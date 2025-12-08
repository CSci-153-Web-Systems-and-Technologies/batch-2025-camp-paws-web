'use client';

// Open/Closed Principle: Main orchestrator for admin map functionality
import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AdminMapProps, TimeFilter, AnimalReport } from '../types/MapTypes';
import { ReportDateFilter } from '../utils/ReportDateFilter';
import { getReportService } from '../services/ReportService';
import TimeFilterSelector from './TimeFilterSelector';

// Dynamically import map to avoid SSR issues with Leaflet
const AdminMapView = dynamic(() => import('./AdminMapView'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-3"></div>
        <div className="text-gray-500">Loading map...</div>
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading animal reports...</p>
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
      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Campus Sightings Map</h2>
            <p className="text-gray-600 mt-1">
              Showing {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} for {selectedFilter}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{filteredReports.length}</div>
            <div className="text-sm text-gray-500">Total Sightings</div>
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
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <AdminMapView
          reports={filteredReports}
          onReportSelect={handleReportSelect}
        />
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-md"></div>
            <span className="text-sm text-gray-700">Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white shadow-md"></div>
            <span className="text-sm text-gray-700">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🐕</span>
            <span className="text-sm text-gray-700">Dog</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🐈</span>
            <span className="text-sm text-gray-700">Cat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 bg-blue-100"></div>
            <span className="text-sm text-gray-700">Campus Boundary</span>
          </div>
        </div>
      </div>
    </div>
  );
}
