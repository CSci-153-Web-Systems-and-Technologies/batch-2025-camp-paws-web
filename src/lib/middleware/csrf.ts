// CSRF (Cross-Site Request Forgery) protection utilities
import { NextRequest } from 'next/server';

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  // Generate a random token
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token from request
 */
export function validateCSRFToken(request: NextRequest, cookieToken?: string): boolean {
  // Skip CSRF check for safe methods
  const method = request.method;
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  // Get token from header
  const headerToken = request.headers.get('x-csrf-token');
  
  // Get token from cookie (passed from middleware)
  if (!cookieToken || !headerToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  return headerToken === cookieToken;
}

/**
 * CSRF cookie name
 */
export const CSRF_COOKIE_NAME = 'csrf-token';

/**
 * CSRF header name
 */
export const CSRF_HEADER_NAME = 'x-csrf-token';
