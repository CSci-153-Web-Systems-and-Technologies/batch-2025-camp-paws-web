-- ============================================================================
-- Alternative Fix: Bypass RLS entirely for the trigger function
-- ============================================================================

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with proper permissions to bypass RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER -- Run with the privileges of the function owner (postgres)
SET search_path = public, auth
AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Extract name from metadata
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Insert into public.users table (bypassing RLS because of SECURITY DEFINER)
  INSERT INTO public.users (
    id,
    email,
    name,
    role,
    reports_submitted,
    warnings,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_name,
    'user',
    0,
    0,
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the actual error for debugging
    RAISE LOG 'Error creating user record for % (ID: %): %', NEW.email, NEW.id, SQLERRM;
    RETURN NEW; -- Don't fail the auth signup
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users and service role
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, authenticated, service_role;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Manual Insert for Testing (run this to test if RLS is the issue)
-- ============================================================================
-- This temporarily disables RLS to insert the user

-- First, let's see what users exist in auth but not in public
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Now insert them with RLS disabled for this session
-- (This requires superuser privileges or you being the table owner)

DO $$
BEGIN
  -- Temporarily disable RLS for this block
  ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
  
  -- Insert missing users
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
  
  -- Re-enable RLS
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
END $$;

-- Verify the insert worked
SELECT 
  'Users in auth.users' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Users in public.users' as table_name,
  COUNT(*) as count
FROM public.users;

-- Show all users
SELECT id, email, name, role, created_at
FROM public.users
ORDER BY created_at DESC;
