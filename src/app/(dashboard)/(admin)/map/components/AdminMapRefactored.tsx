'use client';

// Open/Closed Principle: Main orchestrator for admin map functionality
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AdminMapProps, TimeFilter, AnimalReport } from '../types/MapTypes';
import { ReportDateFilter } from '../utils/ReportDateFilter';
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

// Mock data generator for development
const generateMockReports = (): AnimalReport[] => {
  const mockReports: AnimalReport[] = [];
  const now = new Date();
  
  // Helper to generate date offsets
  const getDaysAgo = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  // Sample coordinates within VSU campus
  const campusLocations: [number, number][] = [
    [10.746183, 124.795011], // Center
    [10.745500, 124.793500], // West side
    [10.747500, 124.796500], // East side
    [10.744800, 124.794800], // South
    [10.747800, 124.793800], // North
    [10.746000, 124.795500], // Near center
    [10.745200, 124.794200], // Southwest
    [10.747200, 124.795800], // Northeast
  ];

  // Generate reports for different time periods
  const reportData = [
    // Today - 5 reports
    { days: 0, count: 5 },
    // Yesterday - 3 reports
    { days: 1, count: 3 },
    // This week - 8 reports
    { days: 3, count: 4 },
    { days: 5, count: 4 },
    // This month - 10 more reports
    { days: 10, count: 3 },
    { days: 15, count: 4 },
    { days: 20, count: 3 },
  ];

  let idCounter = 1;
  reportData.forEach(({ days, count }) => {
    for (let i = 0; i < count; i++) {
      const location = campusLocations[Math.floor(Math.random() * campusLocations.length)];
      const animalType = Math.random() > 0.5 ? 'dog' : 'cat';
      const statuses: ('pending' | 'verified' | 'rejected')[] = ['pending', 'verified', 'rejected'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      mockReports.push({
        id: `report-${idCounter++}`,
        latitude: location[0] + (Math.random() - 0.5) * 0.002, // Small random offset
        longitude: location[1] + (Math.random() - 0.5) * 0.002,
        animalType,
        spottedDate: getDaysAgo(days),
        spottedTime: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        status,
        reporterName: `Student ${idCounter}`,
        locationDescription: [
          'Near main gate',
          'Behind cafeteria',
          'Library area',
          'Near College of Engineering',
          'Beside gymnasium',
          'Near parking lot'
        ][Math.floor(Math.random() * 6)],
      });
    }
  });

  return mockReports;
};

export default function AdminMapRefactored({ initialReports }: AdminMapProps) {
  const [allReports] = useState<AnimalReport[]>(initialReports || generateMockReports());
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('today');

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
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md"></div>
            <span className="text-sm text-gray-700">Rejected</span>
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
