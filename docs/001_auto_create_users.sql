-- ============================================================================
-- Automatic User Creation Trigger
-- ============================================================================
-- This function automatically creates a record in public.users table
-- whenever a new user signs up (via Google OAuth or any auth method)

-- Function to handle new user signup
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
  ON CONFLICT (id) DO NOTHING; -- Prevent errors if user somehow already exists
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the signup
    RAISE WARNING 'Error creating user record for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires after a new user is inserted
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Optional: Sync existing auth.users to public.users
-- ============================================================================
-- Run this ONCE to sync any existing users that were created before the trigger

INSERT INTO public.users (id, email, name, role, reports_submitted, warnings, status, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'full_name',
    SPLIT_PART(email, '@', 1)
  ) as name,
  'user' as role,
  0 as reports_submitted,
  0 as warnings,
  'active' as status,
  created_at,
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Helper Function: Make User Admin
-- ============================================================================
-- Function to promote a user to admin role

CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  -- Update in public.users table
  UPDATE public.users
  SET 
    role = 'admin',
    updated_at = NOW()
  WHERE email = user_email;
  
  -- Also update in auth.users metadata for consistency
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

-- Usage example:
-- SELECT public.make_user_admin('admin@example.com');

-- ============================================================================
-- Helper Function: Get User Role
-- ============================================================================
-- Function to get user role (useful for RLS policies)

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
-- Enable RLS on tables

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stray_animal_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

-- Users table policies
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

-- Allow service role (trigger function) to insert new users
CREATE POLICY "Service role can insert users"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- Reports table policies
CREATE POLICY "Anyone authenticated can view verified reports"
  ON public.stray_animal_reports FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND status = 'verified'
  );

CREATE POLICY "Users can view their own reports"
  ON public.stray_animal_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reports"
  ON public.stray_animal_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reports"
  ON public.stray_animal_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update reports"
  ON public.stray_animal_reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Animal groups policies
CREATE POLICY "Anyone authenticated can view animal groups"
  ON public.animal_groups FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage animal groups"
  ON public.animal_groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User actions policies (warnings/suspensions)
CREATE POLICY "Admins can view all user actions"
  ON public.user_actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create user actions"
  ON public.user_actions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates a user record in public.users when someone signs up via Supabase Auth (Google OAuth, email, etc.)';

COMMENT ON FUNCTION public.make_user_admin(TEXT) IS 
'Promotes a user to admin role. Usage: SELECT public.make_user_admin(''email@example.com'')';

COMMENT ON FUNCTION public.get_user_role(UUID) IS 
'Returns the role of a user. Useful for RLS policies and authorization checks.';
