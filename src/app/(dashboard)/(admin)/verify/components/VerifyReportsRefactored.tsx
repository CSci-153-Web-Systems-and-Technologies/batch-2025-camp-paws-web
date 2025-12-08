'use client';

// Open/Closed Principle: Main orchestrator for verify reports functionality
import { useState, useEffect } from 'react';
import { VerifyReportsProps, Report } from '../types/VerifyTypes';
import { getReportService } from '../services/ReportService';
import ReportsTable from './ReportsTable';
import ReportDetailsModal from './ReportDetailsModal';

const AVAILABLE_COLUMNS = ['animalType', 'sex', 'color', 'spottedTime'];

export default function VerifyReportsRefactored({ initialReports }: VerifyReportsProps) {
  const [reports, setReports] = useState<Report[]>(initialReports || []);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialReports);
  const [error, setError] = useState<string | null>(null);
  const [selectedColumns] = useState<string[]>(AVAILABLE_COLUMNS);

  // Fetch reports
  useEffect(() => {
    if (!initialReports) {
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
    }
  }, [initialReports]);

  const handleRowClick = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
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

  const handleReject = async (reportId: string, reason: string) => {
    const reportService = getReportService();
    await reportService.rejectReport(reportId, reason);
    // Remove from list
    setReports(reports.filter(r => r.id !== reportId));
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading pending reports...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-5xl mb-3">⚠️</div>
        <h3 className="text-xl font-semibold text-red-900 mb-2">Failed to Load Reports</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Verify Reports</h2>
            <p className="text-gray-600 mt-1">
              Review and validate submitted stray sightings to ensure data accuracy and reliability.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{reports.length}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
        </div>
      </div>

      {/* Column Selector - Placeholder for now */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Columns
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Reports Table */}
      <ReportsTable
        reports={reports}
        onRowClick={handleRowClick}
        selectedColumns={selectedColumns}
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Accept
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Reject
        </button>
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
