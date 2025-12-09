/**
 * Input Component - Reusable form input
 * Single Responsibility: Handle text input UI and styling
 */

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    
    const baseInputStyles = 'px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed';
    
    const normalStyles = 'border-primary bg-background text-primary focus:border-green-500 focus:ring-green-500';
    const errorStyles = 'border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500 dark:bg-red-900/20 dark:text-red-100';
    
    const stateStyles = hasError ? errorStyles : normalStyles;
    const widthStyle = fullWidth ? 'w-full' : '';
    const paddingLeft = leftIcon ? 'pl-10' : '';
    const paddingRight = rightIcon ? 'pr-10' : '';
    
    const inputClassName = `${baseInputStyles} ${stateStyles} ${widthStyle} ${paddingLeft} ${paddingRight} ${className}`.trim();

    return (
      <div className={`space-y-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-primary">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClassName}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p id={`${props.id}-error`} className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="text-sm text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
