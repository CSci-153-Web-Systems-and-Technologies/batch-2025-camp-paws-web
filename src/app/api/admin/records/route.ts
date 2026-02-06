import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/records
 * 
 * Fetch verified reports for records table.
 * Simplified with denormalized schema - health conditions stored as arrays!
 */
export async function GET() {
  try {
    const supabase = await createServerClient();

    const { data: reports, error: reportsError } = await supabase
      .from('stray_animal_reports')
      .select(`
        *,
        users!user_id(email, name),
        verified_user:users!verified_by(email, name)
      `)
      .eq('status', 'verified')
      .order('verified_at', { ascending: false });

    if (reportsError) {
      return NextResponse.json({ error: reportsError.message || String(reportsError) }, { status: 500 });
    }

    // Transform to expected format
    const result = (reports ?? []).map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      is_grouped: r.is_grouped,
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
      additional_notes: r.additional_notes,
      status: r.status,
      verified_by: r.verified_by,
      verified_by_email: r.verified_user?.email ?? null,
      verified_by_name: r.verified_user?.name ?? null,
      verified_at: r.verified_at,
      created_at: r.created_at,
      updated_at: r.updated_at,
      location_description: r.location_description,
      // Health conditions as arrays (already stored this way!)
      skin_conditions: r.skin_problems ?? [],
      eye_conditions: r.eye_problems ?? [],
      gait_conditions: r.gait_problems ?? [],
    }));

    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 });
  }
}
