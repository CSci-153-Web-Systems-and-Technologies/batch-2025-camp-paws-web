// Single Responsibility Principle: Component focused only on map selection
'use client';

import { MapSelectionProps } from '../types/LocationTimeTypes';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Leaflet
const UniversityMap = dynamic(() => import('../UniversityMap'), { ssr: false });

export default function MapSelection({
  selectedLocation,
  isLocationValid,
  onLocationSelect,
}: MapSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location on Campus *
      </label>
      <div className="space-y-2">
        <UniversityMap 
          onLocationSelect={onLocationSelect}
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
  );
}
