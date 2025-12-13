"use client";
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export default function RoleDebugPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userRow, setUserRow] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const user = userData?.user ?? null;
        setAuthUser(user);

        if (user?.id) {
          const { data: rowData, error: rowErr } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (rowErr && rowErr.code !== 'PGRST116') {
            // PGRST116: no rows returned for single() — we'll treat as missing
            throw rowErr;
          }

          setUserRow(rowData ?? null);
        }
      } catch (err: unknown) {
        console.error('Role debug error:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-lg font-semibold">Role debug</h2>
        <p className="mt-4">Loading current auth user and DB row...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Role debug</h2>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-100 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <section className="mt-6">
        <h3 className="text-lg font-medium">Auth user</h3>
        {authUser ? (
          <pre className="mt-2 bg-[rgb(var(--color-surface))] p-3 rounded text-sm overflow-auto">{JSON.stringify(authUser, null, 2)}</pre>
        ) : (
          <p className="mt-2 text-sm">No authenticated user found. Please log in first.</p>
        )}
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-medium">public.users row</h3>
        {userRow ? (
          <pre className="mt-2 bg-[rgb(var(--color-surface))] p-3 rounded text-sm overflow-auto">{JSON.stringify(userRow, null, 2)}</pre>
        ) : (
          <p className="mt-2 text-sm">No row found in <code>public.users</code> for the authenticated user id.</p>
        )}
      </section>

      <div className="mt-6 text-sm text-[rgb(var(--color-text-secondary))]">
        Tip: If the auth user id and the <code>public.users</code> id do not match, that explains why admin pages are blocked.
      </div>
    </div>
  );
}
