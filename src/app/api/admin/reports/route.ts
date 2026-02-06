import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/reports
 * 
 * Fetch pending reports for verification.
 * Simplified with denormalized schema - direct column access!
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
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (reportsError) {
      return NextResponse.json({ error: reportsError.message || String(reportsError) }, { status: 500 });
    }

    // Transform to expected format
    const result = (reports ?? []).map((r: any) => ({
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

