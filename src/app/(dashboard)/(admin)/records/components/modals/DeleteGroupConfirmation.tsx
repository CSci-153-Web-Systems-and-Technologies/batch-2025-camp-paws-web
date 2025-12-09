'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2, Unlink } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AnimalGroup } from '../../types/RecordsTypes';

export interface DeleteGroupConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deleteReports: boolean) => void;
  group: AnimalGroup;
}

/**
 * Specialized confirmation dialog for deleting groups.
 * Allows admin to choose whether to delete or keep the reports in the group.
 */
export default function DeleteGroupConfirmation({
  isOpen,
  onClose,
  onConfirm,
  group,
}: DeleteGroupConfirmationProps) {
  const [deleteReports, setDeleteReports] = useState(false);

  const handleConfirm = () => {
    onConfirm(deleteReports);
    onClose();
    setDeleteReports(false); // Reset for next time
  };

  const handleClose = () => {
    onClose();
    setDeleteReports(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Group"
      size="lg"
    >
      <div className="space-y-6">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[rgb(var(--color-error)/0.1)] flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-[rgb(var(--color-error))]" />
          </div>
        </div>

        {/* Group Info */}
        <div className="bg-[rgb(var(--color-muted)/0.3)] rounded-lg p-4 border border-[rgb(var(--color-border))]">
          <div className="font-semibold text-[rgb(var(--color-text))] mb-1">
            {group.name}
          </div>
          <div className="text-sm text-[rgb(var(--color-text-muted))]">
            Group ID: {group.id}
          </div>
          <div className="text-sm text-[rgb(var(--color-text-muted))]">
            Contains {group.reportCount} {group.reportCount === 1 ? 'report' : 'reports'}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-[rgb(var(--color-text))]">
            What should happen to the reports in this group?
          </p>

          {/* Option 1: Keep Reports (Ungroup) */}
          <button
            onClick={() => setDeleteReports(false)}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all
              ${!deleteReports
                ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary)/0.1)]'
                : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary)/0.5)]'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                ${!deleteReports
                  ? 'bg-[rgb(var(--color-primary))] text-white'
                  : 'bg-[rgb(var(--color-muted))] text-[rgb(var(--color-text-muted))]'
                }
              `}>
                <Unlink className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[rgb(var(--color-text))] mb-1">
                  Keep Reports (Recommended)
                </div>
                <p className="text-sm text-[rgb(var(--color-text-muted))]">
                  Ungroup the {group.reportCount} {group.reportCount === 1 ? 'report' : 'reports'} - they will move to the ungrouped section
                </p>
              </div>
              {!deleteReports && (
                <div className="w-6 h-6 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center text-white text-sm shrink-0">
                  ✓
                </div>
              )}
            </div>
          </button>

          {/* Option 2: Delete Reports */}
          <button
            onClick={() => setDeleteReports(true)}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all
              ${deleteReports
                ? 'border-[rgb(var(--color-error))] bg-[rgb(var(--color-error)/0.1)]'
                : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-error)/0.5)]'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                ${deleteReports
                  ? 'bg-[rgb(var(--color-error))] text-white'
                  : 'bg-[rgb(var(--color-muted))] text-[rgb(var(--color-text-muted))]'
                }
              `}>
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[rgb(var(--color-text))] mb-1">
                  Delete All Reports
                </div>
                <p className="text-sm text-[rgb(var(--color-text-muted))]">
                  Permanently delete the group and all {group.reportCount} {group.reportCount === 1 ? 'report' : 'reports'} within it
                </p>
                {deleteReports && (
                  <p className="text-sm text-[rgb(var(--color-error))] mt-2">
                    ⚠️ This cannot be undone!
                  </p>
                )}
              </div>
              {deleteReports && (
                <div className="w-6 h-6 rounded-full bg-[rgb(var(--color-error))] flex items-center justify-center text-white text-sm shrink-0">
                  ✓
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-[rgb(var(--color-border))]">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            {deleteReports ? 'Delete Group & Reports' : 'Delete Group Only'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
