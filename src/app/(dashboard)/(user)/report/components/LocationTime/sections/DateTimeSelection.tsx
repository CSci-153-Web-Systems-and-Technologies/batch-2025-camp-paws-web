// Single Responsibility Principle: Component focused only on date and time selection
import { DateTimeSelectionProps } from '../types/LocationTimeTypes';
import DatePicker from 'react-datepicker';
import SimpleTimePicker from '../SimpleTimePicker';

export default function DateTimeSelection({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DateTimeSelectionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Modern Date Picker */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Spotted
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => date && onDateChange(date)}
          dateFormat="MMMM d, yyyy"
          maxDate={new Date()} // Can't select future dates
          placeholderText="Select date when you spotted the animal"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          calendarClassName="custom-calendar"
          popperClassName="custom-popper"
        />
        <p className="mt-1 text-sm text-gray-500">
          When did you first spot the animal?
        </p>
      </div>

      {/* Simple Time Picker */}
      <div className="flex-1">
        <SimpleTimePicker
          value={selectedTime}
          onChange={onTimeChange}
          label="Time Spotted"
        />
        <p className="mt-1 text-sm text-gray-500">
          What time did you spot the animal?
        </p>
      </div>
    </div>
  );
}
