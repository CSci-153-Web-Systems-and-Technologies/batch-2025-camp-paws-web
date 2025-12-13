import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerClient();

    const { data: reports, error: reportsError } = await supabase
      .from('stray_animal_reports')
      .select(
        'id, user_id, photo_url, animal_type_id, sex_id, collar_status_id, color_pattern_id, primary_color_id, body_condition_score, additional_notes, spotted_date, spotted_time, latitude, longitude, location_description, status, verified_by, verified_at, created_at, updated_at'
      )
      .eq('status', 'verified')
      .order('verified_at', { ascending: false });

    if (reportsError) {
      return NextResponse.json({ error: reportsError.message || String(reportsError) }, { status: 500 });
    }

    const rows = (reports ?? []) as Array<Record<string, unknown>>;

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

    async function fetchLookup(table: string, ids: Set<string>, cols = 'id,name') {
      if (ids.size === 0) return new Map<string, Record<string, unknown>>();
      const { data, error } = await supabase.from(table).select(cols).in('id', [...ids]);
      if (error) throw error;
      const map = new Map<string, Record<string, unknown>>();
      ((data ?? []) as unknown as Array<Record<string, unknown>>).forEach(d => map.set(String(d.id), d));
      return map;
    }

    // Fetch report condition associations (skin/eye/gait) and map condition ids -> labels
    const reportIds = rows.map(r => String(r.id));
    const skinMap = new Map<string, string[]>();
    const eyeMap = new Map<string, string[]>();
    const gaitMap = new Map<string, string[]>();

    if (reportIds.length > 0) {
      // helper to build map from association table and types table
      async function buildConditionMap(assocTable: string, typeTable: string) {
        const { data: assocRows, error: assocErr } = await supabase
          .from(assocTable)
          .select('report_id, condition_id')
          .in('report_id', reportIds);
        if (assocErr) throw assocErr;
        const assoc = (assocRows ?? []) as Array<Record<string, unknown>>;
        const condIds = new Set<string>();
        assoc.forEach(a => { if (a.condition_id) condIds.add(String(a.condition_id)); });

        const { data: typesRows, error: typesErr } = await supabase
          .from(typeTable)
          .select('id,label')
          .in('id', [...condIds]);
        if (typesErr) throw typesErr;
        const idToLabel = new Map<string, string>();
        ((typesRows ?? []) as Array<Record<string, unknown>>).forEach(t => idToLabel.set(String(t.id), String(t.label)));

        const map = new Map<string, string[]>();
        assoc.forEach(a => {
          const rid = String(a.report_id);
          const cid = String(a.condition_id);
          const label = idToLabel.get(cid) ?? cid;
          const arr = map.get(rid) ?? [];
          arr.push(label);
          map.set(rid, arr);
        });

        return map;
      }

      const [skinRes, eyeRes, gaitRes] = await Promise.all([
        buildConditionMap('report_skin_conditions', 'skin_condition_types'),
        buildConditionMap('report_eye_conditions', 'eye_condition_types'),
        buildConditionMap('report_gait_conditions', 'gait_condition_types')
      ]);

      // assign maps
      skinRes.forEach((v, k) => skinMap.set(k, v));
      eyeRes.forEach((v, k) => eyeMap.set(k, v));
      gaitRes.forEach((v, k) => gaitMap.set(k, v));
    }

    // Combine reporter and verifier ids so we can fetch user info for both
    const allUserIds = new Set<string>([...userIds, ...verifiedByIds]);

    const [animalTypes, sexes, collarStatuses, colorPatterns, primaryColors, users] = await Promise.all([
      fetchLookup('animal_types', animalTypeIds, 'id,name'),
      fetchLookup('sexes', sexIds, 'id,name'),
      fetchLookup('collar_statuses', collarStatusIds, 'id,name'),
      fetchLookup('color_patterns', colorPatternIds, 'id,name'),
      fetchLookup('primary_colors', primaryColorIds, 'id,label'),
      fetchLookup('users', allUserIds, 'id,name,email')
    ]);

    const result = rows.map(r => {
      const at = animalTypes.get(String(r.animal_type_id));
      const sx = sexes.get(String(r.sex_id));
      const cs = collarStatuses.get(String(r.collar_status_id));
      const cp = colorPatterns.get(String(r.color_pattern_id));
      const pc = primaryColors.get(String(r.primary_color_id));
  const u = users.get(String(r.user_id));
  const verifier = users.get(String(r.verified_by));

      // Prefer association-table-derived labels; fall back to empty arrays
      const skinProblems: string[] = skinMap.get(String(r.id)) ?? [];
      const eyeProblems: string[] = eyeMap.get(String(r.id)) ?? [];
      const gaitProblems: string[] = gaitMap.get(String(r.id)) ?? [];

  return {
    id: r.id,
    user_id: r.user_id,
    user_email: u ? (u.email ?? null) : null,
    user_name: u ? (u.name ?? null) : null,
    photo_url: r.photo_url,
    spotted_date: r.spotted_date,
    spotted_time: r.spotted_time,
    latitude: r.latitude,
    longitude: r.longitude,
    animal_type: at ? (at.name ?? null) : null,
    sex: sx ? (sx.name ?? null) : null,
    collar_status: cs ? (cs.name ?? null) : null,
    color_pattern: cp ? (cp.name ?? null) : null,
    primary_color: pc ? (pc.label ?? null) : null,
    body_condition_score: r.body_condition_score,
    additional_notes: r.additional_notes,
    status: r.status,
    verified_by: r.verified_by,
    verified_by_email: verifier ? (verifier.email ?? null) : null,
    verified_by_name: verifier ? (verifier.name ?? null) : null,
    verified_at: r.verified_at,
    created_at: r.created_at,
    updated_at: r.updated_at,
  location_description: r.location_description,
  // gait_conditions, skin_conditions, eye_conditions
  gait_conditions: gaitMap.get(String(r.id)) ?? gaitProblems,
    skin_conditions: skinMap.get(String(r.id)) ?? skinProblems,
    eye_conditions: eyeMap.get(String(r.id)) ?? eyeProblems,
  };
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 });
  }
}
