# Fix for Admin Access Issue (RLS Infinite Recursion)

## Problem
Admin accounts cannot access admin pages. The error occurs because of recursive RLS (Row Level Security) policies on the `public.users` table that query the same table within their predicates, causing PostgreSQL to detect infinite recursion.

## Error Message
```
"infinite recursion detected in policy for relation \"users\""
```

## Root Cause
The following policies were querying `public.users` inside their USING/WITH CHECK expressions:
- "Admins can update any user profile (moderation)"
- "Admins can update users"
- "Admins can view all user profiles"
- "Admins can view all users"

When PostgreSQL evaluates these policies, it needs to query `public.users` to check if a user is an admin, which triggers policy evaluation again, creating an infinite loop.

## Solution
Run the SQL script `docs/006_fix_rls_policies.sql` in your Supabase SQL Editor.

### Quick Fix Steps
1. Open your Supabase project dashboard
2. Go to SQL Editor → New Query
3. Copy and paste the entire content of `docs/006_fix_rls_policies.sql`
4. Click "Run" to execute
5. Sign out and sign back in to your app
6. Admin access should now work

### What the Script Does
1. **Drops recursive policies** - Removes the four policies that were causing recursion
2. **Creates safe per-user policies** - Allows users to read/update their own rows
3. **Creates non-recursive admin policies** - Uses `auth.users` metadata instead of querying `public.users`

### Key Changes
- Admin detection now uses `auth.users.raw_user_meta_data->>'role'` or `auth.users.user_metadata->>'role'`
- No policies query `public.users` within their predicates
- Users can still update their own profile but cannot change their role field

## Verify the Fix
After running the SQL:

1. **Test login with admin account**:
   - Should redirect to `/admin-dashboard`
   - Should be able to access admin pages

2. **Check `/debug/role` page**:
   - Should show `source: "public.users"` (not "auth.metadata")
   - Should show `role: "admin"`

3. **Check browser console**:
   - No more "infinite recursion" errors
   - `/api/get-role` should return 200 OK

## Alternative: Manual Policy Setup
If you prefer to run commands one by one:

```sql
-- 1. Drop recursive policies
DROP POLICY IF EXISTS "Admins can update any user profile (moderation)" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- 2. Create admin SELECT policy (non-recursive)
CREATE POLICY "Admins can select all (via auth metadata)"
ON public.users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
      AND (
        (au.raw_user_meta_data->>'role') = 'admin'
        OR (au.user_metadata->>'role') = 'admin'
      )
  )
);

-- 3. Create admin UPDATE policy (non-recursive)
CREATE POLICY "Admins can update all (via auth metadata)"
ON public.users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
      AND (
        (au.raw_user_meta_data->>'role') = 'admin'
        OR (au.user_metadata->>'role') = 'admin'
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
      AND (
        (au.raw_user_meta_data->>'role') = 'admin'
        OR (au.user_metadata->>'role') = 'admin'
      )
  )
);
```

## Security Notes
- The new policies are **more secure** because they:
  - Prevent users from changing their own role via client-side updates
  - Use auth metadata as the authoritative source for admin privileges
  - Avoid recursion issues that could cause service disruptions

- The `auth.users` table contains user metadata set during signup and can only be modified server-side or via Supabase admin functions, making it a safer source for role checks than `public.users`.

## Troubleshooting
If admin access still doesn't work after running the script:

1. **Check if the user metadata has role='admin'**:
   ```sql
   SELECT id, email, raw_user_meta_data->>'role' as role
   FROM auth.users
   WHERE email = 'your-admin-email@example.com';
   ```

2. **If role is not 'admin' in auth.users metadata, update it**:
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = jsonb_set(
     COALESCE(raw_user_meta_data, '{}'::jsonb),
     '{role}',
     '"admin"'
   )
   WHERE email = 'your-admin-email@example.com';
   ```

3. **Verify the public.users row exists with role='admin'**:
   ```sql
   SELECT id, name, role, email
   FROM public.users
   WHERE email = 'your-admin-email@example.com';
   ```

4. **Sign out and sign in again** to refresh the session and cookies.

## Related Files
- `/docs/006_fix_rls_policies.sql` - The SQL script to run
- `/src/app/api/get-role/route.ts` - Server endpoint that fetches user role
- `/src/app/debug/role/page.tsx` - Debug page to verify role detection
- `/src/app/(dashboard)/layout.tsx` - Layout that enforces admin access control

## Date Fixed
December 13, 2025
