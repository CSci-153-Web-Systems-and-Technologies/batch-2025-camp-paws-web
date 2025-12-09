// Single Responsibility Principle: Component focused only on sex selection
import { SexSelectionProps } from '../types/PhysicalDetailsTypes';

export default function SexSelection({ selectedSex, onSelect }: SexSelectionProps) {
  const getButtonClasses = (value: string) => {
    const isSelected = selectedSex === value;
    
    // Male button (blue)
    if (value === 'male') {
      return isSelected
        ? 'border-blue-600 bg-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-200 dark:ring-blue-400/30'
        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-102';
    }
    
    // Female button (pink)
    if (value === 'female') {
      return isSelected
        ? 'border-pink-600 bg-pink-600 text-white shadow-lg scale-105 ring-2 ring-pink-200 dark:ring-pink-400/30'
        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:scale-102';
    }
    
    // Unknown button (gray - uses theme colors)
    return isSelected
      ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))] text-white shadow-lg scale-105 ring-2 ring-[rgb(var(--color-primary-light))]'
      : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-border-hover))] hover:bg-[rgb(var(--color-background))] hover:scale-102';
  };

  const sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'unknown', label: 'Unknown' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">Sex</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sexOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`px-4 py-3 text-sm font-bold rounded-lg border-2 transition-all duration-200 transform ${getButtonClasses(option.value)}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}