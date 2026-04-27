import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface JoinedUser {
  name?: string | null;
  email?: string | null;
}

interface AdminMapReportRow {
  id: string;
  latitude: number | null;
  longitude: number | null;
  animal_type: string | null;
  spotted_date: string | null;
  spotted_time: string | null;
  status: string;
  location_description: string | null;
  photo_url: string | null;
  user_id: string;
  users?: JoinedUser | null;
}

/**
 * GET /api/admin/map/reports
 * 
 * Fetch reports for map view (pending + verified only).
 * Simplified with denormalized schema - no lookups needed!
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
      .select('id, latitude, longitude, animal_type, spotted_date, spotted_time, status, location_description, photo_url, user_id, users(name, email)')
      .in('status', ['pending', 'verified'])
      .order('spotted_date', { ascending: false })
      .order('spotted_time', { ascending: false });

    if (reportsError) {
      return NextResponse.json({ error: reportsError.message || String(reportsError) }, { status: 500 });
    }

    // Transform to expected format
    const result = ((reports ?? []) as AdminMapReportRow[]).map((r) => ({
      id: r.id,
      latitude: r.latitude,
      longitude: r.longitude,
      animal_type: r.animal_type,
      spotted_date: r.spotted_date,
      spotted_time: r.spotted_time,
      status: r.status,
      location_description: r.location_description,
      photo_url: r.photo_url,
      user_id: r.user_id,
      user_name: r.users?.name ?? null,
      user_email: r.users?.email ?? null,
    }));

    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 });
  }
}
