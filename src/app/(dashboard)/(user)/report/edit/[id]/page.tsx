'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import PhotoUploadRefactored from '../../components/PhotoUpload/PhotoUploadRefactored';
import PhysicalDetailsRefactored from '../../components/PhysicalDetails/PhysicalDetailsRefactored';
import LocationTimeRefactored from '../../components/LocationTime/LocationTimeRefactored';
import { FormData } from '../../components/PhotoUpload/types/PhotoUploadTypes';
import { submitReport, type ReportSubmissionData } from '../../actions/submitReport';
import { uploadPhotoFromClient } from '../../utils/uploadPhoto';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ErrorModal from '@/components/ui/ErrorModal';
import { parseServerError, logError, checkNetworkStatus, ParsedError } from '@/lib/utils/errorHandler';
import { fetchReportById } from '@/app/(dashboard)/(user)/user-dashboard/actions';

export default function EditReportPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params?.id as string;
  const { success, error } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ParsedError>({ title: '', message: '', retryable: false });
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string>(''); // Track existing photo URL
  
  const [formData, setFormData] = useState<FormData>({
    photo: null,
    animalType: '',
    sex: '',
    collar: '',
    colorPattern: '',
    primaryColor: '',
    bodyConditionScore: null,
    physicalProblems: [],
    notes: '',
    physicalNotes: '',
    location: null,
    date: '',
    time: '',
    locationDescription: ''
  });

  // Fetch existing report data
  useEffect(() => {
    const loadReport = async () => {
      setIsLoading(true);
      setLoadingMessage('Loading report data');

      try {
        const { data: report, error: fetchError } = await fetchReportById(reportId);

        if (fetchError || !report) {
          throw new Error(fetchError || 'Report not found');
        }

        // Check if report is editable (pending only)
        if (report.status !== 'pending') {
          error('Only pending reports can be edited');
          router.push('/user-dashboard');
          return;
        }

        // Store existing photo URL
        setExistingPhotoUrl(report.photo_url || '');

        // Pre-populate form data
        setFormData({
          photo: null, // Photo URL will be preserved, but user can optionally change it
          animalType: report.animal_type || '',
          sex: report.sex || '',
          collar: report.collar_status || '',
          colorPattern: report.color_pattern || '',
          primaryColor: report.primary_color || '',
          bodyConditionScore: report.body_condition_score || null,
          physicalProblems: [
            ...(report.skin_problems || []),
            ...(report.eye_problems || []),
            ...(report.gait_problems || [])
          ],
          notes: report.additional_notes || '',
          physicalNotes: report.physical_additional_notes || '',
          location: report.latitude && report.longitude ? {
            lat: report.latitude,
            lng: report.longitude
          } : null,
          date: report.spotted_date || '',
          time: report.spotted_time || '',
          locationDescription: report.location_description || ''
        });

        setIsLoading(false);
      } catch (err) {
        const parsedError = parseServerError(err);
        logError('Edit Report - Load', err);
        setErrorDetails(parsedError);
        setShowErrorModal(true);
        setIsLoading(false);
      }
    };

    if (reportId) {
      loadReport();
    }
  }, [reportId, router, error]);

  const handlePhotoNext = (photo: File) => {
    setFormData({ ...formData, photo });
    setCurrentStep(2);
  };

  const handlePhysicalNext = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
  };

  const handleSubmit = async (finalData: FormData) => {
    // Check network status first
    if (!checkNetworkStatus()) {
      const networkError = parseServerError('Network error: No internet connection');
      setErrorDetails(networkError);
      setShowErrorModal(true);
      return;
    }

    // Validate location
    if (!finalData.location || !finalData.location.lat || !finalData.location.lng) {
      error('Please select a location on the map');
      return;
    }

    setIsSubmitting(true);
    setLoadingProgress(0);

    try {
      let photoUrl = existingPhotoUrl; // Keep existing photo URL by default

      // Only upload a new photo if one was provided
      if (finalData.photo) {
        setLoadingMessage('Uploading new photo');
        setLoadingProgress(20);
        
        const photoUploadResult = await uploadPhotoFromClient(finalData.photo);
        
        if (!photoUploadResult.success || !photoUploadResult.url) {
          const uploadError = parseServerError(photoUploadResult.error || 'Failed to upload photo');
          logError('Photo Upload', photoUploadResult.error);
          setErrorDetails(uploadError);
          setShowErrorModal(true);
          setIsSubmitting(false);
          return;
        }

        photoUrl = photoUploadResult.url;
        setLoadingProgress(40);
      } else {
        setLoadingProgress(40);
      }

      // Process physical problems into categories
      setLoadingMessage('Processing report data');
      const skinProblems = finalData.physicalProblems.filter(p => p.startsWith('skin-'));
      const eyeProblems = finalData.physicalProblems.filter(p => p.startsWith('eye-'));
      const gaitProblems = finalData.physicalProblems.filter(p => p.startsWith('gait-'));

      setLoadingProgress(60);

      // Prepare submission data
      const submissionData: ReportSubmissionData = {
        photoUrl,
        animalType: finalData.animalType as 'cat' | 'dog',
        sex: finalData.sex as 'male' | 'female',
        collar: finalData.collar as 'with' | 'without',
        colorPattern: finalData.colorPattern,
        primaryColor: finalData.primaryColor,
        bodyConditionScore: finalData.bodyConditionScore || 5,
        skinProblems: skinProblems.length > 0 ? skinProblems : ['skin-none'],
        eyeProblems: eyeProblems.length > 0 ? eyeProblems : ['eye-none'],
        gaitProblems: gaitProblems.length > 0 ? gaitProblems : ['gait-none'],
        physicalAdditionalNotes: finalData.physicalNotes || undefined,
        additionalNotes: finalData.notes || undefined,
        latitude: finalData.location.lat,
        longitude: finalData.location.lng,
        locationDescription: finalData.locationDescription,
        spottedDate: finalData.date,
        spottedTime: finalData.time,
      };

      setLoadingProgress(70);

      // Submit updated report with report ID
      setLoadingMessage('Updating report');
      const result = await submitReport(submissionData, reportId);

      setLoadingProgress(100);
      setLoadingMessage('Report updated successfully!');

      if (result.success) {
        success('Report updated successfully!');
        setTimeout(() => {
          router.push('/user-dashboard');
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to update report');
      }
    } catch (err) {
      const submitError = parseServerError(err);
      logError('Edit Report - Submit', err);
      setErrorDetails(submitError);
      setShowErrorModal(true);
      setIsSubmitting(false);
      setLoadingProgress(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/user-dashboard');
    }
  };

  const handleErrorRetry = () => {
    setShowErrorModal(false);
    if (errorDetails.retryable) {
      handleSubmit(formData);
    }
  };

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
            Edit Report
          </h1>
          <p className="text-[rgb(var(--color-text-secondary))]">
            Update your pending report details
          </p>
        </div>

        {!isLoading && (
          <>
            {currentStep === 1 && (
              <PhotoUploadRefactored
                data={formData}
                onNext={handlePhotoNext}
              />
            )}

            {currentStep === 2 && (
              <PhysicalDetailsRefactored
                data={formData}
                onNext={handlePhysicalNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <LocationTimeRefactored
                data={formData}
                onSubmit={handleSubmit}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}
          </>
        )}
      </div>

      <LoadingOverlay
        isLoading={isLoading || isSubmitting}
        message={loadingMessage || 'Loading...'}
        progress={loadingProgress}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorDetails.title}
        message={errorDetails.message}
        details={errorDetails.details}
        retryable={errorDetails.retryable}
        onRetry={errorDetails.retryable ? handleErrorRetry : undefined}
      />
    </>
  );
}
