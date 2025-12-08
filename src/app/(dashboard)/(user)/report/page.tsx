'use client';
import { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import PhotoUploadRefactored from './components/PhotoUpload/PhotoUploadRefactored';
import { FormData } from './components/PhotoUpload/types/PhotoUploadTypes';
import PhysicalDetailsRefactored from './components/PhysicalDetails/PhysicalDetailsRefactored';
import LocationTimeRefactored from './components/LocationTime/LocationTimeRefactored';

export default function UserReportPage() {
  const [currentStep, setCurrentStep] = useState(1);
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
    locationDescription: '',
    locationNotes: ''
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
  const handleSubmit = (finalData: FormData) => {
    console.log('Form submitted:', finalData);
    // TODO: Submit to API
    alert('Report submitted successfully!');
  };

  // Navigation functions
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
          />
        )}
      </div>
    </div>
  );
}