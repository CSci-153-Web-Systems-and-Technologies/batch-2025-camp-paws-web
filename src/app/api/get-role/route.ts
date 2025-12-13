import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Try to fetch the DB row from public.users
    const { data: userRow, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    // If we successfully read the row and it has a role, return it
    if (!error && userRow?.role) {
      return NextResponse.json({ role: userRow.role, source: 'public.users' });
    }

    // If the row is missing or RLS prevented the read, fall back to auth metadata
  type Meta = Record<string, unknown> | null | undefined;
  const userMeta = user.user_metadata as Meta;
  const appMeta = user.app_metadata as Meta;
  const fallbackRole = (userMeta && (userMeta as Record<string, unknown>)['role'] as string) ?? (appMeta && (appMeta as Record<string, unknown>)['role'] as string) ?? 'user';

    // Include diagnostics to help debug RLS / missing-row issues
    const diagnostics: Record<string, unknown> = {
      userId: user.id,
      user_metadata: user.user_metadata ?? null,
      app_metadata: user.app_metadata ?? null,
      db_error: error ? (error.message ?? String(error)) : null,
      row_found: !!userRow,
      fallback_used: true,
    };

    return NextResponse.json({ role: fallbackRole, source: 'auth.metadata', diagnostics });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
