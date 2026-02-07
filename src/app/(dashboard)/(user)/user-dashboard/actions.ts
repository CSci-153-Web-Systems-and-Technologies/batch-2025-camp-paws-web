'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface UserReport {
  id: string;
  animal_type: string;
  sex: string;
  status: 'pending' | 'verified' | 'rejected';
  spotted_date: string;
  spotted_time: string;
  location_description: string;
  photo_url: string;
  created_at: string;
  rejection_reason?: string | null;
  // Full details for editing
  collar_status?: string;
  color_pattern?: string;
  primary_color?: string;
  body_condition_score?: number;
  skin_problems?: string[];
  eye_problems?: string[];
  gait_problems?: string[];
  physical_additional_notes?: string | null;
  additional_notes?: string | null;
  latitude?: number;
  longitude?: number;
  user_name?: string | null;
  user_email?: string | null;
}

interface ReportWithUser {
  users: {
    name: string | null;
    email: string;
  } | null;
}

/**
 * Fetch all reports for the current user
 */
export async function fetchUserReports(): Promise<{ data: UserReport[] | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: 'Not authenticated' };
    }

    // Fetch user's reports
    const { data: reports, error: reportsError } = await supabase
      .from('stray_animal_reports')
      .select(`
        id,
        animal_type,
        sex,
        status,
        spotted_date,
        spotted_time,
        location_description,
        photo_url,
        created_at,
        rejection_reason
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (reportsError) {
      console.error('Error fetching reports:', reportsError);
      return { data: null, error: reportsError.message };
    }

    return { data: reports as UserReport[], error: null };
  } catch (error) {
    console.error('Unexpected error fetching reports:', error);
    return { data: null, error: 'Failed to fetch reports' };
  }
}

/**
 * Fetch a single report by ID (for viewing/editing)
 */
export async function fetchReportById(reportId: string): Promise<{ data: UserReport | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: 'Not authenticated' };
    }

    // Fetch the specific report with user information
    const { data: report, error: reportError } = await supabase
      .from('stray_animal_reports')
      .select(`
        *,
        users!stray_animal_reports_user_id_fkey(
          name,
          email
        )
      `)
      .eq('id', reportId)
      .eq('user_id', user.id) // Ensure user owns this report
      .single();

    if (reportError) {
      console.error('Error fetching report:', reportError);
      return { data: null, error: reportError.message };
    }

    if (!report) {
      return { data: null, error: 'Report not found' };
    }

    // Transform the joined user data
    const transformedReport = {
      ...report,
      user_name: (report as unknown as ReportWithUser).users?.name || null,
      user_email: (report as unknown as ReportWithUser).users?.email || null,
    };
    delete (transformedReport as Record<string, unknown>).users;

    return { data: transformedReport as UserReport, error: null };
  } catch (error) {
    console.error('Unexpected error fetching report:', error);
    return { data: null, error: 'Failed to fetch report' };
  }
}

/**
 * Delete a pending report
 */
export async function deleteReport(reportId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // First, verify the report belongs to the user and is pending
    const { data: report, error: fetchError } = await supabase
      .from('stray_animal_reports')
      .select('status')
      .eq('id', reportId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !report) {
      return { success: false, error: 'Report not found or access denied' };
    }

    if (report.status !== 'pending') {
      return { success: false, error: 'Only pending reports can be deleted' };
    }

    // Delete the report
    const { error: deleteError } = await supabase
      .from('stray_animal_reports')
      .delete()
      .eq('id', reportId)
      .eq('user_id', user.id); // Double-check ownership

    if (deleteError) {
      console.error('Error deleting report:', deleteError);
      return { success: false, error: deleteError.message };
    }

    // Revalidate the dashboard page
    revalidatePath('/user-dashboard');

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error deleting report:', error);
    return { success: false, error: 'Failed to delete report' };
  }
}
