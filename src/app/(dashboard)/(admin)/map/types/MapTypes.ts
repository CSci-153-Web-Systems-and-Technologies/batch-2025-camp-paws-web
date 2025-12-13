// Interface Segregation Principle: Separate interfaces for different concerns

export type TimeFilter = 'today' | 'yesterday' | 'week' | 'month';

// Animal report location data
export interface AnimalReport {
  id: string;
  latitude: number;
  longitude: number;
  animalType: 'dog' | 'cat';
  spottedDate: string; // ISO date string
  spottedTime: string; // HH:MM format
  status: 'pending' | 'verified' | 'rejected';
  reporterName?: string;
  locationDescription?: string;
  photoUrl?: string;
}

// Map view state
export interface MapViewState {
  selectedFilter: TimeFilter;
  filteredReports: AnimalReport[];
  selectedReport: AnimalReport | null;
  isLoading: boolean;
}

// Campus boundary configuration
export interface CampusBoundary {
  boundaryPoints: [number, number][];
  center: { lat: number; lng: number };
}

// Component props following Interface Segregation
export interface AdminMapProps {
  initialReports?: AnimalReport[];
}

export interface TimeFilterSelectorProps {
  selectedFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
  reportCounts: Record<TimeFilter, number>;
}

export interface AdminMapViewProps {
  reports: AnimalReport[];
  onReportSelect: (report: AnimalReport) => void;
}

export interface ReportMarkerProps {
  report: AnimalReport;
  onClick: () => void;
  isSelected: boolean;
}

export interface ReportPopupProps {
  report: AnimalReport;
}
