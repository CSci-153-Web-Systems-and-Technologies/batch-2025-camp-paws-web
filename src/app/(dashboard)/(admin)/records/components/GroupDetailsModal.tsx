// Single Responsibility: Modal showing full group details with all reports and actions
'use client';

import { useState } from 'react';
import { Edit2, Trash2, X, MapPin } from 'lucide-react';
import { GroupDetailsModalProps } from '../types/RecordsTypes';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ReportCard from './ReportCard';

export default function GroupDetailsModal({
  isOpen,
  onClose,
  group,
  reports,
  onEditGroup,
  onDeleteGroup,
  onRemoveReport,
  onDeleteReport,
  onViewReport,
}: GroupDetailsModalProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const animalEmoji = group.animalType === 'dog' ? '🐕' : '🐈';
  const sexEmoji = group.sex === 'male' ? '♂️' : group.sex === 'female' ? '♀️' : '❓';

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Sort reports by date (most recent first)
  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.spottedDate).getTime() - new Date(a.spottedDate).getTime()
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${animalEmoji} ${group.name}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Group Characteristics */}
        <div className="bg-[rgb(var(--color-background))] rounded-lg p-4 border border-[rgb(var(--color-border))]">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">
            Animal Characteristics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Type & Sex */}
            <div>
              <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Type & Sex</div>
              <div className="font-semibold text-[rgb(var(--color-text-primary))] capitalize flex items-center gap-1">
                {group.animalType} {sexEmoji}
              </div>
            </div>

            {/* Primary Color */}
            <div>
              <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Primary Color</div>
              <div className="font-semibold text-[rgb(var(--color-text-primary))] capitalize">
                {group.primaryColor}
              </div>
            </div>

            {/* Pattern */}
            <div>
              <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Pattern</div>
              <div className="font-semibold text-[rgb(var(--color-text-primary))] capitalize">
                {group.colorPattern}
              </div>
            </div>

            {/* Sighting Count */}
            <div>
              <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Total Sightings</div>
              <div className="font-semibold text-[rgb(var(--color-primary))]">
                {group.reportCount}
              </div>
            </div>
          </div>

          {/* Description */}
          {group.description && (
            <div className="mt-3 pt-3 border-t border-[rgb(var(--color-border))]">
              <div className="text-xs text-[rgb(var(--color-text-tertiary))] mb-1">Description</div>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                {group.description}
              </p>
            </div>
          )}

          {/* Date Range */}
          <div className="mt-3 pt-3 border-t border-[rgb(var(--color-border))]">
            <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
              <MapPin className="w-4 h-4" />
              <span>
                <span className="font-medium">First sighted:</span> {formatDate(group.firstSightedDate)}
                {group.reportCount > 1 && (
                  <> • <span className="font-medium">Last sighted:</span> {formatDate(group.lastSightedDate)}</>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Group Actions */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() => {
              onEditGroup(group.id);
              onClose();
            }}
            fullWidth
          >
            Edit Group
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => {
              onDeleteGroup(group.id);
              onClose();
            }}
            fullWidth
          >
            Delete Group
          </Button>
        </div>

        {/* Reports List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
              Sighting Reports ({reports.length})
            </h3>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-8 bg-[rgb(var(--color-background))] rounded-lg border border-[rgb(var(--color-border))]">
              <p className="text-[rgb(var(--color-text-secondary))]">
                No reports in this group yet
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {sortedReports.map((report) => (
                <div
                  key={report.id}
                  className={`
                    relative transition-all
                    ${selectedReportId === report.id ? 'ring-2 ring-[rgb(var(--color-primary))] rounded-lg' : ''}
                  `}
                >
                  <ReportCard
                    report={report}
                    compact
                    showActions
                    onViewDetails={(id) => {
                      setSelectedReportId(id);
                      onViewReport(id);
                    }}
                    onDelete={onDeleteReport}
                  />
                  
                  {/* Remove from Group button */}
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="warning"
                      size="sm"
                      leftIcon={<X className="w-3 h-3" />}
                      onClick={() => onRemoveReport(report.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with metadata */}
        <div className="pt-4 border-t border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text-tertiary))]">
          Created by {group.createdBy} on {formatDate(group.createdAt)} • Last updated {formatDate(group.updatedAt)}
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
