// Single Responsibility Principle: Component focused only on additional notes
interface NotesInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function NotesInput({ notes, onNotesChange }: NotesInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
        Additional Notes (Optional)
      </label>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Any additional observations about the animal's condition, behavior, or circumstances..."
        rows={4}
        maxLength={500}
        className="w-full px-3 py-2 border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))] resize-vertical placeholder:text-[rgb(var(--color-text-tertiary))]"
      />
      <div className="flex justify-between items-center mt-1">
        <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
          Describe any other relevant details about the animal&apos;s condition or behavior
        </p>
        <span className={`text-xs ${notes.length > 400 ? 'text-[rgb(var(--color-error))]' : 'text-[rgb(var(--color-text-tertiary))]'}`}>
          {notes.length}/500
        </span>
      </div>
    </div>
  );
}