// Single Responsibility Principle: Component focused only on animal type selection
import { AnimalTypeSelectionProps } from '../types/PhysicalDetailsTypes';
import Image from 'next/image';
import SelectionButton from '@/components/ui/SelectionButton';

export default function AnimalTypeSelection({ selectedType, onSelect }: AnimalTypeSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">Animal Type</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectionButton
          isSelected={selectedType === 'cat'}
          onSelect={() => onSelect('cat')}
          icon={
            <Image
              src="/Cat astronaut-cuate.svg"
              alt="Select cat"
              width={60}
              height={60}
            />
          }
        >
          Cat
        </SelectionButton>
        
        <SelectionButton
          isSelected={selectedType === 'dog'}
          onSelect={() => onSelect('dog')}
          icon={
            <Image
              src="/Dog paw-cuate.svg"
              alt="Select dog"
              width={60}
              height={60}
            />
          }
        >
          Dog
        </SelectionButton>
      </div>
    </div>
  );
}