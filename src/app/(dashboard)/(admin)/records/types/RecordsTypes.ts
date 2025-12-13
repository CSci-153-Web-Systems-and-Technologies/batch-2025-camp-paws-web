// Interface Segregation Principle: Separate interfaces for different concerns

// ============================================================================
// Core Data Types
// ============================================================================

export type ViewType = 'grouped' | 'ungrouped' | 'all';

export type AnimalType = 'dog' | 'cat';
export type Sex = 'male' | 'female' | 'unknown';
export type CollarStatus = 'yes' | 'no' | 'unknown';

// Individual report (accepted from verify page)
// MATCHES: stray_animal_reports table in Supabase
export interface AcceptedReport {
  id: string;
  // Group assignment (not in Supabase - managed separately in animal_groups)
  groupId: string | null; // null if ungrouped
  
  // Photo (MATCHES: photo_url)
  photoUrl: string;
  
  // Physical Details (MATCHES: animal_type, sex, collar_status, color_pattern, primary_color, body_condition_score)
  animalType: AnimalType;
  sex: Sex;
  collar: CollarStatus; // DB: collar_status
  colorPattern: string; // DB: color_pattern - 'solid', 'spotted', 'striped', etc.
  primaryColor: string; // DB: primary_color
  bodyConditionScore: number; // DB: body_condition_score (1-9)
  
  // Health Assessment (MATCHES: skin_problems, eye_problems, gait_problems)
  skinProblems: string[]; // DB: skin_problems (array)
  eyeProblems: string[]; // DB: eye_problems (array)
  gaitProblems: string[]; // DB: gait_problems (array)
  notes: string; // DB: additional_notes
  
  // Location & Time (MATCHES: spotted_date, spotted_time, latitude, longitude, location_description)
  latitude: number;
  longitude: number;
  locationDescription: string; // DB: location_description
  spottedDate: string; // DB: spotted_date (DATE)
  spottedTime: string; // DB: spotted_time (TIME)
  
  // Reporter info (MATCHES: user_id from auth.users)
  reportedBy: string; // DB: user_id (from join with auth.users)
  reporterEmail: string; // From auth.users join
  
  // Metadata (MATCHES: status, verified_by, verified_at, created_at, updated_at)
  status: 'verified'; // DB: status - Only verified reports appear in records
  verifiedBy?: string; // DB: verified_by
  verifiedAt?: string; // DB: verified_at
  acceptedAt: string; // Same as verifiedAt
  createdAt: string; // DB: created_at
  updatedAt?: string; // DB: updated_at
  // Server indicates whether this report has been grouped into an AnimalGroup
  // DB: is_grouped ('yes' | 'no') — exposed here as a boolean for convenience
  isGrouped?: boolean;
}

// Group represents a unique individual animal
export interface AnimalGroup {
  id: string;
  
  // Group metadata
  name: string; // e.g., "Brown Male Dog - Campus Center"
  description?: string; // Optional additional info
  
  // Animal characteristics (defined attributes)
  animalType: AnimalType;
  sex: Sex;
  colorPattern: string;
  primaryColor: string;
  
  // Group statistics
  reportCount: number; // Number of sightings
  firstSightedDate: string; // Date of earliest report
  lastSightedDate: string; // Date of most recent report
  
  // Metadata
  createdAt: string; // When group was created
  createdBy: string; // Admin who created the group
  updatedAt: string; // Last modification timestamp
  
  // Report references
  reportIds: string[]; // Array of report IDs in this group
}

// ============================================================================
// Filter and Search Types
// ============================================================================

export interface RecordsFilters {
  animalType?: AnimalType;
  sex?: Sex;
  colorPattern?: string;
  primaryColor?: string;
  dateRange?: {
    start: string; // YYYY-MM-DD
    end: string; // YYYY-MM-DD
  };
  location?: string; // Search in locationDescription
  groupName?: string; // Search in group names (for grouped view)
}

export interface SortConfig {
  field: 'date' | 'name' | 'reportCount' | 'createdAt';
  direction: 'asc' | 'desc';
}

// ============================================================================
// Modal and Action Types
// ============================================================================

export interface CreateGroupInput {
  name: string;
  description?: string;
  animalType: AnimalType;
  sex: Sex;
  colorPattern: string;
  primaryColor: string;
  initialReportId?: string; // Optional: if creating from a report
}

export interface EditGroupInput {
  name?: string;
  description?: string;
  animalType?: AnimalType;
  sex?: Sex;
  colorPattern?: string;
  primaryColor?: string;
}

export interface GroupAction {
  type: 'create' | 'edit' | 'delete' | 'add-report' | 'remove-report';
  groupId?: string;
  data?: CreateGroupInput | EditGroupInput;
  reportId?: string;
}

export interface ReportAction {
  type: 'delete' | 'edit' | 'add-to-group' | 'remove-from-group';
  reportId: string;
  groupId?: string;
  updatedData?: Partial<AcceptedReport>;
}

// ============================================================================
// Component Props
// ============================================================================

// Main component
export interface RecordsRefactoredProps {
  initialGroups?: AnimalGroup[];
  initialReports?: AcceptedReport[];
}

// View Selector
export interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  counts: {
    grouped: number; // Number of groups
    ungrouped: number; // Number of ungrouped reports
    all: number; // Total (groups + ungrouped reports)
  };
}

// Group Card
export interface GroupCardProps {
  group: AnimalGroup;
  reports: AcceptedReport[]; // Reports belonging to this group
  onViewDetails: (groupId: string) => void;
  onEdit: (groupId: string) => void;
  onDelete: (groupId: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

// Ungrouped Report Card
export interface UngroupedReportCardProps {
  report: AcceptedReport;
  onAddToGroup: (reportId: string) => void;
  onCreateGroup: (reportId: string) => void;
  onDelete: (reportId: string) => void;
  onViewDetails: (reportId: string) => void;
  isSelected?: boolean;
  onSelect?: (reportId: string) => void;
}

// Report Card (reusable)
export interface ReportCardProps {
  report: AcceptedReport;
  showActions?: boolean;
  compact?: boolean;
  onViewDetails?: (reportId: string) => void;
  onDelete?: (reportId: string) => void;
}

// Create Group Modal
export interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGroupInput) => void;
  initialReport?: AcceptedReport; // If creating from a report
  mode: 'manual' | 'from-report';
}

// Edit Group Modal
export interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupId: string, data: EditGroupInput) => void;
  group: AnimalGroup;
}

// Group Details Modal
export interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: AnimalGroup;
  reports: AcceptedReport[];
  onEditGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onRemoveReport: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onViewReport: (reportId: string) => void;
}

// Add to Group Modal
export interface AddToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupId: string, reportId: string) => void;
  report: AcceptedReport;
  groups: AnimalGroup[];
}

// Grouped View
export interface GroupedViewProps {
  groups: AnimalGroup[];
  reports: AcceptedReport[];
  onCreateGroup: () => void;
  onViewGroup: (groupId: string) => void;
  onEditGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  isLoading?: boolean;
}

// Ungrouped View
export interface UngroupedViewProps {
  reports: AcceptedReport[];
  onAddToGroup: (reportId: string) => void;
  onCreateGroup: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onViewReport: (reportId: string) => void;
  selectedReportIds?: string[];
  onSelectReport?: (reportId: string) => void;
  onBulkGroup?: (reportIds: string[]) => void;
  isLoading?: boolean;
}

// All View
export interface AllViewProps {
  groups: AnimalGroup[];
  // Accept either normalized AcceptedReport objects or raw DB rows (server JSON)
  reports: Array<AcceptedReport | Record<string, unknown>>;
  onViewGroup: (groupId: string) => void;
  onViewReport: (reportId: string) => void;
  isLoading?: boolean;
}

// Delete Confirmation Dialog
export interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type: 'group' | 'report' | 'remove-from-group';
  additionalOptions?: {
    deleteReports?: boolean; // For group deletion
  };
}

// Search and Filter
export interface SearchFilterProps {
  filters: RecordsFilters;
  onFilterChange: (filters: RecordsFilters) => void;
  onClearFilters: () => void;
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
  showGroupFilters?: boolean; // Show group-specific filters in grouped view
}
