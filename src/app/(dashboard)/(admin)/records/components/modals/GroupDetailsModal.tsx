// Single Responsibility: Modal showing full group details with all reports and actions
'use client';

import { Edit2, Trash2, X, MapPin, Eye } from 'lucide-react';
import Image from 'next/image';
import { GroupDetailsModalProps, AcceptedReport } from '../../types/RecordsTypes';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';

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
  const animalEmoji = group.animalType === 'dog' ? '🐕' : '🐈';
  const sexEmoji = group.sex === 'male' ? '♂️' : group.sex === 'female' ? '♀️' : '❓';

  // Get the first report (or admin-selected) photo
  const primaryReport = reports.length > 0 ? reports[0] : null;
  const primaryPhoto = primaryReport?.photoUrl;

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
        {/* Prominent Photo */}
        {primaryPhoto ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-[rgb(var(--color-background))]">
            <Image
              src={primaryPhoto}
              alt={`${group.name}`}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full h-64 rounded-lg bg-linear-to-br from-[rgb(var(--color-background))] to-[rgb(var(--color-surface-hover))] flex items-center justify-center border border-[rgb(var(--color-border))]">
            <span className="text-8xl opacity-30">{animalEmoji}</span>
          </div>
        )}
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

        {/* Reports Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
              Sighting Reports ({reports.length})
            </h3>
          </div>

          <Table
            columns={[
              {
                id: 'spottedDate',
                label: 'Date',
                width: 'w-32',
                render: (report: AcceptedReport) => formatDate(report.spottedDate)
              },
              {
                id: 'spottedTime',
                label: 'Time',
                width: 'w-24',
                render: (report: AcceptedReport) => report.spottedTime
              },
              {
                id: 'location',
                label: 'Location',
                width: 'w-48',
                render: (report: AcceptedReport) => (
                  <div className="max-w-xs truncate">{report.locationDescription}</div>
                )
              },
              {
                id: 'bcs',
                label: 'BCS',
                width: 'w-20',
                render: (report: AcceptedReport) => `${report.bodyConditionScore}/9`
              },
              {
                id: 'collar',
                label: 'Collar',
                width: 'w-24',
                render: (report: AcceptedReport) => (
                  <span className="capitalize">{report.collar}</span>
                )
              },
              {
                id: 'actions',
                label: 'Actions',
                width: 'w-32',
                render: (report: AcceptedReport) => (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewReport(report.id);
                      }}
                      className="p-1.5 rounded hover:bg-[rgb(var(--color-background))] text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveReport(report.id);
                      }}
                      className="p-1.5 rounded hover:bg-[rgb(var(--color-background))] text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-warning))] transition-colors"
                      title="Remove from Group"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteReport(report.id);
                      }}
                      className="p-1.5 rounded hover:bg-[rgb(var(--color-background))] text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-danger))] transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              },
            ]}
            data={sortedReports}
            onRowClick={(report: AcceptedReport) => {
              onViewReport(report.id);
            }}
            getRowId={(report: AcceptedReport) => report.id}
            emptyMessage="No reports in this group yet"
            showSelectionInfo={false}
          />
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
