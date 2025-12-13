import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type Body = { reportId: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body?.reportId) return NextResponse.json({ error: 'Missing reportId' }, { status: 400 });

    const supabase = await createClient();

    // Authenticate and ensure caller is admin
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const actorId = user.id;

    const { data: actorRowRaw, error: actorErr } = await supabase.from('users').select('role').eq('id', actorId).maybeSingle();
    if (actorErr) throw actorErr;
    const actorRow = actorRowRaw as Record<string, unknown> | null;
    const actorRole = actorRow && typeof actorRow['role'] === 'string' ? (actorRow['role'] as string) : null;
    if (!actorRow || actorRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update report: set status, verified_by, verified_at
    const updateData: Record<string, unknown> = {
      status: 'verified',
      verified_by: actorId,
      verified_at: new Date().toISOString(),
    };

    const { error: updErr } = await supabase.from('stray_animal_reports').update(updateData).eq('id', body.reportId);
    if (updErr) {
      console.error('verify report update error:', updErr);
      throw updErr;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    try { console.error('verify endpoint error:', err, JSON.stringify(err)); } catch { console.error('verify endpoint error (non-serializable):', err); }
    let message = 'internal';
    if (err instanceof Error && typeof err.message === 'string') message = err.message;
    else if (typeof err === 'string') message = err;
    else if (err && typeof err === 'object') {
      const e = err as Record<string, unknown>;
      if (typeof e['message'] === 'string') message = e['message'] as string;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
