// Dependency Inversion: Abstract interface for report operations
import { Report } from '../types/VerifyTypes';

export interface ReportService {
  fetchPendingReports(): Promise<Report[]>;
  acceptReport(reportId: string): Promise<void>;
  rejectReport(reportId: string, reason: string): Promise<void>;
  updateReport(reportId: string, data: Partial<Report>): Promise<void>;
  warnUser(userId: string, reason: string): Promise<void>;
  suspendUser(userId: string, reason: string): Promise<void>;
  getUser(identifier: string): Promise<{ id?: string; name?: string; email?: string } | null>;
}

// Mock implementation for development
export class MockReportService implements ReportService {
  async fetchPendingReports(): Promise<Report[]> {
    // Return empty list for mock in order to avoid showing stale/demo data.
    await new Promise(resolve => setTimeout(resolve, 200));
    return [];
  }

  async acceptReport(reportId: string): Promise<void> {
    console.log('✅ Accepting report:', reportId);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async rejectReport(reportId: string, reason: string): Promise<void> {
    console.log('❌ Rejecting report:', reportId, 'Reason:', reason);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async updateReport(reportId: string, data: Partial<Report>): Promise<void> {
    console.log('✏️ Updating report:', reportId, data);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async warnUser(userId: string, reason: string): Promise<void> {
    console.log('⚠️ Warning user:', userId, 'Reason:', reason);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async suspendUser(userId: string, reason: string): Promise<void> {
    console.log('🚫 Suspending user:', userId, 'Reason:', reason);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getUser(identifier: string): Promise<{ id?: string; name?: string; email?: string } | null> {
    // Mock: return a simple normalized object
    if (!identifier) return null;
    if (identifier.includes('@')) {
      return { email: identifier, name: `User ${identifier.split('@')[0]}` };
    }
    return { id: identifier, name: `User ${identifier.slice(0, 6)}` };
  }
}

// Future Supabase implementation

// Future Supabase implementation
export class SupabaseReportService implements ReportService {
  async fetchPendingReports(): Promise<Report[]> {
    try {
      // Use server-proxied API to avoid client-side RLS issues.
      const res = await fetch('/api/admin/reports');
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const msg = payload?.error || `Failed to fetch reports: ${res.status}`;
        throw new Error(msg);
      }

      const json = await res.json();
      const rows = json.data ?? [];
      // Map DB rows to frontend Report objects
      const reports = (rows as unknown[]).map((row) => transformToReport(row));

      // Enrich reports with reporter name/email where possible by resolving
      // users on-demand. We fetch each unique identifier in parallel and
      // attach the resolved user info into the report objects. This ensures
      // the UI has the reporter name available immediately without needing
      // to open the details modal.
      const identifiers = new Set<string>();
      for (const r of reports) {
        if (r.reporterId) identifiers.add(r.reporterId);
        else if (r.reporterEmail) identifiers.add(r.reporterEmail);
      }

      if (identifiers.size > 0) {
        const entries = await Promise.all(
          [...identifiers].map(async (id) => [id, await this.getUser(id)] as const)
        );
        const userMap = new Map<string, { id?: string; name?: string; email?: string } | null>(entries);

        for (const rep of reports) {
          const id = rep.reporterId ?? rep.reporterEmail ?? undefined;
          if (!id) continue;
          const user = userMap.get(id) ?? null;
          if (user) {
            if (user.name) rep.reportedBy = user.name;
            if (user.email) rep.reporterEmail = user.email;
            if (user.id) rep.reporterId = user.id;
          }
        }
      }

      return reports;
    } catch (error) {
      console.error('Error fetching reports via proxy:', error);
      throw error;
    }
  }

  async acceptReport(reportId: string): Promise<void> {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    const { error } = await supabase
      .from('stray_animal_reports')
      .update({ status: 'verified', verified_at: new Date().toISOString() })
      .eq('id', reportId);

    if (error) throw error;
  }

  async rejectReport(reportId: string, reason: string): Promise<void> {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    // Here we mark as rejected; optionally keep for audit
    const { error } = await supabase
      .from('stray_animal_reports')
      .update({ status: 'rejected', rejection_reason: reason, rejected_at: new Date().toISOString() })
      .eq('id', reportId);

    if (error) throw error;
  }

  async updateReport(reportId: string, data: Partial<Report>): Promise<void> {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    const dbData = transformToDatabase(data);
    const { error } = await supabase
      .from('stray_animal_reports')
      .update(dbData)
      .eq('id', reportId);

    if (error) throw error;
  }

  async warnUser(userId: string, reason: string): Promise<void> {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    // Allow passing either user id or email. If email is provided, resolve to id first.
    const identifier = userId;
    let resolvedId: string | null = null;
    try {
      if (identifier.includes('@')) {
        const { data: userRow } = await supabase.from('users').select('id').eq('email', identifier).maybeSingle();
        const ur = userRow as Record<string, unknown> | null;
        resolvedId = (ur && (ur['id'] as string)) || null;
      } else {
        resolvedId = identifier;
      }
    } catch {
      // ignore lookup errors and proceed with identifier as-is
      resolvedId = identifier.includes('@') ? null : identifier;
    }

    // Increment warnings via RPC if available, otherwise insert a warning record
    if (resolvedId) {
      try {
        await supabase.rpc('increment_user_warnings', { user_id: resolvedId });
      } catch {
        await supabase.from('user_warnings').insert({ user_id: resolvedId, reason });
      }
    } else {
      // Fallback: insert by email if id not resolvable
      await supabase.from('user_warnings').insert({ user_email: identifier, reason });
    }
  }

  async suspendUser(userId: string, reason: string): Promise<void> {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    const identifier = userId;
    let resolvedId: string | null = null;
    try {
      if (identifier.includes('@')) {
        const { data: userRow } = await supabase.from('users').select('id').eq('email', identifier).maybeSingle();
        const ur = userRow as Record<string, unknown> | null;
        resolvedId = (ur && (ur['id'] as string)) || null;
      } else {
        resolvedId = identifier;
      }
    } catch {
      resolvedId = identifier.includes('@') ? null : identifier;
    }

    let res;
    if (resolvedId) {
      res = await supabase.from('users').update({ is_suspended: true, suspension_reason: reason }).eq('id', resolvedId);
    } else {
      // try by email
      res = await supabase.from('users').update({ is_suspended: true, suspension_reason: reason }).eq('email', identifier);
    }

    if (res.error) throw res.error;
  }

  async getUser(identifier: string): Promise<{ id?: string; name?: string; email?: string } | null> {
    if (!identifier) return null;
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    try {
      if (identifier.includes('@')) {
        const { data, error } = await supabase.from('users').select('id, full_name, name, email').eq('email', identifier).maybeSingle();
        if (error) throw error;
        if (!data) return null;
        const d = data as Record<string, unknown>;
        const name = (typeof d['full_name'] === 'string' && d['full_name']) || (typeof d['name'] === 'string' && d['name']) || undefined;
        return { id: typeof d['id'] === 'string' ? (d['id'] as string) : undefined, name, email: typeof d['email'] === 'string' ? (d['email'] as string) : undefined };
      } else {
        const { data, error } = await supabase.from('users').select('id, full_name, name, email').eq('id', identifier).maybeSingle();
        if (error) throw error;
        if (!data) return null;
        const d = data as Record<string, unknown>;
        const name = (typeof d['full_name'] === 'string' && d['full_name']) || (typeof d['name'] === 'string' && d['name']) || undefined;
        return { id: typeof d['id'] === 'string' ? (d['id'] as string) : undefined, name, email: typeof d['email'] === 'string' ? (d['email'] as string) : undefined };
      }
    } catch (err) {
      console.error('getUser error:', err);
      return null;
    }
  }
}

// Mock data removed — production/dev should query real DB via Supabase.

// Factory function
export function getReportService(): ReportService {
  const USE_SUPABASE = true; // Frontend now connects to backend for verify reports
  return USE_SUPABASE ? new SupabaseReportService() : new MockReportService();
}

// Transform DB row to frontend Report type
function transformToReport(row: unknown): Report {
  const r = row as Record<string, unknown>;
  const users = (r.users as Record<string, unknown> | undefined) ?? undefined;
  const usersName = users ? (users['name'] as string | undefined) : undefined;
  const usersEmail = users ? (users['email'] as string | undefined) : undefined;

  return {
    id: r.id,
    photoUrl: r.photo_url || r.photoUrl || r.photo || '/placeholder.jpg',
    animalType: r.animal_type || r.animalType || 'dog',
    sex: r.sex || 'unknown',
    collar: r.collar || 'unknown',
    colorPattern: r.color_pattern || r.colorPattern || 'solid',
    primaryColor: r.primary_color || r.primaryColor || '',
    bodyConditionScore: r.body_condition_score || r.bodyConditionScore || 5,
    physicalProblems: r.physical_problems || r.physicalProblems || [],
    notes: r.notes || '',
    latitude: Number(r.latitude) || 0,
    longitude: Number(r.longitude) || 0,
    locationDescription: r.location_description || r.locationDescription || '',
    spottedDate: r.spotted_date || r.spottedDate || '',
    spottedTime: r.spotted_time || r.spottedTime || '',
  reportedBy: usersName || (r.reported_by as string) || (r.reportedBy as string) || '',
  reporterEmail: usersEmail || (r.reporter_email as string) || (r.reporterEmail as string) || '',
    reporterId: (r.reported_by as string) || (r.reportedBy as string) || (r.reporter_id as string) || undefined,
    reportsSubmitted: r.reports_submitted || r.reportsSubmitted || 0,
    warnings: r.warnings || 0,
    status: r.status || 'pending',
    createdAt: r.created_at || r.createdAt || new Date().toISOString(),
  } as Report;
}

// Transform frontend partial Report to DB columns (snake_case)
function transformToDatabase(data: Partial<Report>): Record<string, unknown> {
  const db: Record<string, unknown> = {};
  if (data.photoUrl !== undefined) db.photo_url = data.photoUrl;
  if (data.animalType !== undefined) db.animal_type = data.animalType;
  if (data.sex !== undefined) db.sex = data.sex;
  if (data.collar !== undefined) db.collar = data.collar;
  if (data.colorPattern !== undefined) db.color_pattern = data.colorPattern;
  if (data.primaryColor !== undefined) db.primary_color = data.primaryColor;
  if (data.bodyConditionScore !== undefined) db.body_condition_score = data.bodyConditionScore;
  if (data.physicalProblems !== undefined) db.physical_problems = data.physicalProblems;
  if (data.notes !== undefined) db.notes = data.notes;
  if (data.latitude !== undefined) db.latitude = data.latitude;
  if (data.longitude !== undefined) db.longitude = data.longitude;
  if (data.locationDescription !== undefined) db.location_description = data.locationDescription;
  if (data.spottedDate !== undefined) db.spotted_date = data.spottedDate;
  if (data.spottedTime !== undefined) db.spotted_time = data.spottedTime;
  if (data.reportedBy !== undefined) db.reported_by = data.reportedBy;
  if (data.reporterEmail !== undefined) db.reporter_email = data.reporterEmail;
  if (data.reportsSubmitted !== undefined) db.reports_submitted = data.reportsSubmitted;
  if (data.warnings !== undefined) db.warnings = data.warnings;
  if (data.status !== undefined) db.status = data.status;
  return db;
}
