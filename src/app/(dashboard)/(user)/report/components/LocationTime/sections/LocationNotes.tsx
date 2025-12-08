// Single Responsibility Principle: Component focused only on location notes input
import { LocationNotesProps } from '../types/LocationTimeTypes';

export default function LocationNotes({
  notes,
  onNotesChange,
}: LocationNotesProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Additional Location Notes
      </label>
      <textarea
        placeholder="Any additional details about the location or circumstances..."
        rows={3}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
