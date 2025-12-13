import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerClient();
    // Fetch reports (all statuses) and then join lookup tables server-side
    const { data: reports, error: reportsError } = await supabase
      .from('stray_animal_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (reportsError) {
      return NextResponse.json({ error: reportsError.message || String(reportsError) }, { status: 500 });
    }

  const rows = (reports ?? []) as Array<Record<string, unknown>>;

    // Collect ids for lookup tables and users
    const animalTypeIds = new Set<string>();
    const sexIds = new Set<string>();
    const collarStatusIds = new Set<string>();
    const colorPatternIds = new Set<string>();
    const primaryColorIds = new Set<string>();
    const userIds = new Set<string>();
    const verifiedByIds = new Set<string>();

    for (const r of rows) {
      if (r.animal_type_id) animalTypeIds.add(String(r.animal_type_id));
      if (r.sex_id) sexIds.add(String(r.sex_id));
      if (r.collar_status_id) collarStatusIds.add(String(r.collar_status_id));
      if (r.color_pattern_id) colorPatternIds.add(String(r.color_pattern_id));
      if (r.primary_color_id) primaryColorIds.add(String(r.primary_color_id));
      if (r.user_id) userIds.add(String(r.user_id));
      if (r.verified_by) verifiedByIds.add(String(r.verified_by));
    }

    // Helper types and function to fetch lookup table rows by ids
    type LookupRow = { id: string; name?: string; label?: string };
    async function fetchLookup(table: string, ids: Set<string>, cols = 'id,name'): Promise<Map<string, LookupRow>> {
      if (ids.size === 0) return new Map<string, LookupRow>();
      const { data, error } = await supabase.from(table).select(cols).in('id', [...ids]);
      if (error) throw error;
      const map = new Map<string, LookupRow>();
  ((data ?? []) as unknown as LookupRow[]).forEach((d) => map.set(String(d.id), d));
      return map;
    }

    const [animalTypes, sexes, collarStatuses, colorPatterns, primaryColors] = await Promise.all([
      fetchLookup('animal_types', animalTypeIds, 'id,name'),
      fetchLookup('sexes', sexIds, 'id,name'),
      fetchLookup('collar_statuses', collarStatusIds, 'id,name'),
      fetchLookup('color_patterns', colorPatternIds, 'id,name'),
      fetchLookup('primary_colors', primaryColorIds, 'id,label'),
    ]);

    // Fetch users (reporters and verifiers)
    const userMap = new Map<string, { id: string; email?: string }>();
    const allUserIds = new Set([...userIds, ...verifiedByIds]);
    if (allUserIds.size > 0) {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id,email')
        .in('id', [...allUserIds]);
      if (usersError) {
        return NextResponse.json({ error: usersError.message || String(usersError) }, { status: 500 });
      }
      ((usersData ?? []) as Array<{ id: string; email?: string }>).forEach((u) => userMap.set(String(u.id), u));
    }

    // Build frontend-ready rows matching the SELECT you provided
    const result = rows.map((r) => {
      const reporter = userMap.get(String(r.user_id)) ?? null;
      const verifier = userMap.get(String(r.verified_by)) ?? null;

      return {
        id: r.id,
        user_id: r.user_id,
        user_email: reporter ? reporter.email : null,
        photo_url: r.photo_url,
        spotted_date: r.spotted_date,
        spotted_time: r.spotted_time,
        latitude: r.latitude,
        longitude: r.longitude,
        animal_type: animalTypes.get(String(r.animal_type_id))?.name ?? null,
        sex: sexes.get(String(r.sex_id))?.name ?? null,
        collar_status: collarStatuses.get(String(r.collar_status_id))?.name ?? null,
        color_pattern: colorPatterns.get(String(r.color_pattern_id))?.name ?? null,
        primary_color: primaryColors.get(String(r.primary_color_id))?.label ?? null,
        body_condition_score: r.body_condition_score,
        additional_notes: r.additional_notes,
  location_description: r.location_description,
        status: r.status,
        verified_by: r.verified_by,
        verified_by_email: verifier ? verifier.email : null,
        verified_at: r.verified_at,
        created_at: r.created_at,
        updated_at: r.updated_at,
      };
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 });
  }
}

