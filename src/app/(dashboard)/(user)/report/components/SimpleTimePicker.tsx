'use client';

import { useState, useRef, useEffect } from 'react';

interface SimpleTimePickerProps {
  value: string; // HH:MM format
  onChange: (time: string) => void;
  label?: string;
}

export default function SimpleTimePicker({ value, onChange, label }: SimpleTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse current value to display format
  const parseValue = (timeString: string) => {
    if (!timeString) return { hours: 12, minutes: 0, period: 'PM' };
    const [h, m] = timeString.split(':').map(Number);
    return {
      hours: h === 0 ? 12 : h > 12 ? h - 12 : h,
      minutes: m,
      period: h >= 12 ? 'PM' : 'AM'
    };
  };

  const currentTime = parseValue(value);
  const [hours, setHours] = useState(currentTime.hours);
  const [minutes, setMinutes] = useState(currentTime.minutes);
  const [period, setPeriod] = useState<'AM' | 'PM'>(currentTime.period as 'AM' | 'PM');

  // Convert 12h to 24h format
  const formatTo24Hour = (h: number, m: number, p: 'AM' | 'PM') => {
    let hour24 = h;
    if (p === 'AM' && h === 12) hour24 = 0;
    if (p === 'PM' && h !== 12) hour24 = h + 12;
    return `${hour24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Handle time selection
  const handleTimeChange = (newHours?: number, newMinutes?: number, newPeriod?: 'AM' | 'PM') => {
    const h = newHours ?? hours;
    const m = newMinutes ?? minutes;
    const p = newPeriod ?? period;
    
    setHours(h);
    setMinutes(m);
    setPeriod(p);
    
    const time24 = formatTo24Hour(h, m, p);
    onChange(time24);
  };

  // Display format
  const displayTime = () => {
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Time Input Display - Matches DatePicker Style */}
      <div
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer
          transition-colors duration-200
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-400'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        `}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-900">{displayTime()}</span>
          </div>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Time Selection Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-4 space-y-4">
            {/* Hour and Minute Selection */}
            <div className="grid grid-cols-3 gap-3">
              {/* Hours - Hybrid Input/Select */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hour</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={hours}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= 12) {
                      handleTimeChange(val);
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                  placeholder="12"
                />
              </div>

              {/* Minutes - Hybrid Input/Select */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Min</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    if (val >= 0 && val <= 59) {
                      handleTimeChange(undefined, val);
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                  placeholder="00"
                />
              </div>

              {/* AM/PM */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Period</label>
                <select
                  value={period}
                  onChange={(e) => handleTimeChange(undefined, undefined, e.target.value as 'AM' | 'PM')}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Quick Minute Buttons */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Quick Minutes</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[0, 15, 30, 45].map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => handleTimeChange(undefined, minute)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      minutes === minute
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    :{minute.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Time Buttons */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Quick Times</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '9 AM', h: 9, m: 0, p: 'AM' as const },
                  { label: '12 PM', h: 12, m: 0, p: 'PM' as const },
                  { label: '3 PM', h: 3, m: 0, p: 'PM' as const },
                  { label: '6 PM', h: 6, m: 0, p: 'PM' as const },
                ].map((time) => (
                  <button
                    key={time.label}
                    type="button"
                    onClick={() => {
                      handleTimeChange(time.h, time.m, time.p);
                      setIsOpen(false);
                    }}
                    className="px-2 py-1 text-xs bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}