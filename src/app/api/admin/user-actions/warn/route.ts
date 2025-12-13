import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type Body = {
  target: string; // user id or email
  reason?: string;
  reportId?: string | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body?.target) return NextResponse.json({ error: 'Missing target' }, { status: 400 });

    const supabase = await createClient();

    // Verify caller is an admin
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

    // Resolve target user id if an email was provided
    let targetId: string | null = null;
    let targetEmail: string | null = null;
    if (body.target.includes('@')) {
      const { data: u } = await supabase.from('users').select('id,email').eq('email', body.target).maybeSingle();
      const userRow = u as Record<string, unknown> | null;
      if (userRow) {
        targetId = typeof userRow['id'] === 'string' ? (userRow['id'] as string) : null;
        targetEmail = typeof userRow['email'] === 'string' ? (userRow['email'] as string) : body.target;
      } else {
        targetEmail = body.target;
      }
    } else {
      targetId = body.target;
    }

    // Insert audit row in user_actions
    // user_actions schema: (user_id, report_id, admin_id, action_type, reason)
    const actionRow: Record<string, unknown> = {
      user_id: targetId, // may be null if we resolved only email; DB may reject null depending on schema
      report_id: body.reportId ?? null,
      admin_id: actorId,
      action_type: 'warn',
      reason: body.reason ?? '',
    };

    const { error: insertErr } = await supabase.from('user_actions').insert(actionRow);
    if (insertErr) {
      console.error('user_actions insert error:', insertErr);
      throw insertErr;
    }

    // Increment warnings counter if we have a target id
    if (targetId) {
      // Prefer calling a DB-side RPC to atomically increment warnings
      try {
        await supabase.rpc('increment_user_warnings', { user_id: targetId });
      } catch {
        // Fallback: read current warnings and update
        try {
          const { data: existing } = await supabase.from('users').select('warnings').eq('id', targetId).maybeSingle();
          const existingRow = existing as Record<string, unknown> | null;
          const current = typeof existingRow?.['warnings'] === 'number' ? (existingRow!['warnings'] as number) : 0;
          const { error: updErr } = await supabase.from('users').update({ warnings: current + 1 }).eq('id', targetId);
          if (updErr) {
            // As a final fallback, insert into user_warnings so there's an auditable record
            await supabase.from('user_warnings').insert({ user_id: targetId, reason: body.reason ?? null });
          }
        } catch {
          await supabase.from('user_warnings').insert({ user_id: targetId, reason: body.reason ?? null });
        }
      }
    } else if (targetEmail) {
      // When only email is available, insert into user_warnings table so there's a trace
      await supabase.from('user_warnings').insert({ user_email: targetEmail, reason: body.reason ?? null });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log full error for server-side debugging. Try to safely stringify the error.
    try {
      console.error('warn endpoint error:', err, JSON.stringify(err));
    } catch {
      console.error('warn endpoint error (non-serializable):', err);
    }

    // Extract message from common Supabase error shapes or fallback
    let message = 'internal';
    if (err instanceof Error && typeof err.message === 'string') message = err.message;
    else if (typeof err === 'string') message = err;
    else if (err && typeof err === 'object') {
      const e = err as Record<string, unknown>;
      if (typeof e['message'] === 'string') message = e['message'] as string;
      else if (typeof e['error_description'] === 'string') message = e['error_description'] as string;
      else if (typeof e['hint'] === 'string') message = e['hint'] as string;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
