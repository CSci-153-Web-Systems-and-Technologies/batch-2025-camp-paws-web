import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface JoinedUser {
  email?: string | null;
  name?: string | null;
}

interface AdminReportRow {
  id: string;
  user_id: string;
  users?: JoinedUser | null;
  photo_url: string | null;
  spotted_date: string | null;
  spotted_time: string | null;
  latitude: number | null;
  longitude: number | null;
  animal_type: string | null;
  sex: string | null;
  collar_status: string | null;
  color_pattern: string | null;
  primary_color: string | null;
  body_condition_score: string | null;
  skin_problems: unknown;
  eye_problems: unknown;
  gait_problems: unknown;
  additional_notes: string | null;
  location_description: string | null;
  status: string;
  verified_by: string | null;
  verified_user?: JoinedUser | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * GET /api/admin/reports
 * 
 * Fetch pending reports for verification.
 * Simplified with denormalized schema - direct column access!
 */
export async function GET() {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: actorRowRaw, error: actorErr } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (actorErr) {
      throw actorErr;
    }

    const actorRow = actorRowRaw as Record<string, unknown> | null;
    const actorRole =
      actorRow && typeof actorRow['role'] === 'string'
        ? (actorRow['role'] as string)
        : null;

    if (!actorRow || actorRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const { data: reports, error: reportsError } = await supabase
      .from('stray_animal_reports')
      .select(`
        *,
        users!user_id(email, name),
        verified_user:users!verified_by(email, name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (reportsError) {
      return NextResponse.json({ error: reportsError.message || String(reportsError) }, { status: 500 });
    }

    // Transform to expected format
    const result = ((reports ?? []) as AdminReportRow[]).map((r) => ({
      id: r.id,
      user_id: r.user_id,
      user_email: r.users?.email ?? null,
      user_name: r.users?.name ?? null,
      photo_url: r.photo_url,
      spotted_date: r.spotted_date,
      spotted_time: r.spotted_time,
      latitude: r.latitude,
      longitude: r.longitude,
      animal_type: r.animal_type,
      sex: r.sex,
      collar_status: r.collar_status,
      color_pattern: r.color_pattern,
      primary_color: r.primary_color,
      body_condition_score: r.body_condition_score,
      skin_problems: r.skin_problems,
      eye_problems: r.eye_problems,
      gait_problems: r.gait_problems,
      additional_notes: r.additional_notes,
      location_description: r.location_description,
      status: r.status,
      verified_by: r.verified_by,
      verified_by_email: r.verified_user?.email ?? null,
      verified_by_name: r.verified_user?.name ?? null,
      verified_at: r.verified_at,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));

    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 });
  }
}

