// Single Responsibility: Display report details in map popup
import Image from 'next/image';
import { ReportPopupProps } from '../types/MapTypes';

export default function ReportPopup({ report }: ReportPopupProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const animalEmoji = report.animalType === 'dog' ? '🐕' : '🐈';

  return (
    <div className="min-w-[200px]">
      {/* Photo if available */}
      {report.photoUrl && (
        <div className="relative w-full h-32 mb-2">
          <Image 
            src={report.photoUrl} 
            alt={`${report.animalType} sighting`}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
      
      {/* Animal Type */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{animalEmoji}</span>
        <span className="font-semibold text-gray-900 capitalize">
          {report.animalType}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
          {report.status}
        </span>
      </div>

      {/* Date & Time */}
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Spotted:</span>{' '}
        {new Date(report.spottedDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })}{' '}
        at {report.spottedTime}
      </div>

      {/* Location */}
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Location:</span>{' '}
        {report.locationDescription || `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`}
      </div>

      {/* Reporter */}
      {report.reporterName && (
        <div className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Reporter:</span> {report.reporterName}
        </div>
      )}

      {/* Report ID */}
      <div className="text-xs text-gray-400 mt-2 border-t pt-2">
        ID: {report.id.slice(0, 8)}...
      </div>
    </div>
  );
}
