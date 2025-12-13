// Single Responsibility Principle: Focused validation feedback component
import { FormValidationResult } from '../types/PhysicalDetailsTypes';

interface ValidationFeedbackProps {
  validation: FormValidationResult;
}

export default function ValidationFeedback({ validation }: ValidationFeedbackProps) {
  if (validation.isValid) {
    return (
      <div className="bg-[rgb(var(--color-success-bg))] border border-[rgb(var(--color-success))] rounded-md p-4">
        <div className="flex items-center">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-[rgb(var(--color-success))]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-[rgb(var(--color-success))]">
              All required information has been provided. Ready to proceed!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[rgb(var(--color-error-bg))] border border-[rgb(var(--color-error))] rounded-md p-4">
      <div className="flex">
        <div className="shrink-0">
          <svg className="h-5 w-5 text-[rgb(var(--color-error))]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-[rgb(var(--color-error))]">
            Please complete the following required fields:
          </h3>
          <div className="mt-2 text-sm text-[rgb(var(--color-error))]">
            <ul className="list-disc list-inside space-y-1">
              {validation.missingFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}