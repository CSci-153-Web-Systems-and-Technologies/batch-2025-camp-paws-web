# Theme System Documentation

## Overview
The Camp PAWS theme system provides a scalable, maintainable approach to styling with built-in dark mode support.

## Architecture

### 1. **CSS Variables** (`src/styles/theme.css`)
- Single source of truth for colors and design tokens
- Automatically switches between light and dark mode
- Uses RGB values for flexibility with opacity

### 2. **TypeScript Config** (`src/styles/theme.config.ts`)
- Type-safe theme tokens
- Autocomplete support in IDE
- Export constants for programmatic access

### 3. **Theme Context** (`src/contexts/ThemeContext.tsx`)
- React context for theme management
- Persists user preference to localStorage
- Supports system preference detection
- Provides hooks for theme access

### 4. **Theme Components** (`src/components/ThemeSwitcher.tsx`)
- Ready-to-use theme switcher UI
- Simple toggle and full selector variants

## Setup

### Step 1: Import Theme CSS
In your root layout (`src/app/layout.tsx`):

```tsx
import '@/styles/theme.css';
```

### Step 2: Wrap App with ThemeProvider
```tsx
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Note: `suppressHydrationWarning` prevents warnings from theme class changes during hydration.

### Step 3: Add Theme Switcher (Optional)
```tsx
import ThemeSwitcher, { ThemeToggle } from '@/components/ThemeSwitcher';

// Full switcher (light/dark/system)
<ThemeSwitcher />

// Simple toggle (light/dark only)
<ThemeToggle />
```

## Usage

### Using CSS Classes

#### Background Colors
```tsx
// Primary background
<div className="bg-background">

// Secondary background (slightly darker/lighter)
<div className="bg-background-secondary">

// Surface (cards, panels)
<div className="surface">
<div className="surface-hover"> // Hover state
```

#### Text Colors
```tsx
<p className="text-primary">     // Main text
<p className="text-secondary">   // Secondary text
<p className="text-tertiary">    // Tertiary text
<p className="text-text-disabled"> // Disabled text
```

#### Primary (Green) Colors
```tsx
<button className="bg-green-600 text-white hover:bg-green-700">
// Available: green-50 through green-900
```

#### Status Colors
```tsx
// Success
<div className="bg-green-50 text-green-700">

// Warning  
<div className="bg-yellow-50 text-yellow-700">

// Error
<div className="bg-red-50 text-red-700">

// Info
<div className="bg-blue-50 text-blue-700">
```

#### Borders
```tsx
<div className="border border-primary">  // Standard border
<div className="border border-focus">    // Focus state (green)
<div className="border border-error">    // Error state (red)
```

### Using Theme Hook

```tsx
'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Using TypeScript Config

```tsx
import { colors, spacing, shadows } from '@/styles/theme.config';

const styles = {
  color: colors.primary[600],
  padding: spacing.md,
  boxShadow: shadows.lg,
};
```

### Conditional Styling

```tsx
import { useTheme } from '@/contexts/ThemeContext';

export default function Component() {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={resolvedTheme === 'dark' ? 'custom-dark-class' : 'custom-light-class'}>
      Content
    </div>
  );
}
```

## Migration Guide

### Converting Existing Components

#### Before
```tsx
<div className="bg-white text-gray-900 border-gray-200">
  <h1 className="text-gray-900">Title</h1>
  <p className="text-gray-600">Description</p>
</div>
```

#### After
```tsx
<div className="bg-surface text-primary border-primary">
  <h1 className="text-primary">Title</h1>
  <p className="text-secondary">Description</p>
</div>
```

### Converting Colors

| Old (Tailwind) | New (Theme) |
|----------------|-------------|
| `bg-white` | `bg-surface` or `bg-background` |
| `bg-gray-50` | `bg-background-secondary` |
| `text-gray-900` | `text-primary` |
| `text-gray-600` | `text-secondary` |
| `text-gray-400` | `text-tertiary` |
| `border-gray-200` | `border-primary` |
| `bg-green-600` | `bg-green-600` (keep as is) |

## Best Practices

### 1. **Use Semantic Tokens**
```tsx
// ❌ Avoid
<p className="text-gray-600">

// ✅ Prefer
<p className="text-secondary">
```

### 2. **Test Both Themes**
Always test components in both light and dark mode during development.

### 3. **Use Theme-Aware Images**
```tsx
const { resolvedTheme } = useTheme();
const logo = resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png';
```

### 4. **Avoid Hardcoded Colors**
```tsx
// ❌ Avoid
<div style={{ color: '#1f2937' }}>

// ✅ Prefer
<div className="text-primary">
```

### 5. **Use CSS Variables for Custom Styles**
```tsx
// ❌ Avoid
<div style={{ backgroundColor: '#ffffff' }}>

// ✅ Prefer
<div style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
```

## Extending the Theme

### Adding New Colors

1. **Update `theme.css`**:
```css
:root {
  --color-accent: 59 130 246; /* Blue */
}

.dark {
  --color-accent: 96 165 250; /* Lighter blue for dark mode */
}
```

2. **Update `theme.config.ts`**:
```typescript
export const colors = {
  // ...existing colors
  accent: 'rgb(var(--color-accent))',
} as const;
```

### Adding New Utility Classes

In `theme.css`:
```css
.bg-accent {
  background-color: rgb(var(--color-accent));
}

.text-accent {
  color: rgb(var(--color-accent));
}
```

## Troubleshooting

### Flash of Unstyled Content (FOUC)
- Ensure `suppressHydrationWarning` is on `<html>` tag
- ThemeProvider handles initial render blocking

### Theme Not Persisting
- Check localStorage is enabled
- Verify `storageKey` prop if customized

### Colors Not Updating
- Ensure theme CSS is imported before component CSS
- Check class names match theme tokens exactly

## Theme Tokens Reference

### Available CSS Variables

**Colors:**
- `--color-primary-{50-900}` - Primary green scale
- `--color-background` - Main background
- `--color-background-secondary` - Secondary background
- `--color-surface` - Card/panel background
- `--color-text-primary` - Main text
- `--color-text-secondary` - Secondary text
- `--color-border-primary` - Standard borders
- `--color-success` - Success green
- `--color-warning` - Warning yellow
- `--color-error` - Error red
- `--color-info` - Info blue

**Shadows:**
- `--shadow-sm` to `--shadow-xl`

**Backdrop:**
- `--backdrop-blur`
- `--backdrop-opacity`

## Examples

See the following components for reference implementations:
- `src/app/(dashboard)/components/Sidebar.tsx` - Sidebar with theme support
- `src/app/(dashboard)/(admin)/verify/components/ReportDetailsModal.tsx` - Modal with backdrop blur
- `src/components/ThemeSwitcher.tsx` - Theme switching UI
