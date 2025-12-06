interface StepIndicatorProps {
  currentStep: number;
}

interface Step {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps: Step[] = [
    { number: 1, label: 'Photo', active: currentStep >= 1, completed: currentStep > 1 },
    { number: 2, label: 'Physical Status', active: currentStep >= 2, completed: currentStep > 2 },
    { number: 3, label: 'Location', active: currentStep >= 3, completed: currentStep > 3 }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            step.completed 
              ? 'bg-green-600 text-white' 
              : step.active 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-600'
          }`}>
            {step.completed ? '✓' : step.number}
          </div>
          <span className={`ml-2 text-sm ${step.active ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-4 ${step.completed ? 'bg-green-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}