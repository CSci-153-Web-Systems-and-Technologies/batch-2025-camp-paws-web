// Next.js Middleware for route protection and authentication
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './src/lib/supabase/middleware';
import { checkRateLimit, createIPKey } from './src/lib/middleware/rate-limit';
import { logUnauthorizedAccess, logRateLimitHit, logSecurityEvent } from './src/lib/middleware/logger';
import { generateCSRFToken, validateCSRFToken, CSRF_COOKIE_NAME } from './src/lib/middleware/csrf';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, userRole } = await updateSession(request);
  
  const { pathname } = request.nextUrl;

  // Skip middleware for auth callback routes
  if (pathname.startsWith('/auth/callback') || pathname.startsWith('/auth/auth-code-error')) {
    return supabaseResponse;
  }

  // CSRF Protection for authenticated users on state-changing operations
  // TODO: Re-enable after implementing CSRF token handling in all forms
  // if (user && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
  //   const csrfCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  //   const isValid = validateCSRFToken(request, csrfCookie);
  //   
  //   if (!isValid) {
  //     logSecurityEvent('CSRF token validation failed', request, {
  //       userId: user.id,
  //       userEmail: user.email,
  //     });
  //     return new NextResponse('Invalid CSRF token', { status: 403 });
  //   }
  // }

  // Generate CSRF token for authenticated users if not present
  // TODO: Re-enable with CSRF protection
  // if (user && !request.cookies.get(CSRF_COOKIE_NAME)) {
  //   const csrfToken = generateCSRFToken();
  //   supabaseResponse.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //     sameSite: 'strict',
  //     path: '/',
  //   });
  // }

  // Rate limiting for auth routes (login/signup)
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    const rateLimit = checkRateLimit(request, {
      maxRequests: 10, // 10 requests
      windowSeconds: 60, // per minute
      keyGenerator: (req) => createIPKey(req, 'auth'),
    });

    if (!rateLimit.allowed) {
      logRateLimitHit(request, 'auth', user?.id);
      return new NextResponse('Too many requests. Please try again later.', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetTime),
        },
      });
    }
  }

  // Rate limiting for report submissions
  if (pathname.startsWith('/report') && user) {
    const rateLimit = checkRateLimit(request, {
      maxRequests: 20, // 20 reports
      windowSeconds: 3600, // per hour
      keyGenerator: () => `user:${user.id}:report`,
    });

    if (!rateLimit.allowed) {
      logRateLimitHit(request, 'report', user.id);
      return new NextResponse('Report submission limit reached. Please try again later.', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetTime),
        },
      });
    }
  }

  // Define route categories
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboardRoute = pathname.startsWith('/admin-dashboard') || 
                          pathname.startsWith('/user-dashboard') ||
                          pathname.startsWith('/report') ||
                          pathname.startsWith('/map') ||
                          pathname.startsWith('/records') ||
                          pathname.startsWith('/verify') ||
                          pathname.startsWith('/profile');
  const isAdminRoute = pathname.startsWith('/admin-dashboard') ||
                      pathname.startsWith('/map') ||
                      pathname.startsWith('/records') ||
                      pathname.startsWith('/verify');

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    // Use the role from database
    const redirectTo = userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard';
    return Response.redirect(new URL(redirectTo, request.url));
  }

  // Protect dashboard routes - require authentication
  if (isDashboardRoute && !user) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', pathname);
    return Response.redirect(url);
  }

  // Protect admin routes - require admin role
  if (isAdminRoute && user) {
    if (userRole !== 'admin') {
      // Log unauthorized access attempt
      logUnauthorizedAccess(request, user.id, user.email, 'admin');
      // Redirect non-admin users to their dashboard
      return Response.redirect(new URL('/user-dashboard', request.url));
    }
  }

  // Add security headers
  supabaseResponse.headers.set('X-Frame-Options', 'DENY');
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff');
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block');
  supabaseResponse.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self)'
  );
  
  // Content Security Policy
  supabaseResponse.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.supabase.co https://accounts.google.com; " +
    "frame-src 'self' https://accounts.google.com; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
