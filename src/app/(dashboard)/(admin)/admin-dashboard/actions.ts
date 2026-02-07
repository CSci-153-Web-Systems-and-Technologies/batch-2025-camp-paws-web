'use server';

import { createClient } from '@/lib/supabase/server';

export interface AdminStats {
  totalReports: number;
  pendingReports: number;
  verifiedReports: number;
  rejectedReports: number;
  totalUsers: number;
  totalGroups: number;
  reportsThisWeek: number;
  reportsThisMonth: number;
}

export interface RecentReport {
  id: string;
  animal_type: string;
  status: string;
  spotted_date: string;
  spotted_time: string;
  user_name: string | null;
  user_email: string | null;
  created_at: string;
}

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
 * Fetch comprehensive admin statistics
 */
export async function fetchAdminStats(): Promise<{ data: AdminStats | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Fetch all reports count
    const { count: totalReports, error: totalError } = await supabase
      .from('stray_animal_reports')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Fetch pending reports count
    const { count: pendingReports, error: pendingError } = await supabase
      .from('stray_animal_reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) throw pendingError;

    // Fetch verified reports count
    const { count: verifiedReports, error: verifiedError } = await supabase
      .from('stray_animal_reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'verified');

    if (verifiedError) throw verifiedError;

    // Fetch rejected reports count
    const { count: rejectedReports, error: rejectedError } = await supabase
      .from('stray_animal_reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    if (rejectedError) throw rejectedError;

    // Fetch total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Fetch total groups count
    const { count: totalGroups, error: groupsError } = await supabase
      .from('animal_groups')
      .select('*', { count: 'exact', head: true });

    if (groupsError) throw groupsError;

    // Calculate date ranges
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch reports from this week
    const { count: reportsThisWeek, error: weekError } = await supabase
      .from('stray_animal_reports')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());

    if (weekError) throw weekError;

    // Fetch reports from this month
    const { count: reportsThisMonth, error: monthError } = await supabase
      .from('stray_animal_reports')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneMonthAgo.toISOString());

    if (monthError) throw monthError;

    return {
      data: {
        totalReports: totalReports || 0,
        pendingReports: pendingReports || 0,
        verifiedReports: verifiedReports || 0,
        rejectedReports: rejectedReports || 0,
        totalUsers: totalUsers || 0,
        totalGroups: totalGroups || 0,
        reportsThisWeek: reportsThisWeek || 0,
        reportsThisMonth: reportsThisMonth || 0,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch admin statistics',
    };
  }
}

/**
 * Fetch recent reports for activity feed
 */
export async function fetchRecentReports(limit = 10): Promise<{ data: RecentReport[] | null; error: string | null }> {
  try {
    // Use API route to bypass RLS issues
    const res = await fetch(`/api/admin/dashboard/recent-reports?limit=${limit}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch reports: ${res.status}`);
    }

    const json = await res.json();
    return {
      data: json.data || [],
      error: null,
    };
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch recent reports',
    };
  }
}
