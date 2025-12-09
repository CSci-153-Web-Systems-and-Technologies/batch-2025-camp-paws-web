// Single Responsibility Principle: Component focused only on animal type selection
import { AnimalTypeSelectionProps } from '../types/PhysicalDetailsTypes';
import Image from 'next/image';

export default function AnimalTypeSelection({ selectedType, onSelect }: AnimalTypeSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">Animal Type</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onSelect('cat')}
          className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 transform ${
            selectedType === 'cat' 
              ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))] shadow-lg scale-105 ring-2 ring-[rgb(var(--color-primary-light))]' 
              : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))] hover:scale-102'
          }`}
        >
          <Image
            src="/Cat astronaut-cuate.svg"
            alt="Select cat"
            width={60}
            height={60}
            className="mb-2"
          />
          <span className={`text-sm font-bold ${
            selectedType === 'cat' ? 'text-white' : 'text-[rgb(var(--color-text-primary))]'
          }`}>Cat</span>
        </button>
        
        <button
          type="button"
          onClick={() => onSelect('dog')}
          className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 transform ${
            selectedType === 'dog' 
              ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))] shadow-lg scale-105 ring-2 ring-[rgb(var(--color-primary-light))]' 
              : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))] hover:scale-102'
          }`}
        >
          <Image
            src="/Dog paw-cuate.svg"
            alt="Select dog"
            width={60}
            height={60}
            className="mb-2"
          />
          <span className={`text-sm font-bold ${
            selectedType === 'dog' ? 'text-white' : 'text-[rgb(var(--color-text-primary))]'
          }`}>Dog</span>
        </button>
      </div>
    </div>
  );
}