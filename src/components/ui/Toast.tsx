/**
 * Toast Component - Toast notification system for user feedback
 * Single Responsibility: Display temporary notifications
 */

import { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
}

const variantStyles: Record<ToastVariant, { bg: string; icon: typeof CheckCircle; iconColor: string }> = {
  success: {
    bg: 'bg-green-50 border-green-500 dark:bg-green-950/20 dark:border-green-500',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
  },
  error: {
    bg: 'bg-red-50 border-red-500 dark:bg-red-950/20 dark:border-red-500',
    icon: AlertCircle,
    iconColor: 'text-red-600 dark:text-red-400',
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-500 dark:bg-yellow-950/20 dark:border-yellow-500',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  info: {
    bg: 'bg-blue-50 border-blue-500 dark:bg-blue-950/20 dark:border-blue-500',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
};

export default function Toast({
  id,
  message,
  variant = 'info',
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const { bg, icon: Icon, iconColor } = variantStyles[variant];

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  }, [id, onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg
        min-w-[300px] max-w-md
        transition-all duration-300 ease-in-out
        ${bg}
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
      
      <p className="flex-1 text-sm text-gray-900 dark:text-gray-100">
        {message}
      </p>

      <button
        onClick={handleClose}
        className="shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * ToastContainer Component - Container for managing multiple toasts
 * Single Responsibility: Position and manage toast notifications
 */

export interface ToastContainerProps {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastContainer({ toasts, position = 'top-right' }: ToastContainerProps) {
  return (
    <div
      className={`fixed ${positionStyles[position]} z-50 flex flex-col gap-2`}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}
