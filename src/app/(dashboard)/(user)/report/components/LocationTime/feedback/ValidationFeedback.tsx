// Single Responsibility Principle: Focused validation feedback component
import { LocationTimeValidationResult } from '../types/LocationTimeTypes';

interface ValidationFeedbackProps {
  validation: LocationTimeValidationResult;
}

export default function ValidationFeedback({ validation }: ValidationFeedbackProps) {
  if (validation.isValid) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="text-sm text-red-800">
        <p className="font-medium mb-2">Please complete all required fields:</p>
        <ul className="list-disc list-inside space-y-1">
          {validation.missingFields.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
