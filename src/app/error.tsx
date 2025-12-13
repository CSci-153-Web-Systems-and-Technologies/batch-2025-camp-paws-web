'use client';

// Global error page
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
      message={error.message || "An unexpected error occurred. Please try again."}
      showBackButton={true}
    >
      <button
        onClick={reset}
        className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-lg font-medium hover:bg-[rgb(var(--color-primary-dark))] transition-colors"
      >
        Try Again
      </button>
    </ErrorPage>
  );
}
