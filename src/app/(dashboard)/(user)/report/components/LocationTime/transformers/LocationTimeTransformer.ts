// Dependency Inversion Principle: Abstract data transformation
import { LocationTimeFormData, BackendLocationTimeData } from '../types/LocationTimeTypes';
import { FormData } from '../../PhotoUpload/types/PhotoUploadTypes';

export interface DataTransformer<TInput, TOutput> {
  transform(input: TInput, existingData: FormData): TOutput;
}

export class LocationTimeTransformer implements DataTransformer<LocationTimeFormData, FormData> {
  transform(formData: LocationTimeFormData, existingData: FormData): FormData {
    // Convert Date object to ISO date string (YYYY-MM-DD format)
    const formattedDate = formData.selectedDate.toISOString().split('T')[0];

    return {
      ...existingData, // Include all previous steps (photos, physical details, etc.)
      
      // Location & Time Data
      date: formattedDate,
      time: formData.selectedTime,
      location: {
        lat: formData.selectedLocation!.lat,
        lng: formData.selectedLocation!.lng,
      },
      
      // Location Description Data
      locationDescription: formData.locationDescription,
      locationNotes: formData.locationNotes.trim() || '',
    };
  }

  // Helper method to create backend-ready format if needed
  toBackendFormat(formData: LocationTimeFormData): BackendLocationTimeData {
    const formattedDate = formData.selectedDate.toISOString().split('T')[0];

    return {
      date: formattedDate,
      time: formData.selectedTime,
      location: {
        lat: formData.selectedLocation!.lat,
        lng: formData.selectedLocation!.lng,
      },
      location_description: formData.locationDescription,
      location_notes: formData.locationNotes.trim() || null,
    };
  }
}
