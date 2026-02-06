// Single Responsibility Principle: Component focused only on color pattern and primary color selection
import { ColorSelectionProps } from '../types/PhysicalDetailsTypes';
import Image from 'next/image';
import { PRIMARY_COLORS, getColorPatternsForAnimal } from '@/lib/constants/animalAttributes';

export default function ColorSelection({ animalType, selectedPattern, selectedColor, onPatternSelect, onColorSelect }: ColorSelectionProps) {
  // Get color patterns from centralized constants
  const colorPatterns = getColorPatternsForAnimal(animalType as 'cat' | 'dog');

  if (!animalType) {
    return (
      <div className="text-center py-8 text-[rgb(var(--color-text-tertiary))]">
        <p>Please select an animal type first to choose color options</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Color Pattern Selection */}
      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">
          Color Pattern {animalType && `(${animalType === 'cat' ? 'Cat' : 'Dog'})`}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colorPatterns.map((pattern) => (
            <button
              key={pattern.id}
              type="button"
              onClick={() => onPatternSelect(pattern.id)}
              className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 transform ${
                selectedPattern === pattern.id
                  ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] scale-105 ring-2 ring-[rgb(var(--color-primary-light))] shadow-lg'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))] hover:scale-102'
              }`}
            >
              <div className="flex flex-col h-40">
                {/* Picture Section (2/3 height) */}
                <div className={`flex-1 flex items-center justify-center transition-colors ${
                  selectedPattern === pattern.id
                    ? 'bg-[rgb(var(--color-primary-light))]'
                    : 'bg-[rgb(var(--color-background))]'
                }`}>
                  {/* Color pattern image */}
                  {pattern.id === 'not-sure-cat-pattern' || pattern.id === 'not-sure-dog-pattern' ? (
                    // Not Sure placeholder
                    <div className="w-20 h-20 bg-[rgb(var(--color-border))] rounded-lg flex items-center justify-center border-2 border-dashed border-[rgb(var(--color-text-tertiary))]">
                      <span className="text-2xl">❓</span>
                    </div>
                  ) : (
                    <Image
                      src={pattern.image}
                      alt={pattern.label}
                      width={80}
                      height={80}
                      className="rounded object-cover"
                    />
                  )}
                </div>
                
                {/* Label Section (1/3 height) */}
                <div className="h-12 p-3 flex items-center justify-center">
                  <span className={`text-sm font-medium text-center leading-tight transition-colors ${
                    selectedPattern === pattern.id
                      ? 'text-[rgb(var(--color-primary))]'
                      : 'text-[rgb(var(--color-text-primary))]'
                  }`}>
                    {pattern.shortLabel}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Color Selection - Matching original PhysicalDetails.tsx exactly */}
      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">Primary Color</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {primaryColors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => onColorSelect(color.id)}
              className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 transform text-left ${
                selectedColor === color.id
                  ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] shadow-lg scale-105 ring-2 ring-[rgb(var(--color-primary-light))]'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))] hover:scale-102'
              }`}
            >
              {/* Color Circle */}
              <div className={`w-8 h-8 min-w-8 min-h-8 rounded-full mr-3 border-2 shrink-0 ${color.colorClass} ${
                color.id === 'white' ? 'border-gray-300' : 'border-white'
              }`}></div>
              
              {/* Label */}
              <span className={`text-sm font-medium transition-colors ${
                selectedColor === color.id
                  ? 'text-[rgb(var(--color-primary))]'
                  : 'text-[rgb(var(--color-text-primary))]'
              }`}>
                {color.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}