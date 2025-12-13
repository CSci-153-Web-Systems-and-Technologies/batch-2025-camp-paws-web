-- Fix RLS policies for public.users table
-- Problem: Recursive policies cause "infinite recursion detected" error
-- Solution: Drop recursive policies that query public.users inside predicates,
--           and create safe policies that use auth.users metadata instead.

-- Step 1: Drop the recursive admin policies
DROP POLICY IF EXISTS "Admins can update any user profile (moderation)" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Step 2: Create safe per-user policies (if not already present)
-- Allow authenticated users to SELECT their own row
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Users can select own row' AND polrelid = 'public.users'::regclass
  ) THEN
    CREATE POLICY "Users can select own row"
    ON public.users
    FOR SELECT
    USING ( auth.uid() = id );
  END IF;
END $$;

-- Allow authenticated users to INSERT their own row
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Users can insert own row' AND polrelid = 'public.users'::regclass
  ) THEN
    CREATE POLICY "Users can insert own row"
    ON public.users
    FOR INSERT
    WITH CHECK ( auth.uid() = id );
  END IF;
END $$;

-- Allow authenticated users to UPDATE their own row but prevent changing 'role'
-- First drop the old unrestricted update policy if it exists
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

CREATE POLICY "Users can update own row (no role change)"
ON public.users
FOR UPDATE
USING ( auth.uid() = id )
WITH CHECK (
  auth.uid() = id
  AND (role = (SELECT role FROM public.users WHERE id = auth.uid()) OR role IS NULL)
);

-- Step 3: Create non-recursive admin policies using auth.users metadata
-- These check the auth.users table for role = 'admin' and do NOT query public.users
CREATE POLICY "Admins can select all (via auth metadata)"
ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM auth.users au
    WHERE au.id = auth.uid()
      AND (au.raw_user_meta_data->>'role') = 'admin'
  )
);

CREATE POLICY "Admins can update all (via auth metadata)"
ON public.users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM auth.users au
    WHERE au.id = auth.uid()
      AND (au.raw_user_meta_data->>'role') = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM auth.users au
    WHERE au.id = auth.uid()
      AND (au.raw_user_meta_data->>'role') = 'admin'
  )
);

-- Verify policies were created
SELECT 
  polname AS policy_name,
  polcmd AS command,
  pg_get_expr(polqual, polrelid) AS using_expr
FROM pg_policy
WHERE polrelid = 'public.users'::regclass
ORDER BY polname;
