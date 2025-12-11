# 🔧 User Not Appearing - Quick Fix Guide

## Problem
Users signing up with Google OAuth are not appearing in `public.users` table.

## Quick Fix Steps

### Step 1: Check if you ran the trigger SQL
Go to Supabase Dashboard → SQL Editor and run:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

**If empty/no results:**
- You haven't run the migration yet
- Run the entire `001_auto_create_users.sql` file

### Step 2: Manually sync existing users
If you already signed up before creating the trigger, run this in SQL Editor:

```sql
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
  0, 0, 'active',
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

### Step 3: Verify it worked
```sql
SELECT id, email, name, role FROM public.users ORDER BY created_at DESC;
```

You should now see your user!

## Common Issues

### Issue 1: Trigger not firing
**Check:**
```sql
SELECT tgname, tgenabled FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

**Fix:**
If `tgenabled` is not 'O', enable it:
```sql
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
```

### Issue 2: Permission error
**Symptom:** Trigger exists but users still not created

**Fix:** Recreate function with proper permissions:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Then run the entire 001_auto_create_users.sql again
```

### Issue 3: Users table doesn't exist
**Check:**
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users';
```

**Fix:**
You need to create the database schema first! Run the table creation SQL from `SUPABASE_DATABASE.txt`.

## Testing the Trigger

### Test with a new user:
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Invite user" or sign up again with different Google account
3. Check `public.users`:
```sql
SELECT * FROM public.users ORDER BY created_at DESC LIMIT 1;
```

### Check trigger logs:
```sql
-- Check for any warnings from the trigger
SELECT * FROM pg_stat_statements WHERE query LIKE '%handle_new_user%';
```

## Make Yourself Admin (After User Created)

```sql
-- Quick method
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@gmail.com';

-- Or use the helper function
SELECT public.make_user_admin('your-email@gmail.com');
```

## Still Not Working?

### Manual workaround:
Manually add yourself to the users table:

```sql
-- 1. Get your ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'your-email@gmail.com';

-- 2. Manually insert (replace YOUR_ID and YOUR_EMAIL)
INSERT INTO public.users (id, email, name, role, status)
VALUES (
  'YOUR_ID_FROM_STEP_1',
  'YOUR_EMAIL',
  'Your Name',
  'admin',  -- Make yourself admin directly
  'active'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## Verify Everything

Run this comprehensive check:
```sql
-- Should have matching counts
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users,
  (SELECT COUNT(*) FROM public.users) as public_users;

-- See side-by-side comparison
SELECT 
  au.email as auth_email,
  pu.email as public_email,
  pu.name,
  pu.role,
  pu.status
FROM auth.users au
FULL OUTER JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC;
```

## Next Time You Sign Up

After running the migration:
1. New Google OAuth signups will **automatically** create user in `public.users`
2. You'll see them immediately in the table
3. No manual sync needed!
