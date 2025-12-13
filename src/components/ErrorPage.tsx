// Reusable error page component
import Link from 'next/link';

export interface ErrorPageProps {
  title?: string;
  message?: string;
  statusCode?: number;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export default function ErrorPage({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again later.',
  statusCode,
  showHomeButton = true,
  showBackButton = false,
  children,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))] px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        {/* Status Code */}
        {statusCode && (
          <div>
            <p className="text-6xl font-bold text-[rgb(var(--color-primary))]">
              {statusCode}
            </p>
          </div>
        )}

        {/* Error Title */}
        <div>
          <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
            {title}
          </h1>
          <p className="text-[rgb(var(--color-text-secondary))] text-base">
            {message}
          </p>
        </div>

        {/* Custom Content */}
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          {showBackButton && (
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] rounded-lg font-medium border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-background))] transition-colors"
            >
              Go Back
            </button>
          )}
          
          {showHomeButton && (
            <Link
              href="/"
              className="px-6 py-3 bg-[rgb(var(--color-primary))] text-white rounded-lg font-medium hover:bg-[rgb(var(--color-primary-dark))] transition-colors"
            >
              Back to Home
            </Link>
          )}
        </div>

        {/* Additional Help Text */}
        <div className="mt-8 pt-8 border-t border-[rgb(var(--color-border))]">
          <p className="text-sm text-[rgb(var(--color-text-tertiary))]">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
