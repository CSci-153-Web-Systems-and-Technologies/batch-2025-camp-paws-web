// Single Responsibility Principle: Component focused only on collar status
import { CollarSelectionProps } from '../types/PhysicalDetailsTypes';
import InlineError from '@/components/ui/InlineError';

export default function CollarSelection({ selectedCollar, onSelect, error, touched }: CollarSelectionProps) {
  const showError = touched && !selectedCollar;
  
  const collarOptions = [
    { 
      value: 'with', 
      label: 'With Collar', 
      description: 'Animal has a collar (may indicate ownership)'
    },
    { 
      value: 'without', 
      label: 'Without Collar', 
      description: 'Animal has no visible collar'
    }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">
        Collar Status <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {collarOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`p-4 text-left border-2 rounded-lg transition-all duration-200 transform ${
              selectedCollar === option.value
                ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] shadow-lg scale-105 ring-2 ring-[rgb(var(--color-primary-light))]'
                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))] hover:scale-102'
            }`}
          >
            <div className={`text-sm font-bold mb-1 ${
              selectedCollar === option.value 
                ? 'text-[rgb(var(--color-primary))]'
                : 'text-[rgb(var(--color-text-primary))]'
            }`}>
              {option.label}
            </div>
            <div className={`text-xs ${
              selectedCollar === option.value 
                ? 'text-[rgb(var(--color-primary))]'
                : 'text-[rgb(var(--color-text-secondary))]'
            }`}>
              {option.description}
            </div>
          </button>
        ))}
      </div>
      <InlineError error={error} show={showError} />
    </div>
  );
}