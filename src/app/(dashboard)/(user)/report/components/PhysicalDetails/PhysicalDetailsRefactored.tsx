// Refactored PhysicalDetails component applying SOLID principles
'use client';

import { useState } from 'react';
import { FormData } from '../PhotoUpload/types/PhotoUploadTypes';
import { 
  PhysicalDetailsFormData, 
  FormValidationResult 
} from './types/PhysicalDetailsTypes';
import { PhysicalDetailsValidator } from './validation/PhysicalDetailsValidator';
import { PhysicalDetailsTransformer } from './transformers/PhysicalDetailsTransformer';
import AnimalTypeSelection from './sections/AnimalTypeSelection';
import SexSelection from './sections/SexSelection';
import CollarSelection from './sections/CollarSelection';
import BodyConditionSelection from './sections/BodyConditionSelection';
import ColorSelection from './sections/ColorSelection';
import HealthAssessment from './sections/HealthAssessment';
import NotesInput from './sections/NotesInput';
import ValidationFeedback from './feedback/ValidationFeedback';
import Button from '@/components/ui/Button';

interface PhysicalDetailsProps {
  data: FormData;
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

// Open/Closed Principle: This component is open for extension (new sections) 
// but closed for modification (core logic doesn't change)
export default function PhysicalDetailsRefactored({ data, onNext, onBack }: PhysicalDetailsProps) {
  // Single Responsibility: State management only
  const [formState, setFormState] = useState<PhysicalDetailsFormData>({
    animalType: data.animalType || '',
    sex: data.sex || '',
    collar: data.collar || '',
    bodyConditionScore: data.bodyConditionScore || null,
    colorPattern: data.colorPattern || '',
    primaryColor: data.primaryColor || '',
    physicalProblems: data.physicalProblems || [],
    notes: data.notes || '',
  });

  // Track which fields have been touched for validation
  const [touchedFields, setTouchedFields] = useState({
    animalType: false,
    sex: false,
    collar: false,
    bodyConditionScore: false,
    colorPattern: false,
    primaryColor: false,
  });

  // Dependency Inversion: Depend on abstractions, not concretions
  const validator = new PhysicalDetailsValidator();
  const transformer = new PhysicalDetailsTransformer();

  // Single Responsibility: Form validation
  const validation: FormValidationResult = validator.validate(formState);

  // Mark field as touched
  const markAsTouched = (field: keyof typeof touchedFields) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  // Single Responsibility: Handle field updates
  const updateFormField = <K extends keyof PhysicalDetailsFormData>(
    field: K, 
    value: PhysicalDetailsFormData[K]
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    // Mark as touched when user interacts
    if (field in touchedFields) {
      markAsTouched(field as keyof typeof touchedFields);
    }
  };

  // Single Responsibility: Form submission
  const handleSubmit = () => {
    if (validation.isValid) {
      const backendData = transformer.transform(formState);
      console.log('🚀 Backend-ready data:', backendData);
      onNext(backendData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">Physical Status</h2>
        <p className="text-sm sm:text-base text-[rgb(var(--color-text-secondary))] px-4">
          Describe the physical characteristics and condition of the animal.
        </p>
      </div>

      <div className="bg-[rgb(var(--color-surface))] rounded-lg border border-[rgb(var(--color-border))] p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        
        {/* Identification Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-3 sm:mb-4">Identification</h3>
          <div className="space-y-4 sm:space-y-6">
            
            {/* Liskov Substitution: All selection components follow the same interface */}
            <AnimalTypeSelection 
              selectedType={formState.animalType}
              onSelect={(type) => updateFormField('animalType', type)}
              error={validation.errors.animalType}
              touched={touchedFields.animalType}
            />
            
            <SexSelection 
              selectedSex={formState.sex}
              onSelect={(sex) => updateFormField('sex', sex)}
              error={validation.errors.sex}
              touched={touchedFields.sex}
            />
            
            <CollarSelection 
              selectedCollar={formState.collar}
              onSelect={(collar) => updateFormField('collar', collar)}
              error={validation.errors.collar}
              touched={touchedFields.collar}
            />
            
          </div>
        </div>

        {/* Physical Attributes Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-3 sm:mb-4">Physical Attributes</h3>
          <div className="space-y-6">
            
            <BodyConditionSelection 
              selectedScore={formState.bodyConditionScore}
              onSelect={(score) => updateFormField('bodyConditionScore', score)}
              animalType={formState.animalType}
              error={validation.errors.bodyConditionScore}
              touched={touchedFields.bodyConditionScore}
            />
            
            <ColorSelection 
              animalType={formState.animalType}
              selectedPattern={formState.colorPattern}
              selectedColor={formState.primaryColor}
              onPatternSelect={(pattern) => updateFormField('colorPattern', pattern)}
              onColorSelect={(color) => updateFormField('primaryColor', color)}
              patternError={validation.errors.colorPattern}
              colorError={validation.errors.primaryColor}
              patternTouched={touchedFields.colorPattern}
              colorTouched={touchedFields.primaryColor}
            />
            
          </div>
        </div>

        {/* Health Assessment Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-3 sm:mb-4">Health Assessment</h3>
          
          <HealthAssessment 
            selectedProblems={formState.physicalProblems}
            onProblemsChange={(problems) => updateFormField('physicalProblems', problems)}
          />
        </div>

        {/* Additional Notes Section */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-3 sm:mb-4">Additional Information</h3>
          
          <NotesInput 
            notes={formState.notes}
            onNotesChange={(notes) => updateFormField('notes', notes)}
          />
        </div>

        {/* Validation Feedback */}
        <ValidationFeedback validation={validation} />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            onClick={onBack}
            variant="secondary"
            size="lg"
          >
            Back
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={!validation.isValid}
            variant="primary"
            size="lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}