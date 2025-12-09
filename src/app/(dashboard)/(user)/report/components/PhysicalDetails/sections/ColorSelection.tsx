// Single Responsibility Principle: Component focused only on color pattern and primary color selection
import { ColorSelectionProps } from '../types/PhysicalDetailsTypes';
import Image from 'next/image';

export default function ColorSelection({ animalType, selectedPattern, selectedColor, onPatternSelect, onColorSelect }: ColorSelectionProps) {
  // Color patterns vary by animal type - matching PhysicalDetails.tsx exactly
  const getColorPatterns = () => {
    if (animalType === 'cat') {
      return [
        { id: 'white-puspin', label: 'White Puspin', shortLabel: 'White', image: '/cat-color/white.png' },
        { id: 'black-puspin', label: 'Black Puspin', shortLabel: 'Black', image: '/cat-color/black.png' },
        { id: 'tabby-puspin', label: 'Tabby Puspin', shortLabel: 'Tabby', image: '/cat-color/Tabby.jpg' },
        { id: 'orange-tabby-puspin', label: 'Orange-Tabby Puspin', shortLabel: 'Orange Tabby', image: '/cat-color/orange-tabby.png' },
        { id: 'bi-color-puspin', label: 'Bi-color Puspin', shortLabel: 'Bi-color', image: '/cat-color/Bi-color.png' },
        { id: 'calico-puspin', label: 'Calico(Tri-color) Puspin', shortLabel: 'Calico', image: '/cat-color/Calico.jpg' },
        { id: 'tortoiseshell-puspin', label: 'Tortoiseshell Puspin', shortLabel: 'Tortoiseshell', image: '/cat-color/Tortoiseshell.jpg' },
        { id: 'not-sure-cat', label: 'Not Sure', shortLabel: 'Not Sure', image: '' }
      ];
    } else if (animalType === 'dog') {
      return [
        { id: 'bi-color', label: 'Bi-color', shortLabel: 'Bi-color', image: '/dog-color/Bi-color.png' },
        { id: 'blenheim', label: 'Blenheim', shortLabel: 'Blenheim', image: '/dog-color/Blenheim.png' },
        { id: 'brindle', label: 'Brindle', shortLabel: 'Brindle', image: '/dog-color/Brindle.png' },
        { id: 'harlequin', label: 'Harlequin', shortLabel: 'Harlequin', image: '/dog-color/Harlequin.png' },
        { id: 'hound-coat', label: 'Hound Coat', shortLabel: 'Hound Coat', image: '/dog-color/Hound-coat.png' },
        { id: 'mantle', label: 'Mantle', shortLabel: 'Mantle', image: '/dog-color/Mantle.png' },
        { id: 'merle', label: 'Merle', shortLabel: 'Merle', image: '/dog-color/Merle.png' },
        { id: 'patchy', label: 'Patchy', shortLabel: 'Patchy', image: '/dog-color/Patchy.png' },
        { id: 'plain', label: 'Plain', shortLabel: 'Plain', image: '/dog-color/Plain.png' },
        { id: 'sable', label: 'Sable', shortLabel: 'Sable', image: '/dog-color/Sable.png' },
        { id: 'tri-color', label: 'Tri-color', shortLabel: 'Tri-color', image: '/dog-color/Tri-color.png' },
        { id: 'tuxedo', label: 'Tuxedo', shortLabel: 'Tuxedo', image: '/dog-color/Tuxedo.png' },
        { id: 'not-sure-dog', label: 'Not Sure', shortLabel: 'Not Sure', image: '' }
      ];
    }
    return [];
  };

  // Primary colors exactly matching PhysicalDetails.tsx
  const primaryColors = [
    { id: 'black', label: 'Black', colorClass: 'bg-gray-900' },
    { id: 'white', label: 'White', colorClass: 'bg-white border-gray-300' },
    { id: 'brown', label: 'Brown / Chocolate', colorClass: 'bg-amber-800' },
    { id: 'tan', label: 'Tan / Fawn', colorClass: 'bg-yellow-600' },
    { id: 'grey', label: 'Grey / Blue', colorClass: 'bg-gray-500' },
    { id: 'red', label: 'Red / Orange / Ginger', colorClass: 'bg-orange-600' },
    { id: 'cream', label: 'Cream / Yellow', colorClass: 'bg-yellow-200' },
    { id: 'other', label: 'Other / Unsure', colorClass: 'bg-gray-300' }
  ];

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
          {getColorPatterns().map((pattern) => (
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
                  {pattern.id === 'not-sure-cat' || pattern.id === 'not-sure-dog' ? (
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
                  ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] shadow-md ring-2 ring-[rgb(var(--color-primary-light))]'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))]'
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