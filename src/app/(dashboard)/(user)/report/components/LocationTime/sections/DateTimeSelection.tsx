// Single Responsibility Principle: Component focused only on date and time selection
import { DateTimeSelectionProps } from '../types/LocationTimeTypes';
import DatePicker from 'react-datepicker';
import SimpleTimePicker from '../SimpleTimePicker';
import InlineError from '@/components/ui/InlineError';

export default function DateTimeSelection({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
  dateTouched,
  timeTouched,
}: DateTimeSelectionProps) {
  const showDateError = dateTouched && !selectedDate;
  const showTimeError = timeTouched && !selectedTime;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Modern Date Picker */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
          Date Spotted <span className="text-red-500">*</span>
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => date && onDateChange(date)}
          dateFormat="MMMM d, yyyy"
          maxDate={new Date()} // Can't select future dates
          placeholderText="Select date when you spotted the animal"
          className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))]"
          calendarClassName="custom-calendar"
          popperClassName="custom-popper"
        />
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          When did you first spot the animal?
        </p>
        <InlineError error={dateError} show={showDateError} />
      </div>

      {/* Simple Time Picker */}
      <div className="flex-1">
        <SimpleTimePicker
          value={selectedTime}
          onChange={onTimeChange}
          label="Time Spotted"
          required={true}
        />
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          What time did you spot the animal?
        </p>
        <InlineError error={timeError} show={showTimeError} />
      </div>
    </div>
  );
}
