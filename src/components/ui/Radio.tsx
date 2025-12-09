/**
 * Radio Component - Reusable radio button with label and consistent styling
 * Single Responsibility: Form radio button field with label and error handling
 */

import { InputHTMLAttributes, forwardRef } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-4 h-4 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
    const normalStyles = 'border-gray-300 text-green-600 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800';
    const disabledStyles = 'opacity-50 cursor-not-allowed';

    const radioClassName = `
      ${baseStyles}
      ${normalStyles}
      ${disabled ? disabledStyles : 'cursor-pointer'}
      ${className}
    `.trim();

    const id = props.id || props.name;

    return (
      <div className="flex items-start gap-2">
        <input
          ref={ref}
          type="radio"
          id={id}
          disabled={disabled}
          className={radioClassName}
          aria-describedby={description ? `${id}-description` : undefined}
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
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;

/**
 * RadioGroup Component - Container for radio button groups
 * Single Responsibility: Group radio buttons with shared name and error handling
 */

interface RadioGroupProps {
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({
  label,
  error,
  helperText,
  children,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={className}>
      {label && (
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </p>
      )}
      
      <div className="space-y-2">
        {children}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
