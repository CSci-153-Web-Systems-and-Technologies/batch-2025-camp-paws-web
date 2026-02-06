/**
 * Animal Attributes Constants
 * These replace the deleted database tables:
 * - primary_colors
 * - color_patterns
 * - dog_body_condition_scores
 * - cat_body_condition_scores
 * 
 * Data source: /docs/data-in-old.txt
 */

// ============================================================================
// TYPES
// ============================================================================

export type AnimalType = 'dog' | 'cat';
export type Sex = 'male' | 'female' | 'unknown';
export type CollarStatus = 'with' | 'without' | 'unknown';

export interface PrimaryColor {
  id: string;
  label: string;
  colorClass: string; // Tailwind class for visual display
}

export interface ColorPattern {
  id: string;
  name: string;
  label: string;
  shortLabel: string;
  image: string;
  animalType: AnimalType;
}

export interface BodyConditionScore {
  score: 1 | 3 | 5 | 7 | 9;
  label: string;
  description: string;
  image: string;
}

// ============================================================================
// PRIMARY COLORS
// ============================================================================

export const PRIMARY_COLORS: readonly PrimaryColor[] = [
  {
    id: 'black',
    label: 'Black',
    colorClass: 'bg-gray-900',
  },
  {
    id: 'white',
    label: 'White',
    colorClass: 'bg-white border-gray-300',
  },
  {
    id: 'brown',
    label: 'Brown / Chocolate',
    colorClass: 'bg-amber-800',
  },
  {
    id: 'tan',
    label: 'Tan / Fawn',
    colorClass: 'bg-yellow-600',
  },
  {
    id: 'grey',
    label: 'Grey / Blue',
    colorClass: 'bg-gray-500',
  },
  {
    id: 'red',
    label: 'Red / Orange / Ginger',
    colorClass: 'bg-orange-600',
  },
  {
    id: 'cream',
    label: 'Cream / Yellow',
    colorClass: 'bg-yellow-200',
  },
  {
    id: 'other',
    label: 'Other / Unsure',
    colorClass: 'bg-gray-300',
  },
] as const;

// ============================================================================
// COLOR PATTERNS (by Animal Type)
// ============================================================================

export const CAT_COLOR_PATTERNS: readonly ColorPattern[] = [
  {
    id: 'white-puspin',
    name: 'White Puspin',
    label: 'White Puspin',
    shortLabel: 'White',
    image: '/cat-color/white.png',
    animalType: 'cat',
  },
  {
    id: 'black-puspin',
    name: 'Black Puspin',
    label: 'Black Puspin',
    shortLabel: 'Black',
    image: '/cat-color/black.png',
    animalType: 'cat',
  },
  {
    id: 'tabby-puspin',
    name: 'Tabby Puspin',
    label: 'Tabby Puspin',
    shortLabel: 'Tabby',
    image: '/cat-color/Tabby.jpg',
    animalType: 'cat',
  },
  {
    id: 'orange-tabby-puspin',
    name: 'Orange-Tabby Puspin',
    label: 'Orange-Tabby Puspin',
    shortLabel: 'Orange Tabby',
    image: '/cat-color/orange-tabby.png',
    animalType: 'cat',
  },
  {
    id: 'bi-color-puspin',
    name: 'Bi-color Puspin',
    label: 'Bi-color Puspin',
    shortLabel: 'Bi-color',
    image: '/cat-color/Bi-color.png',
    animalType: 'cat',
  },
  {
    id: 'calico-puspin',
    name: 'Calico(Tri-color) Puspin',
    label: 'Calico(Tri-color) Puspin',
    shortLabel: 'Calico',
    image: '/cat-color/Calico.jpg',
    animalType: 'cat',
  },
  {
    id: 'tortoiseshell-puspin',
    name: 'Tortoiseshell Puspin',
    label: 'Tortoiseshell Puspin',
    shortLabel: 'Tortoiseshell',
    image: '/cat-color/Tortoiseshell.jpg',
    animalType: 'cat',
  },
  {
    id: 'not-sure-cat-pattern',
    name: 'Not Sure',
    label: 'Not Sure',
    shortLabel: 'Not Sure',
    image: '',
    animalType: 'cat',
  },
] as const;

export const DOG_COLOR_PATTERNS: readonly ColorPattern[] = [
  {
    id: 'bi-color-dog',
    name: 'Bi-color',
    label: 'Bi-color',
    shortLabel: 'Bi-color',
    image: '/dog-color/Bi-color.png',
    animalType: 'dog',
  },
  {
    id: 'blenheim',
    name: 'Blenheim',
    label: 'Blenheim',
    shortLabel: 'Blenheim',
    image: '/dog-color/Blenheim.png',
    animalType: 'dog',
  },
  {
    id: 'brindle',
    name: 'Brindle',
    label: 'Brindle',
    shortLabel: 'Brindle',
    image: '/dog-color/Brindle.png',
    animalType: 'dog',
  },
  {
    id: 'harlequin',
    name: 'Harlequin',
    label: 'Harlequin',
    shortLabel: 'Harlequin',
    image: '/dog-color/Harlequin.png',
    animalType: 'dog',
  },
  {
    id: 'hound-coat',
    name: 'Hound Coat',
    label: 'Hound Coat',
    shortLabel: 'Hound Coat',
    image: '/dog-color/Hound-coat.png',
    animalType: 'dog',
  },
  {
    id: 'mantle',
    name: 'Mantle',
    label: 'Mantle',
    shortLabel: 'Mantle',
    image: '/dog-color/Mantle.png',
    animalType: 'dog',
  },
  {
    id: 'merle',
    name: 'Merle',
    label: 'Merle',
    shortLabel: 'Merle',
    image: '/dog-color/Merle.png',
    animalType: 'dog',
  },
  {
    id: 'patchy',
    name: 'Patchy',
    label: 'Patchy',
    shortLabel: 'Patchy',
    image: '/dog-color/Patchy.png',
    animalType: 'dog',
  },
  {
    id: 'plain',
    name: 'Plain',
    label: 'Plain',
    shortLabel: 'Plain',
    image: '/dog-color/Plain.png',
    animalType: 'dog',
  },
  {
    id: 'sable',
    name: 'Sable',
    label: 'Sable',
    shortLabel: 'Sable',
    image: '/dog-color/Sable.png',
    animalType: 'dog',
  },
  {
    id: 'tri-color-dog',
    name: 'Tri-color',
    label: 'Tri-color',
    shortLabel: 'Tri-color',
    image: '/dog-color/Tri-color.png',
    animalType: 'dog',
  },
  {
    id: 'tuxedo',
    name: 'Tuxedo',
    label: 'Tuxedo',
    shortLabel: 'Tuxedo',
    image: '/dog-color/Tuxedo.png',
    animalType: 'dog',
  },
  {
    id: 'not-sure-dog-pattern',
    name: 'Not Sure',
    label: 'Not Sure',
    shortLabel: 'Not Sure',
    image: '',
    animalType: 'dog',
  },
] as const;

export const ALL_COLOR_PATTERNS: readonly ColorPattern[] = [
  ...CAT_COLOR_PATTERNS,
  ...DOG_COLOR_PATTERNS,
] as const;

// ============================================================================
// BODY CONDITION SCORES
// ============================================================================

export const DOG_BODY_CONDITION_SCORES: readonly BodyConditionScore[] = [
  {
    score: 1,
    label: 'Very Thin',
    description: 'Ribs, spine and hip bones are visible (coat may interfere with observation). Fat can not be seen or felt under the skin. Obvious loss of muscle mass. Extreme waist and abdominal tuck.',
    image: '/dog-bcs/1.png',
  },
  {
    score: 3,
    label: 'Thin',
    description: 'Ribs, spine and hip bones are easy to feel but visible. Fat can not be seen or felt under the skin, especially around the ribs and lower back. Obvious waist and abdominal tuck. Some muscle loss.',
    image: '/dog-bcs/3.png',
  },
  {
    score: 5,
    label: 'Ideal',
    description: 'Ribs, spine and hip bones are easily felt and may be visible (coat may interfere with visibility). A waist and abdominal tuck are seen when viewed from above and side. Fat can be felt around ribs, spine and hip bones.',
    image: '/dog-bcs/5.png',
  },
  {
    score: 7,
    label: 'Overweight',
    description: 'Ribs, spine and hip bones are not visible and difficult to feel. Excess fat is felt around ribs, spine and hip bones. Waist and abdominal tuck are minimal or absent.',
    image: '/dog-bcs/7.png',
  },
  {
    score: 9,
    label: 'Obesity',
    description: 'Ribs, spine and hip bones are difficult to feel under a thick layer of fat. Waist and abdomen distended when viewed from above and side. Prominent fat deposits over lower spine, neck and chest.',
    image: '/dog-bcs/9.png',
  },
] as const;

export const CAT_BODY_CONDITION_SCORES: readonly BodyConditionScore[] = [
  {
    score: 1,
    label: 'Very Thin',
    description: 'Ribs, spine and hip bones are visible (coat may interfere with visibility). Fat can not be seen or felt under the skin. Obvious loss of muscle mass.',
    image: '/cat-bcs/1.jpg',
  },
  {
    score: 3,
    label: 'Thin',
    description: 'Ribs, spine and hip bones are easily felt (coat may interfere with visibility). Fat can not be seen or felt under the skin. Obvious loss of muscle mass.',
    image: '/cat-bcs/3.jpg',
  },
  {
    score: 5,
    label: 'Ideal',
    description: 'Ribs, spine and hip bones are easily felt and may be visible (coat may interfere with visibility). A waist and abdominal tuck are seen when viewed from above and side.',
    image: '/cat-bcs/5.jpg',
  },
  {
    score: 7,
    label: 'Overweight',
    description: 'Ribs, spine and hip bones are not visible and difficult to feel. Excess fat is felt around ribs, spine and hip bones. Waist and abdominal tuck are minimal or absent.',
    image: '/cat-bcs/7.jpg',
  },
  {
    score: 9,
    label: 'Obesity',
    description: 'Ribs, spine and hip bones are difficult to feel under a thick layer of fat. Waist and abdomen distended when viewed from above and side. Prominent fat deposits over lower spine, neck and chest.',
    image: '/cat-bcs/9.jpg',
  },
] as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get color patterns for a specific animal type
 */
export function getColorPatternsForAnimal(animalType: AnimalType): readonly ColorPattern[] {
  return animalType === 'cat' ? CAT_COLOR_PATTERNS : DOG_COLOR_PATTERNS;
}

/**
 * Get body condition scores for a specific animal type
 */
export function getBodyConditionScoresForAnimal(animalType: AnimalType): readonly BodyConditionScore[] {
  return animalType === 'cat' ? CAT_BODY_CONDITION_SCORES : DOG_BODY_CONDITION_SCORES;
}

/**
 * Get primary color by ID
 */
export function getPrimaryColorById(id: string): PrimaryColor | undefined {
  return PRIMARY_COLORS.find((color) => color.id === id);
}

/**
 * Get color pattern by ID
 */
export function getColorPatternById(id: string): ColorPattern | undefined {
  return ALL_COLOR_PATTERNS.find((pattern) => pattern.id === id);
}

/**
 * Get body condition score details
 */
export function getBodyConditionScore(
  animalType: AnimalType,
  score: number
): BodyConditionScore | undefined {
  const scores = getBodyConditionScoresForAnimal(animalType);
  return scores.find((s) => s.score === score);
}

/**
 * Validate color pattern matches animal type
 */
export function isValidColorPatternForAnimal(patternId: string, animalType: AnimalType): boolean {
  const patterns = getColorPatternsForAnimal(animalType);
  return patterns.some((pattern) => pattern.id === patternId);
}

// ============================================================================
// TYPE EXPORTS (for strict typing)
// ============================================================================

export type PrimaryColorId = typeof PRIMARY_COLORS[number]['id'];
export type CatColorPatternId = typeof CAT_COLOR_PATTERNS[number]['id'];
export type DogColorPatternId = typeof DOG_COLOR_PATTERNS[number]['id'];
export type ColorPatternId = CatColorPatternId | DogColorPatternId;
export type BodyConditionScoreValue = 1 | 3 | 5 | 7 | 9;
