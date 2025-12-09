/**
 * Select Component - Reusable dropdown select with custom styling
 * Single Responsibility: Form select field with label, error handling, and consistent styling
 */

import { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      fullWidth = false,
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

    const selectClassName = `
      ${baseStyles}
      ${error ? errorStyles : normalStyles}
      ${disabled ? disabledStyles : ''}
      ${widthStyles}
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
        
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          className={selectClassName}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

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

Select.displayName = 'Select';

export default Select;
