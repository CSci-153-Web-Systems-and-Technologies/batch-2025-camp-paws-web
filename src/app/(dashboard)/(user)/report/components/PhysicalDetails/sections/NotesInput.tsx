// Single Responsibility Principle: Component focused only on additional notes
import { Textarea } from '@/components/ui';

interface NotesInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function NotesInput({ notes, onNotesChange }: NotesInputProps) {
  const characterCount = notes.length;
  const maxLength = 500;
  const isNearLimit = characterCount > 400;

  return (
    <div>
      <Textarea
        label="Additional Notes (Optional)"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Any additional observations about the animal's condition, behavior, or circumstances..."
        rows={4}
        maxLength={maxLength}
        helperText="Describe any other relevant details about the animal's condition or behavior"
        fullWidth
        resize="vertical"
      />
      <div className="flex justify-end mt-1">
        <span className={`text-xs ${isNearLimit ? 'text-[rgb(var(--color-error))]' : 'text-[rgb(var(--color-text-tertiary))]'}`}>
          {characterCount}/{maxLength}
        </span>
      </div>
    </div>
  );
}