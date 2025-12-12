// Server actions for submitting stray animal reports
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ReportSubmissionData {
  // Photo
  photoUrl: string; // This should be uploaded to Supabase Storage first
  
  // Basic identification
  animalType: 'cat' | 'dog';
  sex: 'male' | 'female';
  collar: 'with' | 'without';
  
  // Physical attributes
  colorPattern: string;
  primaryColor: string;
  bodyConditionScore: number;
  
  // Health conditions
  skinProblems: string[];
  eyeProblems: string[];
  gaitProblems: string[];
  
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
 * Submit a stray animal report to the database
 */
export async function submitReport(
  data: ReportSubmissionData
): Promise<ReportSubmissionResult> {
  try {
    console.log('🚀 Starting report submission...');
    console.log('📋 Data received:', data);
    
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

    // Map frontend values to database IDs
    const animalTypeId = data.animalType === 'cat' ? 'cat' : 'dog';
    const sexId = data.sex === 'male' ? 'male' : 'female';
    const collarStatusId = data.collar === 'with' ? 'collar-with' : 'collar-without';

    console.log('📝 Mapped IDs:', { animalTypeId, sexId, collarStatusId });

    // Insert main report
    console.log('💾 Inserting main report...');
    const { data: report, error: reportError } = await supabase
      .from('stray_animal_reports')
      .insert({
        user_id: user.id,
        photo_url: data.photoUrl,
        animal_type_id: animalTypeId,
        sex_id: sexId,
        collar_status_id: collarStatusId,
        color_pattern_id: data.colorPattern,
        primary_color_id: data.primaryColor,
        body_condition_score: data.bodyConditionScore,
        additional_notes: data.additionalNotes || null,
        spotted_date: data.spottedDate,
        spotted_time: data.spottedTime,
        latitude: data.latitude,
        longitude: data.longitude,
        location_description: data.locationDescription,
        status: 'pending', // Default status
      })
      .select('id')
      .single();

    if (reportError || !report) {
      console.error('❌ Report submission error:', reportError);
      return {
        success: false,
        error: reportError?.message || 'Failed to submit report',
      };
    }

    const reportId = report.id;
    console.log('✅ Main report created with ID:', reportId);

    // Insert skin conditions
    if (data.skinProblems.length > 0) {
      console.log('🩹 Processing skin conditions:', data.skinProblems);
      const skinConditions = data.skinProblems
        .filter(problem => problem !== 'skin-none')
        .map(conditionId => ({
          report_id: reportId,
          condition_id: conditionId,
        }));

      if (skinConditions.length > 0) {
        console.log('💾 Inserting skin conditions:', skinConditions);
        const { error: skinError } = await supabase
          .from('report_skin_conditions')
          .insert(skinConditions);

        if (skinError) {
          console.error('⚠️ Skin conditions insert error:', skinError);
        } else {
          console.log('✅ Skin conditions inserted');
        }
      }
    }

    // Insert eye conditions
    if (data.eyeProblems.length > 0) {
      console.log('👁️ Processing eye conditions:', data.eyeProblems);
      const eyeConditions = data.eyeProblems
        .filter(problem => problem !== 'eye-none')
        .map(conditionId => ({
          report_id: reportId,
          condition_id: conditionId,
        }));

      if (eyeConditions.length > 0) {
        console.log('💾 Inserting eye conditions:', eyeConditions);
        const { error: eyeError } = await supabase
          .from('report_eye_conditions')
          .insert(eyeConditions);

        if (eyeError) {
          console.error('⚠️ Eye conditions insert error:', eyeError);
        } else {
          console.log('✅ Eye conditions inserted');
        }
      }
    }

    // Insert gait conditions
    if (data.gaitProblems.length > 0) {
      console.log('🚶 Processing gait conditions:', data.gaitProblems);
      const gaitConditions = data.gaitProblems
        .filter(problem => problem !== 'gait-none')
        .map(conditionId => ({
          report_id: reportId,
          condition_id: conditionId,
        }));

      if (gaitConditions.length > 0) {
        console.log('💾 Inserting gait conditions:', gaitConditions);
        const { error: gaitError } = await supabase
          .from('report_gait_conditions')
          .insert(gaitConditions);

        if (gaitError) {
          console.error('⚠️ Gait conditions insert error:', gaitError);
        } else {
          console.log('✅ Gait conditions inserted');
        }
      }
    }

    // Update user's report count
    const { error: updateError } = await supabase.rpc('increment', {
      table_name: 'users',
      row_id: user.id,
      column_name: 'reports_submitted',
    });

    if (updateError) {
      // Non-critical error, log but don't fail the submission
      console.warn('⚠️ Failed to update user report count:', updateError);
    } else {
      console.log('✅ User report count updated');
    }

    // Revalidate relevant pages
    revalidatePath('/user-dashboard');
    revalidatePath('/admin-dashboard');
    revalidatePath('/verify');
    
    console.log('🎉 Report submission completed successfully!');
    console.log('📊 Final Report ID:', reportId);

    return {
      success: true,
      reportId,
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
