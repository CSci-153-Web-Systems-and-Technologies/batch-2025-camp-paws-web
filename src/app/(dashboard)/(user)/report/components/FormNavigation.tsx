interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  nextDisabled?: boolean;
  submitDisabled?: boolean;
}

export default function FormNavigation({ 
  currentStep, 
  totalSteps, 
  onBack, 
  onNext, 
  onSubmit,
  nextDisabled = false,
  submitDisabled = false
}: FormNavigationProps) {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex justify-between mt-8">
      {/* Back Button */}
      {!isFirstStep && onBack && (
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      )}
      
      {/* Spacer for first step */}
      {isFirstStep && <div />}

      {/* Next/Submit Button */}
      {isLastStep ? (
        <button
          onClick={onSubmit}
          disabled={submitDisabled}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            submitDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Submit Report
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            nextDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Next
        </button>
      )}
    </div>
  );
}