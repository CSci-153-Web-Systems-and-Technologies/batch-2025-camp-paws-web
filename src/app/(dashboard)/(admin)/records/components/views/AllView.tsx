// Single Responsibility: Display all individual reports in a table format
'use client';

import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { AllViewProps, AcceptedReport } from '../../types/RecordsTypes';

/**
 * View for displaying all individual reports in a single table.
 * This provides a comprehensive view of all individual sighting records.
 */
export default function AllView({
  reports,
  onViewReport,
}: AllViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sort reports by date (most recent first)
  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.spottedDate).getTime() - new Date(a.spottedDate).getTime()
  );

  // Handle selection
  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(sortedReports.map(r => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Handle actions
  const handleEdit = () => {
    if (selectedIds.size === 1) {
      const reportId = Array.from(selectedIds)[0];
      onViewReport(reportId);
    }
  };

  const handleDelete = () => {
    if (selectedIds.size > 0) {
      console.log('Delete reports:', Array.from(selectedIds));
      // TODO: Implement delete functionality
    }
  };

  // Empty state
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">
            No Records Yet
          </h3>
          <p className="text-[rgb(var(--color-text-muted))]">
            Accepted reports will appear here.
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
            All Reports
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            Complete list of all {reports.length} individual sighting {reports.length === 1 ? 'report' : 'reports'}
          </p>
        </div>

        {/* Action Buttons */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              leftIcon={<Edit2 />}
              onClick={handleEdit}
              disabled={selectedIds.size !== 1}
            >
              Edit
            </Button>
            
            <Button
              variant="danger"
              leftIcon={<Trash2 />}
              onClick={handleDelete}
            >
              Delete {selectedIds.size > 1 ? `(${selectedIds.size})` : ''}
            </Button>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/20 rounded-lg p-4">
        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
          ℹ️ This view shows every individual report, including those that are part of groups and those that are ungrouped.
        </p>
      </div>

      {/* All Reports Table */}
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
        data={sortedReports}
        onRowClick={(report: AcceptedReport) => onViewReport(report.id)}
        selectable={true}
        selectedIds={selectedIds}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        getRowId={(report: AcceptedReport) => report.id}
        emptyMessage="No reports available"
        showSelectionInfo={false}
      />
    </div>
  );
}
