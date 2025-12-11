# Google OAuth Setup Guide

## Prerequisites
- Supabase project created
- Google Cloud Console account

## Steps to Enable Google OAuth

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure consent screen if not already done:
   - User Type: External
   - App name: Camp Paws
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
6. Application type: **Web application**
7. Name: Camp Paws Web App
8. Add Authorized JavaScript origins:
   ```
   http://localhost:3000
   https://your-domain.com
   ```
9. Add Authorized redirect URIs:
   ```
   https://zevyyvvgwaerxydtmiwh.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```
10. Click **Create**
11. Copy the **Client ID** and **Client Secret**

### 2. Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the provider list
5. Toggle it to **Enabled**
6. Enter your Google OAuth credentials:
   - **Client ID**: (from step 1)
   - **Client Secret**: (from step 1)
7. Click **Save**

### 3. Update Redirect URLs

In Supabase Dashboard:
1. Go to **Authentication** > **URL Configuration**
2. Add Site URL: `http://localhost:3000` (development) or `https://your-domain.com` (production)
3. Add Redirect URLs:
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```

### 4. Test OAuth Flow

1. Start your dev server: `npm run dev`
2. Go to `/login`
3. Click "Login with Google"
4. You should be redirected to Google sign-in
5. After authentication, you'll be redirected back to your app
6. Check if user is created in Supabase Dashboard > Authentication > Users

## Files Created for OAuth

### 1. `/src/lib/auth/actions.ts`
- `signInWithGoogle()` - Initiates Google OAuth flow
- `signInWithEmail()` - Email/password sign in
- `signUpWithEmail()` - Email/password sign up
- `signOut()` - Sign out current user
- `getSession()` - Get current session
- `getCurrentUser()` - Get current user
- `resetPassword()` - Send password reset email
- `updatePassword()` - Update user password

### 2. `/src/app/auth/callback/route.ts`
- Handles OAuth callback from Google
- Exchanges code for session
- Redirects user based on role (admin/user)

### 3. `/src/app/auth/auth-code-error/page.tsx`
- Error page for failed OAuth attempts

## Usage in Login Page

Update your login page to use the new auth actions:

```typescript
'use client';
import { signInWithGoogle, signInWithEmail } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // User will be redirected automatically
    } catch (error) {
      console.error('Failed to login with Google:', error);
    }
  };
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmail(email, password);
      const role = user?.user_metadata?.role || 'user';
      router.push(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleEmailLogin}>
        {/* Email/password fields */}
      </form>
      
      <button onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
}
```

## Security Notes

1. **Never commit Google Client Secret** to version control
2. Store credentials in environment variables (already handled by Supabase)
3. Use HTTPS in production
4. Verify email domains if needed (can be configured in Google Console)
5. Set up proper CORS policies

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Console exactly matches Supabase's callback URL
- Include both http://localhost:3000 for dev and your production URL

### User not redirected after login
- Check that `/auth/callback/route.ts` is properly handling the OAuth code
- Verify middleware is not blocking the callback route

### User role not set
- Check the user creation trigger in Supabase
- Verify `handle_new_user()` function is setting the role in user_metadata

## Next Steps

1. ✅ Create Google OAuth credentials
2. ✅ Configure Supabase provider
3. ⏳ Update login page to use `signInWithGoogle()`
4. ⏳ Update signup page to use `signUpWithEmail()`
5. ⏳ Test OAuth flow
6. ⏳ Test email/password flow
7. ⏳ Add error handling and loading states
