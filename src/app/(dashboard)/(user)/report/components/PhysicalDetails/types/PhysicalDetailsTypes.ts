// Interface Segregation Principle: Separate interfaces for different concerns
export interface AnimalIdentification {
  animalType: string;
  sex: string;
  collar: string;
}

export interface AnimalPhysicalAttributes {
  bodyConditionScore: number | null;
  colorPattern: string;
  primaryColor: string;
}

export interface AnimalHealthAssessment {
  physicalProblems: string[];
  notes: string;
}

// Complete form data interface composed of smaller interfaces
export interface PhysicalDetailsFormData extends 
  AnimalIdentification, 
  AnimalPhysicalAttributes, 
  AnimalHealthAssessment {}

// Backend-ready data interface
export interface BackendPhysicalData {
  animal_type: string;
  sex: string;
  collar_status: string;
  body_condition_score: number;
  color_pattern: string;
  primary_color: string;
  health_assessment: {
    skin_problems: string[];
    eye_problems: string[];
    gait_problems: string[];
  };
  additional_notes: string | null;
  form_completed_at: string;
  form_version: string;
}

// Props interfaces following Interface Segregation
export interface AnimalTypeSelectionProps {
  selectedType: string;
  onSelect: (type: string) => void;
  error?: string;
  touched?: boolean;
}

export interface SexSelectionProps {
  selectedSex: string;
  onSelect: (sex: string) => void;
  error?: string;
  touched?: boolean;
}

export interface CollarSelectionProps {
  selectedCollar: string;
  onSelect: (collar: string) => void;
  error?: string;
  touched?: boolean;
}

export interface BodyConditionProps {
  selectedScore: number | null;
  onSelect: (score: number) => void;
  animalType: string;
  error?: string;
  touched?: boolean;
}

export interface ColorSelectionProps {
  animalType: string;
  selectedPattern: string;
  selectedColor: string;
  onPatternSelect: (pattern: string) => void;
  onColorSelect: (color: string) => void;
  patternError?: string;
  colorError?: string;
  patternTouched?: boolean;
  colorTouched?: boolean;
}

export interface HealthAssessmentProps {
  selectedProblems: string[];
  onProblemsChange: (problems: string[]) => void;
}

export interface FormValidationResult {
  isValid: boolean;
  missingFields: string[];
}