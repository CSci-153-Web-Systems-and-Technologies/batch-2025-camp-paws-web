// Single Responsibility Principle: Component focused only on location description input
import { LocationDescriptionProps } from '../types/LocationTimeTypes';

export default function LocationDescription({
  description,
  onDescriptionChange,
}: LocationDescriptionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location Description *
      </label>
      <input
        type="text"
        placeholder="e.g., 123 Main Street, Central Park entrance, near Starbucks"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <p className="mt-1 text-sm text-gray-500">
        Provide a clear description (minimum 5 characters)
      </p>
    </div>
  );
}
