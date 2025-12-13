'use client';
/**
 * Checkbox Component - Reusable checkbox with label and consistent styling
 * Single Responsibility: Form checkbox field with label and error handling
 */

import { InputHTMLAttributes, forwardRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      description,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-4 h-4 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
    const normalStyles = 'border-gray-300 text-green-600 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800';
    const errorStyles = 'border-red-500 text-red-600 focus:ring-red-500/20 dark:border-red-500';
    const disabledStyles = 'opacity-50 cursor-not-allowed';

    const checkboxClassName = `
      ${baseStyles}
      ${error ? errorStyles : normalStyles}
      ${disabled ? disabledStyles : 'cursor-pointer'}
      ${className}
    `.trim();

    const id = props.id || props.name;

    return (
      <div>
        <div className="flex items-start gap-2">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            disabled={disabled}
            className={checkboxClassName}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : description ? `${id}-description` : undefined
            }
            {...props}
          />
          
          {(label || description) && (
            <div className="flex flex-col">
              {label && (
                <label
                  htmlFor={id}
                  className={`text-sm font-medium ${
                    disabled
                      ? 'text-gray-400 dark:text-gray-600'
                      : 'text-gray-700 dark:text-gray-300 cursor-pointer'
                  }`}
                >
                  {label}
                </label>
              )}
              {description && (
                <p
                  id={`${id}-description`}
                  className="text-sm text-gray-500 dark:text-gray-400 mt-0.5"
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

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

Checkbox.displayName = 'Checkbox';

export default Checkbox;
