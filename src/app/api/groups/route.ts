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

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient();
    const body = await req.json();

    const {
      name,
      description,
      animalType,
      sex,
      colorPattern,
      primaryColor,
      initialReportId,
      reportIds = [],
  } = body as Record<string, unknown>;

    // Helper to find lookup id by name/label
    async function findId(table: string, col: string, value?: string) {
      if (!value) return null;
      const { data, error } = await supabase.from(table).select('id').eq(col, value).limit(1).maybeSingle();
      if (error) throw error;
      return data ? String((data as Record<string, unknown>).id) : null;
    }

  const animal_type_id = await findId('animal_types', 'name', typeof animalType === 'string' ? animalType : undefined);
  const sex_id = await findId('sexes', 'name', typeof sex === 'string' ? sex : undefined);
  const color_pattern_id = await findId('color_patterns', 'name', typeof colorPattern === 'string' ? colorPattern : undefined);
  const primary_color_id = await findId('primary_colors', 'label', typeof primaryColor === 'string' ? primaryColor : undefined);

    // Compute report statistics if reportIds provided (or initialReportId)
    const ids = Array.isArray(reportIds) && reportIds.length > 0 ? reportIds : (initialReportId ? [initialReportId] : []);

    let firstSightedDate: string | null = null;
    let lastSightedDate: string | null = null;

    if (ids.length > 0) {
      const { data: rd, error: rdErr } = await supabase
        .from('stray_animal_reports')
        .select('spotted_date')
        .in('id', ids as string[]);
      if (rdErr) throw rdErr;
  const dates = (rd ?? []).map((r: Record<string, unknown>) => r.spotted_date).filter(Boolean).map((d: unknown) => new Date(String(d)).getTime());
      if (dates.length > 0) {
        firstSightedDate = new Date(Math.min(...dates)).toISOString().split('T')[0];
        lastSightedDate = new Date(Math.max(...dates)).toISOString().split('T')[0];
      }
    }

    // Create group
    const insertPayload: Record<string, unknown> = {
      name,
      description,
      animal_type_id,
      sex_id,
      color_pattern_id,
      primary_color_id,
      report_count: ids.length,
      first_sighted_date: firstSightedDate,
      last_sighted_date: lastSightedDate,
      created_at: new Date().toISOString(),
    };

    // Use cookie-backed server client and set created_by from the authenticated session
    const supabaseServer = await createServerClient();

    // Get user from session
    const { data: { user }, error: authErr } = await supabaseServer.auth.getUser();
    if (authErr) {
      throw authErr;
    }

    // Attach created_by to the payload so RLS policies that check auth.uid() will pass
    if (user?.id) {
      insertPayload.created_by = user.id;
    }

    const { data: created, error: createErr } = await supabaseServer.from('animal_groups').insert(insertPayload).select().limit(1).maybeSingle();
    if (createErr) throw createErr;
    const createdGroup = created as Record<string, unknown>;

    // If we have report ids, insert into group_reports and mark reports as grouped
    if (ids.length > 0) {
      const rows = ids.map((rid: string) => ({ group_id: createdGroup.id, report_id: rid }));
      const { error: grErr } = await supabaseServer.from('group_reports').insert(rows);
      if (grErr) throw grErr;

      const { error: updErr } = await supabaseServer.from('stray_animal_reports').update({ is_grouped: 'yes' }).in('id', ids);
      if (updErr) throw updErr;
    }

    // Return created group in similar shape as GET
    const result = {
      group_id: createdGroup.id,
      group_name: createdGroup.name,
      group_description: createdGroup.description,
      animal_type_id: createdGroup.animal_type_id,
      sex_id: createdGroup.sex_id,
      color_pattern_id: createdGroup.color_pattern_id,
      primary_color_id: createdGroup.primary_color_id,
      report_count: createdGroup.report_count ?? ids.length,
      first_sighted_date: createdGroup.first_sighted_date ?? firstSightedDate,
      last_sighted_date: createdGroup.last_sighted_date ?? lastSightedDate,
      group_created_by: createdGroup.created_by ?? null,
      group_created_at: createdGroup.created_at,
      group_updated_at: createdGroup.updated_at,
      report_ids: ids,
    };

    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || String(err) }, { status: 500 });
  }
}
