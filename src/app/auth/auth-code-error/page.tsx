// Auth error page
import ErrorPage from '@/components/ErrorPage';
import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <ErrorPage
      title="Authentication Error"
      message="There was a problem signing you in. Please try again."
      showHomeButton={false}
    >
      <Link
        href="/login"
        className="inline-block px-6 py-3 bg-[rgb(var(--color-primary))] text-white rounded-lg font-medium hover:bg-[rgb(var(--color-primary-dark))] transition-colors"
      >
        Back to Login
      </Link>
    </ErrorPage>
  );
}
