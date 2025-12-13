import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerClient();

    // Fetch groups
    const { data: groups, error: groupsError } = await supabase
      .from('animal_groups')
      .select('*')
      .order('last_sighted_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (groupsError) {
      return NextResponse.json({ error: groupsError.message || String(groupsError) }, { status: 500 });
    }

    const rows = (groups ?? []) as Array<Record<string, unknown>>;

    const groupIds = new Set<string>();
    const animalTypeIds = new Set<string>();
    const sexIds = new Set<string>();
    const colorPatternIds = new Set<string>();
    const primaryColorIds = new Set<string>();
    const creatorIds = new Set<string>();

    for (const g of rows) {
      if (g.id) groupIds.add(String(g.id));
      if (g.animal_type_id) animalTypeIds.add(String(g.animal_type_id));
      if (g.sex_id) sexIds.add(String(g.sex_id));
      if (g.color_pattern_id) colorPatternIds.add(String(g.color_pattern_id));
      if (g.primary_color_id) primaryColorIds.add(String(g.primary_color_id));
      if (g.created_by) creatorIds.add(String(g.created_by));
    }

    async function fetchLookup(table: string, ids: Set<string>, cols = 'id,name') {
      if (ids.size === 0) return new Map<string, Record<string, unknown>>();
      const { data, error } = await supabase.from(table).select(cols).in('id', [...ids]);
      if (error) throw error;
      const map = new Map<string, Record<string, unknown>>();
      ((data ?? []) as unknown as Array<Record<string, unknown>>).forEach(d => map.set(String(d.id), d));
      return map;
    }

    const [animalTypes, sexes, colorPatterns, primaryColors, creators] = await Promise.all([
      fetchLookup('animal_types', animalTypeIds, 'id,name'),
      fetchLookup('sexes', sexIds, 'id,name'),
      fetchLookup('color_patterns', colorPatternIds, 'id,name'),
      fetchLookup('primary_colors', primaryColorIds, 'id,label'),
      fetchLookup('users', creatorIds, 'id,name,email')
    ]);

    // Fetch group_reports rows to aggregate report_ids per group
  const groupReportsMap = new Map<string, string[]>();
    if (groupIds.size > 0) {
      const { data: grData, error: grError } = await supabase
        .from('group_reports')
        .select('group_id, report_id')
        .in('group_id', [...groupIds])
        .order('report_id', { ascending: true });
      if (grError) throw grError;
      ((grData ?? []) as Array<Record<string, unknown>>).forEach((row) => {
        const gid = String(row.group_id);
        const rid = String(row.report_id);
        const arr = groupReportsMap.get(gid) ?? [];
        arr.push(rid);
        groupReportsMap.set(gid, arr);
      });
    }

    const result = rows.map(g => {
      const at = animalTypes.get(String(g.animal_type_id));
      const sx = sexes.get(String(g.sex_id));
      const cp = colorPatterns.get(String(g.color_pattern_id));
      const pc = primaryColors.get(String(g.primary_color_id));
      const creator = creators.get(String(g.created_by));

      return {
        group_id: g.id,
        group_name: g.name,
        group_description: g.description,
        animal_type_id: g.animal_type_id,
        animal_type: at ? (at.name ?? null) : null,
        sex_id: g.sex_id,
        sex: sx ? (sx.name ?? null) : null,
        color_pattern_id: g.color_pattern_id,
        color_pattern: cp ? (cp.name ?? null) : null,
        primary_color_id: g.primary_color_id,
        primary_color: pc ? (pc.label ?? null) : null,
        report_count: g.report_count,
        first_sighted_date: g.first_sighted_date,
        last_sighted_date: g.last_sighted_date,
        group_created_by: g.created_by,
        creator_name: creator ? (creator.name ?? null) : null,
        creator_email: creator ? (creator.email ?? null) : null,
        group_created_at: g.created_at,
        group_updated_at: g.updated_at,
        report_ids: groupReportsMap.get(String(g.id)) ?? [],
      };
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 });
  }
}
