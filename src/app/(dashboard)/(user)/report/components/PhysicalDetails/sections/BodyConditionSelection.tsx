// Single Responsibility Principle: Component focused only on body condition scoring
import { BodyConditionProps } from '../types/PhysicalDetailsTypes';
import Image from 'next/image';
import { CAT_BODY_CONDITION_SCORES, DOG_BODY_CONDITION_SCORES } from '@/lib/constants/animalAttributes';

export default function BodyConditionSelection({ selectedScore, onSelect, animalType }: BodyConditionProps) {
  // Get the appropriate scores from centralized constants
  const bodyConditionScores = animalType === 'cat' ? CAT_BODY_CONDITION_SCORES : 
                             animalType === 'dog' ? DOG_BODY_CONDITION_SCORES : [];

  // If no animal type is selected, show a message
  if (!animalType) {
    return (
      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">
          Body Condition Score
        </label>
        <div className="bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg p-4 text-center">
          <p className="text-[rgb(var(--color-text-tertiary))] text-sm">Please select an animal type first to see body condition scores</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-3">
        Body Condition Score
      </label>
      <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-4">
        Rate the animal&apos;s body condition from 1 (emaciated) to 9 (obese)
      </p>
      
      <div className="space-y-3">
        {bodyConditionScores.map((condition) => {
          const isSelected = selectedScore === condition.score;
          return (
            <button
              key={condition.score}
              type="button"
              onClick={() => onSelect(condition.score)}
              className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-200 transform text-left ${
                isSelected
                  ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] shadow-lg scale-[1.02] ring-2 ring-[rgb(var(--color-primary-light))]'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))] hover:scale-[1.01]'
              }`}
            >
              {/* Image Section (Left) */}
              <div className="shrink-0 mr-4">
                <Image
                  src={condition.image}
                  alt={`${animalType === 'cat' ? 'Cat' : 'Dog'} Body Condition Score ${condition.score}`}
                  width={120}
                  height={80}
                  className="rounded object-cover"
                />
              </div>
              
              {/* Text Section (Right) */}
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className={`text-2xl font-bold mr-3 transition-colors ${
                    isSelected
                      ? 'text-[rgb(var(--color-primary))]'
                      : 'text-[rgb(var(--color-text-primary))]'
                  }`}>
                    {condition.score}
                  </div>
                  <div className={`text-lg font-semibold transition-colors ${
                    isSelected
                      ? 'text-[rgb(var(--color-primary))]'
                      : 'text-[rgb(var(--color-text-primary))]'
                  }`}>
                    {condition.label}
                  </div>
                </div>
                <div className={`text-sm leading-relaxed transition-colors ${
                  isSelected
                    ? 'text-[rgb(var(--color-primary))]'
                    : 'text-[rgb(var(--color-text-secondary))]'
                }`}>
                  {condition.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}