// Single Responsibility: Display an ungrouped report card with actions
'use client';

import Image from 'next/image';
import { FolderPlus, Plus, Eye, Trash2 } from 'lucide-react';
import { UngroupedReportCardProps } from '../types/RecordsTypes';
import Button from '@/components/ui/Button';

export default function UngroupedReportCard({
  report,
  onAddToGroup,
  onCreateGroup,
  onDelete,
  onViewDetails,
  isSelected,
  onSelect,
}: UngroupedReportCardProps) {
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

  return (
    <div
      className={`
        bg-[rgb(var(--color-surface))] rounded-lg shadow-sm border-2 transition-all
        ${isSelected 
          ? 'border-[rgb(var(--color-primary))] ring-2 ring-[rgb(var(--color-primary-light))]' 
          : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary-light))]'
        }
      `}
    >
      {/* Selection Checkbox (if bulk selection enabled) */}
      {onSelect && (
        <div className="p-3 border-b border-[rgb(var(--color-border))]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected || false}
              onChange={() => onSelect(report.id)}
              className="w-4 h-4 rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
            />
            <span className="text-sm text-[rgb(var(--color-text-secondary))]">
              Select for grouping
            </span>
          </label>
        </div>
      )}

      <div className="p-4">
        {/* Header with Photo */}
        <div className="flex gap-4 mb-4">
          {/* Photo */}
          {report.photoUrl ? (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[rgb(var(--color-border))]">
              <Image
                src={report.photoUrl}
                alt={`${report.animalType} sighting`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] flex items-center justify-center shrink-0">
              <span className="text-4xl">{animalEmoji}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{animalEmoji}</span>
              <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))] capitalize">
                {report.animalType}
              </h3>
              <span className="text-lg">{sexEmoji}</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                <span className="font-medium">Sighted:</span> {formatDate(report.spottedDate)} at {report.spottedTime}
              </div>
              <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                <span className="font-medium">Location:</span> 📍 {report.locationDescription || 'No description'}
              </div>
              <div className="text-xs text-[rgb(var(--color-text-tertiary))]">
                ID: {report.id.slice(0, 8)}...
              </div>
            </div>
          </div>
        </div>

        {/* Physical Characteristics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {/* Collar */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-2 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))]">Collar</div>
            <div className="font-semibold text-sm text-[rgb(var(--color-text-primary))] capitalize flex items-center gap-1">
              {collarEmoji} {report.collar}
            </div>
          </div>

          {/* Primary Color */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-2 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))]">Color</div>
            <div className="font-semibold text-sm text-[rgb(var(--color-text-primary))] capitalize">
              {report.primaryColor}
            </div>
          </div>

          {/* Pattern */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-2 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))]">Pattern</div>
            <div className="font-semibold text-sm text-[rgb(var(--color-text-primary))] capitalize">
              {report.colorPattern}
            </div>
          </div>

          {/* BCS */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-2 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))]">BCS</div>
            <div className="font-semibold text-sm text-[rgb(var(--color-text-primary))]">
              {report.bodyConditionScore}/9
            </div>
          </div>
        </div>

        {/* Physical Problems */}
        {report.physicalProblems.length > 0 && (
          <div className="mb-4 p-2 bg-[rgb(var(--color-warning-bg))] border border-[rgb(var(--color-warning))] rounded-lg">
            <div className="text-xs font-medium text-[rgb(var(--color-warning))] mb-1">
              ⚠️ Physical Issues
            </div>
            <div className="flex flex-wrap gap-1">
              {report.physicalProblems.map((problem) => (
                <span
                  key={problem}
                  className="text-xs px-2 py-1 bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] rounded"
                >
                  {problem.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {report.notes && (
          <div className="mb-4 p-2 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg">
            <div className="text-xs font-medium text-[rgb(var(--color-text-tertiary))] mb-1">
              📝 Notes
            </div>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {report.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Primary Actions */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<FolderPlus className="w-4 h-4" />}
            onClick={() => onAddToGroup(report.id)}
            fullWidth
          >
            Add to Group
          </Button>
          <Button
            variant="success"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => onCreateGroup(report.id)}
            fullWidth
          >
            Create Group
          </Button>
          
          {/* Secondary Actions */}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => onViewDetails(report.id)}
            fullWidth
          >
            View Details
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => onDelete(report.id)}
            fullWidth
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Footer with Reporter Info */}
      <div className="px-4 py-2 bg-[rgb(var(--color-background))] border-t border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text-tertiary))]">
        Reported by {report.reportedBy} • Accepted on {formatDate(report.acceptedAt)}
      </div>
    </div>
  );
}
