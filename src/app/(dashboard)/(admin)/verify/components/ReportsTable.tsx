// Single Responsibility: Display reports in a table format
import { ReportsTableProps } from '../types/VerifyTypes';

export default function ReportsTable({ reports, onRowClick, selectedColumns }: ReportsTableProps) {
  const columnConfig = {
    animalType: { label: 'Animal Type', width: 'w-32' },
    sex: { label: 'Sex', width: 'w-24' },
    color: { label: 'Color', width: 'w-32' },
    spottedTime: { label: 'Sighting Time', width: 'w-40' },
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                Actions
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
              reports.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => onRowClick(report)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {displayColumns.map((columnId) => (
                    <td key={columnId} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {columnId === 'animalType' && (
                        <span className="capitalize">{report.animalType}</span>
                      )}
                      {columnId === 'sex' && (
                        <span className="capitalize">{report.sex}</span>
                      )}
                      {columnId === 'color' && report.color}
                      {columnId === 'spottedTime' && `${report.spottedDate} - ${report.spottedTime}`}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination info */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
        0 of {reports.length} row(s) selected.
      </div>
    </div>
  );
}
