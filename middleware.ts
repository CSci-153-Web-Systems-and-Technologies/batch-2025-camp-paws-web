// Next.js Middleware for route protection and authentication
import { type NextRequest } from 'next/server';
import { updateSession } from './src/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  
  const { pathname } = request.nextUrl;

  // Skip middleware for auth callback routes
  if (pathname.startsWith('/auth/callback') || pathname.startsWith('/auth/auth-code-error')) {
    return supabaseResponse;
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
    // Check user role from metadata or database
    const userRole = user.user_metadata?.role || 'user';
    const redirectTo = userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard';
    return supabaseResponse.cookies.getAll().length > 0 
      ? supabaseResponse 
      : Response.redirect(new URL(redirectTo, request.url));
  }

  // Protect dashboard routes - require authentication
  if (isDashboardRoute && !user) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', pathname);
    return Response.redirect(url);
  }

  // Protect admin routes - require admin role
  if (isAdminRoute && user) {
    const userRole = user.user_metadata?.role || 'user';
    if (userRole !== 'admin') {
      // Redirect non-admin users to their dashboard
      return Response.redirect(new URL('/user-dashboard', request.url));
    }
  }

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
