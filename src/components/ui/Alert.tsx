/**
 * Alert Component - Informational message display
 * Single Responsibility: Display contextual alerts and messages
 */

import { HTMLAttributes, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  icon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; icon: typeof CheckCircle; iconColor: string; titleColor: string }> = {
  success: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-900',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-800 dark:text-green-300',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-900',
    icon: AlertCircle,
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-800 dark:text-red-300',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    border: 'border-yellow-200 dark:border-yellow-900',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    titleColor: 'text-yellow-800 dark:text-yellow-300',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-900',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-800 dark:text-blue-300',
  },
};

export default function Alert({
  variant = 'info',
  title,
  children,
  icon = true,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div
      role="alert"
      className={`
        flex gap-3 p-4 rounded-lg border
        ${styles.bg}
        ${styles.border}
        ${className}
      `.trim()}
      {...props}
    >
      {icon && (
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${styles.iconColor}`} aria-hidden="true" />
      )}
      
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={`font-semibold mb-1 ${styles.titleColor}`}>
            {title}
          </h3>
        )}
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={`shrink-0 ${styles.iconColor} hover:opacity-70 transition-opacity`}
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
