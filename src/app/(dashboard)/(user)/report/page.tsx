'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from './components/StepIndicator';
import PhotoUploadRefactored from './components/PhotoUpload/PhotoUploadRefactored';
import { FormData } from './components/PhotoUpload/types/PhotoUploadTypes';
import PhysicalDetailsRefactored from './components/PhysicalDetails/PhysicalDetailsRefactored';
import LocationTimeRefactored from './components/LocationTime/LocationTimeRefactored';
import { submitReport, ReportSubmissionData } from './actions/submitReport';
import { uploadPhotoFromClient } from './utils/uploadPhoto';
import { useToast } from '@/hooks/useToast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ErrorModal from '@/components/ui/ErrorModal';
import { parseServerError, logError, checkNetworkStatus } from '@/lib/utils/errorHandler';

export default function UserReportPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ title: '', message: '', details: '', retryable: false });
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
    location: null,
    date: '',
    time: '',
    locationDescription: ''
  });

  // Handle photo upload (Step 1 → Step 2)
  const handlePhotoNext = (photo: File) => {
    setFormData({ ...formData, photo });
    setCurrentStep(2);
  };

  // Handle physical details (Step 2 → Step 3)
  const handlePhysicalNext = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
  };

  // Handle form submission (Step 3)
  const handleSubmit = async (finalData: FormData) => {
    // Check network status first
    if (!checkNetworkStatus()) {
      const networkError = parseServerError('Network error: No internet connection');
      setErrorDetails(networkError);
      setShowErrorModal(true);
      return;
    }

    // Validate all required fields
    if (!finalData.photo || !finalData.location) {
      error('Missing required data: Photo and location are required');
      return;
    }

    // Validate physical details are complete
    if (!finalData.animalType || !finalData.sex || !finalData.collar) {
      error('Please complete all required fields (Animal Type, Sex, Collar Status)');
      return;
    }

    if (!finalData.colorPattern || !finalData.primaryColor) {
      error('Please select both color pattern and primary color');
      return;
    }

    if (!finalData.bodyConditionScore) {
      error('Please select a body condition score');
      return;
    }

    setIsSubmitting(true);
    setLoadingProgress(0);

    try {
      // Step 1: Upload photo from client side (avoids 1MB server action limit)
      setLoadingMessage('Uploading photo');
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

      setLoadingProgress(50);

      // Step 2: Parse physical problems into categories
      setLoadingMessage('Processing report data');
      const skinProblems = finalData.physicalProblems.filter(p => p.startsWith('skin-'));
      const eyeProblems = finalData.physicalProblems.filter(p => p.startsWith('eye-'));
      const gaitProblems = finalData.physicalProblems.filter(p => p.startsWith('gait-'));

      setLoadingProgress(60);

      // Step 3: Prepare submission data
      const submissionData: ReportSubmissionData = {
        photoUrl: photoUploadResult.url,
        animalType: finalData.animalType as 'cat' | 'dog',
        sex: finalData.sex as 'male' | 'female',
        collar: finalData.collar as 'with' | 'without',
        colorPattern: finalData.colorPattern,
        primaryColor: finalData.primaryColor,
        bodyConditionScore: finalData.bodyConditionScore || 5,
        skinProblems: skinProblems.length > 0 ? skinProblems : ['skin-none'],
        eyeProblems: eyeProblems.length > 0 ? eyeProblems : ['eye-none'],
        gaitProblems: gaitProblems.length > 0 ? gaitProblems : ['gait-none'],
        additionalNotes: finalData.notes || undefined,
        latitude: finalData.location.lat,
        longitude: finalData.location.lng,
        locationDescription: finalData.locationDescription,
        spottedDate: finalData.date,
        spottedTime: finalData.time,
      };

      setLoadingProgress(70);

      // Step 4: Submit report
      setLoadingMessage('Submitting report');
      const result = await submitReport(submissionData);

      setLoadingProgress(100);

      if (result.success) {
        setIsSubmitting(false);
        setShowSuccessModal(true);
        success('Report submitted successfully!');
      } else {
        const submitError = parseServerError(result.error || 'Failed to submit report');
        logError('Report Submission', result.error);
        setErrorDetails(submitError);
        setShowErrorModal(true);
        setIsSubmitting(false);
      }
    } catch (err) {
      const unexpectedError = parseServerError(err);
      logError('Report Submission - Unexpected', err);
      setErrorDetails(unexpectedError);
      setShowErrorModal(true);
      setIsSubmitting(false);
    }
  };

  // Navigation functions
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Handle success modal close and redirect
  const handleSuccessModalClose = () => {
    console.log('Redirecting to user dashboard...');
    setShowSuccessModal(false);
    router.push('/user-dashboard');
  };

  // Handle error retry
  const handleErrorRetry = () => {
    setShowErrorModal(false);
    // Re-trigger submission with current form data
    handleSubmit(formData);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <StepIndicator currentStep={currentStep} />
        
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
            onBack={() => goToStep(1)}
          />
        )}
        
        {currentStep === 3 && (
          <LocationTimeRefactored 
            data={formData}
            onSubmit={handleSubmit}
            onBack={() => goToStep(2)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isLoading={isSubmitting}
        message={loadingMessage}
        progress={loadingProgress}
        submessage="Please don't close this window"
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorDetails.title}
        message={errorDetails.message}
        details={errorDetails.details}
        retryable={errorDetails.retryable}
        onRetry={errorDetails.retryable ? handleErrorRetry : undefined}
      />

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        size="sm"
        closeOnBackdropClick={false}
        closeOnEscape={false}
        showCloseButton={false}
      >
        <div className="text-center py-6">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
            Report Submitted!
          </h3>
          <p className="text-[rgb(var(--color-text-secondary))] mb-6">
            Thank you for helping stray animals in your community. Your report has been successfully submitted and will be reviewed by our team.
          </p>
          <Button
            onClick={handleSuccessModalClose}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>
      </Modal>
    </div>
  );
}