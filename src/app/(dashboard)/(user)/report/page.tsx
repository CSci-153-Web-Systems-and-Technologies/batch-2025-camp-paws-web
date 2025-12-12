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

export default function UserReportPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!finalData.photo || !finalData.location) {
      error('Missing required data');
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
        success('Report submitted successfully!');
        // Redirect to user dashboard after a brief delay
        setTimeout(() => {
          router.push('/user-dashboard');
        }, 1500);
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
    </div>
  );
}