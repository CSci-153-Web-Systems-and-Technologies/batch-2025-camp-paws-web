/**
 * Inline Error Display Component
 * Shows validation errors directly next to form fields
 */

'use client';

import { AlertCircle } from 'lucide-react';

export interface InlineErrorProps {
  error?: string | null;
  show?: boolean;
}

export default function InlineError({ error, show = true }: InlineErrorProps) {
  if (!error || !show) return null;

  return (
    <div className="flex items-start gap-2 mt-1 text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{error}</span>
    </div>
  );
}
