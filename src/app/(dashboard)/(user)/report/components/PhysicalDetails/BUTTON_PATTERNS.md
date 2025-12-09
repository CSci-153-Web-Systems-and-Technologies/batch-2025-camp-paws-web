# Button Pattern Reference

This document preserves the approved button styling patterns for the PhysicalDetails form sections.

## Standard Selection Button Pattern (Primary Theme Color)

**Used in:** AnimalTypeSelection, CollarSelection, BodyConditionSelection, ColorSelection (pattern cards), HealthAssessment

**Pattern:** Light colored background with colored text when selected

### Styling Classes:

**Selected State:**
```tsx
'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))] shadow-lg scale-105 ring-2 ring-[rgb(var(--color-primary-light))]'
```

**Unselected State:**
```tsx
'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-primary))] hover:scale-102'
```

### Example Implementation:

```tsx
<button
  type="button"
  onClick={() => onSelect(value)}
  className={`p-4 border-2 rounded-lg transition-all duration-200 transform ${
    isSelected
      ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))] shadow-lg scale-105 ring-2 ring-[rgb(var(--color-primary-light))]' 
      : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-primary))] hover:scale-102'
  }`}
>
  {/* Button content */}
</button>
```

### Visual Characteristics:
- **Border:** Primary theme color (green-500) when selected, gray border when not
- **Background:** Very light primary color (primary-light variable) when selected, surface color when not
- **Text:** Primary theme color when selected, primary text color when not
- **Effects:** Shadow, slight scale-up (105%), and ring effect when selected
- **Transitions:** Smooth 200ms transitions for all states

---

## Semantic Color Button Pattern (Male/Female)

**Used in:** SexSelection (Male and Female options only)

**Pattern:** Minimal background tint with semantic border and text colors

### Male Button (Blue):

**Selected State:**
```tsx
'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 shadow-lg scale-105'
```

**Unselected State:**
```tsx
'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:border-blue-400 hover:scale-102'
```

### Female Button (Pink):

**Selected State:**
```tsx
'border-pink-600 bg-pink-50/30 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 shadow-lg scale-105'
```

**Unselected State:**
```tsx
'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:border-pink-400 hover:scale-102'
```

### Visual Characteristics:
- **Border:** Semantic color (blue-600 or pink-600) when selected
- **Background:** Very subtle tint (30% opacity light mode, 20% dark mode) when selected
- **Text:** Matches border color when selected
- **Effects:** Shadow and slight scale-up, but NO ring effect
- **Purpose:** Maintains semantic meaning while keeping subtle appearance

---

## When to Use Each Pattern:

### Standard Pattern (Primary Theme Color):
- Default choice for most selection buttons
- Use when there's no specific semantic meaning to the choice
- Provides consistent look across the application
- Examples: Animal type, collar status, body condition score, health issues

### Semantic Pattern (Custom Colors):
- Use only when color has specific meaning (e.g., Male=Blue, Female=Pink)
- Keep background very subtle (low opacity)
- Reserve for rare cases where semantic color is important

---

## Key Design Principles:

1. **Consistency:** Most buttons should use the standard primary color pattern
2. **Readability:** Text must be clearly readable in both light and dark modes
3. **Subtlety:** Background colors should enhance, not overpower the design
4. **Accessibility:** Maintain proper contrast ratios for text and borders
5. **Transitions:** Always include smooth transitions for better UX

---

## CSS Variables Reference:

Used in the patterns above:
- `--color-primary`: Main theme color (green-500: 34 197 94)
- `--color-primary-light`: Light tint for backgrounds (green-50 light, green-900 dark)
- `--color-surface`: Component background (white light, gray-800 dark)
- `--color-border`: Default border color (gray-200 light, gray-700 dark)
- `--color-text-primary`: Main text color (gray-900 light, gray-100 dark)

---

**Last Updated:** December 9, 2025  
**Status:** Approved and Implemented
