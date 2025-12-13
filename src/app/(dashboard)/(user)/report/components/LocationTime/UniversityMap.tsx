'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface UniversityMapProps {
  onLocationSelect: (lat: number, lng: number, isValid: boolean) => void;
  selectedLocation: { lat: number; lng: number } | null;
}

// Visayas State University exact campus boundary points
const VSU_BOUNDARY_POINTS: [number, number][] = [
  [10.739297109417734, 124.78954418752326],
  [10.745093765187544, 124.78655704607576],
  [10.748908580850467, 124.79208701275739],
  [10.74982855084182, 124.7944559685733],
  [10.751032694776626, 124.79582456702671],
  [10.750142115575805, 124.79799860535354],
  [10.749993039272425, 124.79826472281272],
  [10.744037371313935, 124.80597500444362],
  [10.741857649512134, 124.80194507540114],
];

const UNIVERSITY_BOUNDS = {
  center: { lat: 10.746183403128184, lng: 124.79501145000867 } // VSU center
};

// Function to check if a point is within the VSU polygon boundary
function isWithinUniversityBounds(lat: number, lng: number): boolean {
  // Point-in-polygon algorithm (ray casting)
  let inside = false;
  const polygon = VSU_BOUNDARY_POINTS;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [yi, xi] = polygon[i];
    const [yj, xj] = polygon[j];
    
    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

// Map click handler component
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number, isValid: boolean) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const isValid = isWithinUniversityBounds(lat, lng);
      onLocationSelect(lat, lng, isValid);
    },
  });
  return null;
}

export default function UniversityMap({ onLocationSelect, selectedLocation }: UniversityMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use timeout to avoid synchronous setState in effect
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-80 bg-[rgb(var(--color-background))] rounded-lg flex items-center justify-center">
        <div className="text-[rgb(var(--color-text-secondary))]">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border border-[rgb(var(--color-border))]">
      <MapContainer
        center={[UNIVERSITY_BOUNDS.center.lat, UNIVERSITY_BOUNDS.center.lng]}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* University boundary visualization */}
        <Polygon 
          positions={VSU_BOUNDARY_POINTS}
          pathOptions={{
            color: '#3b82f6',
            weight: 2,
            fillColor: '#3b82f6',
            fillOpacity: 0.1
          }}
        />
        
        {/* Click handler */}
        <MapClickHandler onLocationSelect={onLocationSelect} />
        
        {/* Selected location marker */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="text-sm text-gray-900">
                <p className="font-semibold">Selected Location</p>
                <p>Lat: {selectedLocation.lat.toFixed(6)}</p>
                <p>Lng: {selectedLocation.lng.toFixed(6)}</p>
                <p className={`mt-1 ${isWithinUniversityBounds(selectedLocation.lat, selectedLocation.lng) ? 'text-green-600' : 'text-red-600'}`}>
                  {isWithinUniversityBounds(selectedLocation.lat, selectedLocation.lng) ? '✓ Valid Location' : '✗ Outside Campus'}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

