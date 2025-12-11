# Component Library Documentation

This document provides a comprehensive guide to the Camp Paws UI component library. All components follow SOLID principles, support dark mode via theme tokens, and are fully typed with TypeScript.

## Table of Contents

1. [Button](#button)
2. [Card](#card)
3. [Input](#input)
4. [Modal](#modal)
5. [Badge](#badge)
6. [Select](#select)
7. [Checkbox](#checkbox)
8. [Radio](#radio)
9. [Textarea](#textarea)
10. [Toast](#toast)
11. [Spinner](#spinner)
12. [Skeleton](#skeleton)
13. [Alert](#alert)

---

## Button

Reusable button component with multiple variants, sizes, and loading states.

### Import

```tsx
import Button from '@/src/components/ui/Button';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'ghost'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `fullWidth` | `boolean` | `false` | Stretch to full width |
| `isLoading` | `boolean` | `false` | Show loading spinner |
| `leftIcon` | `ReactNode` | - | Icon on the left |
| `rightIcon` | `ReactNode` | - | Icon on the right |
| `disabled` | `boolean` | `false` | Disable button |

### Examples

```tsx
// Primary button
<Button variant="primary">Save Changes</Button>

// Button with loading state
<Button isLoading disabled>Submitting...</Button>

// Button with icon
import { Save } from 'lucide-react';
<Button leftIcon={<Save className="w-4 h-4" />}>
  Save
</Button>

// Full width button
<Button fullWidth variant="success">
  Complete Registration
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete Account
</Button>
```

---

## Card

Container component for grouped content with composition pattern.

### Import

```tsx
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/src/components/ui/Card';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outlined' \| 'elevated'` | `'default'` | Visual style variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `hover` | `boolean` | `false` | Enable hover effect |

### Examples

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Animal Report</CardTitle>
    <CardDescription>Submit a new sighting</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Submit</Button>
  </CardFooter>
</Card>

// Elevated card with hover
<Card variant="elevated" hover>
  <CardContent>
    Clickable card content
  </CardContent>
</Card>

// Outlined card without padding
<Card variant="outlined" padding="none">
  <div className="p-4">Custom padding</div>
</Card>
```

---

## Input

Form input field with label, error handling, and icon support.

### Import

```tsx
import Input from '@/src/components/ui/Input';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text below input |
| `leftIcon` | `ReactNode` | - | Icon on the left |
| `rightIcon` | `ReactNode` | - | Icon on the right |
| `fullWidth` | `boolean` | `false` | Full width input |

### Examples

```tsx
// Basic input with label
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
/>

// Input with error
<Input
  label="Username"
  error="Username is required"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// Input with icon
import { Mail } from 'lucide-react';
<Input
  label="Email"
  leftIcon={<Mail className="w-4 h-4" />}
  helperText="We'll never share your email"
/>

// React Hook Form integration
import { useForm } from 'react-hook-form';
const { register, formState: { errors } } = useForm();

<Input
  {...register('email')}
  label="Email"
  error={errors.email?.message}
/>
```

---

## Modal

Overlay dialog component with backdrop blur.

### Import

```tsx
import Modal, { ModalHeader, ModalBody, ModalFooter } from '@/src/components/ui/Modal';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Control modal visibility |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `showCloseButton` | `boolean` | `true` | Show X button |
| `closeOnBackdropClick` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |

### Examples

```tsx
const [isOpen, setIsOpen] = useState(false);

// Basic modal
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <ModalBody>
    Are you sure you want to proceed?
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleConfirm}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>

// Large modal with custom content
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="lg"
>
  <ModalHeader>
    <h2>Custom Header</h2>
  </ModalHeader>
  <ModalBody>
    <div className="space-y-4">
      <Input label="Name" />
      <Input label="Email" />
    </div>
  </ModalBody>
  <ModalFooter>
    <Button>Save</Button>
  </ModalFooter>
</Modal>
```

---

## Badge

Small labeled indicator for status, counts, and categories.

### Import

```tsx
import Badge from '@/src/components/ui/Badge';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `dot` | `boolean` | `false` | Show status dot |
| `removable` | `boolean` | `false` | Show remove button |
| `onRemove` | `() => void` | - | Remove handler |

### Examples

```tsx
// Basic badges
<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Rejected</Badge>

// Badge with dot
<Badge variant="success" dot>
  Active
</Badge>

// Removable badge
<Badge removable onRemove={() => console.log('removed')}>
  Tag
</Badge>

// Small badge with count
<Badge variant="primary" size="sm">
  42
</Badge>
```

---

## Select

Dropdown select field with label and error handling.

### Import

```tsx
import Select from '@/src/components/ui/Select';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Select label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `options` | `SelectOption[]` | - | Array of options |
| `placeholder` | `string` | - | Placeholder text |
| `fullWidth` | `boolean` | `false` | Full width select |

### SelectOption Type

```tsx
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

### Examples

```tsx
const animalTypes = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'other', label: 'Other' },
];

<Select
  label="Animal Type"
  options={animalTypes}
  placeholder="Select animal type"
  value={selectedType}
  onChange={(e) => setSelectedType(e.target.value)}
/>

// With error
<Select
  label="Status"
  options={statusOptions}
  error="Please select a status"
/>
```

---

## Checkbox

Checkbox input with label and description support.

### Import

```tsx
import Checkbox from '@/src/components/ui/Checkbox';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Checkbox label |
| `description` | `string` | - | Additional description |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |

### Examples

```tsx
// Basic checkbox
<Checkbox
  label="I agree to the terms and conditions"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>

// Checkbox with description
<Checkbox
  label="Email notifications"
  description="Receive email updates about your reports"
  checked={emailNotifications}
  onChange={(e) => setEmailNotifications(e.target.checked)}
/>

// Checkbox with error
<Checkbox
  label="Accept terms"
  error="You must accept the terms"
  checked={false}
/>
```

---

## Radio

Radio button with label, description, and RadioGroup container.

### Import

```tsx
import Radio, { RadioGroup } from '@/src/components/ui/Radio';
```

### Props

**Radio**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Radio label |
| `description` | `string` | - | Additional description |

**RadioGroup**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Group label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |

### Examples

```tsx
const [sex, setSex] = useState('');

<RadioGroup label="Sex" error={errors.sex}>
  <Radio
    name="sex"
    value="male"
    label="Male"
    checked={sex === 'male'}
    onChange={(e) => setSex(e.target.value)}
  />
  <Radio
    name="sex"
    value="female"
    label="Female"
    checked={sex === 'female'}
    onChange={(e) => setSex(e.target.value)}
  />
  <Radio
    name="sex"
    value="unknown"
    label="Unknown"
    description="Cannot determine sex"
    checked={sex === 'unknown'}
    onChange={(e) => setSex(e.target.value)}
  />
</RadioGroup>
```

---

## Textarea

Multi-line text input with label and error handling.

### Import

```tsx
import Textarea from '@/src/components/ui/Textarea';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Textarea label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `fullWidth` | `boolean` | `false` | Full width textarea |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Resize behavior |

### Examples

```tsx
// Basic textarea
<Textarea
  label="Additional Notes"
  placeholder="Enter any additional information..."
  rows={4}
/>

// Textarea with character count
<Textarea
  label="Description"
  helperText={`${description.length}/500 characters`}
  maxLength={500}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

// Non-resizable textarea
<Textarea
  label="Fixed Size"
  resize="none"
  rows={3}
/>
```

---

## Toast

Toast notification system for temporary user feedback.

### Import

```tsx
import Toast, { ToastContainer } from '@/src/components/ui/Toast';
import type { ToastProps } from '@/src/components/ui/Toast';
```

### Props

**Toast**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique toast ID |
| `message` | `string` | - | Toast message |
| `variant` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Visual style |
| `duration` | `number` | `5000` | Auto-dismiss duration (ms) |
| `onClose` | `(id: string) => void` | - | Close handler |

**ToastContainer**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toasts` | `ToastProps[]` | - | Array of toasts |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'top-center' \| 'bottom-center'` | `'top-right'` | Container position |

### Examples

```tsx
// Toast hook implementation
const [toasts, setToasts] = useState<ToastProps[]>([]);

const addToast = (message: string, variant: ToastVariant = 'info') => {
  const id = Date.now().toString();
  const newToast: ToastProps = {
    id,
    message,
    variant,
    onClose: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
  };
  setToasts((prev) => [...prev, newToast]);
};

// In your component
<>
  <Button onClick={() => addToast('Changes saved!', 'success')}>
    Save
  </Button>
  
  <ToastContainer toasts={toasts} position="top-right" />
</>

// Different variants
addToast('Operation successful', 'success');
addToast('An error occurred', 'error');
addToast('Warning: Low storage', 'warning');
addToast('New message received', 'info');
```

---

## Spinner

Loading indicator component.

### Import

```tsx
import Spinner, { FullPageSpinner } from '@/src/components/ui/Spinner';
```

### Props

**Spinner**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Spinner size |
| `variant` | `'primary' \| 'secondary' \| 'white'` | `'primary'` | Visual style |

**FullPageSpinner**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `'Loading...'` | Loading message |

### Examples

```tsx
// Inline spinner
<Spinner size="sm" />

// Button with spinner
<Button disabled>
  <Spinner size="sm" variant="white" />
  Loading...
</Button>

// Full page loading
{isLoading && <FullPageSpinner message="Fetching data..." />}
```

---

## Skeleton

Loading placeholder component.

### Import

```tsx
import Skeleton, { SkeletonText, SkeletonCard } from '@/src/components/ui/Skeleton';
```

### Props

**Skeleton**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'circular' \| 'rectangular'` | `'text'` | Skeleton shape |
| `width` | `string \| number` | `'100%'` | Skeleton width |
| `height` | `string \| number` | - | Skeleton height |
| `animation` | `'pulse' \| 'wave' \| 'none'` | `'pulse'` | Animation type |

**SkeletonText**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lines` | `number` | `3` | Number of lines |
| `lastLineWidth` | `string` | `'70%'` | Width of last line |
| `spacing` | `string` | `'space-y-2'` | Spacing between lines |

### Examples

```tsx
// Text skeleton
<Skeleton variant="text" width="80%" />

// Avatar skeleton
<Skeleton variant="circular" width={40} height={40} />

// Image skeleton
<Skeleton variant="rectangular" width="100%" height={200} />

// Multiple text lines
<SkeletonText lines={4} lastLineWidth="60%" />

// Card skeleton
<SkeletonCard />

// Custom loading state
<div className="space-y-4">
  <div className="flex items-center gap-3">
    <Skeleton variant="circular" width={48} height={48} />
    <div className="flex-1">
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="60%" />
    </div>
  </div>
  <SkeletonText lines={3} />
</div>
```

---

## Alert

Contextual alert and message display component.

### Import

```tsx
import Alert from '@/src/components/ui/Alert';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Visual style |
| `title` | `string` | - | Alert title |
| `icon` | `boolean` | `true` | Show icon |
| `dismissible` | `boolean` | `false` | Show dismiss button |
| `onDismiss` | `() => void` | - | Dismiss handler |

### Examples

```tsx
// Basic alerts
<Alert variant="info">
  This is an informational message.
</Alert>

<Alert variant="success" title="Success!">
  Your report has been submitted successfully.
</Alert>

<Alert variant="warning" title="Warning">
  Your session will expire in 5 minutes.
</Alert>

<Alert variant="error" title="Error">
  Failed to save changes. Please try again.
</Alert>

// Dismissible alert
<Alert
  variant="info"
  dismissible
  onDismiss={() => console.log('dismissed')}
>
  You have 3 new notifications.
</Alert>

// Alert without icon
<Alert variant="info" icon={false}>
  Simple text message without icon.
</Alert>
```

---

## Migration Guide

### Replacing Existing Components

#### Button Migration

**Before:**
```tsx
<button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
  Submit
</button>
```

**After:**
```tsx
<Button variant="primary">Submit</Button>
```

#### Input Migration

**Before:**
```tsx
<div>
  <label className="text-gray-700">Email</label>
  <input
    type="email"
    className="border rounded px-4 py-2"
    placeholder="Enter email"
  />
</div>
```

**After:**
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
/>
```

#### Card Migration

**Before:**
```tsx
<div className="bg-white border rounded-lg p-4 shadow">
  <h3 className="text-xl font-bold">Title</h3>
  <p>Content...</p>
</div>
```

**After:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content...</p>
  </CardContent>
</Card>
```

---

## Best Practices

### 1. Always Use Theme Tokens

```tsx
// ❌ Don't use hardcoded colors
<div className="bg-white text-black">...</div>

// ✅ Use theme tokens
<div className="bg-surface text-primary">...</div>
```

### 2. Leverage Composition

```tsx
// ✅ Use sub-components for flexibility
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

### 3. Handle Loading States

```tsx
// ✅ Show loading feedback
<Button isLoading disabled>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

### 4. Provide Accessibility

```tsx
// ✅ Use labels and error messages
<Input
  label="Email"
  error={errors.email}
  aria-required="true"
/>
```

### 5. Use forwardRef with Forms

```tsx
// ✅ With React Hook Form
const { register } = useForm();
<Input {...register('email')} label="Email" />
```

---

## Component Index

Quick reference of all available components:

- **Form Components**: Input, Select, Checkbox, Radio, Textarea
- **Feedback Components**: Toast, Alert, Spinner, Skeleton
- **Layout Components**: Card, Modal
- **Display Components**: Button, Badge

All components support:
- ✅ Dark mode via theme tokens
- ✅ TypeScript with full type definitions
- ✅ Accessibility (ARIA attributes)
- ✅ Responsive design
- ✅ Customizable via className prop
