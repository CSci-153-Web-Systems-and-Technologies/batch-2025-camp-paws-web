-- ============================================================================
-- Create Auto User Creation Trigger
-- ============================================================================
-- Run this to create the trigger that automatically adds users to public.users
-- when they sign up with Google OAuth

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
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

  -- Insert into public.users table
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
    'user', -- Default role is 'user'
    0, -- Initial reports submitted
    0, -- Initial warnings
    'active', -- Initial status
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
    -- Log error but don't fail the signup
    RAISE WARNING 'Error creating user record for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Sync Existing Users
-- ============================================================================
-- This will copy any users from auth.users that don't exist in public.users yet

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

-- Show counts
SELECT 'auth.users count' as description, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'public.users count' as description, COUNT(*) as count FROM public.users;

-- Show all users in public.users
SELECT id, email, name, role, status, created_at
FROM public.users
ORDER BY created_at DESC;

-- ============================================================================
-- Helper Functions (if they don't exist)
-- ============================================================================

-- Function to make a user admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET 
    role = 'admin',
    updated_at = NOW()
  WHERE email = user_email;
  
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    '{"role": "admin"}'::jsonb
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage after this runs:
-- SELECT public.make_user_admin('your-email@gmail.com');
