// Dependency Inversion Principle: Abstract validation logic
import { LocationTimeFormData, LocationTimeValidationResult } from '../types/LocationTimeTypes';

export interface ValidationErrors {
  date?: string | null;
  time?: string | null;
  locationDescription?: string | null;
  location?: string | null;
}

export interface FormValidator {
  validate(data: LocationTimeFormData): LocationTimeValidationResult & { errors: ValidationErrors };
  getMissingFields(data: LocationTimeFormData): string[];
}

export class LocationTimeValidator implements FormValidator {
  private readonly MIN_DESCRIPTION_LENGTH = 5;

  validate(data: LocationTimeFormData): LocationTimeValidationResult & { errors: ValidationErrors } {
    const errors = this.getFieldErrors(data);
    const missingFields = this.getMissingFields(data);
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      errors,
    };
  }

  getFieldErrors(data: LocationTimeFormData): ValidationErrors {
    const errors: ValidationErrors = {};

    // Date validation
    if (!data.selectedDate) {
      errors.date = 'Please select the date when you spotted the animal';
    }

    // Time validation
    if (!data.selectedTime) {
      errors.time = 'Please select the time when you spotted the animal';
    }

    // Location description validation
    if (data.locationDescription.trim().length === 0) {
      errors.locationDescription = 'Please provide a description of the location';
    } else if (data.locationDescription.trim().length < this.MIN_DESCRIPTION_LENGTH) {
      errors.locationDescription = `Description must be at least ${this.MIN_DESCRIPTION_LENGTH} characters`;
    }

    // Map location validation
    if (!data.selectedLocation) {
      errors.location = 'Please pin the location on the map';
    } else if (!data.isLocationValid) {
      errors.location = 'Please select a valid location within campus boundaries';
    }

    return errors;
  }

  getMissingFields(data: LocationTimeFormData): string[] {
    const missing: string[] = [];

    // Date validation
    if (!data.selectedDate) {
      missing.push('Date spotted');
    }

    // Time validation
    if (!data.selectedTime) {
      missing.push('Time spotted');
    }

    // Location description validation
    if (data.locationDescription.trim().length < this.MIN_DESCRIPTION_LENGTH) {
      missing.push(`Location description (minimum ${this.MIN_DESCRIPTION_LENGTH} characters)`);
    }

    // Map location validation
    if (!data.selectedLocation) {
      missing.push('Pin location on map');
    } else if (!data.isLocationValid) {
      missing.push('Select a valid location within campus boundaries');
    }

    return missing;
  }

  isDescriptionValid(description: string): boolean {
    return description.trim().length >= this.MIN_DESCRIPTION_LENGTH;
  }

  isLocationValid(location: { lat: number; lng: number } | null, isValid: boolean): boolean {
    return location !== null && isValid;
  }
}
