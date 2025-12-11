-- ============================================================================
-- Fix RLS Policies for User Creation
-- ============================================================================
-- This fixes the issue where RLS policies were blocking the trigger function
-- from inserting new users into the public.users table

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;

-- Recreate policies with INSERT permission for service role
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- CRITICAL: Allow service role (trigger function) to insert new users
CREATE POLICY "Service role can insert users"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- Manual Sync for Existing Users
-- ============================================================================
-- This will copy any users from auth.users that don't exist in public.users

INSERT INTO public.users (id, email, name, role, reports_submitted, warnings, status, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name',
    SPLIT_PART(au.email, '@', 1)
  ) as name,
  'user' as role,
  0 as reports_submitted,
  0 as warnings,
  'active' as status,
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- ============================================================================
-- Verification
-- ============================================================================

-- Check if users were synced
SELECT 
  'Total users in auth.users:' as description,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Total users in public.users:' as description,
  COUNT(*) as count
FROM public.users
UNION ALL
SELECT 
  'Users missing from public.users:' as description,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Show all users in public.users
SELECT id, email, name, role, status, created_at
FROM public.users
ORDER BY created_at DESC;
