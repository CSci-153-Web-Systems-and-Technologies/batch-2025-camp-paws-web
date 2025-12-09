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
    const normalStyles = 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:border-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]/20';
    const errorStyles = 'border-[rgb(var(--color-error))] bg-[rgb(var(--color-error-bg))] text-[rgb(var(--color-text-primary))] focus:border-[rgb(var(--color-error))] focus:ring-[rgb(var(--color-error))]/20';
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
            className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5"
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
          <p id={`${id}-error`} className="mt-1.5 text-sm text-[rgb(var(--color-error))]">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${id}-helper`} className="mt-1.5 text-sm text-[rgb(var(--color-text-secondary))]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
