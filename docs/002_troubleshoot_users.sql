-- ============================================================================
-- TROUBLESHOOTING: Check if trigger exists and verify user creation
-- ============================================================================

-- 1. Check if the trigger exists
SELECT 
  tgname as trigger_name,
  tgenabled as enabled,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';

-- 2. Check if the function exists
SELECT 
  proname as function_name,
  pronargs as num_arguments
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 3. Check how many users are in auth.users
SELECT COUNT(*) as total_auth_users FROM auth.users;

-- 4. Check how many users are in public.users
SELECT COUNT(*) as total_public_users FROM public.users;

-- 5. Show auth.users with their metadata
SELECT 
  id,
  email,
  raw_user_meta_data->>'name' as google_name,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 6. Show public.users
SELECT 
  id,
  email,
  name,
  role,
  status,
  created_at
FROM public.users
ORDER BY created_at DESC;

-- ============================================================================
-- MANUAL FIX: If trigger didn't work, manually sync users
-- ============================================================================

-- Run this to manually add users from auth.users to public.users
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
WHERE pu.id IS NULL  -- Only insert users that don't exist yet
ON CONFLICT (id) DO NOTHING;

-- Verify the insert worked
SELECT 
  'Users synced successfully' as message,
  COUNT(*) as users_added
FROM public.users
WHERE created_at >= NOW() - INTERVAL '1 minute';
