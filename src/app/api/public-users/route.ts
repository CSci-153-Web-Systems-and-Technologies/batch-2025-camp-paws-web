import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// WARNING: This endpoint uses the SUPABASE_SERVICE_ROLE_KEY to bypass RLS.
// Set SUPABASE_SERVICE_ROLE_KEY in your deployment environment (do NOT commit it).

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Service key not configured' }, { status: 500 });
    }

    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    // Return only non-sensitive fields
    const { data, error } = await supabase
      .from('users')
      .select('id, name, role')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
