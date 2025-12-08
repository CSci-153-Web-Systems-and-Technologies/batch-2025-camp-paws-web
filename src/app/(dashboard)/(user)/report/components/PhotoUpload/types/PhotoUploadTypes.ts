// Interface Segregation Principle: Separate interfaces for different concerns

// Main form data interface - shared across all steps
export interface FormData {
  photo: File | null;
  animalType: string;
  sex: string;
  collar: string;
  colorPattern: string;
  primaryColor: string;
  bodyConditionScore: number | null;
  physicalProblems: string[];
  notes: string;
  location: { lat: number; lng: number } | null;
  date: string;
  time: string;
  locationDescription: string;
  locationNotes: string;
}

// Photo upload specific state
export interface PhotoUploadState {
  selectedFile: File | null;
  preview: string | null;
  dragActive: boolean;
  error: string | null;
}

// Validation result
export interface FileValidationResult {
  isValid: boolean;
  error: string | null;
}

// File constraints configuration
export interface FileConstraints {
  maxSizeMB: number;
  allowedTypes: string[];
  maxFiles: number;
}

// Component props following Interface Segregation
export interface PhotoUploadProps {
  data: FormData;
  onNext: (photo: File) => void;
}

export interface DropZoneProps {
  dragActive: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ImagePreviewProps {
  preview: string;
  fileName: string;
  fileSize: number;
  onRemove: () => void;
}

export interface UploadFeedbackProps {
  error: string | null;
  selectedFile: File | null;
}
