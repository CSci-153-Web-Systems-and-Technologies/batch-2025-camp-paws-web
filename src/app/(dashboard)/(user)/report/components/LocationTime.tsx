'use client';

import { FormData } from './PhotoUpload';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import DatePicker from 'react-datepicker';
import SimpleTimePicker from './SimpleTimePicker';

// Dynamic import to avoid SSR issues with Leaflet
const UniversityMap = dynamic(() => import('./UniversityMap'), { ssr: false });

interface LocationTimeProps {
  data: FormData;
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

export default function LocationTime({ data, onSubmit, onBack }: LocationTimeProps) {
  // === DATA CONTAINER 1: Location Description (Required) ===
  // Backend field: location_description (VARCHAR, NOT NULL, min 5 chars)
  const [locationDescription, setLocationDescription] = useState('');

  // === DATA CONTAINER 2: Location Notes (Optional) ===  
  // Backend field: location_notes (TEXT, NULLABLE)
  const [locationNotes, setLocationNotes] = useState('');

  // === DATA CONTAINER 3: Selected Date (Required) ===
  // Backend field: spotted_date (DATE, NOT NULL)
  // Format: YYYY-MM-DD (ISO date string)
  const [selectedDate, setSelectedDate] = useState<Date>(
    data.date ? new Date(data.date) : new Date()
  );

  // === DATA CONTAINER 4: Selected Time (Required) ===
  // Backend field: spotted_time (TIME, NOT NULL) 
  // Format: HH:MM (24-hour format string)
  const [selectedTime, setSelectedTime] = useState<string>(
    data.time || new Date().toTimeString().slice(0, 5)
  );

  // === DATA CONTAINER 5: GPS Coordinates (Required) ===
  // Backend fields: latitude (DECIMAL), longitude (DECIMAL)
  // Must be within VSU campus boundaries (validated by geofencing)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    data.location ? { lat: data.location.lat, lng: data.location.lng } : null
  );

  // === DATA CONTAINER 6: Location Validation Flag ===
  // Internal validation state (not sent to backend)
  const [isLocationValid, setIsLocationValid] = useState(true);

  const isValid = locationDescription.trim().length >= 5 && selectedDate && selectedTime && selectedLocation && isLocationValid;

  // Handle map location selection
  const handleLocationSelect = (lat: number, lng: number, isValid: boolean) => {
    setSelectedLocation({ lat, lng });
    setIsLocationValid(isValid);
  };

  const handleSubmit = () => {
    if (isValid && selectedLocation) {
      // === FINAL DATA ASSEMBLY FOR BACKEND ===
      // Convert Date object to ISO date string (YYYY-MM-DD format)
      const formattedDate = selectedDate.toISOString().split('T')[0]; 
      
      // Combine all form data from all steps for final submission
      const finalData: FormData = {
        ...data, // Include all previous steps (photos, physical details, etc.)
        
        // === LOCATION & TIME DATA ===
        date: formattedDate,                    // spotted_date: "2025-12-08"
        time: selectedTime,                     // spotted_time: "14:30"
        location: {                             // GPS coordinates
          lat: selectedLocation.lat,            // latitude: 14.123456
          lng: selectedLocation.lng             // longitude: 120.987654
        },
        
        // === LOCATION DESCRIPTION DATA ===
        locationDescription,                    // location_description: "Near main gate"
        locationNotes,                          // location_notes: "Additional details..."
      };
      
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
          {/* Date & Time Pickers */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Modern Date Picker */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Spotted
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => date && setSelectedDate(date)}
                dateFormat="MMMM d, yyyy"
                maxDate={new Date()} // Can't select future dates
                placeholderText="Select date when you spotted the animal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                calendarClassName="custom-calendar"
                popperClassName="custom-popper"
              />
              <p className="mt-1 text-sm text-gray-500">
                When did you first spot the animal?
              </p>
            </div>

            {/* Simple Time Picker */}
            <div className="flex-1">
              <SimpleTimePicker
                value={selectedTime}
                onChange={setSelectedTime}
                label="Time Spotted"
              />
              <p className="mt-1 text-sm text-gray-500">
                What time did you spot the animal?
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Description *
            </label>
            <input
              type="text"
              placeholder="e.g., 123 Main Street, Central Park entrance, near Starbucks"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Provide a clear description (minimum 5 characters)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Location Notes
            </label>
            <textarea
              placeholder="Any additional details about the location or circumstances..."
              rows={3}
              value={locationNotes}
              onChange={(e) => setLocationNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Interactive Map */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location on Campus *
            </label>
            <div className="space-y-2">
              <UniversityMap 
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
              />
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Click anywhere on the map to pin the location where you found the animal</p>
                <p>• Only locations within the university campus boundaries are valid</p>
                {selectedLocation && (
                  <div className={`font-medium ${isLocationValid ? 'text-green-600' : 'text-red-600'}`}>
                    {isLocationValid ? (
                      <>✓ Valid location selected (Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)})</>
                    ) : (
                      <>✗ Selected location is outside campus boundaries - please select a location within the marked area</>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Validation Messages */}
          {!isValid && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-800">
                <p className="font-medium mb-2">Please complete all required fields:</p>
                <ul className="list-disc list-inside space-y-1">
                  {!selectedDate && <li>Date spotted</li>}
                  {!selectedTime && <li>Time spotted</li>}
                  {locationDescription.trim().length < 5 && <li>Location description (minimum 5 characters)</li>}
                  {!selectedLocation && <li>Pin location on map</li>}
                  {selectedLocation && !isLocationValid && <li>Select a valid location within campus boundaries</li>}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-6 py-2 rounded-md shadow-sm ${
              isValid
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
