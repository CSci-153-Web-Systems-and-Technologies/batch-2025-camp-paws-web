/**
 * Health Condition Constants
 * These replace the deleted database tables:
 * - skin_condition_types
 * - eye_condition_types  
 * - gait_condition_types
 * 
 * Data source: /docs/data-in-old.txt
 */

// ============================================================================
// TYPES
// ============================================================================

export interface HealthCondition {
  id: string;
  label: string;
  description: string;
}

// ============================================================================
// SKIN CONDITIONS
// ============================================================================

export const SKIN_CONDITIONS: readonly HealthCondition[] = [
  {
    id: 'skin-none',
    label: 'None/Normal',
    description: 'No visible skin issues, coat looks healthy.',
  },
  {
    id: 'skin-hair-loss',
    label: 'Missing Hair/Bald Patches',
    description: 'Noticeable areas where fur is missing.',
  },
  {
    id: 'skin-redness',
    label: 'Redness/Irritation',
    description: 'Skin looks inflamed, bright red, or heavily scratched.',
  },
  {
    id: 'skin-wounds',
    label: 'Wounds/Cuts/Blood',
    description: 'An open, bloody cut, tear, or severe scrape is visible.',
  },
  {
    id: 'skin-lumps',
    label: 'Lumps/Bumps/Swelling',
    description: 'Any significant raised area, lump, or general swelling under the skin.',
  },
  {
    id: 'skin-parasites',
    label: 'Heavy Parasites',
    description: 'Visible fleas, ticks, or excessive black "flea dirt" in the coat.',
  },
] as const;

// ============================================================================
// EYE CONDITIONS
// ============================================================================

export const EYE_CONDITIONS: readonly HealthCondition[] = [
  {
    id: 'eye-none',
    label: 'None/Normal',
    description: 'Eyes appear clear, open, and free of excessive discharge.',
  },
  {
    id: 'eye-squinting',
    label: 'Squinting/Shut',
    description: 'The pet is constantly blinking, squinting, or holding one eye tightly shut (indicates pain).',
  },
  {
    id: 'eye-discharge',
    label: 'Thick/Colored Discharge',
    description: 'A noticeable amount of green, yellow, or thick pus coming from one or both eyes.',
  },
  {
    id: 'eye-tearing',
    label: 'Excessive Tearing/Watery',
    description: 'The eye is constantly running with clear, watery fluid.',
  },
  {
    id: 'eye-cloudy',
    label: 'Cloudy/Hazy Eye',
    description: 'The front part of the eye (cornea/pupil area) looks hazy, gray, or blue/white.',
  },
  {
    id: 'eye-red',
    label: 'Red/Inflamed Eyelids',
    description: 'The eyelids or the white part of the eye are noticeably very red or swollen.',
  },
] as const;

// ============================================================================
// GAIT CONDITIONS
// ============================================================================

export const GAIT_CONDITIONS: readonly HealthCondition[] = [
  {
    id: 'gait-none',
    label: 'None/Normal',
    description: 'Walks and runs without limping or difficulty.',
  },
  {
    id: 'gait-mild-limp',
    label: 'Mild Limping/Favoring a Limb',
    description: 'Has a slight limp or puts noticeably less weight on one or more legs.',
  },
  {
    id: 'gait-severe-limp',
    label: 'Severe Limping/3-Legged Walk',
    description: 'Is holding a leg up completely and walking on only three legs.',
  },
  {
    id: 'gait-wobbly',
    label: 'Stumbling/Wobbly/Uncoordinated',
    description: 'Walks with a wide stance, stumbles, sways side-to-side, or loses balance easily.',
  },
  {
    id: 'gait-dragging',
    label: 'Dragging/Knuckling',
    description: 'Is dragging a foot or walking on the top of the paw/knuckles instead of the pad.',
  },
  {
    id: 'gait-reluctant',
    label: 'Reluctance to Move/Stiffness',
    description: 'Struggles to stand up, moves very slowly, or refuses to jump or run.',
  },
] as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all health conditions as a flat array
 */
export const ALL_HEALTH_CONDITIONS = [
  ...SKIN_CONDITIONS,
  ...EYE_CONDITIONS,
  ...GAIT_CONDITIONS,
] as const;

/**
 * Get condition by ID (across all types)
 */
export function getHealthConditionById(id: string): HealthCondition | undefined {
  return ALL_HEALTH_CONDITIONS.find((condition) => condition.id === id);
}

/**
 * Get condition label by ID
 */
export function getHealthConditionLabel(id: string): string {
  return getHealthConditionById(id)?.label || id;
}

/**
 * Check if a condition ID is valid
 */
export function isValidHealthConditionId(id: string): boolean {
  return ALL_HEALTH_CONDITIONS.some((condition) => condition.id === id);
}

/**
 * Check if user has selected "None" for a category
 */
export function hasNormalCondition(conditions: string[], category: 'skin' | 'eye' | 'gait'): boolean {
  return conditions.includes(`${category}-none`);
}

/**
 * Filter out "none" conditions
 */
export function filterNoneConditions(conditions: string[]): string[] {
  return conditions.filter(id => !id.endsWith('-none'));
}

// ============================================================================
// TYPE EXPORTS (for strict typing)
// ============================================================================

export type SkinConditionId = typeof SKIN_CONDITIONS[number]['id'];
export type EyeConditionId = typeof EYE_CONDITIONS[number]['id'];
export type GaitConditionId = typeof GAIT_CONDITIONS[number]['id'];
export type HealthConditionId = SkinConditionId | EyeConditionId | GaitConditionId;
