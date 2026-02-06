'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { Edit, Trash2, Eye } from 'lucide-react';

export interface Report {
  id: string;
  animal_type: string;
  sex: string;
  status: 'pending' | 'verified' | 'rejected';
  spotted_date: string;
  spotted_time: string;
  location_description: string;
  photo_url: string;
  created_at: string;
  rejection_reason?: string;
}

interface ReportsListProps {
  reports: Report[];
  onEdit: (reportId: string) => void;
  onDelete: (reportId: string) => void;
  onView: (reportId: string) => void;
  isLoading?: boolean;
}

export default function ReportsList({ reports, onEdit, onDelete, onView, isLoading }: ReportsListProps) {
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<string | null>(null);

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">⏳ Pending</Badge>;
      case 'verified':
        return <Badge variant="success">✅ Verified</Badge>;
      case 'rejected':
        return <Badge variant="error">❌ Rejected</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    // Convert HH:MM:SS to 12-hour format
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleDeleteClick = (reportId: string) => {
    setDeleteConfirmModal(reportId);
  };

  const confirmDelete = () => {
    if (deleteConfirmModal) {
      onDelete(deleteConfirmModal);
      setDeleteConfirmModal(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--color-primary))] mx-auto mb-4"></div>
        <p className="text-[rgb(var(--color-text-secondary))]">Loading your reports...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12 bg-[rgb(var(--color-surface))] rounded-lg border border-[rgb(var(--color-border))]">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
          No Reports Yet
        </h3>
        <p className="text-[rgb(var(--color-text-secondary))] mb-4">
          You haven&apos;t submitted any reports. Start by reporting a stray animal you&apos;ve seen.
        </p>
        <Button onClick={() => window.location.href = '/report'}>
          Submit Your First Report
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-[rgb(var(--color-surface))] rounded-lg border border-[rgb(var(--color-border))] p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Photo */}
              <div className="shrink-0">
                <Image
                  src={report.photo_url}
                  alt={`${report.animal_type} spotted`}
                  width={128}
                  height={128}
                  className="w-full md:w-32 h-32 object-cover rounded-lg"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] capitalize">
                      {report.animal_type} • {report.sex}
                    </h3>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                      📍 {report.location_description}
                    </p>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-[rgb(var(--color-text-secondary))] mb-3">
                  <span>📅 {formatDate(report.spotted_date)}</span>
                  <span>🕐 {formatTime(report.spotted_time)}</span>
                  <span>📤 Submitted {formatDate(report.created_at)}</span>
                </div>

                {/* Rejection Reason */}
                {report.status === 'rejected' && report.rejection_reason && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                      Rejection Reason:
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {report.rejection_reason}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {report.status === 'pending' ? (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onEdit(report.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteClick(report.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onView(report.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmModal !== null}
        onClose={() => setDeleteConfirmModal(null)}
        title="Delete Report?"
      >
        <div className="space-y-4">
          <p className="text-[rgb(var(--color-text-secondary))]">
            Are you sure you want to delete this report? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmModal(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete Report
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
