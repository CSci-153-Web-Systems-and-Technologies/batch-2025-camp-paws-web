"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function VerifyPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your email — one moment...');

  useEffect(() => {
    async function handleVerify() {
      const supabase = createClient();

      try {
        // Parse session from URL that Supabase appended when the user clicked
        // the confirmation link. This will store the session in the browser
        // if it's valid.
        // `getSessionFromUrl` is the v2 helper that processes the URL.
        // If it doesn't exist or returns an error we'll continue but still
        // attempt to fetch the user to decide next steps.
        // @ts-expect-error: runtime helper may not be present in some typing bundles
        const sessionRes = await (supabase.auth.getSessionFromUrl ? supabase.auth.getSessionFromUrl() : Promise.resolve(null));

        if (sessionRes?.error) {
          console.warn('getSessionFromUrl error:', sessionRes.error);
        }

        // Now fetch the current user (if any) and redirect based on role.
        const { data: userData, error: userErr } = await supabase.auth.getUser();

        if (userErr || !userData?.user) {
          setMessage('Email verified. Please sign in. Redirecting to login...');
          setTimeout(() => router.push('/auth/login'), 1200);
          return;
        }

        const user = userData.user;

        // Fetch role from users table
        const { data: dbUser, error: dbErr } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (dbErr) {
          console.warn('Error fetching user role:', dbErr);
        }

        const role = dbUser?.role || 'user';
        const redirectTo = role === 'admin' ? '/admin-dashboard' : '/user-dashboard';

        setMessage('Verification complete — redirecting...');
        setTimeout(() => router.push(redirectTo), 800);
      } catch (err) {
        console.error('Verification handler error:', err);
        setMessage('Something went wrong while verifying. Please sign in manually.');
        setTimeout(() => router.push('/auth/login'), 1800);
      }
    }

    handleVerify();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="max-w-lg w-full p-8 rounded-md bg-white dark:bg-slate-800 shadow">
        <h1 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Verifying email</h1>
        <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>
      </div>
    </div>
  );
}
