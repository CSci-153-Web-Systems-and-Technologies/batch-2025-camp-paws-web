// Single Responsibility: Reusable report card for displaying report details
'use client';

import Image from 'next/image';
import { Eye, Trash2 } from 'lucide-react';
import { ReportCardProps } from '../types/RecordsTypes';
import Button from '@/components/ui/Button';

export default function ReportCard({
  report,
  showActions = false,
  compact = false,
  onViewDetails,
  onDelete,
}: ReportCardProps) {
  const animalEmoji = report.animalType === 'dog' ? '🐕' : '🐈';
  const sexEmoji = report.sex === 'male' ? '♂️' : report.sex === 'female' ? '♀️' : '❓';
  const collarEmoji = report.collar === 'yes' ? '🔴' : report.collar === 'no' ? '⚪' : '❓';

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Compact version (for use in lists/modals)
  if (compact) {
    return (
      <div className="bg-[rgb(var(--color-surface))] rounded-lg p-3 border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary-light))] transition-colors">
        <div className="flex gap-3">
          {/* Photo/Icon */}
          {report.photoUrl ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[rgb(var(--color-border))]">
              <Image
                src={report.photoUrl}
                alt={`${report.animalType} sighting`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] flex items-center justify-center shrink-0">
              <span className="text-2xl">{animalEmoji}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{animalEmoji}</span>
              <span className="font-semibold text-[rgb(var(--color-text-primary))] capitalize">
                {report.animalType}
              </span>
              <span>{sexEmoji}</span>
            </div>
            <div className="text-sm text-[rgb(var(--color-text-secondary))]">
              {formatDate(report.spottedDate)} at {report.spottedTime}
            </div>
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] truncate">
              📍 {report.locationDescription || 'No location'}
            </div>
          </div>

          {/* Actions (if enabled) */}
          {showActions && (onViewDetails || onDelete) && (
            <div className="flex flex-col gap-1 shrink-0">
              {onViewDetails && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Eye className="w-3 h-3" />}
                  onClick={() => onViewDetails(report.id)}
                >
                  View
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Trash2 className="w-3 h-3" />}
                  onClick={() => onDelete(report.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full version (detailed view)
  return (
    <div className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm border border-[rgb(var(--color-border))]">
      <div className="p-4">
        {/* Header with Photo */}
        <div className="flex gap-4 mb-4">
          {/* Photo */}
          {report.photoUrl ? (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden shrink-0 border border-[rgb(var(--color-border))]">
              <Image
                src={report.photoUrl}
                alt={`${report.animalType} sighting`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-lg bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] flex items-center justify-center shrink-0">
              <span className="text-5xl">{animalEmoji}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">{animalEmoji}</span>
              <h3 className="text-xl font-bold text-[rgb(var(--color-text-primary))] capitalize">
                {report.animalType}
              </h3>
              <span className="text-2xl">{sexEmoji}</span>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                <span className="font-medium">Sighted:</span> {formatDate(report.spottedDate)} at {report.spottedTime}
              </div>
              <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                <span className="font-medium">Location:</span> 📍 {report.locationDescription || `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`}
              </div>
              <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                <span className="font-medium">Reporter:</span> {report.reportedBy} ({report.reporterEmail})
              </div>
              <div className="text-xs text-[rgb(var(--color-text-tertiary))]">
                Report ID: {report.id}
              </div>
            </div>
          </div>
        </div>

        {/* Physical Characteristics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {/* Collar */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-3 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Collar</div>
            <div className="font-semibold text-sm text-[rgb(var(--color-text-primary))] capitalize flex items-center gap-1">
              {collarEmoji} {report.collar}
            </div>
          </div>

          {/* Primary Color */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-3 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Primary Color</div>
            <div className="font-semibold text-sm text-[rgb(var(--color-text-primary))] capitalize">
              {report.primaryColor}
            </div>
          </div>

          {/* Pattern */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-3 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Color Pattern</div>
            <div className="font-semibold text-sm text-[rgb(var(--color-text-primary))] capitalize">
              {report.colorPattern}
            </div>
          </div>

          {/* BCS */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-3 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Body Condition</div>
            <div className="font-semibold text-sm text-[rgb(var(--color-text-primary))]">
              {report.bodyConditionScore}/9
            </div>
          </div>
        </div>

        {/* Physical Problems */}
        {report.physicalProblems.length > 0 && (
          <div className="mb-4 p-3 bg-[rgb(var(--color-warning-bg))] border border-[rgb(var(--color-warning))] rounded-lg">
            <div className="text-sm font-semibold text-[rgb(var(--color-warning))] mb-2">
              ⚠️ Physical Issues Observed
            </div>
            <div className="flex flex-wrap gap-2">
              {report.physicalProblems.map((problem) => (
                <span
                  key={problem}
                  className="text-xs px-2 py-1 bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] rounded border border-[rgb(var(--color-warning-light))]"
                >
                  {problem.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {report.notes && (
          <div className="mb-4 p-3 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg">
            <div className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
              📝 Additional Notes
            </div>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {report.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (onViewDetails || onDelete) && (
          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Eye className="w-4 h-4" />}
                onClick={() => onViewDetails(report.id)}
                fullWidth
              >
                View Full Details
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => onDelete(report.id)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-[rgb(var(--color-background))] border-t border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text-tertiary))]">
        Accepted on {formatDate(report.acceptedAt)} • Created {formatDate(report.createdAt)}
      </div>
    </div>
  );
}
