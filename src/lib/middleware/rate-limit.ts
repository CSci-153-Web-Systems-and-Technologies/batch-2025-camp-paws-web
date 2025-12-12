// Rate limiting utilities for middleware
import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;
  
  /**
   * Time window in seconds
   */
  windowSeconds: number;
  
  /**
   * Custom key generator (default: uses IP address)
   */
  keyGenerator?: (request: NextRequest) => string;
}

/**
 * Rate limit checker
 * Returns true if request should be allowed, false if rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const key = config.keyGenerator 
    ? config.keyGenerator(request)
    : getClientIP(request);
  
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  
  // Initialize or get existing rate limit data
  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: rateLimitStore[key].resetTime,
    };
  }
  
  // Increment count
  rateLimitStore[key].count++;
  
  const allowed = rateLimitStore[key].count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - rateLimitStore[key].count);
  
  return {
    allowed,
    remaining,
    resetTime: rateLimitStore[key].resetTime,
  };
}

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a default (not ideal but prevents crashes)
  return 'unknown';
}

/**
 * Create a rate limit key based on user ID
 */
export function createUserKey(userId: string, endpoint: string): string {
  return `user:${userId}:${endpoint}`;
}

/**
 * Create a rate limit key based on IP and endpoint
 */
export function createIPKey(request: NextRequest, endpoint: string): string {
  const ip = getClientIP(request);
  return `ip:${ip}:${endpoint}`;
}
