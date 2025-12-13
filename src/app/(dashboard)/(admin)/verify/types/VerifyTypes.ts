// Interface Segregation Principle: Separate interfaces for different concerns

export interface Report {
  id: string;
  // From PhotoUpload
  photoUrl: string;
  // From PhysicalDetails
  animalType: 'dog' | 'cat';
  sex: 'male' | 'female' | 'unknown';
  collar: 'yes' | 'no' | 'unknown';
  colorPattern: string; // 'solid', 'spotted', 'striped', etc.
  primaryColor: string;
  bodyConditionScore: number; // 1-9
  // Physical problems array
  physicalProblems: string[]; // Contains 'eye_problems', 'skin_problems', 'gait_problems'
  notes: string; // Additional notes
  // From LocationTime
  latitude: number;
  longitude: number;
  locationDescription: string;
  spottedDate: string; // YYYY-MM-DD
  spottedTime: string; // HH:MM
  // Reporter info (from backend)
  reportedBy: string;
  reporterEmail: string;
  // optional raw reporter id (UUID) if available from DB
  reporterId?: string;
  reportsSubmitted: number;
  warnings: number;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface ReportAction {
  type: 'accept' | 'reject' | 'edit' | 'warn' | 'suspend';
  reportId: string;
  reason?: string;
  updatedData?: Partial<Report>;
}

export interface UserAction {
  userId: string;
  action: 'warn' | 'suspend';
  reason: string;
}

// Component props
export interface VerifyReportsProps {
  initialReports?: Report[];
}

export interface ReportsTableProps {
  reports: Report[];
  onRowClick: (report: Report) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedColumns: string[];
}

export interface ReportDetailsModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (reportId: string) => void;
  onReject: (reportId: string, reason: string) => void;
  onEdit: (reportId: string, data: Partial<Report>) => void;
  onWarnUser: (userId: string, reason: string) => void;
  onSuspendUser: (userId: string, reason: string) => void;
}

export interface EditReportModalProps {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
  onSave: (reportId: string, data: Partial<Report>) => void;
}

export interface ActionButtonsProps {
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
  isProcessing?: boolean;
}

export interface UserActionsProps {
  reporterEmail: string;
  warnings: number;
  onWarn: () => void;
  onSuspend: () => void;
}

export interface ColumnSelectorProps {
  availableColumns: ColumnConfig[];
  selectedColumns: string[];
  onToggleColumn: (columnId: string) => void;
}

export interface ColumnConfig {
  id: string;
  label: string;
  sortable: boolean;
}
