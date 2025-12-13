// Single Responsibility: Tab switcher for Grouped/Ungrouped/All views
'use client';

import { ViewSelectorProps, ViewType } from '../../types/RecordsTypes';

const VIEW_OPTIONS: { value: ViewType; label: string; description: string }[] = [
  { 
    value: 'grouped', 
    label: 'Grouped', 
    description: 'Organized by unique animals' 
  },
  { 
    value: 'ungrouped', 
    label: 'Ungrouped', 
    description: 'Unorganized reports' 
  },
  { 
    value: 'all', 
    label: 'All Records', 
    description: 'Everything together' 
  },
];

export default function ViewSelector({ 
  currentView, 
  onViewChange, 
  counts 
}: ViewSelectorProps) {
  return (
    <div className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm p-4 border border-[rgb(var(--color-border))]">
      <div className="flex flex-col sm:flex-row gap-3">
        {VIEW_OPTIONS.map((option) => {
          const isSelected = currentView === option.value;
          const count = counts[option.value];
          
          return (
            <button
              key={option.value}
              onClick={() => onViewChange(option.value)}
              className={`
                flex-1 p-4 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))]'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary-light))] hover:bg-[rgb(var(--color-surface-hover))]'
                }
              `}
            >
              <div className="text-center">
                <div className={`text-sm font-semibold mb-1 ${
                  isSelected 
                    ? 'text-[rgb(var(--color-primary))]' 
                    : 'text-[rgb(var(--color-text-primary))]'
                }`}>
                  {option.label}
                </div>
                <div className={`text-2xl font-bold mb-1 ${
                  isSelected 
                    ? 'text-[rgb(var(--color-primary))]' 
                    : 'text-[rgb(var(--color-text-primary))]'
                }`}>
                  {count}
                </div>
                <div className="text-xs text-[rgb(var(--color-text-tertiary))]">
                  {option.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
