/**
 * Theme Configuration
 * Type-safe theme tokens and utility functions
 */

export const colors = {
  primary: {
    50: 'rgb(var(--color-primary-50))',
    100: 'rgb(var(--color-primary-100))',
    200: 'rgb(var(--color-primary-200))',
    300: 'rgb(var(--color-primary-300))',
    400: 'rgb(var(--color-primary-400))',
    500: 'rgb(var(--color-primary-500))',
    600: 'rgb(var(--color-primary-600))',
    700: 'rgb(var(--color-primary-700))',
    800: 'rgb(var(--color-primary-800))',
    900: 'rgb(var(--color-primary-900))',
  },
  background: {
    DEFAULT: 'rgb(var(--color-background))',
    secondary: 'rgb(var(--color-background-secondary))',
    tertiary: 'rgb(var(--color-background-tertiary))',
    elevated: 'rgb(var(--color-background-elevated))',
  },
  surface: {
    DEFAULT: 'rgb(var(--color-surface))',
    hover: 'rgb(var(--color-surface-hover))',
    active: 'rgb(var(--color-surface-active))',
  },
  text: {
    primary: 'rgb(var(--color-text-primary))',
    secondary: 'rgb(var(--color-text-secondary))',
    tertiary: 'rgb(var(--color-text-tertiary))',
    disabled: 'rgb(var(--color-text-disabled))',
    inverse: 'rgb(var(--color-text-inverse))',
  },
  border: {
    primary: 'rgb(var(--color-border-primary))',
    secondary: 'rgb(var(--color-border-secondary))',
    focus: 'rgb(var(--color-border-focus))',
    error: 'rgb(var(--color-border-error))',
  },
  status: {
    success: {
      DEFAULT: 'rgb(var(--color-success))',
      bg: 'rgb(var(--color-success-bg))',
      text: 'rgb(var(--color-success-text))',
    },
    warning: {
      DEFAULT: 'rgb(var(--color-warning))',
      bg: 'rgb(var(--color-warning-bg))',
      text: 'rgb(var(--color-warning-text))',
    },
    error: {
      DEFAULT: 'rgb(var(--color-error))',
      bg: 'rgb(var(--color-error-bg))',
      text: 'rgb(var(--color-error-text))',
    },
    info: {
      DEFAULT: 'rgb(var(--color-info))',
      bg: 'rgb(var(--color-info-bg))',
      text: 'rgb(var(--color-info-text))',
    },
  },
} as const;

export const shadows = {
  sm: 'var(--shadow-sm)',
  base: 'var(--shadow-base)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const;

export const borderRadius = {
  sm: '0.25rem',  // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem',   // 8px
  xl: '0.75rem',  // 12px
  '2xl': '1rem',  // 16px
  full: '9999px',
} as const;

export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Type exports for TypeScript autocomplete
export type ColorToken = keyof typeof colors;
export type ShadowToken = keyof typeof shadows;
export type SpacingToken = keyof typeof spacing;
export type BorderRadiusToken = keyof typeof borderRadius;
export type FontSizeToken = keyof typeof fontSize;
export type FontWeightToken = keyof typeof fontWeight;
export type BreakpointToken = keyof typeof breakpoints;
export type ZIndexToken = keyof typeof zIndex;
export type TransitionToken = keyof typeof transitions;
