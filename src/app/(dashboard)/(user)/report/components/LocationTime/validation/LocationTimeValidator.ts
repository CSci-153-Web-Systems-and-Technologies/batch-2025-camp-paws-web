// Dependency Inversion Principle: Abstract validation logic
import { LocationTimeFormData, LocationTimeValidationResult } from '../types/LocationTimeTypes';

export interface FormValidator {
  validate(data: LocationTimeFormData): LocationTimeValidationResult;
  getMissingFields(data: LocationTimeFormData): string[];
}

export class LocationTimeValidator implements FormValidator {
  private readonly MIN_DESCRIPTION_LENGTH = 5;

  validate(data: LocationTimeFormData): LocationTimeValidationResult {
    const missingFields = this.getMissingFields(data);
    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
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
