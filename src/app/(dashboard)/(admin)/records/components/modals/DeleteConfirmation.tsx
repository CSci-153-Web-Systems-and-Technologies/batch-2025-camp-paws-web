'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  confirmButtonText?: string;
  isDangerous?: boolean;
}

/**
 * Reusable confirmation dialog for delete operations.
 * Shows warning icon and requires explicit confirmation.
 */
export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmButtonText = 'Delete',
  isDangerous = true,
}: DeleteConfirmationProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[rgb(var(--color-error)/0.1)] flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-[rgb(var(--color-error))]" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-[rgb(var(--color-text))]">
            {message}
          </p>
          
          {itemName && (
            <div className="bg-[rgb(var(--color-muted)/0.3)] rounded-lg p-3 border border-[rgb(var(--color-border))]">
              <p className="font-semibold text-[rgb(var(--color-text))]">
                {itemName}
              </p>
            </div>
          )}

          {isDangerous && (
            <p className="text-sm text-[rgb(var(--color-error))]">
              ⚠️ This action cannot be undone.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-[rgb(var(--color-border))]">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
