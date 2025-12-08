// Single Responsibility Principle: Component focused only on sex selection
import { SexSelectionProps } from '../types/PhysicalDetailsTypes';

export default function SexSelection({ selectedSex, onSelect }: SexSelectionProps) {
  const sexOptions = [
    { value: 'male', label: 'Male', color: 'blue' },
    { value: 'female', label: 'Female', color: 'pink' },
    { value: 'unknown', label: 'Unknown', color: 'gray' }
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
            className={`px-4 py-3 text-sm font-bold rounded-lg border-2 transition-all duration-200 transform ${
              selectedSex === option.value
                ? `border-${option.color}-600 bg-${option.color}-500 text-white shadow-lg shadow-${option.color}-200 scale-105 ring-2 ring-${option.color}-300`
                : `border-${option.color}-200 bg-${option.color}-25 text-${option.color}-700 hover:border-${option.color}-400 hover:bg-${option.color}-50 hover:scale-102`
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}