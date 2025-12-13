// User authentication utilities
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user';

export interface UserProfile extends User {
  role: UserRole;
}

/**
 * Get user role from Supabase user object
 * Role can be stored in:
 * 1. user_metadata.role (set during signup)
 * 2. app_metadata.role (set by admin)
 * 3. Queried from users table in database
 */
export function getUserRole(user: User | null): UserRole {
  if (!user) return 'user';
  
  // Check app_metadata first (takes precedence)
  if (user.app_metadata?.role) {
    return user.app_metadata.role as UserRole;
  }
  
  // Check user_metadata
  if (user.user_metadata?.role) {
    return user.user_metadata.role as UserRole;
  }
  
  // Default to user
  return 'user';
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return getUserRole(user) === 'admin';
}

/**
 * Check if user is regular user
 */
export function isRegularUser(user: User | null): boolean {
  return getUserRole(user) === 'user';
}
