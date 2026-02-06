// Single Responsibility Principle: Component focused only on sex selection
import { SexSelectionProps } from '../types/PhysicalDetailsTypes';
import SelectionButton from '@/components/ui/SelectionButton';
import InlineError from '@/components/ui/InlineError';

export default function SexSelection({ selectedSex, onSelect, error, touched }: SexSelectionProps) {
  const showError = touched && !selectedSex;
  
  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">
        Sex <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SelectionButton
          isSelected={selectedSex === 'male'}
          onSelect={() => onSelect('male')}
          variant="semantic"
          semanticColor={{
            border: 'border-blue-600',
            background: 'bg-blue-50/30 dark:bg-blue-950/20',
            text: 'text-blue-600',
            darkText: 'dark:text-blue-400'
          }}
        >
          Male
        </SelectionButton>

        <SelectionButton
          isSelected={selectedSex === 'female'}
          onSelect={() => onSelect('female')}
          variant="semantic"
          semanticColor={{
            border: 'border-pink-600',
            background: 'bg-pink-50/30 dark:bg-pink-950/20',
            text: 'text-pink-600',
            darkText: 'dark:text-pink-400'
          }}
        >
          Female
        </SelectionButton>

        <SelectionButton
          isSelected={selectedSex === 'unknown'}
          onSelect={() => onSelect('unknown')}
        >
          Unknown
        </SelectionButton>
      </div>
      <InlineError error={error} show={showError} />
    </div>
  );
}