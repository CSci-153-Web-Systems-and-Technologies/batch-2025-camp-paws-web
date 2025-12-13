"use client";
// Common error page variants

import ErrorPage from './ErrorPage';

// 404 - Not Found
export function NotFoundError() {
  return (
    <ErrorPage
      statusCode={404}
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      showBackButton={true}
    />
  );
}

// 403 - Forbidden/Unauthorized
export function UnauthorizedError() {
  return (
    <ErrorPage
      statusCode={403}
      title="Access Denied"
      message="You don't have permission to access this page."
      showBackButton={true}
    />
  );
}

// 500 - Server Error
export function ServerError() {
  return (
    <ErrorPage
      statusCode={500}
      title="Server Error"
      message="Something went wrong on our end. We're working to fix it."
      showBackButton={true}
    />
  );
}

// Network Error
export function NetworkError() {
  return (
    <ErrorPage
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection."
      showBackButton={true}
    >
      <button
        onClick={() => window.location.reload()}
        className="text-[rgb(var(--color-primary))] hover:underline font-medium"
      >
        Try Again
      </button>
    </ErrorPage>
  );
}

// Session Expired
export function SessionExpiredError() {
  return (
    <ErrorPage
      title="Session Expired"
      message="Your session has expired. Please log in again to continue."
      showHomeButton={false}
    >
      <a
        href="/login"
        className="inline-block px-6 py-3 bg-[rgb(var(--color-primary))] text-white rounded-lg font-medium hover:bg-[rgb(var(--color-primary-dark))] transition-colors"
      >
        Go to Login
      </a>
    </ErrorPage>
  );
}

// Maintenance Mode
export function MaintenanceError() {
  return (
    <ErrorPage
      title="Under Maintenance"
      message="We're currently performing scheduled maintenance. We'll be back soon!"
      showHomeButton={false}
      showBackButton={false}
    >
      <div className="mt-4">
        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
          Expected downtime: 30 minutes
        </p>
      </div>
    </ErrorPage>
  );
}
