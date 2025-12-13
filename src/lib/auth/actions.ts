// OAuth authentication utilities
import { createClient } from '@/lib/supabase/client';

/**
 * Sign in with Google OAuth
 * Redirects user to Google for authentication
 */
export async function signInWithGoogle() {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error.message);
    throw error;
  }

  return data;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }

  // Require email verification: Supabase user object may include `email_confirmed_at` or `confirmed_at`.
  // If neither is present, treat the account as unverified and prevent sign in.
  const user = (data as { user?: { email_confirmed_at?: string; confirmed_at?: string } })?.user;
  const isEmailVerified = !!(user?.email_confirmed_at || user?.confirmed_at);
  if (user && !isEmailVerified) {
    // Sign the user out if a session was created to prevent partial auth state.
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    const msg = 'Please verify your email before signing in.';
    console.warn('Blocked sign-in for unverified email:', email);
    throw new Error(msg);
  }

  return data;
}

/**
 * Sign up with email and password
 * Creates both auth user and database user entry
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const supabase = createClient();
  
  const fullName = `${firstName} ${lastName}`.trim();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: fullName,
        first_name: firstName,
        last_name: lastName,
        role: 'user', // Default role
      },
      // After the user clicks the verification link, Supabase will redirect them
      // here. We use `/auth/verify` which is a client page that will finish
      // processing the session from the URL and redirect the user appropriately.
      emailRedirectTo: `${window.location.origin}/auth/verify`,
    },
  });

  if (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
}

/**
 * Get the current user session
 */
export async function getSession() {
  const supabase = createClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error.message);
    throw error;
  }

  return session;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error.message);
    throw error;
  }

  return user;
}

/**
 * Reset password - send reset email
 */
export async function resetPassword(email: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    console.error('Error sending reset email:', error.message);
    throw error;
  }

  return data;
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Error updating password:', error.message);
    throw error;
  }

  return data;
}


