// Single Responsibility Principle: Component focused only on location description input
import { LocationDescriptionProps } from '../types/LocationTimeTypes';
import InlineError from '@/components/ui/InlineError';

export default function LocationDescription({
  description,
  onDescriptionChange,
  error,
  touched,
}: LocationDescriptionProps) {
  const showError = touched && error;

  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
        Location Description <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="e.g., near VSU USHER by the tree"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full px-3 py-2 border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))]"
      />
      <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
        Provide a clear description (minimum 5 characters)
      </p>
      <InlineError error={error} show={showError} />
    </div>
  );
}
