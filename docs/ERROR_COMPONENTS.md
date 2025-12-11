# Error Page Components

## Overview
Reusable error page components for consistent error handling throughout the application.

## Base Component

### `ErrorPage`
Located at: `/src/components/ErrorPage.tsx`

A flexible error page component that can be customized for different error scenarios.

#### Props:
```typescript
interface ErrorPageProps {
  title?: string;              // Error title (default: "Something went wrong")
  message?: string;            // Error description
  statusCode?: number;         // HTTP status code (e.g., 404, 500)
  showHomeButton?: boolean;    // Show "Back to Home" button (default: true)
  showBackButton?: boolean;    // Show "Go Back" button (default: false)
  children?: React.ReactNode;  // Custom content/actions
}
```

#### Usage:
```tsx
import ErrorPage from '@/components/ErrorPage';

// Basic usage
<ErrorPage />

// Custom error
<ErrorPage
  statusCode={404}
  title="Page Not Found"
  message="The page you're looking for doesn't exist."
  showBackButton={true}
/>

// With custom actions
<ErrorPage
  title="Session Expired"
  message="Please log in again."
>
  <Link href="/login">Go to Login</Link>
</ErrorPage>
```

## Pre-built Error Variants

Located at: `/src/components/ErrorVariants.tsx`

### 1. NotFoundError (404)
```tsx
import { NotFoundError } from '@/components/ErrorVariants';

export default function NotFound() {
  return <NotFoundError />;
}
```

### 2. UnauthorizedError (403)
```tsx
import { UnauthorizedError } from '@/components/ErrorVariants';

export default function Unauthorized() {
  return <UnauthorizedError />;
}
```

### 3. ServerError (500)
```tsx
import { ServerError } from '@/components/ErrorVariants';

export default function Error() {
  return <ServerError />;
}
```

### 4. NetworkError
```tsx
import { NetworkError } from '@/components/ErrorVariants';

// Use in error boundaries or try-catch blocks
if (error.message === 'Network Error') {
  return <NetworkError />;
}
```

### 5. SessionExpiredError
```tsx
import { SessionExpiredError } from '@/components/ErrorVariants';

// Use when session expires
if (sessionExpired) {
  return <SessionExpiredError />;
}
```

### 6. MaintenanceError
```tsx
import { MaintenanceError } from '@/components/ErrorVariants';

// Use during maintenance
if (maintenanceMode) {
  return <MaintenanceError />;
}
```

## Next.js Integration

### Global Error Page
Create `app/error.tsx`:
```tsx
'use client';

import ErrorPage from '@/components/ErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      title="Something went wrong"
      message={error.message || "An unexpected error occurred."}
      showBackButton={true}
    >
      <button
        onClick={reset}
        className="text-[rgb(var(--color-primary))] hover:underline font-medium"
      >
        Try Again
      </button>
    </ErrorPage>
  );
}
```

### Global Not Found Page
Create `app/not-found.tsx`:
```tsx
import { NotFoundError } from '@/components/ErrorVariants';

export default function NotFound() {
  return <NotFoundError />;
}
```

### Route-specific Error Pages
```tsx
// app/(dashboard)/admin-dashboard/error.tsx
'use client';

import { ServerError } from '@/components/ErrorVariants';

export default function AdminError() {
  return <ServerError />;
}
```

## Features

✅ **Consistent Design** - Matches your theme system
✅ **Flexible** - Customizable props for different scenarios
✅ **Responsive** - Mobile-friendly layout
✅ **Theme-aware** - Uses CSS variables from theme system
✅ **Accessible** - Semantic HTML and clear messaging
✅ **Action Buttons** - Go back, go home, or custom actions
✅ **Status Codes** - Display HTTP status codes prominently
✅ **Icon** - Visual error indicator

## Customization

### Custom Error with Actions
```tsx
<ErrorPage
  title="Payment Failed"
  message="Your payment could not be processed."
  showHomeButton={false}
>
  <div className="flex gap-3">
    <button onClick={retryPayment}>Retry Payment</button>
    <Link href="/support">Contact Support</Link>
  </div>
</ErrorPage>
```

### Error Boundary Example
```tsx
'use client';

import { Component, ReactNode } from 'react';
import ErrorPage from '@/components/ErrorPage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          title="Oops! Something went wrong"
          message={this.state.error?.message}
          showBackButton={true}
        >
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-[rgb(var(--color-primary))] hover:underline"
          >
            Try Again
          </button>
        </ErrorPage>
      );
    }

    return this.props.children;
  }
}
```

## Theme Variables Used

- `--color-background` - Page background
- `--color-surface` - Card/button backgrounds
- `--color-primary` - Primary action color
- `--color-primary-dark` - Hover states
- `--color-text-primary` - Main text
- `--color-text-secondary` - Description text
- `--color-text-tertiary` - Help text
- `--color-border` - Borders and dividers

## Best Practices

1. **Use specific variants** when possible (404, 403, 500)
2. **Provide clear messages** - Tell users what went wrong and what they can do
3. **Offer actions** - Always give users a way forward
4. **Log errors** - Use error boundaries to log errors for debugging
5. **Test error states** - Ensure error pages display correctly in all scenarios
