// Single Responsibility Principle: Component focused only on additional notes
interface NotesInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function NotesInput({ notes, onNotesChange }: NotesInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Additional Notes (Optional)
      </label>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Any additional observations about the animal's condition, behavior, or circumstances..."
        rows={4}
        maxLength={500}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
      />
      <div className="flex justify-between items-center mt-1">
        <p className="text-xs text-gray-500">
          Describe any other relevant details about the animal&apos;s condition or behavior
        </p>
        <span className={`text-xs ${notes.length > 400 ? 'text-red-600' : 'text-gray-500'}`}>
          {notes.length}/500
        </span>
      </div>
    </div>
  );
}