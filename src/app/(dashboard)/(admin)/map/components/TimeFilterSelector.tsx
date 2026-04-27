// Single Responsibility: Time filter selection UI
import { TimeFilterSelectorProps, TimeFilter } from '../types/MapTypes';

const FILTER_OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
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
    <div className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm p-4 border border-[rgb(var(--color-border))]">
      <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">Time Period</h3>
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
                  ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))]'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-primary-light))] hover:bg-[rgb(var(--color-surface-hover))]'
                }
              `}
            >
              <div className="text-center">
                <div className="text-xs font-medium mb-1">{option.label}</div>
                <div className={`text-2xl font-bold ${isSelected ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text-primary))]'}`}>
                  {count}
                </div>
                <div className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1">
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
