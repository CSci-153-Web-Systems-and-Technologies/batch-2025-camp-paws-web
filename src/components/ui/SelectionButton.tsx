'use client';

/**
 * SelectionButton Component - Button that maintains selected/highlighted state
 * Single Responsibility: Handle selection button UI with toggle behavior
 * 
 * Use this for:
 * - Radio-like selections (animal type, sex, collar status)
 * - Toggle buttons that show active state
 * - Any button that needs to stay highlighted when selected
 * 
 * Pattern Reference: Based on AnimalTypeSelection button behavior
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

export type SelectionButtonVariant = 'primary' | 'semantic';
export type SelectionButtonSize = 'sm' | 'md' | 'lg';

export interface SelectionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Whether this button is currently selected */
  isSelected: boolean;
  /** Callback when button is clicked - receives the new selected state */
  onSelect: () => void;
  /** Visual variant - 'primary' uses theme color, 'semantic' allows custom colors */
  variant?: SelectionButtonVariant;
  /** Button size */
  size?: SelectionButtonSize;
  /** Full width button */
  fullWidth?: boolean;
  /** Icon or image to display (optional) */
  icon?: ReactNode;
  /** Custom semantic color for selected state (only works with 'semantic' variant) */
  semanticColor?: {
    border: string;
    background: string;
    text: string;
    darkText?: string;
  };
  children: ReactNode;
}

const sizeStyles: Record<SelectionButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
};

export default function SelectionButton({
  isSelected,
  onSelect,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  semanticColor,
  children,
  className = '',
  disabled,
  ...props
}: SelectionButtonProps) {
  // Base styles applied to all selection buttons
  const baseStyles = 'flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
  
  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Variant-specific styles
  let selectedStyles = '';
  let unselectedStyles = '';
  let focusStyles = '';
  
  if (variant === 'primary') {
    // Standard primary theme color pattern
    selectedStyles = 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))] shadow-lg scale-105 ring-2 ring-[rgb(var(--color-primary-light))]';
    unselectedStyles = 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-primary))] hover:scale-102';
    focusStyles = 'focus:ring-[rgb(var(--color-primary))]';
  } else if (variant === 'semantic' && semanticColor) {
    // Semantic color pattern (e.g., blue for male, pink for female)
    const darkTextClass = semanticColor.darkText || semanticColor.text;
    selectedStyles = `${semanticColor.border} ${semanticColor.background} ${semanticColor.text} ${darkTextClass} shadow-lg scale-105`;
    unselectedStyles = `border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:${semanticColor.border.replace('border-', 'border-').split(' ')[0]} hover:scale-102`;
    focusStyles = `focus:ring-${semanticColor.border.split('-')[1]}-500`;
  } else {
    // Fallback to primary if semantic color not provided
    selectedStyles = 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))] shadow-lg scale-105 ring-2 ring-[rgb(var(--color-primary-light))]';
    unselectedStyles = 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-primary))] hover:scale-102';
    focusStyles = 'focus:ring-[rgb(var(--color-primary))]';
  }
  
  const stateStyles = isSelected ? selectedStyles : unselectedStyles;
  
  const combinedClassName = `${baseStyles} ${stateStyles} ${sizeStyles[size]} ${widthStyle} ${focusStyles} ${className}`.trim();

  return (
    <button
      type="button"
      className={combinedClassName}
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={isSelected}
      {...props}
    >
      {icon && <span className="mb-2">{icon}</span>}
      <span className="font-bold">{children}</span>
    </button>
  );
}
