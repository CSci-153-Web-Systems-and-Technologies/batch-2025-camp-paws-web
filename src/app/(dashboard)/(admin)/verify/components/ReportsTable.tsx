// Single Responsibility: Display reports in a table format
'use client';

import { useState } from 'react';
import Table, { TableColumn } from '@/components/ui/Table';
import { ReportsTableProps, Report } from '../types/VerifyTypes';

export default function ReportsTable({ reports, onRowClick, selectedColumns, onSelectionChange }: ReportsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSet = new Set(reports.map(r => r.id));
      setSelectedRows(newSet);
      if (onSelectionChange) onSelectionChange([...newSet]);
    } else {
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    }
  };

  const handleSelectRow = (reportId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(reportId);
    } else {
      newSelected.delete(reportId);
    }
    setSelectedRows(newSelected);
    if (onSelectionChange) onSelectionChange([...newSelected]);
  };

  const columnConfig: Record<string, { label: string; width: string; render: (report: Report) => React.ReactNode }> = {
    reportId: {
      label: 'Report ID',
      width: 'w-40',
      render: (report) => (
        <div className="font-mono text-xs text-[rgb(var(--color-text-secondary))]">
          {report.id.slice(0, 8)}...
        </div>
      )
    },
    animalType: {
      label: 'Animal Type',
      width: 'w-32',
      render: (report) => <span className="capitalize">{report.animalType}</span>
    },
    sex: {
      label: 'Sex',
      width: 'w-24',
      render: (report) => <span className="capitalize">{report.sex}</span>
    },
    colorPattern: {
      label: 'Color Pattern',
      width: 'w-32',
      render: (report) => <span className="capitalize">{report.colorPattern}</span>
    },
    primaryColor: {
      label: 'Color',
      width: 'w-32',
      render: (report) => report.primaryColor
    },
    spottedTime: {
      label: 'Sighting Time',
      width: 'w-40',
      render: (report) => `${report.spottedDate} - ${report.spottedTime}`
    },
  };

  const getDisplayColumns = (): TableColumn<Report>[] => {
    return selectedColumns
      .filter(col => col in columnConfig)
      .map(columnId => ({
        id: columnId,
        label: columnConfig[columnId].label,
        width: columnConfig[columnId].width,
        render: columnConfig[columnId].render,
      }));
  };

  const displayColumns = getDisplayColumns();

  return (
    <Table
      columns={displayColumns}
      data={reports}
      onRowClick={onRowClick}
      selectable={true}
      selectedIds={selectedRows}
      onSelectRow={handleSelectRow}
      onSelectAll={handleSelectAll}
      getRowId={(report) => report.id}
      emptyMessage="No pending reports to verify"
      showSelectionInfo={true}
    />
  );
}
