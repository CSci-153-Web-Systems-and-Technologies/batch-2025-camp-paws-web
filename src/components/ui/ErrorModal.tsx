/**
 * Error Modal Component
 * Display detailed error information with retry options
 */

'use client';

import Modal from './Modal';
import Button from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  details?: string;
  retryable?: boolean;
  onRetry?: () => void;
}

export default function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  details,
  retryable = false,
  onRetry,
}: ErrorModalProps) {
  const handleRetry = () => {
    onClose();
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-4">
        {/* Icon and Title */}
        <div className="flex items-start space-x-3">
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">{message}</p>

          {/* Details */}
          {details && (
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono wrap-break-word">
                {details}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {retryable && onRetry && (
            <Button
              variant="primary"
              onClick={handleRetry}
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          <Button
            variant={retryable ? 'secondary' : 'primary'}
            onClick={onClose}
            className="flex-1"
          >
            {retryable ? 'Cancel' : 'Close'}
          </Button>
        </div>

        {/* Help Text */}
        {retryable && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
            If the problem persists, please contact support
          </p>
        )}
      </div>
    </Modal>
  );
}
