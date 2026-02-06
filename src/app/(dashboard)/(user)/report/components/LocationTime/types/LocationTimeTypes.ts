// Interface Segregation Principle: Separate interfaces for different concerns
import { FormData } from '../../PhotoUpload/types/PhotoUploadTypes';

// Location and time form state
export interface LocationTimeFormData {
  locationDescription: string;
  selectedDate: Date;
  selectedTime: string;
  selectedLocation: { lat: number; lng: number } | null;
  isLocationValid: boolean;
}

// Backend-ready data interface
export interface BackendLocationTimeData {
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  location: {
    lat: number;
    lng: number;
  };
  location_description: string;
}

// Validation result
export interface LocationTimeValidationResult {
  isValid: boolean;
  missingFields: string[];
}

// Component props following Interface Segregation
export interface LocationTimeProps {
  data: FormData;
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export interface DateTimeSelectionProps {
  selectedDate: Date;
  selectedTime: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  dateError?: string | null;
  timeError?: string | null;
  dateTouched?: boolean;
  timeTouched?: boolean;
}

export interface LocationDescriptionProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  error?: string | null;
  touched?: boolean;
}

export interface MapSelectionProps {
  selectedLocation: { lat: number; lng: number } | null;
  isLocationValid: boolean;
  onLocationSelect: (lat: number, lng: number, isValid: boolean) => void;
  error?: string | null;
  touched?: boolean;
}
