// Single Responsibility Principle: Component focused only on collar status
import { CollarSelectionProps } from '../types/PhysicalDetailsTypes';

export default function CollarSelection({ selectedCollar, onSelect }: CollarSelectionProps) {
  const collarOptions = [
    { 
      value: 'with', 
      label: 'With Collar', 
      description: 'Animal has a collar (may indicate ownership)',
      color: 'green'
    },
    { 
      value: 'without', 
      label: 'Without Collar', 
      description: 'Animal has no visible collar',
      color: 'red'
    }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">Collar Status</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {collarOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`p-4 text-left border-2 rounded-lg transition-all duration-200 transform ${
              selectedCollar === option.value
                ? option.color === 'green'
                  ? 'border-green-600 bg-green-100 dark:bg-green-900/30 shadow-lg scale-105 ring-2 ring-green-300 dark:ring-green-400/30'
                  : 'border-red-600 bg-red-100 dark:bg-red-900/30 shadow-lg scale-105 ring-2 ring-red-300 dark:ring-red-400/30'
                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-border-hover))] hover:bg-[rgb(var(--color-background))] hover:scale-102'
            }`}
          >
            <div className={`text-sm font-bold mb-1 ${
              selectedCollar === option.value 
                ? option.color === 'green' 
                  ? 'text-green-700 dark:text-green-400' 
                  : 'text-red-700 dark:text-red-400'
                : 'text-[rgb(var(--color-text-primary))]'
            }`}>
              {option.label}
            </div>
            <div className={`text-xs ${
              selectedCollar === option.value 
                ? option.color === 'green' 
                  ? 'text-green-600 dark:text-green-300' 
                  : 'text-red-600 dark:text-red-300'
                : 'text-[rgb(var(--color-text-secondary))]'
            }`}>
              {option.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}