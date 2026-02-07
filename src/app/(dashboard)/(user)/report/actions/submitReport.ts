// Server actions for submitting stray animal reports
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { StrayAnimalReportInsert } from '@/types/database';
import type { AnimalType, Sex, CollarStatus } from '@/lib/constants/animalAttributes';
import type { HealthConditionId } from '@/lib/constants/healthConditions';

export interface ReportSubmissionData {
  // Photo
  photoUrl: string; // This should be uploaded to Supabase Storage first
  
  // Basic identification
  animalType: AnimalType;
  sex: Sex;
  collar: CollarStatus;
  
  // Physical attributes
  colorPattern: string;
  primaryColor: string;
  bodyConditionScore: number;
  
  // Health conditions (arrays of IDs)
  skinProblems: HealthConditionId[];
  eyeProblems: HealthConditionId[];
  gaitProblems: HealthConditionId[];
  
  // Notes
  additionalNotes?: string;
  
  // Location and time
  latitude: number;
  longitude: number;
  locationDescription: string;
  spottedDate: string; // YYYY-MM-DD
  spottedTime: string; // HH:MM
}

export interface ReportSubmissionResult {
  success: boolean;
  reportId?: string;
  error?: string;
}

/**
 * Submit a stray animal report to the database (create or update)
 * @param data - Report submission data
 * @param reportId - Optional report ID for updates (only pending reports can be updated)
 */
export async function submitReport(
  data: ReportSubmissionData,
  reportId?: string
): Promise<ReportSubmissionResult> {
  try {
    const isUpdate = Boolean(reportId);
    console.log(isUpdate ? `🔄 Starting report update for ID: ${reportId}` : '🚀 Starting report submission...');
    
    // Server-side validation
    if (!data.animalType || !data.sex || !data.collar) {
      return {
        success: false,
        error: 'Missing required fields: Animal Type, Sex, or Collar Status',
      };
    }

    if (!data.colorPattern || !data.primaryColor) {
      return {
        success: false,
        error: 'Missing required fields: Color Pattern or Primary Color',
      };
    }

    if (!data.bodyConditionScore || data.bodyConditionScore < 1 || data.bodyConditionScore > 9) {
      return {
        success: false,
        error: 'Invalid Body Condition Score',
      };
    }
    
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ Auth error:', authError);
      return {
        success: false,
        error: 'You must be logged in to submit a report',
      };
    }
    
    console.log('✅ User authenticated:', user.email);

    // If updating, verify report exists, user owns it, and it's still pending
    if (isUpdate) {
      const { data: existingReport, error: fetchError } = await supabase
        .from('stray_animal_reports')
        .select('user_id, status')
        .eq('id', reportId)
        .single();

      if (fetchError || !existingReport) {
        console.error('❌ Report not found:', fetchError);
        return {
          success: false,
          error: 'Report not found',
        };
      }

      if (existingReport.user_id !== user.id) {
        console.error('❌ Unauthorized: User does not own this report');
        return {
          success: false,
          error: 'You do not have permission to edit this report',
        };
      }

      if (existingReport.status !== 'pending') {
        console.error('❌ Cannot edit non-pending report');
        return {
          success: false,
          error: `Cannot edit reports with status: ${existingReport.status}`,
        };
      }

      console.log('✅ Report verified for update');
    }

    // Filter out 'none' conditions from arrays
    const skinProblems = data.skinProblems.filter(id => id !== 'skin-none');
    const eyeProblems = data.eyeProblems.filter(id => id !== 'eye-none');
    const gaitProblems = data.gaitProblems.filter(id => id !== 'gait-none');

    // Prepare report data - direct insert with arrays, no ID mappings!
    const reportData: StrayAnimalReportInsert = {
      user_id: user.id,
      photo_url: data.photoUrl,
      animal_type: data.animalType,
      sex: data.sex,
      collar_status: data.collar,
      color_pattern: data.colorPattern,
      primary_color: data.primaryColor,
      body_condition_score: data.bodyConditionScore,
      skin_problems: skinProblems,
      eye_problems: eyeProblems,
      gait_problems: gaitProblems,
      additional_notes: data.additionalNotes || null,
      spotted_date: data.spottedDate,
      spotted_time: data.spottedTime,
      latitude: data.latitude,
      longitude: data.longitude,
      location_description: data.locationDescription,
    };

    let report;
    let reportError;

    if (isUpdate) {
      // Update existing report
      console.log('💾 Updating report...');
      const result = await supabase
        .from('stray_animal_reports')
        .update(reportData)
        .eq('id', reportId)
        .select('id')
        .single();
      
      report = result.data;
      reportError = result.error;
    } else {
      // Insert new report
      console.log('💾 Inserting report...');
      const result = await supabase
        .from('stray_animal_reports')
        .insert(reportData)
        .select('id')
        .single();
      
      report = result.data;
      reportError = result.error;
    }

    if (reportError || !report) {
      console.error(`❌ Report ${isUpdate ? 'update' : 'submission'} error:`, reportError);
      return {
        success: false,
        error: reportError?.message || `Failed to ${isUpdate ? 'update' : 'submit'} report`,
      };
    }

    console.log(`✅ Report ${isUpdate ? 'updated' : 'created'} with ID:`, report.id);

    // Only update user's report count for new reports
    if (!isUpdate) {
      const { error: updateError } = await supabase.rpc('increment_user_reports', {
        p_user_id: user.id,
      });

      if (updateError) {
        // Non-critical error, log but don't fail the submission
        console.warn('⚠️ Failed to update user report count:', updateError);
      } else {
        console.log('✅ User report count updated');
      }
    }

    // Revalidate relevant pages
    revalidatePath('/user-dashboard');
    revalidatePath('/admin-dashboard');
    revalidatePath('/verify');
    
    console.log(`🎉 Report ${isUpdate ? 'update' : 'submission'} completed successfully!`);

    return {
      success: true,
      reportId: report.id,
    };
  } catch (error) {
    console.error('💥 Unexpected error submitting report:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Upload photo to Supabase Storage
 */
export async function uploadReportPhoto(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to upload photos',
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('report-photos') // Make sure this bucket exists in Supabase
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Photo upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('report-photos')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Unexpected error uploading photo:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while uploading the photo',
    };
  }
}
