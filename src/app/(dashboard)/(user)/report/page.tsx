'use client';
import { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import PhotoUpload, { FormData } from './components/PhotoUpload';
import PhysicalDetails from './components/PhysicalDetails';
import LocationTime from './components/LocationTime';

export default function UserReportPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    photo: null,
    animalType: '',
    sex: '',
    color: '',
    bodyCondition: '',
    physicalProblems: [],
    notes: '',
    location: null,
    date: '',
    time: ''
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
          <PhotoUpload 
            data={formData}
            onNext={handlePhotoNext}
          />
        )}
        
        {currentStep === 2 && (
          <PhysicalDetails 
            data={formData}
            onNext={handlePhysicalNext}
            onBack={() => goToStep(1)}
          />
        )}
        
        {currentStep === 3 && (
          <LocationTime 
            data={formData}
            onSubmit={handleSubmit}
            onBack={() => goToStep(2)}
          />
        )}
      </div>
    </div>
  );
}