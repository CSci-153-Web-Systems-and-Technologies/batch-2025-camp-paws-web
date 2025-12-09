/**
 * Spinner Component - Loading indicator
 * Single Responsibility: Display loading state
 */

import { HTMLAttributes } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'white';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
};

const variantStyles: Record<SpinnerVariant, string> = {
  primary: 'border-green-200 border-t-green-600 dark:border-green-900 dark:border-t-green-400',
  secondary: 'border-gray-200 border-t-gray-600 dark:border-gray-800 dark:border-t-gray-400',
  white: 'border-white/20 border-t-white',
};

export default function Spinner({
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block ${className}`.trim()}
      {...props}
    >
      <div
        className={`
          rounded-full animate-spin
          ${sizeStyles[size]}
          ${variantStyles[variant]}
        `.trim()}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * FullPageSpinner Component - Centered full-page loading indicator
 * Single Responsibility: Display full-page loading state
 */

export interface FullPageSpinnerProps {
  message?: string;
}

export function FullPageSpinner({ message = 'Loading...' }: FullPageSpinnerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" variant="primary" />
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}
