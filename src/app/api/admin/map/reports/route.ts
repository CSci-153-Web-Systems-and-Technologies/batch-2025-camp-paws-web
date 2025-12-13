import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerClient();

    const { data: reports, error: reportsError } = await supabase
      .from('stray_animal_reports')
      .select('id, latitude, longitude, animal_type_id, spotted_date, spotted_time, status, location_description, photo_url, user_id')
      .in('status', ['pending', 'verified'])
      .order('spotted_date', { ascending: false })
      .order('spotted_time', { ascending: false });

    if (reportsError) {
      return NextResponse.json({ error: reportsError.message || String(reportsError) }, { status: 500 });
    }

    const rows = (reports ?? []) as Array<Record<string, unknown>>;

    const animalTypeIds = new Set<string>();
    const userIds = new Set<string>();

    for (const r of rows) {
      if (r.animal_type_id) animalTypeIds.add(String(r.animal_type_id));
      if (r.user_id) userIds.add(String(r.user_id));
    }

    // Fetch lookups
    async function fetchLookup(table: string, ids: Set<string>, cols = 'id,name') {
      if (ids.size === 0) return new Map<string, Record<string, unknown>>();
      const { data, error } = await supabase.from(table).select(cols).in('id', [...ids]);
      if (error) throw error;
      const map = new Map<string, Record<string, unknown>>();
  ((data ?? []) as unknown as Array<Record<string, unknown>>).forEach(d => map.set(String(d.id), d));
      return map;
    }

    const [animalTypes, users] = await Promise.all([
      fetchLookup('animal_types', animalTypeIds, 'id,name'),
      fetchLookup('users', userIds, 'id,name,email'),
    ]);

    const result = rows.map(r => {
      const at = animalTypes.get(String(r.animal_type_id));
      const u = users.get(String(r.user_id));

      return {
        id: r.id,
        latitude: r.latitude,
        longitude: r.longitude,
        animal_type: at ? (at.name ?? null) : null,
        spotted_date: r.spotted_date,
        spotted_time: r.spotted_time,
        status: r.status,
        location_description: r.location_description,
        photo_url: r.photo_url,
        user_id: r.user_id,
        user_name: u ? (u.name ?? null) : null,
        user_email: u ? (u.email ?? null) : null,
      };
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 });
  }
}
