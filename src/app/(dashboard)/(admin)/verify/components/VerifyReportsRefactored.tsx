'use client';

// Open/Closed Principle: Main orchestrator for verify reports functionality
import { useState, useEffect } from 'react';
import { VerifyReportsProps, Report } from '../types/VerifyTypes';
import { getReportService } from '../services/ReportService';
import ReportsTable from './ReportsTable';
import ReportDetailsModal from './ReportDetailsModal';
import Button from '@/components/ui/Button';

const AVAILABLE_COLUMNS = ['reportId', 'animalType', 'sex', 'colorPattern', 'primaryColor', 'spottedTime'];

export default function VerifyReportsRefactored({ initialReports }: VerifyReportsProps) {
  const [reports, setReports] = useState<Report[]>(initialReports || []);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColumns] = useState<string[]>(AVAILABLE_COLUMNS);
  
  // Filter states
  const [filters, setFilters] = useState({
    animalType: 'all',
    sex: 'all',
    colorPattern: 'all',
    primaryColor: 'all'
  });

  // Apply filters to reports
  const filteredReports = reports.filter(report => {
    // Only show reports that are pending verification in this view
    if (report.status !== 'pending') return false;
    if (filters.animalType !== 'all' && report.animalType !== filters.animalType) return false;
    if (filters.sex !== 'all' && report.sex !== filters.sex) return false;
    if (filters.colorPattern !== 'all' && report.colorPattern !== filters.colorPattern) return false;
    if (filters.primaryColor !== 'all' && report.primaryColor !== filters.primaryColor) return false;
    return true;
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Fetch reports
  useEffect(() => {
    // Always refresh reports on mount to ensure UI reflects latest DB state.
    const reportService = getReportService();
    reportService.fetchPendingReports()
      .then(fetchedReports => {
        setReports(fetchedReports);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch reports:', err);
        setError('Failed to load reports. Please try again.');
        setIsLoading(false);
      });
  }, [initialReports]);

  const handleRowClick = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedIds(selectedIds);
    if (selectedIds.length === 0) {
      setSelectedReport(null);
      return;
    }
    const firstId = selectedIds[0];
    const found = reports.find(r => r.id === firstId) || null;
    setSelectedReport(found);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleAccept = async (reportId: string) => {
    const reportService = getReportService();
    await reportService.acceptReport(reportId);
    // Remove from list or update status
    setReports(reports.filter(r => r.id !== reportId));
  };

  const handleAcceptBulk = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    setIsProcessing(true);
    const reportService = getReportService();
    type BulkResult = { id: string; status: 'fulfilled' } | { id: string; status: 'rejected'; reason: unknown };
    const promises: Promise<BulkResult>[] = ids.map(id =>
      reportService.acceptReport(id)
        .then((): BulkResult => ({ id, status: 'fulfilled' }))
        .catch((err): BulkResult => ({ id, status: 'rejected', reason: err }))
    );
    const results: BulkResult[] = await Promise.all(promises);
    const succeeded = results.filter((r): r is { id: string; status: 'fulfilled' } => r.status === 'fulfilled').map(r => r.id);
    const failed = results.filter((r): r is { id: string; status: 'rejected'; reason: unknown } => r.status === 'rejected').map(r => ({ id: r.id, reason: r.reason }));
    // remove succeeded from list
    if (succeeded.length > 0) {
      setReports(prev => prev.filter(r => !succeeded.includes(r.id)));
    }
    // clear selection of processed ids
    setSelectedIds([]);
    setSelectedReport(null);
    setIsProcessing(false);
    if (failed.length > 0) {
      console.error('Some accepts failed', failed);
      // Basic feedback - can be replaced with toast
      alert(`${succeeded.length} accepted, ${failed.length} failed`);
    }
  };

  const handleReject = async (reportId: string, reason: string) => {
    const reportService = getReportService();
    await reportService.rejectReport(reportId, reason);
    // Remove from list
    setReports(reports.filter(r => r.id !== reportId));
  };

  const handleRejectBulk = async (ids: string[], reason: string) => {
    if (!ids || ids.length === 0) return;
    setIsProcessing(true);
    const reportService = getReportService();
    type BulkResult = { id: string; status: 'fulfilled' } | { id: string; status: 'rejected'; reason: unknown };
    const promises: Promise<BulkResult>[] = ids.map(id =>
      reportService.rejectReport(id, reason)
        .then((): BulkResult => ({ id, status: 'fulfilled' }))
        .catch((err): BulkResult => ({ id, status: 'rejected', reason: err }))
    );
    const results: BulkResult[] = await Promise.all(promises);
    const succeeded = results.filter((r): r is { id: string; status: 'fulfilled' } => r.status === 'fulfilled').map(r => r.id);
    const failed = results.filter((r): r is { id: string; status: 'rejected'; reason: unknown } => r.status === 'rejected').map(r => ({ id: r.id, reason: r.reason }));
    if (succeeded.length > 0) {
      setReports(prev => prev.filter(r => !succeeded.includes(r.id)));
    }
    setSelectedIds([]);
    setSelectedReport(null);
    setIsProcessing(false);
    if (failed.length > 0) {
      console.error('Some rejects failed', failed);
      alert(`${succeeded.length} rejected, ${failed.length} failed`);
    }
  };

  const handleEdit = async (reportId: string, data: Partial<Report>) => {
    const reportService = getReportService();
    await reportService.updateReport(reportId, data);
    // Update in list
    setReports(reports.map(r => r.id === reportId ? { ...r, ...data } : r));
  };

  const handleWarnUser = async (userEmail: string, reason: string) => {
    const reportService = getReportService();
    await reportService.warnUser(userEmail, reason);
    // Update warning count in UI
    if (selectedReport) {
      const updated = { ...selectedReport, warnings: selectedReport.warnings + 1 };
      setSelectedReport(updated);
      setReports(reports.map(r => r.id === updated.id ? updated : r));
    }
  };

  const handleSuspendUser = async (userEmail: string, reason: string) => {
    const reportService = getReportService();
    await reportService.suspendUser(userEmail, reason);
    // Could show a success message
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[rgb(var(--color-primary))] mx-auto mb-4"></div>
          <p className="text-[rgb(var(--color-text-secondary))] font-medium">Loading pending reports...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[rgb(var(--color-error-bg))] border border-[rgb(var(--color-error))] rounded-lg p-6 text-center">
        <div className="text-[rgb(var(--color-error))] text-5xl mb-3">⚠️</div>
        <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">Failed to Load Reports</h3>
        <p className="text-[rgb(var(--color-error))] mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="danger"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm p-6 border border-[rgb(var(--color-border))]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Verify Reports</h2>
            <p className="text-[rgb(var(--color-text-secondary))] mt-1">
              Review and validate submitted stray sightings to ensure data accuracy and reliability.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[rgb(var(--color-primary))]">{filteredReports.length}</div>
            <div className="text-sm text-[rgb(var(--color-text-tertiary))]">
              {filteredReports.length === reports.length ? 'Pending' : `of ${reports.length} total`}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm p-4 border border-[rgb(var(--color-border))]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[rgb(var(--color-text-tertiary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium text-[rgb(var(--color-text-primary))]">Filters:</span>
          </div>

          {/* Animal Type Filter */}
          <select
            value={filters.animalType}
            onChange={(e) => handleFilterChange('animalType', e.target.value)}
            className="px-3 py-1.5 text-sm border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))]"
          >
            <option value="all">All Animals</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>

          {/* Sex Filter */}
          <select
            value={filters.sex}
            onChange={(e) => handleFilterChange('sex', e.target.value)}
            className="px-3 py-1.5 text-sm border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))]"
          >
            <option value="all">All Sexes</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Color Pattern Filter */}
          <select
            value={filters.colorPattern}
            onChange={(e) => handleFilterChange('colorPattern', e.target.value)}
            className="px-3 py-1.5 text-sm border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))]"
          >
            <option value="all">All Patterns</option>
            <option value="solid">Solid</option>
            <option value="spotted">Spotted</option>
            <option value="striped">Striped</option>
            <option value="patched">Patched</option>
            <option value="brindle">Brindle</option>
          </select>

          {/* Primary Color Filter */}
          <select
            value={filters.primaryColor}
            onChange={(e) => handleFilterChange('primaryColor', e.target.value)}
            className="px-3 py-1.5 text-sm border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))]"
          >
            <option value="all">All Colors</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Brown">Brown</option>
            <option value="Gray">Gray</option>
            <option value="Tan">Tan</option>
            <option value="Orange">Orange</option>
            <option value="Yellow">Yellow</option>
            <option value="Cream">Cream</option>
          </select>

          {/* Clear Filters */}
          {(filters.animalType !== 'all' || filters.sex !== 'all' || filters.colorPattern !== 'all' || filters.primaryColor !== 'all') && (
            <Button
              onClick={() => setFilters({ animalType: 'all', sex: 'all', colorPattern: 'all', primaryColor: 'all' })}
              variant="secondary"
              size="sm"
            >
              Clear Filters
            </Button>
          )}

          {/* Results count */}
          <div className="ml-auto text-sm text-[rgb(var(--color-text-tertiary))]">
            {filteredReports.length} of {reports.length} reports
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <ReportsTable
        reports={filteredReports}
        onRowClick={handleRowClick}
        selectedColumns={selectedColumns}
        onSelectionChange={handleSelectionChange}
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="success"
          onClick={() => {
            if (selectedIds.length > 0) {
              void handleAcceptBulk(selectedIds);
            } else if (selectedReport) {
              void handleAccept(selectedReport.id);
            }
          }}
          disabled={isProcessing || (selectedIds.length === 0 && !selectedReport)}
        >
          {selectedIds.length > 0 ? `Accept (${selectedIds.length})` : 'Accept'}
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            if (selectedIds.length > 0) {
              const reason = window.prompt('Reason for rejection (applied to all selected):');
              if (reason && reason.trim().length > 0) {
                void handleRejectBulk(selectedIds, reason.trim());
              }
            } else if (selectedReport) {
              setIsModalOpen(true);
            }
          }}
          disabled={isProcessing || (selectedIds.length === 0 && !selectedReport)}
        >
          {selectedIds.length > 0 ? `Reject (${selectedIds.length})` : 'Reject'}
        </Button>
      </div>

      {/* Report Details Modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAccept={handleAccept}
        onReject={handleReject}
        onEdit={handleEdit}
        onWarnUser={handleWarnUser}
        onSuspendUser={handleSuspendUser}
      />
    </div>
  );
}
