// React hook for authentication state
'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { getUserRole, UserRole } from '@/lib/auth/utils';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setRole(getUserRole(session?.user ?? null));
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setRole(getUserRole(session?.user ?? null));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
  };
}
