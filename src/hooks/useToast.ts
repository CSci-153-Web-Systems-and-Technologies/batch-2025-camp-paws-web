/**
 * useToast Hook - Manage toast notifications
 * Single Responsibility: Provide toast notification functionality
 */

import { useState, useCallback } from 'react';
import type { ToastProps, ToastVariant } from '@/components/ui/Toast';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastProps = {
        id,
        message,
        variant,
        duration,
        onClose: removeToast,
      };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, duration?: number) => addToast(message, 'success', duration),
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => addToast(message, 'error', duration),
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => addToast(message, 'warning', duration),
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => addToast(message, 'info', duration),
    [addToast]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll,
  };
}
