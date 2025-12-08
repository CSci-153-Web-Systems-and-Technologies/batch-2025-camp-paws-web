// Single Responsibility: Time filter selection UI
import { TimeFilterSelectorProps, TimeFilter } from '../types/MapTypes';

const FILTER_OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export default function TimeFilterSelector({ 
  selectedFilter, 
  onFilterChange, 
  reportCounts 
}: TimeFilterSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Time Period</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FILTER_OPTIONS.map((option) => {
          const isSelected = selectedFilter === option.value;
          const count = reportCounts[option.value];
          
          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                }
              `}
            >
              <div className="text-center">
                <div className="text-xs font-medium mb-1">{option.label}</div>
                <div className={`text-2xl font-bold ${isSelected ? 'text-green-600' : 'text-gray-900'}`}>
                  {count}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {count === 1 ? 'report' : 'reports'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
