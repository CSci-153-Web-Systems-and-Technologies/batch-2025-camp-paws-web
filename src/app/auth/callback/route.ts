// OAuth callback handler
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get user to determine redirect
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch user role from database
      let userRole: 'admin' | 'user' = 'user';
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        userRole = userData?.role || 'user';
      }
      
      // Redirect based on role
      const redirectTo = userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard';
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectTo}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectTo}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectTo}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
