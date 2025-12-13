// Hook to get CSRF token for form submissions
'use client';

import { CSRF_COOKIE_NAME } from '@/lib/middleware/csrf';

/**
 * Get CSRF token from cookies
 */
function getCSRFTokenFromCookie(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${CSRF_COOKIE_NAME}=`)
  );

  if (!csrfCookie) {
    return null;
  }

  return csrfCookie.split('=')[1];
}

/**
 * Hook to get CSRF token
 */
export function useCSRFToken(): string | null {
  return getCSRFTokenFromCookie();
}

/**
 * Add CSRF token to fetch headers
 */
export function getCSRFHeaders(): HeadersInit {
  const token = getCSRFTokenFromCookie();
  if (!token) {
    return {};
  }

  return {
    'x-csrf-token': token,
  };
}
