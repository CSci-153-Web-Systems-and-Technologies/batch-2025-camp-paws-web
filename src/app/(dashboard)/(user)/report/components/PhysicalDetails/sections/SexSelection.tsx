// Single Responsibility Principle: Component focused only on sex selection
import { SexSelectionProps } from '../types/PhysicalDetailsTypes';

export default function SexSelection({ selectedSex, onSelect }: SexSelectionProps) {
  const getButtonClasses = (value: string) => {
    const isSelected = selectedSex === value;
    
    // Male button
    if (value === 'male') {
      return isSelected
        ? 'border-blue-600 bg-blue-500 text-white shadow-lg shadow-blue-200 scale-105 ring-2 ring-blue-300'
        : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-blue-400 hover:bg-blue-100 hover:text-blue-700 hover:scale-102';
    }
    
    // Female button
    if (value === 'female') {
      return isSelected
        ? 'border-pink-600 bg-pink-500 text-white shadow-lg shadow-pink-200 scale-105 ring-2 ring-pink-300'
        : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-pink-400 hover:bg-pink-100 hover:text-pink-700 hover:scale-102';
    }
    
    // Unknown button
    return isSelected
      ? 'border-gray-600 bg-gray-500 text-white shadow-lg shadow-gray-200 scale-105 ring-2 ring-gray-300'
      : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100 hover:scale-102';
  };

  const sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'unknown', label: 'Unknown' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Sex</label>
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