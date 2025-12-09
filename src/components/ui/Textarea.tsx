/**
 * Textarea Component - Reusable multi-line text input with label and error handling
 * Single Responsibility: Form textarea field with consistent styling
 */

import { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      resize = 'vertical',
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-lg border px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
    const normalStyles = 'border-gray-300 bg-white text-gray-900 focus:border-green-500 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';
    const errorStyles = 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:bg-red-950/20';
    const disabledStyles = 'opacity-50 cursor-not-allowed';
    const widthStyles = fullWidth ? 'w-full' : '';
    
    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    const textareaClassName = `
      ${baseStyles}
      ${error ? errorStyles : normalStyles}
      ${disabled ? disabledStyles : ''}
      ${widthStyles}
      ${resizeStyles[resize]}
      ${className}
    `.trim();

    const id = props.id || props.name;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          className={textareaClassName}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />

        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${id}-helper`} className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
