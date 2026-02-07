import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface ReportWithUser {
  id: string;
  animal_type: string;
  status: string;
  spotted_date: string;
  spotted_time: string;
  created_at: string;
  user_id: string;
  users: {
    name: string | null;
    email: string | null;
  }[] | null;
}

/**
 * GET /api/admin/dashboard/recent-reports
 * 
 * Fetch recent reports for admin dashboard activity feed.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const supabase = await createClient();
    
    const { data: reports, error } = await supabase
      .from('stray_animal_reports')
      .select('id, animal_type, status, spotted_date, spotted_time, created_at, user_id, users!stray_animal_reports_user_id_fkey(name, email)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent reports:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to expected format
    const result = (reports as ReportWithUser[] ?? []).map((r) => ({
      id: r.id,
      animal_type: r.animal_type,
      status: r.status,
      spotted_date: r.spotted_date,
      spotted_time: r.spotted_time,
      created_at: r.created_at,
      user_name: r.users?.[0]?.name ?? null,
      user_email: r.users?.[0]?.email ?? null,
    }));

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 });
  }
}
