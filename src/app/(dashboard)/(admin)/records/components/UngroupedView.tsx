'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import UngroupedReportCard from './UngroupedReportCard';
import { UngroupedViewProps } from '../types/RecordsTypes';

/**
 * View for displaying ungrouped reports.
 * Shows a grid of UngroupedReportCard components with bulk selection and actions.
 */
export default function UngroupedView({
  reports,
  onAddToGroup,
  onCreateGroup,
  onDeleteReport,
  onViewReport,
  selectedReportIds = [],
  onSelectReport,
  onBulkGroup,
}: UngroupedViewProps) {
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedReportIds);

  // Handle selection toggle
  const handleSelectToggle = (reportId: string) => {
    const newSelection = localSelectedIds.includes(reportId)
      ? localSelectedIds.filter(id => id !== reportId)
      : [...localSelectedIds, reportId];
    
    setLocalSelectedIds(newSelection);
    if (onSelectReport) {
      onSelectReport(reportId);
    }
  };

  // Select all / deselect all
  const handleSelectAll = () => {
    if (localSelectedIds.length === reports.length) {
      setLocalSelectedIds([]);
    } else {
      setLocalSelectedIds(reports.map(r => r.id));
    }
  };

  const hasSelection = localSelectedIds.length > 0;

  // Empty state
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">
            All Reports Organized
          </h3>
          <p className="text-[rgb(var(--color-text-muted))]">
            Great! All accepted reports have been grouped. New ungrouped reports will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Bulk Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
            Ungrouped Reports
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            {reports.length} {reports.length === 1 ? 'report' : 'reports'} waiting to be organized
            {hasSelection && (
              <span className="ml-2 text-[rgb(var(--color-primary))]">
                • {localSelectedIds.length} selected
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Select All Toggle */}
          <Button
            variant="secondary"
            onClick={handleSelectAll}
          >
            {localSelectedIds.length === reports.length ? 'Deselect All' : 'Select All'}
          </Button>

          {/* Bulk Group Action */}
          {hasSelection && onBulkGroup && (
            <Button
              variant="primary"
              leftIcon={<Users />}
              onClick={() => onBulkGroup(localSelectedIds)}
            >
              Group Selected ({localSelectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((report) => {
          const isSelected = localSelectedIds.includes(report.id);

          return (
            <UngroupedReportCard
              key={report.id}
              report={report}
              onAddToGroup={() => onAddToGroup(report.id)}
              onCreateGroup={() => onCreateGroup(report.id)}
              onDelete={() => onDeleteReport(report.id)}
              onViewDetails={() => onViewReport(report.id)}
              isSelected={isSelected}
              onSelect={onSelectReport ? () => handleSelectToggle(report.id) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
