'use client';

// Single Responsibility: Display report location on a small map
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// VSU Campus boundary
const VSU_BOUNDARY = [
  [10.739297109417734, 124.78954418752326],
  [10.745093765187544, 124.78655704607576],
  [10.748908580850467, 124.79208701275739],
  [10.74982855084182, 124.7944559685733],
  [10.751032694776626, 124.79582456702671],
  [10.750142115575805, 124.79799860535354],
  [10.749993039272425, 124.79826472281272],
  [10.744037371313935, 124.80597500444362],
  [10.741857649512134, 124.80194507540114],
] as [number, number][];

interface ReportLocationMapProps {
  latitude: number;
  longitude: number;
}

export default function ReportLocationMap({ latitude, longitude }: ReportLocationMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={17}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* VSU Campus Boundary */}
      <Polygon
        positions={VSU_BOUNDARY}
        pathOptions={{
          color: '#22c55e',
          fillColor: '#22c55e',
          fillOpacity: 0.1,
          weight: 2,
        }}
      />
      
      <Marker position={[latitude, longitude]}>
        <Popup>
          <div className="text-sm">
            <p className="font-semibold">Report Location</p>
            <p className="text-xs text-gray-600">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
