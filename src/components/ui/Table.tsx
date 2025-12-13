// Reusable Table Component with selection support and pagination
'use client';

import { ReactNode, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TableColumn<T> {
  id: string;
  label: string;
  width?: string;
  render: (item: T) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  // Selection
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectRow?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  getRowId: (item: T) => string;
  // Empty state
  emptyMessage?: string;
  // Footer
  showSelectionInfo?: boolean;
  // Pagination
  itemsPerPage?: number;
}

export default function Table<T>({
  columns,
  data,
  onRowClick,
  selectable = false,
  selectedIds = new Set(),
  onSelectRow,
  onSelectAll,
  getRowId,
  emptyMessage = 'No data available',
  showSelectionInfo = false,
  itemsPerPage = 15,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Check if all items on current page are selected
  const isAllSelected = paginatedData.length > 0 && paginatedData.every(item => selectedIds.has(getRowId(item)));
  const isSomeSelected = paginatedData.some(item => selectedIds.has(getRowId(item))) && !isAllSelected;

  // Handle page change
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm border border-[rgb(var(--color-border))] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[rgb(var(--color-background))] border-b border-[rgb(var(--color-border))]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-6 py-3 text-left text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wider ${column.width || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {selectable && (
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
                      onChange={(e) => onSelectAll?.(e.target.checked)}
                      className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
                    />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-[rgb(var(--color-surface))] divide-y divide-[rgb(var(--color-border))]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-[rgb(var(--color-text-secondary))]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const rowId = getRowId(item);
                const isSelected = selectedIds.has(rowId);
                return (
                  <tr
                    key={rowId}
                    className={`hover:bg-[rgb(var(--color-background))] ${onRowClick ? 'cursor-pointer' : ''} transition-colors ${
                      isSelected ? 'bg-[rgb(var(--color-primary-light))]' : ''
                    }`}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        onClick={() => onRowClick?.(item)}
                        className="px-6 py-4 whitespace-nowrap text-sm text-[rgb(var(--color-text-primary))]"
                      >
                        {column.render(item)}
                      </td>
                    ))}
                    {selectable && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              onSelectRow?.(rowId, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination and selection info */}
      {(showSelectionInfo || totalPages > 1) && (
        <div className="bg-[rgb(var(--color-background))] px-6 py-3 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
          {/* Selection info */}
          <div className="text-sm text-[rgb(var(--color-text-secondary))]">
            {showSelectionInfo && selectable ? (
              <span>{selectedIds.size} of {data.length} row(s) selected.</span>
            ) : (
              <span>Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}</span>
            )}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-[rgb(var(--color-surface))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    Math.abs(page - currentPage) <= 1;
                  
                  const showEllipsis = 
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return (
                      <span key={page} className="px-2 text-[rgb(var(--color-text-secondary))]">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) {
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-8 h-8 px-2 rounded text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-[rgb(var(--color-primary))] text-white'
                          : 'hover:bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-[rgb(var(--color-surface))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
