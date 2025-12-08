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
      <label className="block text-sm font-medium text-gray-700 mb-3">Collar Status</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {collarOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`p-4 text-left border-2 rounded-lg transition-all duration-200 transform ${
              selectedCollar === option.value
                ? option.color === 'green'
                  ? 'border-green-600 bg-green-50 shadow-lg shadow-green-200 scale-105 ring-2 ring-green-300'
                  : 'border-red-600 bg-red-50 shadow-lg shadow-red-200 scale-105 ring-2 ring-red-300'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 hover:scale-102'
            }`}
          >
            <div className={`text-sm font-bold mb-1 ${
              selectedCollar === option.value 
                ? option.color === 'green' 
                  ? 'text-green-700' 
                  : 'text-red-700'
                : 'text-gray-900'
            }`}>
              {option.label}
            </div>
            <div className={`text-xs ${
              selectedCollar === option.value 
                ? option.color === 'green' 
                  ? 'text-green-600' 
                  : 'text-red-600'
                : 'text-gray-600'
            }`}>
              {option.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}