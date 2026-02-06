/**
 * Loading Overlay Component
 * Full-screen loading indicator with progress messages
 */

'use client';

import { useEffect, useState } from 'react';
import Spinner from './Spinner';

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  progress?: number;
  submessage?: string;
}

export default function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  progress,
  submessage,
}: LoadingOverlayProps) {
  const [dots, setDots] = useState('');

  // Animated dots for loading message
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 space-y-6">
        {/* Spinner */}
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>

        {/* Main Message */}
        <div className="text-center space-y-2">
          <h3
            id="loading-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {message}
            <span className="inline-block w-6 text-left">{dots}</span>
          </h3>

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          )}

          {/* Submessage */}
          {submessage && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {submessage}
            </p>
          )}
        </div>

        {/* Tips or Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Please wait, this may take a few moments
        </div>
      </div>
    </div>
  );
}
