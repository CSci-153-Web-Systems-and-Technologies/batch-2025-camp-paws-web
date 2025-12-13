/**
 * Client-side utility for uploading photos to Supabase Storage
 * This avoids the 1MB server action body limit by uploading directly from the client
 */

import { createClient } from '@/lib/supabase/client';

export interface PhotoUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a photo file to Supabase Storage from the client side
 * @param file - The File object to upload
 * @returns Result with success status, URL, or error message
 */
export async function uploadPhotoFromClient(
  file: File
): Promise<PhotoUploadResult> {
  try {
    const supabase = createClient();
    
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

    // Upload to Supabase Storage from client
    const { error: uploadError } = await supabase.storage
      .from('report-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Photo upload error:', uploadError);
      return {
        success: false,
        error: uploadError.message,
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
