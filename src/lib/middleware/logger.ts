// Logging utilities for middleware
import { NextRequest } from 'next/server';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  userId?: string;
  userEmail?: string;
  ip?: string;
  path?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  
  return 'unknown';
}

/**
 * Log a security event
 */
export function logSecurityEvent(
  message: string,
  request: NextRequest,
  metadata?: {
    userId?: string;
    userEmail?: string;
    [key: string]: unknown;
  }
): void {
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: LogLevel.SECURITY,
    message,
    ip: getClientIP(request),
    path: request.nextUrl.pathname,
    userAgent: request.headers.get('user-agent') || undefined,
    ...metadata,
  };

  // In production, send to logging service (e.g., Sentry, LogRocket, etc.)
  console.log('[SECURITY]', JSON.stringify(logEntry, null, 2));
}

/**
 * Log unauthorized access attempt
 */
export function logUnauthorizedAccess(
  request: NextRequest,
  userId?: string,
  userEmail?: string,
  attemptedRole?: string
): void {
  logSecurityEvent(
    'Unauthorized access attempt',
    request,
    {
      userId,
      userEmail,
      attemptedRole,
      attemptedPath: request.nextUrl.pathname,
    }
  );
}

/**
 * Log rate limit hit
 */
export function logRateLimitHit(
  request: NextRequest,
  endpoint: string,
  userId?: string
): void {
  logSecurityEvent(
    'Rate limit exceeded',
    request,
    {
      userId,
      endpoint,
      limit: 'exceeded',
    }
  );
}

/**
 * Log authentication event
 */
export function logAuthEvent(
  message: string,
  request: NextRequest,
  userId?: string,
  userEmail?: string,
  success: boolean = true
): void {
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: success ? LogLevel.INFO : LogLevel.WARN,
    message,
    userId,
    userEmail,
    ip: getClientIP(request),
    path: request.nextUrl.pathname,
    metadata: { success },
  };

  console.log(`[AUTH]`, JSON.stringify(logEntry, null, 2));
}
