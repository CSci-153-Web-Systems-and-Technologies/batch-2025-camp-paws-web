// Refactored LocationTime component applying SOLID principles
'use client';

import { useState } from 'react';
import { LocationTimeProps, LocationTimeFormData, LocationTimeValidationResult } from './types/LocationTimeTypes';
import { LocationTimeValidator } from './validation/LocationTimeValidator';
import { LocationTimeTransformer } from './transformers/LocationTimeTransformer';
import DateTimeSelection from './sections/DateTimeSelection';
import LocationDescription from './sections/LocationDescription';
import LocationNotes from './sections/LocationNotes';
import MapSelection from './sections/MapSelection';
import ValidationFeedback from './feedback/ValidationFeedback';

// Open/Closed Principle: This component is open for extension (new location features)
// but closed for modification (core logic doesn't change)
export default function LocationTimeRefactored({ data, onSubmit, onBack }: LocationTimeProps) {
  // Single Responsibility: State management only
  const [formState, setFormState] = useState<LocationTimeFormData>({
    locationDescription: data.locationDescription || '',
    locationNotes: data.locationNotes || '',
    selectedDate: data.date ? new Date(data.date) : new Date(),
    selectedTime: data.time || new Date().toTimeString().slice(0, 5),
    selectedLocation: data.location ? { lat: data.location.lat, lng: data.location.lng } : null,
    isLocationValid: true,
  });

  // Dependency Inversion: Depend on abstractions, not concretions
  const validator = new LocationTimeValidator();
  const transformer = new LocationTimeTransformer();

  // Single Responsibility: Form validation
  const validation: LocationTimeValidationResult = validator.validate(formState);

  // Single Responsibility: Handle field updates
  const updateFormField = <K extends keyof LocationTimeFormData>(
    field: K,
    value: LocationTimeFormData[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Single Responsibility: Handle location selection with validation
  const handleLocationSelect = (lat: number, lng: number, isValid: boolean) => {
    setFormState((prev) => ({
      ...prev,
      selectedLocation: { lat, lng },
      isLocationValid: isValid,
    }));
  };

  // Single Responsibility: Form submission
  const handleSubmit = () => {
    if (validation.isValid) {
      const finalData = transformer.transform(formState, data);
      console.log('🎯 Final Report Data Ready for Backend:', finalData);
      onSubmit(finalData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">When & Where</h2>
          <div className="text-sm text-gray-500">Step 3 of 3</div>
        </div>

        <div className="space-y-6">
          {/* Liskov Substitution: All section components follow the same interface pattern */}
          <DateTimeSelection
            selectedDate={formState.selectedDate}
            selectedTime={formState.selectedTime}
            onDateChange={(date) => updateFormField('selectedDate', date)}
            onTimeChange={(time) => updateFormField('selectedTime', time)}
          />

          <LocationDescription
            description={formState.locationDescription}
            onDescriptionChange={(description) => updateFormField('locationDescription', description)}
          />

          <LocationNotes
            notes={formState.locationNotes}
            onNotesChange={(notes) => updateFormField('locationNotes', notes)}
          />

          <MapSelection
            selectedLocation={formState.selectedLocation}
            isLocationValid={formState.isLocationValid}
            onLocationSelect={handleLocationSelect}
          />

          {/* Validation Feedback */}
          <ValidationFeedback validation={validation} />
        </div>

        <div className="flex justify-between pt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            disabled={!validation.isValid}
            className={`px-6 py-2 rounded-md shadow-sm font-medium transition-colors ${
              validation.isValid
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
