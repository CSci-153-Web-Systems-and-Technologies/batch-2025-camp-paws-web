import { FormData } from './PhotoUpload';
import Image from 'next/image';
import { useState } from 'react';

interface PhysicalDetailsProps {
  data: FormData;
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

export default function PhysicalDetails({ data, onNext, onBack }: PhysicalDetailsProps) {
  // Local state for form fields
  const [formState, setFormState] = useState({
    animalType: data.animalType,
    sex: data.sex,
    collar: data.collar,
    bodyConditionScore: data.bodyConditionScore,
    colorPattern: data.colorPattern,
    primaryColor: data.primaryColor,
    physicalProblems: data.physicalProblems || [],
    notes: data.notes || '',
  });

  // Handle animal type selection
  const handleAnimalTypeSelect = (type: string) => {
    setFormState({ ...formState, animalType: type });
  };

  // Handle sex selection
  const handleSexSelect = (sex: string) => {
    setFormState({ ...formState, sex });
  };

  // Handle collar selection
  const handleCollarSelect = (collar: string) => {
    setFormState({ ...formState, collar });
  };

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    const hasSkinAssessment = formState.physicalProblems.some(problem => problem.startsWith('skin-'));
    const hasEyeAssessment = formState.physicalProblems.some(problem => problem.startsWith('eye-'));
    const hasGaitAssessment = formState.physicalProblems.some(problem => problem.startsWith('gait-'));

    return (
      formState.animalType && // Animal type must be selected
      formState.sex && // Sex must be selected
      formState.collar && // Collar status must be selected
      formState.bodyConditionScore !== null && // Body condition score must be selected
      formState.colorPattern && // Color pattern must be selected
      formState.primaryColor && // Primary color must be selected
      hasSkinAssessment && // At least one skin problem option must be selected
      hasEyeAssessment && // At least one eye problem option must be selected
      hasGaitAssessment // At least one gait problem option must be selected
    );
  };

  // Get list of missing required fields for user feedback
  const getMissingFields = () => {
    const missing = [];
    if (!formState.animalType) missing.push('Animal Type (Dog or Cat)');
    if (!formState.sex) missing.push('Sex (Male or Female)');
    if (!formState.collar) missing.push('Collar Status (With or Without)');
    if (formState.bodyConditionScore === null) missing.push('Body Condition Score (1, 3, 5, 7, or 9)');
    if (!formState.colorPattern) missing.push('Color Pattern');
    if (!formState.primaryColor) missing.push('Primary Color');
    
    // Check each physical assessment category
    const hasSkinAssessment = formState.physicalProblems.some(problem => problem.startsWith('skin-'));
    const hasEyeAssessment = formState.physicalProblems.some(problem => problem.startsWith('eye-'));
    const hasGaitAssessment = formState.physicalProblems.some(problem => problem.startsWith('gait-'));
    
    if (!hasSkinAssessment) missing.push('Skin Problems Assessment');
    if (!hasEyeAssessment) missing.push('Eye Problems Assessment');
    if (!hasGaitAssessment) missing.push('Gait Problems Assessment');
    
    return missing;
  };

  // Format data for backend submission (Supabase/API ready)
  const formatForBackend = () => {
    const skinProblems = formState.physicalProblems.filter(p => p.startsWith('skin-'));
    const eyeProblems = formState.physicalProblems.filter(p => p.startsWith('eye-'));
    const gaitProblems = formState.physicalProblems.filter(p => p.startsWith('gait-'));

    return {
      // Basic identification
      animal_type: formState.animalType, // 'cat' | 'dog'
      sex: formState.sex, // 'male' | 'female'
      collar_status: formState.collar, // 'with' | 'without'
      
      // Physical attributes
      body_condition_score: formState.bodyConditionScore, // 1 | 3 | 5 | 7 | 9
      color_pattern: formState.colorPattern, // breed-specific pattern or 'not-sure-cat'/'not-sure-dog'
      primary_color: formState.primaryColor, // 'black' | 'white' | 'brown' | etc.
      
      // Physical assessment (structured for easy querying)
      health_assessment: {
        skin_problems: skinProblems, // ['skin-none'] or ['skin-redness', 'skin-wounds']
        eye_problems: eyeProblems, // ['eye-none'] or ['eye-discharge', 'eye-red']  
        gait_problems: gaitProblems, // ['gait-none'] or ['gait-mild-limp']
      },
      
      // Additional notes (optional)
      additional_notes: formState.notes.trim() || null,
      
      // Metadata for tracking
      form_completed_at: new Date().toISOString(),
      form_version: '1.0', // For future form updates
    };
  };

  // Handle form submission with structured data
  const handleFormSubmission = () => {
    const backendData = formatForBackend();
    
    // Debug: Log the formatted data (remove in production)
    console.log('🚀 Backend-ready data:', backendData);
    
    // Pass to parent component (will eventually go to Supabase)
    onNext(backendData);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Physical Status</h2>
        <p className="text-gray-600">
          Describe the physical characteristics and condition of the animal.
        </p>
      </div>

      {/* Physical Details Form */}
      <div className="bg-white rounded-lg border p-8 space-y-8">
        
        {/* Identification Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Identification</h3>
          <div className="space-y-6">
            
            {/* Animal Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Animal Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleAnimalTypeSelect('cat')}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 transform ${
                    formState.animalType === 'cat' 
                      ? 'border-green-600 bg-green-500 shadow-lg shadow-green-200 scale-105 ring-2 ring-green-300' 
                      : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-25 hover:scale-102'
                  }`}
                >
                  <Image
                    src="/Cat astronaut-cuate.svg"
                    alt="Cat"
                    width={60}
                    height={60}
                    className="mb-2"
                  />
                  <span className={`text-sm font-bold ${
                    formState.animalType === 'cat' ? 'text-white' : 'text-gray-900'
                  }`}>Cat</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleAnimalTypeSelect('dog')}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 transform ${
                    formState.animalType === 'dog' 
                      ? 'border-green-600 bg-green-500 shadow-lg shadow-green-200 scale-105 ring-2 ring-green-300' 
                      : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-25 hover:scale-102'
                  }`}
                >
                  <Image
                    src="/Dog paw-cuate.svg"
                    alt="Dog"
                    width={60}
                    height={60}
                    className="mb-2"
                  />
                  <span className={`text-sm font-bold ${
                    formState.animalType === 'dog' ? 'text-white' : 'text-gray-900'
                  }`}>Dog</span>
                </button>
              </div>
            </div>

            {/* Sex Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Sex</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSexSelect('male')}
                  className={`px-4 py-3 text-sm font-bold rounded-lg border-2 transition-all duration-200 transform ${
                    formState.sex === 'male'
                      ? 'border-blue-600 bg-blue-500 text-white shadow-lg shadow-blue-200 scale-105 ring-2 ring-blue-300'
                      : 'border-blue-200 bg-blue-25 text-blue-700 hover:border-blue-400 hover:bg-blue-50 hover:scale-102'
                  }`}
                >
                  Male
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSexSelect('female')}
                  className={`px-4 py-3 text-sm font-bold rounded-lg border-2 transition-all duration-200 transform ${
                    formState.sex === 'female'
                      ? 'border-pink-600 bg-pink-500 text-white shadow-lg shadow-pink-200 scale-105 ring-2 ring-pink-300'
                      : 'border-pink-200 bg-pink-25 text-pink-700 hover:border-pink-400 hover:bg-pink-50 hover:scale-102'
                  }`}
                >
                  Female
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSexSelect('unidentified')}
                  className={`px-4 py-3 text-sm font-bold rounded-lg border-2 transition-all duration-200 transform ${
                    formState.sex === 'unidentified'
                      ? 'border-gray-600 bg-gray-500 text-white shadow-lg shadow-gray-200 scale-105 ring-2 ring-gray-300'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100 hover:scale-102'
                  }`}
                >
                  Unidentified
                </button>
              </div>
            </div>

            {/* Collar Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Collar</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleCollarSelect('with')}
                  className={`px-4 py-3 text-sm font-bold rounded-lg border-2 transition-all duration-200 transform ${
                    formState.collar === 'with'
                      ? 'border-green-600 bg-green-500 text-white shadow-lg shadow-green-200 scale-105 ring-2 ring-green-300'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-25 hover:scale-102'
                  }`}
                >
                  With Collar
                </button>
                
                <button
                  type="button"
                  onClick={() => handleCollarSelect('without')}
                  className={`px-4 py-3 text-sm font-bold rounded-lg border-2 transition-all duration-200 transform ${
                    formState.collar === 'without'
                      ? 'border-green-600 bg-green-500 text-white shadow-lg shadow-green-200 scale-105 ring-2 ring-green-300'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-25 hover:scale-102'
                  }`}
                >
                  Without Collar
                </button>
              </div>
            </div>
            
          </div>
        </div>

        {/* Physical Attributes Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Attributes</h3>
          
          {/* Body Condition Score */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Body Condition Score {formState.animalType && `(${formState.animalType === 'cat' ? 'Cat' : 'Dog'})`}
            </label>
            
            {/* Show message if no animal type selected */}
            {!formState.animalType && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">Please select an animal type first to see body condition scores</p>
              </div>
            )}
            
            {/* Cat Body Condition Score */}
            {formState.animalType === 'cat' && (
              <div className="space-y-3">
                {[
                  { 
                    score: 1, 
                    label: 'Very Thin',
                    description: 'Ribs, spine and hip bones are visible (coat may interfere with visibility). Fat can not be seen or felt under the skin. Obvious loss of muscle mass.'
                  },
                  { 
                    score: 3, 
                    label: 'Thin',
                    description: 'Ribs, spine and hip bones are easily felt (coat may interfere with visibility). Fat can not be seen or felt under the skin. Obvious loss of muscle mass.'
                  },
                  { 
                    score: 5, 
                    label: 'Ideal',
                    description: 'Ribs, spine and hip bones are easily felt and may be visible (coat may interfere with visibility). A waist and abdominal tuck are seen when viewed from above and side.'
                  },
                  { 
                    score: 7, 
                    label: 'Overweight',
                    description: 'Ribs, spine and hip bones are not visible and difficult to feel. Excess fat is felt around ribs, spine and hip bones. Waist and abdominal tuck are minimal or absent.'
                  },
                  { 
                    score: 9, 
                    label: 'Obesity',
                    description: 'Ribs, spine and hip bones are difficult to feel under a thick layer of fat. Waist and abdomen distended when viewed from above and side. Prominent fat deposits over lower spine, neck and chest.'
                  }
                ].map((item) => (
                  <button
                    key={item.score}
                    type="button"
                    onClick={() => setFormState(prev => ({ ...prev, bodyConditionScore: item.score }))}
                    className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-200 transform text-left ${
                      formState.bodyConditionScore === item.score
                        ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-300'
                        : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-25'
                    }`}
                  >
                    {/* Image Section (Left) */}
                    <div className="flex-shrink-0 mr-4">
                      <Image
                        src={`/cat-bcs/${item.score}.jpg`}
                        alt={`Cat Body Condition Score ${item.score}`}
                        width={120}
                        height={80}
                        className="rounded object-cover"
                      />
                    </div>
                    
                    {/* Text Section (Right) */}
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`text-2xl font-bold mr-3 transition-colors ${
                          formState.bodyConditionScore === item.score
                            ? 'text-green-700'
                            : 'text-gray-700'
                        }`}>
                          {item.score}
                        </div>
                        <div className={`text-lg font-semibold transition-colors ${
                          formState.bodyConditionScore === item.score
                            ? 'text-green-700'
                            : 'text-gray-900'
                        }`}>
                          {item.label}
                        </div>
                      </div>
                      <div className={`text-sm leading-relaxed transition-colors ${
                        formState.bodyConditionScore === item.score
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Dog Body Condition Score */}
            {formState.animalType === 'dog' && (
              <div className="space-y-3">
                {[
                  { 
                    score: 1, 
                    label: 'Very Thin',
                    description: 'Ribs, spine and hip bones are visible (coat may interfere with observation). Fat can not be seen or felt under the skin. Obvious loss of muscle mass. Extreme waist and abdominal tuck.'
                  },
                  { 
                    score: 3, 
                    label: 'Thin',
                    description: 'Ribs, spine and hip bones are easy to feel but visible. Fat can not be seen or felt under the skin, especially around the ribs and lower back. Obvious waist and abdominal tuck. Some muscle loss.'
                  },
                  { 
                    score: 5, 
                    label: 'Ideal',
                    description: 'Ribs, spine and hip bones are easily felt and may be visible (coat may interfere with visibility). A waist and abdominal tuck are seen when viewed from above and side. Fat can be felt around ribs, spine and hip bones.'
                  },
                  { 
                    score: 7, 
                    label: 'Overweight',
                    description: 'Ribs, spine and hip bones are not visible and difficult to feel. Excess fat is felt around ribs, spine and hip bones. Waist and abdominal tuck are minimal or absent.'
                  },
                  { 
                    score: 9, 
                    label: 'Obesity',
                    description: 'Ribs, spine and hip bones are difficult to feel under a thick layer of fat. Waist and abdomen distended when viewed from above and side. Prominent fat deposits over lower spine, neck and chest.'
                  }
                ].map((item) => (
                  <button
                    key={item.score}
                    type="button"
                    onClick={() => setFormState(prev => ({ ...prev, bodyConditionScore: item.score }))}
                    className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-200 transform text-left ${
                      formState.bodyConditionScore === item.score
                        ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-300'
                        : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-25'
                    }`}
                  >
                    {/* Image Section (Left) */}
                    <div className="flex-shrink-0 mr-4">
                      <Image
                        src={`/dog-bcs/${item.score}.png`}
                        alt={`Dog Body Condition Score ${item.score}`}
                        width={120}
                        height={80}
                        className="rounded object-cover"
                      />
                    </div>
                    
                    {/* Text Section (Right) */}
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`text-2xl font-bold mr-3 transition-colors ${
                          formState.bodyConditionScore === item.score
                            ? 'text-green-700'
                            : 'text-gray-700'
                        }`}>
                          {item.score}
                        </div>
                        <div className={`text-lg font-semibold transition-colors ${
                          formState.bodyConditionScore === item.score
                            ? 'text-green-700'
                            : 'text-gray-900'
                        }`}>
                          {item.label}
                        </div>
                      </div>
                      <div className={`text-sm leading-relaxed transition-colors ${
                        formState.bodyConditionScore === item.score
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Pattern Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color Pattern {formState.animalType && `(${formState.animalType === 'cat' ? 'Cat' : 'Dog'})`}
            </label>
            
            {/* Show message if no animal type selected */}
            {!formState.animalType && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">Please select an animal type first to see available colors</p>
              </div>
            )}
            
            {/* Cat Colors Grid */}
            {formState.animalType === 'cat' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { id: 'white-puspin', label: 'White Puspin', shortLabel: 'White' },
                  { id: 'black-puspin', label: 'Black Puspin', shortLabel: 'Black' },
                  { id: 'tabby-puspin', label: 'Tabby Puspin', shortLabel: 'Tabby' },
                  { id: 'orange-tabby-puspin', label: 'Orange-Tabby Puspin', shortLabel: 'Orange Tabby' },
                  { id: 'bi-color-puspin', label: 'Bi-color Puspin', shortLabel: 'Bi-color' },
                  { id: 'calico-puspin', label: 'Calico(Tri-color) Puspin', shortLabel: 'Calico' },
                  { id: 'tortoiseshell-puspin', label: 'Tortoiseshell Puspin', shortLabel: 'Tortoiseshell' },
                  { id: 'not-sure-cat', label: 'Not Sure', shortLabel: 'Not Sure' }
                ].map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setFormState(prev => ({ ...prev, colorPattern: color.id }))}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 transform ${
                      formState.colorPattern === color.id
                        ? 'border-green-500 bg-green-50 scale-105 ring-2 ring-green-300 shadow-lg'
                        : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-25 hover:scale-102'
                    }`}
                  >
                    <div className="flex flex-col h-40">
                      {/* Picture Section (2/3 height) */}
                      <div className={`flex-1 flex items-center justify-center transition-colors ${
                        formState.colorPattern === color.id
                          ? 'bg-green-100'
                          : 'bg-gray-50'
                      }`}>
                        {/* Cat color pattern image */}
                        {color.id === 'not-sure-cat' ? (
                          // Not Sure placeholder
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400">
                            <span className="text-2xl">❓</span>
                          </div>
                        ) : (
                          <Image
                            src={`/cat-color/${(() => {
                              switch(color.id) {
                                case 'white-puspin': return 'white.png';
                                case 'black-puspin': return 'black.png';
                                case 'tabby-puspin': return 'Tabby.jpg';
                                case 'orange-tabby-puspin': return 'orange-tabby.png';
                                case 'bi-color-puspin': return 'Bi-color.png';
                                case 'calico-puspin': return 'Calico.jpg';
                                case 'tortoiseshell-puspin': return 'Tortoiseshell.jpg';
                                default: return 'white.png';
                              }
                            })()}`}
                            alt={color.label}
                            width={80}
                            height={80}
                            className="rounded object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Label Section (1/3 height) */}
                      <div className="h-12 p-3 flex items-center justify-center">
                        <span className={`text-sm font-medium text-center leading-tight transition-colors ${
                          formState.colorPattern === color.id
                            ? 'text-green-700'
                            : 'text-gray-700'
                        }`}>
                          {color.shortLabel}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Dog Colors Grid */}
            {formState.animalType === 'dog' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { id: 'bi-color', label: 'Bi-color' },
                  { id: 'blenheim', label: 'Blenheim' },
                  { id: 'brindle', label: 'Brindle' },
                  { id: 'harlequin', label: 'Harlequin' },
                  { id: 'hound-coat', label: 'Hound Coat' },
                  { id: 'mantle', label: 'Mantle' },
                  { id: 'merle', label: 'Merle' },
                  { id: 'patchy', label: 'Patchy' },
                  { id: 'plain', label: 'Plain' },
                  { id: 'sable', label: 'Sable' },
                  { id: 'tri-color', label: 'Tri-color' },
                  { id: 'tuxedo', label: 'Tuxedo' },
                  { id: 'not-sure-dog', label: 'Not Sure' }
                ].map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setFormState(prev => ({ ...prev, colorPattern: color.id }))}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 transform ${
                      formState.colorPattern === color.id
                        ? 'border-green-500 bg-green-50 scale-105 ring-2 ring-green-300 shadow-lg'
                        : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-25 hover:scale-102'
                    }`}
                  >
                    <div className="flex flex-col h-40">
                      {/* Picture Section (2/3 height) */}
                      <div className={`flex-1 flex items-center justify-center transition-colors ${
                        formState.colorPattern === color.id
                          ? 'bg-green-100'
                          : 'bg-gray-50'
                      }`}>
                        {color.id === 'not-sure-dog' ? (
                          // Not Sure placeholder
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400">
                            <span className="text-2xl">❓</span>
                          </div>
                        ) : (
                          <Image
                            src={`/dog-color/${(() => {
                              switch(color.id) {
                                case 'bi-color': return 'Bi-color.png';
                                case 'blenheim': return 'Blenheim.png';
                                case 'brindle': return 'Brindle.png';
                                case 'harlequin': return 'Harlequin.png';
                                case 'hound-coat': return 'Hound-coat.png';
                                case 'mantle': return 'Mantle.png';
                                case 'merle': return 'Merle.png';
                                case 'patchy': return 'Patchy.png';
                                case 'plain': return 'Plain.png';
                                case 'sable': return 'Sable.png';
                                case 'tri-color': return 'Tri-color.png';
                                case 'tuxedo': return 'Tuxedo.png';
                                default: return 'Plain.png';
                              }
                            })()}`}
                            alt={color.label}
                            width={80}
                            height={80}
                            className="rounded object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Label Section (1/3 height) */}
                      <div className="h-12 p-3 flex items-center justify-center">
                        <span className={`text-sm font-medium text-center leading-tight transition-colors ${
                          formState.colorPattern === color.id
                            ? 'text-green-700'
                            : 'text-gray-700'
                        }`}>
                          {color.label}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Primary Color</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'black', label: 'Black', colorClass: 'bg-gray-900' },
                { id: 'white', label: 'White', colorClass: 'bg-white border-gray-300' },
                { id: 'brown', label: 'Brown / Chocolate', colorClass: 'bg-amber-800' },
                { id: 'tan', label: 'Tan / Fawn', colorClass: 'bg-yellow-600' },
                { id: 'grey', label: 'Grey / Blue', colorClass: 'bg-gray-500' },
                { id: 'red', label: 'Red / Orange / Ginger', colorClass: 'bg-orange-600' },
                { id: 'cream', label: 'Cream / Yellow', colorClass: 'bg-yellow-200' },
                { id: 'other', label: 'Other / Unsure', colorClass: 'bg-gray-300' }
              ].map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setFormState(prev => ({ ...prev, primaryColor: color.id }))}
                  className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 transform text-left ${
                    formState.primaryColor === color.id
                      ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-300'
                      : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-25'
                  }`}
                >
                  {/* Color Circle */}
                  <div className={`w-8 h-8 rounded-full mr-3 border-2 ${color.colorClass} ${
                    color.id === 'white' ? 'border-gray-300' : 'border-white'
                  }`}></div>
                  
                  {/* Label */}
                  <span className={`text-sm font-medium transition-colors ${
                    formState.primaryColor === color.id
                      ? 'text-green-700'
                      : 'text-gray-700'
                  }`}>
                    {color.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Physical Assessment Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Physical Assessment</h3>
          
          {/* Skin Problems */}
          <div className="mb-8">
            <h4 className="text-base font-medium text-gray-800 mb-4">
              Skin Problems (Select all that apply)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'skin-none', label: 'None/Normal', description: 'No visible skin issues, coat looks healthy.' },
                { id: 'skin-hair-loss', label: 'Missing Hair/Bald Patches', description: 'Noticeable areas where fur is missing.' },
                { id: 'skin-redness', label: 'Redness/Irritation', description: 'Skin looks inflamed, bright red, or heavily scratched.' },
                { id: 'skin-wounds', label: 'Wounds/Cuts/Blood', description: 'An open, bloody cut, tear, or severe scrape is visible.' },
                { id: 'skin-lumps', label: 'Lumps/Bumps/Swelling', description: 'Any significant raised area, lump, or general swelling under the skin.' },
                { id: 'skin-parasites', label: 'Heavy Parasites', description: 'Visible fleas, ticks, or excessive black "flea dirt" in the coat.' }
              ].map((problem) => (
                <button
                  key={problem.id}
                  type="button"
                  onClick={() => {
                    setFormState(prev => {
                      const currentProblems = prev.physicalProblems || [];
                      const isSelected = currentProblems.includes(problem.id);
                      let newProblems;
                      
                      if (problem.id === 'skin-none') {
                        // If selecting "None", clear all other skin problems
                        newProblems = isSelected ? [] : [problem.id];
                      } else {
                        // If selecting a specific problem, remove "None" and toggle this problem
                        const filteredProblems = currentProblems.filter(p => p !== 'skin-none');
                        newProblems = isSelected 
                          ? filteredProblems.filter(p => p !== problem.id)
                          : [...filteredProblems, problem.id];
                      }
                      
                      return { ...prev, physicalProblems: newProblems };
                    });
                  }}
                  className={`text-left p-4 rounded-lg border-2 transition-all duration-200 transform ${
                    (formState.physicalProblems || []).includes(problem.id)
                      ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-300'
                      : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-25'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      (formState.physicalProblems || []).includes(problem.id)
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {(formState.physicalProblems || []).includes(problem.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm transition-colors ${
                        (formState.physicalProblems || []).includes(problem.id)
                          ? 'text-green-700'
                          : 'text-gray-900'
                      }`}>
                        {problem.label}
                      </div>
                      <div className={`text-xs mt-1 transition-colors ${
                        (formState.physicalProblems || []).includes(problem.id)
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}>
                        {problem.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Eye Problems */}
          <div className="mb-8">
            <h4 className="text-base font-medium text-gray-800 mb-4">
              Eye Problems (Select all that apply)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'eye-none', label: 'None/Normal', description: 'Eyes appear clear, open, and free of excessive discharge.' },
                { id: 'eye-squinting', label: 'Squinting/Shut', description: 'The pet is constantly blinking, squinting, or holding one eye tightly shut (indicates pain).' },
                { id: 'eye-discharge', label: 'Thick/Colored Discharge', description: 'A noticeable amount of green, yellow, or thick pus coming from one or both eyes.' },
                { id: 'eye-tearing', label: 'Excessive Tearing/Watery', description: 'The eye is constantly running with clear, watery fluid.' },
                { id: 'eye-cloudy', label: 'Cloudy/Hazy Eye', description: 'The front part of the eye (cornea/pupil area) looks hazy, gray, or blue/white.' },
                { id: 'eye-red', label: 'Red/Inflamed Eyelids', description: 'The eyelids or the white part of the eye are noticeably very red or swollen.' }
              ].map((problem) => (
                <button
                  key={problem.id}
                  type="button"
                  onClick={() => {
                    setFormState(prev => {
                      const currentProblems = prev.physicalProblems || [];
                      const isSelected = currentProblems.includes(problem.id);
                      let newProblems;
                      
                      if (problem.id === 'eye-none') {
                        // If selecting "None", clear all other eye problems
                        const nonEyeProblems = currentProblems.filter(p => !p.startsWith('eye-'));
                        newProblems = isSelected ? nonEyeProblems : [...nonEyeProblems, problem.id];
                      } else {
                        // If selecting a specific problem, remove "None" and toggle this problem
                        const filteredProblems = currentProblems.filter(p => p !== 'eye-none');
                        newProblems = isSelected 
                          ? filteredProblems.filter(p => p !== problem.id)
                          : [...filteredProblems, problem.id];
                      }
                      
                      return { ...prev, physicalProblems: newProblems };
                    });
                  }}
                  className={`text-left p-4 rounded-lg border-2 transition-all duration-200 transform ${
                    (formState.physicalProblems || []).includes(problem.id)
                      ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-300'
                      : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-25'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      (formState.physicalProblems || []).includes(problem.id)
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {(formState.physicalProblems || []).includes(problem.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm transition-colors ${
                        (formState.physicalProblems || []).includes(problem.id)
                          ? 'text-green-700'
                          : 'text-gray-900'
                      }`}>
                        {problem.label}
                      </div>
                      <div className={`text-xs mt-1 transition-colors ${
                        (formState.physicalProblems || []).includes(problem.id)
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}>
                        {problem.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Gait Problems */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-800 mb-4">
              Gait Problems (Select all that apply)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'gait-none', label: 'None/Normal', description: 'Walks and runs without limping or difficulty.' },
                { id: 'gait-mild-limp', label: 'Mild Limping/Favoring a Limb', description: 'Has a slight limp or puts noticeably less weight on one or more legs.' },
                { id: 'gait-severe-limp', label: 'Severe Limping/3-Legged Walk', description: 'Is holding a leg up completely and walking on only three legs.' },
                { id: 'gait-wobbly', label: 'Stumbling/Wobbly/Uncoordinated', description: 'Walks with a wide stance, stumbles, sways side-to-side, or loses balance easily.' },
                { id: 'gait-dragging', label: 'Dragging/Knuckling', description: 'Is dragging a foot or walking on the top of the paw/knuckles instead of the pad.' },
                { id: 'gait-reluctant', label: 'Reluctance to Move/Stiffness', description: 'Struggles to stand up, moves very slowly, or refuses to jump or run.' }
              ].map((problem) => (
                <button
                  key={problem.id}
                  type="button"
                  onClick={() => {
                    setFormState(prev => {
                      const currentProblems = prev.physicalProblems || [];
                      const isSelected = currentProblems.includes(problem.id);
                      let newProblems;
                      
                      if (problem.id === 'gait-none') {
                        // If selecting "None", clear all other gait problems
                        const nonGaitProblems = currentProblems.filter(p => !p.startsWith('gait-'));
                        newProblems = isSelected ? nonGaitProblems : [...nonGaitProblems, problem.id];
                      } else {
                        // If selecting a specific problem, remove "None" and toggle this problem
                        const filteredProblems = currentProblems.filter(p => p !== 'gait-none');
                        newProblems = isSelected 
                          ? filteredProblems.filter(p => p !== problem.id)
                          : [...filteredProblems, problem.id];
                      }
                      
                      return { ...prev, physicalProblems: newProblems };
                    });
                  }}
                  className={`text-left p-4 rounded-lg border-2 transition-all duration-200 transform ${
                    (formState.physicalProblems || []).includes(problem.id)
                      ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-300'
                      : 'border-gray-300 bg-white hover:border-green-400 hover:bg-green-25'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      (formState.physicalProblems || []).includes(problem.id)
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {(formState.physicalProblems || []).includes(problem.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm transition-colors ${
                        (formState.physicalProblems || []).includes(problem.id)
                          ? 'text-green-700'
                          : 'text-gray-900'
                      }`}>
                        {problem.label}
                      </div>
                      <div className={`text-xs mt-1 transition-colors ${
                        (formState.physicalProblems || []).includes(problem.id)
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}>
                        {problem.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Notes Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details or Observations (Optional)
            </label>
            <textarea
              value={formState.notes}
              onChange={(e) => setFormState(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Describe any additional observations about the animal's condition, behavior, location details, or other relevant information that might help with identification or care..."
              rows={5}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 resize-none focus:outline-none ${
                formState.notes.trim()
                  ? 'border-green-400 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                  : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-gray-400'
              }`}
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {formState.notes.trim() ? (
                  <span className="text-green-600 font-medium">
                    ✓ Notes added ({formState.notes.trim().length} characters)
                  </span>
                ) : (
                  "Optional: Add any extra details that might be helpful"
                )}
              </span>
              <span className="text-gray-400">
                {formState.notes.length}/500
              </span>
            </div>
            
            {/* Helper Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Helpful Details to Include:</h4>
              <ul className="text-xs text-blue-700 space-y-1 ml-4">
                <li>• Specific location where the animal was found</li>
                <li>• Animal behavior (friendly, scared, injured, etc.)</li>
                <li>• Time of day when spotted</li>
                <li>• Any visible injuries or concerns not covered above</li>
                <li>• Interaction with people or other animals</li>
                <li>• Anything unusual about the situation</li>
              </ul>
            </div>
          </div>
        </div>
        
      </div>

      {/* Form Validation Message */}
      {!isFormValid() && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
          <div className="flex items-center mb-2">
            <span className="text-red-600 mr-2">⚠️</span>
            <h4 className="text-sm font-medium text-red-800">Please complete all required fields</h4>
          </div>
          <p className="text-xs text-red-700 mb-2">Missing required information:</p>
          <ul className="text-xs text-red-600 space-y-1">
            {getMissingFields().map((field, index) => (
              <li key={index}>• {field}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Back
        </button>
        <button
          onClick={() => isFormValid() && handleFormSubmission()}
          disabled={!isFormValid()}
          className={`px-6 py-2 rounded-lg transition-all duration-200 ${
            isFormValid()
              ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
          }`}
        >
          {isFormValid() ? 'Next' : 'Complete Required Fields'}
        </button>
      </div>
    </div>
  );
}