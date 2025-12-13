'use client';

// Single Responsibility: Display map with animal report markers
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { AdminMapViewProps } from '../types/MapTypes';
import { VSU_CAMPUS_BOUNDARY } from '../utils/CampusBoundary';
import ReportPopup from './ReportPopup';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on animal type and status
const createCustomIcon = (animalType: 'dog' | 'cat', status: 'pending' | 'verified' | 'rejected') => {
  const colors = {
    pending: '#eab308', // yellow
    verified: '#22c55e', // green
    rejected: '#ef4444', // red
  };

  const emoji = animalType === 'dog' ? '🐕' : '🐈';
  const color = colors[status];

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 18px;
        ">${emoji}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export default function AdminMapView({ reports, onReportSelect }: AdminMapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-[rgb(var(--color-background))] rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--color-primary))] mx-auto mb-3"></div>
          <div className="text-[rgb(var(--color-text-secondary))]">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-[rgb(var(--color-border))] shadow-lg">
      <MapContainer
        center={[VSU_CAMPUS_BOUNDARY.center.lat, VSU_CAMPUS_BOUNDARY.center.lng]}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Fit map bounds to reports when available */}
        <FitBounds reports={reports} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* University boundary visualization */}
        <Polygon 
          positions={VSU_CAMPUS_BOUNDARY.boundaryPoints}
          pathOptions={{
            color: '#3b82f6',
            weight: 2,
            fillColor: '#3b82f6',
            fillOpacity: 0.1
          }}
        />
        
        {/* Report markers */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createCustomIcon(report.animalType, report.status)}
            eventHandlers={{
              click: () => onReportSelect(report),
            }}
          >
            <Popup maxWidth={300}>
              <ReportPopup report={report} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function FitBounds({ reports }: { reports: AdminMapViewProps['reports'] }) {
  const map = useMap();

  useEffect(() => {
    if (!reports || reports.length === 0) return;
    const latLngs = reports.map(r => [r.latitude, r.longitude] as [number, number]);
    // fitBounds can throw if latLngs are invalid; ignore errors silently
    try {
      map.fitBounds(latLngs, { padding: [40, 40] });
    } catch {
      // ignore
    }
  }, [reports, map]);

  return null;
}
