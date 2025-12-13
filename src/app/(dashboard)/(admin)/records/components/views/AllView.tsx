// Single Responsibility: Display all individual reports in a table format
'use client';

import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { AllViewProps, AcceptedReport } from '../../types/RecordsTypes';

// Normalize row shape: accept either AcceptedReport or server row (snake_case) and map to AcceptedReport
function normalizeRow(r: AcceptedReport | Record<string, unknown>): AcceptedReport {
  // if already normalized, assume it's correct
  if ((r as AcceptedReport).animalType !== undefined) {
    return r as AcceptedReport;
  }

  const row = r as Record<string, unknown>;

  // Normalize animal type: accept either the human label or the id; be case-insensitive
  const rawAnimal = String(row['animal_type'] ?? row['animal_type_id'] ?? row['animalType'] ?? '').trim().toLowerCase();
  let animalType: AcceptedReport['animalType'] = 'cat';
  if (rawAnimal.includes('dog')) animalType = 'dog';
  else if (rawAnimal.includes('cat')) animalType = 'cat';

  // Normalize sex similarly (accept 'male'/'female' in various forms)
  const rawSex = String(row['sex'] ?? row['sex_id'] ?? row['sex_id'] ?? row['sex'] ?? '').trim().toLowerCase();
  const sex: AcceptedReport['sex'] = rawSex.includes('male') ? 'male' : (rawSex.includes('female') ? 'female' : 'unknown');

  const collarRaw = String(row['collar_status'] ?? row['collar'] ?? '').toLowerCase();
  const collar: AcceptedReport['collar'] = collarRaw.includes('yes') || collarRaw.includes('with') ? 'yes' : (collarRaw.includes('no') || collarRaw.includes('without') ? 'no' : 'unknown');

  const photoUrl = row['photo_url'] ? String(row['photo_url']) : '';
  const colorPattern = row['color_pattern'] ? String(row['color_pattern']) : 'unknown';
  const primaryColor = row['primary_color'] ? String(row['primary_color']) : (row['primaryColor'] ? String(row['primaryColor']) : 'unknown');

  const bodyConditionScore = Number(row['body_condition_score'] ?? row['bodyConditionScore'] ?? 0) || 0;

  // Server may return either *_problems or *_conditions (snake_case) or camelCase variants
  const skinProblems = Array.isArray(row['skin_problems']) ? (row['skin_problems'] as string[])
    : Array.isArray(row['skinProblems']) ? (row['skinProblems'] as string[])
    : Array.isArray(row['skin_conditions']) ? (row['skin_conditions'] as string[])
    : Array.isArray(row['skinConditions']) ? (row['skinConditions'] as string[])
    : [];

  const eyeProblems = Array.isArray(row['eye_problems']) ? (row['eye_problems'] as string[])
    : Array.isArray(row['eyeProblems']) ? (row['eyeProblems'] as string[])
    : Array.isArray(row['eye_conditions']) ? (row['eye_conditions'] as string[])
    : Array.isArray(row['eyeConditions']) ? (row['eyeConditions'] as string[])
    : [];

  const gaitProblems = Array.isArray(row['gait_problems']) ? (row['gait_problems'] as string[])
    : Array.isArray(row['gaitProblems']) ? (row['gaitProblems'] as string[])
    : Array.isArray(row['gait_conditions']) ? (row['gait_conditions'] as string[])
    : Array.isArray(row['gaitConditions']) ? (row['gaitConditions'] as string[])
    : [];

  const latitude = Number(row['latitude'] ?? 0) || 0;
  const longitude = Number(row['longitude'] ?? 0) || 0;

  const spottedDate = row['spotted_date'] ? String(row['spotted_date']) : (row['spottedDate'] ? String(row['spottedDate']) : new Date().toISOString().split('T')[0]);
  const spottedTime = row['spotted_time'] ? String(row['spotted_time']) : (row['spottedTime'] ? String(row['spottedTime']) : '00:00:00');

  const reportedBy = row['user_id'] ? String(row['user_id']) : (row['reportedBy'] ? String(row['reportedBy']) : (row['userId'] ? String(row['userId']) : ''));
  const reporterEmail = row['reporter_email'] ? String(row['reporter_email']) : (row['reporterEmail'] ? String(row['reporterEmail']) : (row['user_email'] ? String(row['user_email']) : (row['userEmail'] ? String(row['userEmail']) : '')));

  const verifiedBy = row['verified_by'] ? String(row['verified_by']) : (row['verifiedBy'] ? String(row['verifiedBy']) : undefined);
  const verifiedAt = row['verified_at'] ? String(row['verified_at']) : (row['verifiedAt'] ? String(row['verifiedAt']) : (row['accepted_at'] ? String(row['accepted_at']) : undefined));

  return {
    id: String(row['id']),
  groupId: row['group_id'] ? String(row['group_id']) : (row['groupId'] ? String(row['groupId']) : null),
    photoUrl,
    animalType,
    sex,
    collar,
    colorPattern,
    primaryColor,
    bodyConditionScore,
    skinProblems,
    eyeProblems,
    gaitProblems,
  notes: row['additional_notes'] ? String(row['additional_notes']) : (row['notes'] ? String(row['notes']) : ''),
    latitude,
    longitude,
    locationDescription: row['location_description'] ? String(row['location_description']) : (row['locationDescription'] ? String(row['locationDescription']) : ''),
    spottedDate,
    spottedTime,
  reportedBy,
  reporterEmail,
  status: String(row['status'] ?? 'verified') === 'verified' ? 'verified' : 'verified',
  verifiedBy,
  verifiedAt,
  acceptedAt: verifiedAt ?? (row['accepted_at'] ? String(row['accepted_at']) : (row['acceptedAt'] ? String(row['acceptedAt']) : new Date().toISOString())),
    createdAt: row['created_at'] ? String(row['created_at']) : (row['createdAt'] ? String(row['createdAt']) : new Date().toISOString()),
    updatedAt: row['updated_at'] ? String(row['updated_at']) : (row['updatedAt'] ? String(row['updatedAt']) : undefined),
  };
}

/**
 * View for displaying all individual reports in a single table.
 * This provides a comprehensive view of all individual sighting records.
 */
export default function AllView({
  reports,
  onViewReport,
}: AllViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Normalize incoming reports to AcceptedReport shape (accept server JSON)
  const normalizedReports: AcceptedReport[] = reports.map(r => normalizeRow(r));

  // Sort reports by date (most recent first)
  const sortedReports = [...normalizedReports].sort((a, b) => 
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
