# Supabase Authentication Middleware Setup

## Overview
This middleware handles authentication and route protection using Supabase Auth.

## Files Created

### 1. `/src/lib/supabase/client.ts`
- Browser-side Supabase client for client components
- Used in: Login, Signup, Client-side data fetching

### 2. `/src/lib/supabase/server.ts`
- Server-side Supabase client for Server Components
- Used in: Server Components, API routes

### 3. `/src/lib/supabase/middleware.ts`
- Helper for middleware authentication
- Refreshes user sessions

### 4. `/middleware.ts` (Root level)
- Main middleware that runs on every request
- Handles route protection and redirects

### 5. `/src/lib/auth/utils.ts`
- User role utilities
- Helper functions for checking user permissions

## Setup Instructions

### 1. Set Up Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Project Settings > API

### 2. Configure Environment Variables
Create `.env.local` file in root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database Schema
Run the SQL from the ERD to create tables:
- `users` (handled by Supabase Auth)
- `stray_animal_reports`
- `animal_groups`
- `group_reports`
- `user_actions`

### 4. Configure Auth in Supabase Dashboard

#### Enable Email Auth:
1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates (optional)

#### Set Up User Roles:
Add a trigger to set default role on signup:

```sql
-- Function to set default user role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user metadata with default role
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || '{"role": "user"}'::jsonb
  WHERE id = NEW.id;
  
  -- Insert into custom users table (optional)
  INSERT INTO public.users (id, email, name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Make Admin Users:
```sql
-- Update specific user to admin
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';

-- Also update in users table
UPDATE public.users
SET role = 'admin'
WHERE email = 'admin@example.com';
```

## Route Protection Rules

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes (Require Authentication)
- `/user-dashboard` - User dashboard
- `/report` - Submit report
- `/profile` - User profile

### Admin-Only Routes
- `/admin-dashboard` - Admin dashboard
- `/map` - Map view of reports
- `/records` - Animal records management
- `/verify` - Verify pending reports

## Middleware Logic

```typescript
// Auth pages: Redirect logged-in users to dashboard
/login, /signup → Redirect to appropriate dashboard if logged in

// Dashboard routes: Require authentication
/user-dashboard, /report, /profile → Redirect to /login if not authenticated

// Admin routes: Require admin role
/admin-dashboard, /map, /records, /verify → Redirect to /user-dashboard if not admin
```

## Usage in Components

### Client Component
```typescript
'use client';
import { createClient } from '@/lib/supabase/client';

export default function MyComponent() {
  const supabase = createClient();
  
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'password'
    });
  };
}
```

### Server Component
```typescript
import { createClient } from '@/lib/supabase/server';

export default async function MyServerComponent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return <div>Hello {user?.email}</div>;
}
```

### Check User Role
```typescript
import { createClient } from '@/lib/supabase/server';
import { getUserRole, isAdmin } from '@/lib/auth/utils';

export default async function MyComponent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const role = getUserRole(user);
  const adminAccess = isAdmin(user);
  
  return adminAccess ? <AdminPanel /> : <UserPanel />;
}
```

## Next Steps

1. ✅ Install dependencies: `npm install @supabase/supabase-js @supabase/ssr`
2. ⏳ Create Supabase project
3. ⏳ Set environment variables in `.env.local`
4. ⏳ Run database schema SQL
5. ⏳ Configure auth trigger for user roles
6. ⏳ Update login/signup pages to use Supabase
7. ⏳ Test authentication flow
8. ⏳ Test route protection

## Testing

1. Try accessing `/admin-dashboard` without login → Should redirect to `/login`
2. Login as regular user → Should redirect to `/user-dashboard`
3. Try accessing `/admin-dashboard` as user → Should redirect to `/user-dashboard`
4. Make user admin in database → Should access admin routes
5. Logout → Should redirect to `/login` when accessing protected routes
