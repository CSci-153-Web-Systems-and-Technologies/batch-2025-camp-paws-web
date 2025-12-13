'use client';

import { useState } from 'react';
import { Users, Pencil, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import { UngroupedViewProps, AcceptedReport } from '../../types/RecordsTypes';
// removed toast; using modal for coming-soon messages

/**
 * View for displaying ungrouped reports in a table format.
 * Shows a table with selection and action buttons below.
 */
export default function UngroupedView({
  reports,
  onViewReport,
  selectedReportIds = [],
  onSelectReport,
}: UngroupedViewProps) {
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedReportIds);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonMessage] = useState('Feature will arrive soon');

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
      {/* Header with Action Buttons */}
      <div className="flex items-start justify-between gap-4">
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

        {/* Action Buttons */}
        {hasSelection && (
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              leftIcon={<Pencil />}
              disabled={localSelectedIds.length !== 1}
              onClick={() => setShowComingSoon(true)}
            >
              Edit
            </Button>
            
            <Button
              variant="danger"
              leftIcon={<Trash2 />}
              onClick={() => setShowComingSoon(true)}
            >
              Delete {localSelectedIds.length > 1 ? `(${localSelectedIds.length})` : ''}
            </Button>

            <Button
              variant="primary"
              leftIcon={<Users />}
              onClick={() => setShowComingSoon(true)}
            >
              New Group {localSelectedIds.length > 1 ? `(${localSelectedIds.length})` : ''}
            </Button>
          </div>
        )}
      </div>

      {/* Reports Table */}
      <Table
        columns={[
          {
            id: 'animalType',
            label: 'Animal Type',
            width: 'w-32',
            render: (report: AcceptedReport) => <span className="capitalize">{report.animalType}</span>
          },
          {
            id: 'sex',
            label: 'Sex',
            width: 'w-24',
            render: (report: AcceptedReport) => <span className="capitalize">{report.sex}</span>
          },
          {
            id: 'colorPattern',
            label: 'Color Pattern',
            width: 'w-32',
            render: (report: AcceptedReport) => <span className="capitalize">{report.colorPattern}</span>
          },
          {
            id: 'primaryColor',
            label: 'Color',
            width: 'w-32',
            render: (report: AcceptedReport) => report.primaryColor
          },
          {
            id: 'spottedTime',
            label: 'Sighting Time',
            width: 'w-40',
            render: (report: AcceptedReport) => `${report.spottedDate} - ${report.spottedTime}`
          },
          {
            id: 'bcs',
            label: 'BCS',
            width: 'w-24',
            render: (report: AcceptedReport) => `${report.bodyConditionScore}/9`
          },
        ]}
        data={reports}
        onRowClick={(report: AcceptedReport) => onViewReport(report.id)}
        selectable={true}
        selectedIds={new Set(localSelectedIds)}
        onSelectRow={(id: string) => {
          handleSelectToggle(id);
        }}
        getRowId={(report: AcceptedReport) => report.id}
        emptyMessage="No ungrouped reports"
        showSelectionInfo={false}
      />

      <Modal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} title="Coming soon">
        <div className="space-y-4">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">{comingSoonMessage}</p>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowComingSoon(false)}
              className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
