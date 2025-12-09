// Single Responsibility Principle: Component focused only on body condition scoring
import { BodyConditionProps } from '../types/PhysicalDetailsTypes';
import Image from 'next/image';

export default function BodyConditionSelection({ selectedScore, onSelect, animalType }: BodyConditionProps) {
  // Cat Body Condition Scores
  const catBodyConditionScores = [
    {
      score: 1,
      label: 'Very Thin',
      description: 'Ribs, spine and hip bones are visible (coat may interfere with visibility). Fat can not be seen or felt under the skin. Obvious loss of muscle mass.',
      image: '/cat-bcs/1.jpg'
    },
    {
      score: 3,
      label: 'Thin',
      description: 'Ribs, spine and hip bones are easily felt (coat may interfere with visibility). Fat can not be seen or felt under the skin. Obvious loss of muscle mass.',
      image: '/cat-bcs/3.jpg'
    },
    {
      score: 5,
      label: 'Ideal',
      description: 'Ribs, spine and hip bones are easily felt and may be visible (coat may interfere with visibility). A waist and abdominal tuck are seen when viewed from above and side.',
      image: '/cat-bcs/5.jpg'
    },
    {
      score: 7,
      label: 'Overweight',
      description: 'Ribs, spine and hip bones are not visible and difficult to feel. Excess fat is felt around ribs, spine and hip bones. Waist and abdominal tuck are minimal or absent.',
      image: '/cat-bcs/7.jpg'
    },
    {
      score: 9,
      label: 'Obesity',
      description: 'Ribs, spine and hip bones are difficult to feel under a thick layer of fat. Waist and abdomen distended when viewed from above and side. Prominent fat deposits over lower spine, neck and chest.',
      image: '/cat-bcs/9.jpg'
    }
  ];

  // Dog Body Condition Scores
  const dogBodyConditionScores = [
    {
      score: 1,
      label: 'Very Thin',
      description: 'Ribs, spine and hip bones are visible (coat may interfere with observation). Fat can not be seen or felt under the skin. Obvious loss of muscle mass. Extreme waist and abdominal tuck.',
      image: '/dog-bcs/1.png'
    },
    {
      score: 3,
      label: 'Thin',
      description: 'Ribs, spine and hip bones are easy to feel but visible. Fat can not be seen or felt under the skin, especially around the ribs and lower back. Obvious waist and abdominal tuck. Some muscle loss.',
      image: '/dog-bcs/3.png'
    },
    {
      score: 5,
      label: 'Ideal',
      description: 'Ribs, spine and hip bones are easily felt and may be visible (coat may interfere with visibility). A waist and abdominal tuck are seen when viewed from above and side. Fat can be felt around ribs, spine and hip bones.',
      image: '/dog-bcs/5.png'
    },
    {
      score: 7,
      label: 'Overweight',
      description: 'Ribs, spine and hip bones are not visible and difficult to feel. Excess fat is felt around ribs, spine and hip bones. Waist and abdominal tuck are minimal or absent.',
      image: '/dog-bcs/7.png'
    },
    {
      score: 9,
      label: 'Obesity',
      description: 'Ribs, spine and hip bones are difficult to feel under a thick layer of fat. Waist and abdomen distended when viewed from above and side. Prominent fat deposits over lower spine, neck and chest.',
      image: '/dog-bcs/9.png'
    }
  ];

  // Get the appropriate scores based on animal type
  const bodyConditionScores = animalType === 'cat' ? catBodyConditionScores : 
                             animalType === 'dog' ? dogBodyConditionScores : [];

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
        {bodyConditionScores.map((condition) => (
          <button
            key={condition.score}
            type="button"
            onClick={() => onSelect(condition.score)}
            className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-200 transform text-left ${
              selectedScore === condition.score
                ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] shadow-md ring-2 ring-[rgb(var(--color-primary-light))]'
                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))]'
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
                  selectedScore === condition.score
                    ? 'text-[rgb(var(--color-primary))]'
                    : 'text-[rgb(var(--color-text-primary))]'
                }`}>
                  {condition.score}
                </div>
                <div className={`text-lg font-semibold transition-colors ${
                  selectedScore === condition.score
                    ? 'text-[rgb(var(--color-primary))]'
                    : 'text-[rgb(var(--color-text-primary))]'
                }`}>
                  {condition.label}
                </div>
              </div>
              <div className={`text-sm leading-relaxed transition-colors ${
                selectedScore === condition.score
                  ? 'text-[rgb(var(--color-primary))]'
                  : 'text-[rgb(var(--color-text-secondary))]'
              }`}>
                {condition.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}