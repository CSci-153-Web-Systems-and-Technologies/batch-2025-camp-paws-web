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

export default function UserReportPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    // Validate all required fields
    if (!finalData.photo || !finalData.location) {
      error('Missing required data');
      return;
    }

    // Validate physical details are complete
    if (!finalData.animalType || !finalData.sex || !finalData.collar) {
      error('Please complete all required fields (Animal Type, Sex, Collar Status)');
      setIsSubmitting(false);
      return;
    }

    if (!finalData.colorPattern || !finalData.primaryColor) {
      error('Please select both color pattern and primary color');
      setIsSubmitting(false);
      return;
    }

    if (!finalData.bodyConditionScore) {
      error('Please select a body condition score');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload photo from client side (avoids 1MB server action limit)
      const photoUploadResult = await uploadPhotoFromClient(finalData.photo);
      
      if (!photoUploadResult.success || !photoUploadResult.url) {
        error(photoUploadResult.error || 'Failed to upload photo');
        setIsSubmitting(false);
        return;
      }

      // Step 2: Parse physical problems into categories
      const skinProblems = finalData.physicalProblems.filter(p => p.startsWith('skin-'));
      const eyeProblems = finalData.physicalProblems.filter(p => p.startsWith('eye-'));
      const gaitProblems = finalData.physicalProblems.filter(p => p.startsWith('gait-'));

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

      // Step 4: Submit report
      const result = await submitReport(submissionData);

      if (result.success) {
        setIsSubmitting(false);
        setShowSuccessModal(true);
        success('Report submitted successfully!');
      } else {
        error(result.error || 'Failed to submit report');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      error('An unexpected error occurred');
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