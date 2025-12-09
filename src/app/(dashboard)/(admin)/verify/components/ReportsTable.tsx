// Single Responsibility: Display reports in a table format
'use client';

import { useState } from 'react';
import { ReportsTableProps } from '../types/VerifyTypes';

export default function ReportsTable({ reports, onRowClick, selectedColumns }: ReportsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(reports.map(r => r.id)));
    } else {
      setSelectedRows(new Set());
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
  };

  const isAllSelected = reports.length > 0 && selectedRows.size === reports.length;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < reports.length;
  const columnConfig = {
    animalType: { label: 'Animal Type', width: 'w-32' },
    sex: { label: 'Sex', width: 'w-24' },
    colorPattern: { label: 'Color Pattern', width: 'w-32' },
    primaryColor: { label: 'Color', width: 'w-32' },
    spottedTime: { label: 'Sighting Time', width: 'w-40' },
    submittedBy: { label: 'Submitted By', width: 'w-48' },
  };

  const getDisplayColumns = () => {
    return selectedColumns.filter(col => col in columnConfig);
  };

  const displayColumns = getDisplayColumns();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {displayColumns.map((columnId) => {
                const config = columnConfig[columnId as keyof typeof columnConfig];
                return (
                  <th
                    key={columnId}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${config.width}`}
                  >
                    <div className="flex items-center gap-1">
                      {config.label}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                );
              })}
              {/* Checkbox column */}
              <th className="px-6 py-3 w-12 text-center">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={displayColumns.length + 1} className="px-6 py-12 text-center text-gray-500">
                  No pending reports to verify
                </td>
              </tr>
            ) : (
              reports.map((report) => {
                const isSelected = selectedRows.has(report.id);
                return (
                  <tr
                    key={report.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-green-50' : ''
                    }`}
                  >
                    {displayColumns.map((columnId) => (
                      <td
                        key={columnId}
                        onClick={() => onRowClick(report)}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {columnId === 'animalType' && (
                          <span className="capitalize">{report.animalType}</span>
                        )}
                        {columnId === 'sex' && (
                          <span className="capitalize">{report.sex}</span>
                        )}
                        {columnId === 'colorPattern' && (
                          <span className="capitalize">{report.colorPattern}</span>
                        )}
                        {columnId === 'primaryColor' && report.primaryColor}
                        {columnId === 'spottedTime' && `${report.spottedDate} - ${report.spottedTime}`}
                        {columnId === 'submittedBy' && (
                          <div className="max-w-xs truncate">{report.reportedBy}</div>
                        )}
                      </td>
                    ))}
                    {/* Checkbox column */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(report.id, e.target.checked);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Selection info */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
        {selectedRows.size} of {reports.length} row(s) selected.
      </div>
    </div>
  );
}
