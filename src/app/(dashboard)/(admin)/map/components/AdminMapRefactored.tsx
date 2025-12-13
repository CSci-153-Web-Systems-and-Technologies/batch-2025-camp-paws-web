'use client';

// Open/Closed Principle: Main orchestrator for admin map functionality
import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AdminMapProps, TimeFilter, AnimalReport } from '../types/MapTypes';
import { ReportDateFilter } from '../utils/ReportDateFilter';
import { getReportService } from '../services/ReportService';
import TimeFilterSelector from './TimeFilterSelector';
import Button from '@/components/ui/Button';

// Dynamically import map to avoid SSR issues with Leaflet
const AdminMapView = dynamic(() => import('./AdminMapView'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-[rgb(var(--color-background))] rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--color-primary))] mx-auto mb-3"></div>
        <div className="text-[rgb(var(--color-text-secondary))]">Loading map...</div>
      </div>
    </div>
  )
});

export default function AdminMapRefactored({ initialReports }: AdminMapProps) {
  const [allReports, setAllReports] = useState<AnimalReport[]>(initialReports || []);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('today');
  const [isLoading, setIsLoading] = useState(!initialReports);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports from service if not provided via props
  useEffect(() => {
    if (!initialReports) {
      const reportService = getReportService();
      
      reportService.fetchReports()
        .then(reports => {
          setAllReports(reports);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch reports:', err);
          setError('Failed to load reports. Please try again.');
          setIsLoading(false);
        });
    }
  }, [initialReports]);

  // Memoize filtered reports to avoid unnecessary recalculations
  const filteredReports = useMemo(() => {
    return ReportDateFilter.filterByTimeRange(allReports, selectedFilter);
  }, [allReports, selectedFilter]);

  // Memoize report counts
  const reportCounts = useMemo(() => {
    return ReportDateFilter.getReportCounts(allReports);
  }, [allReports]);

  const handleFilterChange = (filter: TimeFilter) => {
    setSelectedFilter(filter);
  };

  const handleReportSelect = (report: AnimalReport) => {
    // Could be used for future functionality like showing details in sidebar
    console.log('Selected report:', report.id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[rgb(var(--color-primary))] mx-auto mb-4"></div>
          <p className="text-[rgb(var(--color-text-secondary))] font-medium">Loading animal reports...</p>
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
      {/* Summary Stats */}
      <div className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm p-6 border border-[rgb(var(--color-border))]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Campus Sightings Map</h2>
            <p className="text-[rgb(var(--color-text-secondary))] mt-1">
              Showing {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} for {selectedFilter}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[rgb(var(--color-primary))]">{filteredReports.length}</div>
            <div className="text-sm text-[rgb(var(--color-text-tertiary))]">Total Sightings</div>
          </div>
        </div>
      </div>

      {/* Time Filter Selector */}
      <TimeFilterSelector
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        reportCounts={reportCounts}
      />

      {/* Map View */}
      <div className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm p-4 border border-[rgb(var(--color-border))]">
        {filteredReports.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-[rgb(var(--color-text-secondary))] mb-3">No reports match the selected time filter.</p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" onClick={() => setSelectedFilter('week')}>Show this week</Button>
              <Button variant="secondary" onClick={() => setSelectedFilter('month')}>Show last 30 days</Button>
            </div>
          </div>
        ) : (
          <AdminMapView 
            reports={filteredReports}
            onReportSelect={handleReportSelect}
          />
        )}
      </div>      {/* Legend */}
      <div className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm p-4 border border-[rgb(var(--color-border))]">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-[rgb(var(--color-surface))] shadow-md"></div>
            <span className="text-sm text-[rgb(var(--color-text-secondary))]">Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-[rgb(var(--color-surface))] shadow-md"></div>
            <span className="text-sm text-[rgb(var(--color-text-secondary))]">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🐕</span>
            <span className="text-sm text-[rgb(var(--color-text-secondary))]">Dog</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🐈</span>
            <span className="text-sm text-[rgb(var(--color-text-secondary))]">Cat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 bg-blue-100"></div>
            <span className="text-sm text-[rgb(var(--color-text-secondary))]">Campus Boundary</span>
          </div>
        </div>
      </div>
    </div>
  );
}
