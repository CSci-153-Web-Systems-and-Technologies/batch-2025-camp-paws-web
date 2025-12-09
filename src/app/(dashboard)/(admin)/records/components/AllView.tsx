'use client';

import GroupCard from './GroupCard';
import UngroupedReportCard from './UngroupedReportCard';
import { AllViewProps } from '../types/RecordsTypes';

/**
 * View for displaying all groups and ungrouped reports together.
 * Shows grouped animals first, then ungrouped reports, with visual distinction.
 */
export default function AllView({
  groups,
  reports,
  onViewGroup,
  onViewReport,
}: AllViewProps) {
  // Split reports into grouped and ungrouped
  const groupedReportIds = new Set(groups.flatMap(g => g.reportIds));
  const ungroupedReports = reports.filter(r => !groupedReportIds.has(r.id));

  // Empty state (no data at all)
  if (groups.length === 0 && reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">
            No Records Yet
          </h3>
          <p className="text-[rgb(var(--color-text-muted))]">
            Accepted reports and groups will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
          All Records
        </h2>
        <p className="text-sm text-[rgb(var(--color-text-muted))]">
          {groups.length} {groups.length === 1 ? 'group' : 'groups'} • {ungroupedReports.length} ungrouped {ungroupedReports.length === 1 ? 'report' : 'reports'}
        </p>
      </div>

      {/* Grouped Animals Section */}
      {groups.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-md font-semibold text-[rgb(var(--color-text))]">
              📁 Grouped Animals
            </h3>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[rgb(var(--color-primary)/0.2)] text-[rgb(var(--color-primary))]">
              {groups.length}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {groups.map((group) => {
              // Get reports for this group
              const groupReports = reports.filter(r => group.reportIds.includes(r.id));

              return (
                <GroupCard
                  key={group.id}
                  group={group}
                  reports={groupReports}
                  onViewDetails={() => onViewGroup(group.id)}
                  onEdit={() => {}} // Read-only in All view
                  onDelete={() => {}} // Read-only in All view
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Ungrouped Reports Section */}
      {ungroupedReports.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-md font-semibold text-[rgb(var(--color-text))]">
              📋 Ungrouped Reports
            </h3>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[rgb(var(--color-warning)/0.2)] text-[rgb(var(--color-warning))]">
              {ungroupedReports.length}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {ungroupedReports.map((report) => {
              return (
                <UngroupedReportCard
                  key={report.id}
                  report={report}
                  onAddToGroup={() => {}} // Read-only in All view
                  onCreateGroup={() => {}} // Read-only in All view
                  onDelete={() => {}} // Read-only in All view
                  onViewDetails={() => onViewReport(report.id)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Info Banner */}
      <div className="bg-[rgb(var(--color-muted)/0.3)] rounded-lg p-4 border border-[rgb(var(--color-border))]">
        <p className="text-sm text-[rgb(var(--color-text-muted))]">
          💡 <strong>Tip:</strong> Switch to <span className="text-[rgb(var(--color-primary))]">Grouped</span> or <span className="text-[rgb(var(--color-warning))]">Ungrouped</span> view to manage records individually.
        </p>
      </div>
    </div>
  );
}
