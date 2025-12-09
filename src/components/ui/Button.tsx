/**
 * Button Component - Reusable button with variants
 * Single Responsibility: Handle button UI and styling
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-hover))] active:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50',
  secondary: 'bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-border-hover))] active:bg-[rgb(var(--color-border-hover))] disabled:opacity-50 border border-[rgb(var(--color-border))]',
  success: 'bg-[rgb(var(--color-success))] text-white hover:opacity-90 active:opacity-80 disabled:opacity-50',
  warning: 'bg-[rgb(var(--color-warning))] text-white hover:opacity-90 active:opacity-80 disabled:opacity-50',
  danger: 'bg-[rgb(var(--color-error))] text-white hover:opacity-90 active:opacity-80 disabled:opacity-50',
  ghost: 'bg-transparent text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-surface))] active:bg-[rgb(var(--color-border))] disabled:opacity-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
