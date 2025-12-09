// Single Responsibility: Display a group card with animal characteristics and metadata
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, Edit2, Trash2 } from 'lucide-react';
import { GroupCardProps } from '../types/RecordsTypes';
import Button from '@/components/ui/Button';

export default function GroupCard({
  group,
  reports,
  onViewDetails,
  onEdit,
  onDelete,
  isExpanded: controlledExpanded,
  onToggleExpand,
}: GroupCardProps) {
  // Internal expand state if not controlled
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  
  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const animalEmoji = group.animalType === 'dog' ? '🐕' : '🐈';
  const sexEmoji = group.sex === 'male' ? '♂️' : group.sex === 'female' ? '♀️' : '❓';

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm border border-[rgb(var(--color-border))] overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="p-4">
        {/* Title Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{animalEmoji}</span>
            <div>
              <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
                {group.name}
              </h3>
              <p className="text-sm text-[rgb(var(--color-text-tertiary))]">
                ID: {group.id.slice(0, 8)}...
              </p>
            </div>
          </div>
          
          {/* Sighting Count Badge */}
          <div className="bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))] px-3 py-1 rounded-full text-sm font-semibold">
            {group.reportCount} {group.reportCount === 1 ? 'sighting' : 'sightings'}
          </div>
        </div>

        {/* Description */}
        {group.description && (
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-3">
            {group.description}
          </p>
        )}

        {/* Characteristics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Animal Type & Sex */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-3 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Type & Sex</div>
            <div className="font-semibold text-[rgb(var(--color-text-primary))] capitalize flex items-center gap-1">
              {group.animalType} {sexEmoji}
            </div>
          </div>

          {/* Primary Color */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-3 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Primary Color</div>
            <div className="font-semibold text-[rgb(var(--color-text-primary))] capitalize">
              {group.primaryColor}
            </div>
          </div>

          {/* Color Pattern */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-3 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Pattern</div>
            <div className="font-semibold text-[rgb(var(--color-text-primary))] capitalize">
              {group.colorPattern}
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-3 border border-[rgb(var(--color-border))]">
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Sighted Period</div>
            <div className="text-xs font-medium text-[rgb(var(--color-text-primary))]">
              {formatDate(group.firstSightedDate)}
              {group.reportCount > 1 && (
                <> - {formatDate(group.lastSightedDate)}</>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => onViewDetails(group.id)}
            fullWidth
          >
            View Details
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() => onEdit(group.id)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => onDelete(group.id)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Expandable Reports Preview */}
      {reports.length > 0 && (
        <>
          {/* Expand/Collapse Button */}
          <button
            onClick={handleToggleExpand}
            className="w-full px-4 py-2 bg-[rgb(var(--color-background))] border-t border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface-hover))] transition-colors flex items-center justify-between"
          >
            <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
              {isExpanded ? 'Hide' : 'Show'} Reports ({reports.length})
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
            )}
          </button>

          {/* Expanded Reports List */}
          {isExpanded && (
            <div className="p-4 bg-[rgb(var(--color-background))] border-t border-[rgb(var(--color-border))] space-y-2 max-h-64 overflow-y-auto">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 bg-[rgb(var(--color-surface))] rounded-lg border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary-light))] transition-colors cursor-pointer"
                  onClick={() => onViewDetails(group.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                        Sighted: {formatDate(report.spottedDate)} at {report.spottedTime}
                      </div>
                      <div className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                        📍 {report.locationDescription || 'No location description'}
                      </div>
                    </div>
                    {report.photoUrl && (
                      <div className="ml-2 text-xs text-[rgb(var(--color-text-tertiary))]">
                        📷
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer Metadata */}
      <div className="px-4 py-2 bg-[rgb(var(--color-background))] border-t border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text-tertiary))]">
        Created by {group.createdBy} on {formatDate(group.createdAt)}
      </div>
    </div>
  );
}
