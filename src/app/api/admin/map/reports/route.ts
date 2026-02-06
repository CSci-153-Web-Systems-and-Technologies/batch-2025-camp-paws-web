import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/map/reports
 * 
 * Fetch reports for map view (pending + verified only).
 * Simplified with denormalized schema - no lookups needed!
 */
export async function GET() {
  try {
    const supabase = await createServerClient();

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
    const result = (reports ?? []).map((r: any) => ({
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
