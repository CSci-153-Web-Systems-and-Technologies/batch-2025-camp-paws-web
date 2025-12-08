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
    <div className="flex items-center justify-center mb-8 px-2 overflow-x-auto step-indicator-container">
      <div className="flex items-center min-w-max">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle - Responsive sizes */}
            <div className={`step-circle flex items-center justify-center rounded-full font-medium shrink-0 ${
              step.completed 
                ? 'bg-green-600 text-white' 
                : step.active 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {step.completed ? '✓' : step.number}
            </div>
            
            {/* Step Label - Multi-breakpoint responsive */}
            <span className={`step-label whitespace-nowrap ${step.active ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
              {/* Ultra small screens (<400px): Single letters */}
              <span className="ultra-small-only">
                {step.label === 'Photo' ? 'P' : step.label === 'Physical Status' ? 'S' : 'L'}
              </span>
              {/* Small screens (400-500px): Short labels */}
              <span className="small-only">
                {step.label === 'Photo' ? 'Photo' : step.label === 'Physical Status' ? 'Physical' : 'Location'}
              </span>
              {/* Medium+ screens (≥500px): Full labels */}
              <span className="medium-plus">{step.label}</span>
            </span>
            
            {/* Connector Line - Multi-breakpoint responsive */}
            {index < steps.length - 1 && (
              <div className={`step-connector h-0.5 shrink-0 ${
                step.completed ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}