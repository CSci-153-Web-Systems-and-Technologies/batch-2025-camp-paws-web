/**
 * Single Responsibility Principle: Utility focused only on parsing physical problem data
 * Parses physicalProblems array from format 'category-problem' into categorized display data
 */

export interface CategorizedProblems {
  skin: string[];
  eye: string[];
  gait: string[];
}

/**
 * Parse physicalProblems array and group by category
 * @param problems - Array of problem strings in format 'category-problem'
 * @returns Categorized problems object
 */
export function parsePhysicalProblems(problems: string[]): CategorizedProblems {
  const categorized: CategorizedProblems = {
    skin: [],
    eye: [],
    gait: []
  };

  problems.forEach(problem => {
    if (problem.startsWith('skin-') && problem !== 'skin-none') {
      categorized.skin.push(formatProblemLabel(problem));
    } else if (problem.startsWith('eye-') && problem !== 'eye-none') {
      categorized.eye.push(formatProblemLabel(problem));
    } else if (problem.startsWith('gait-') && problem !== 'gait-none') {
      categorized.gait.push(formatProblemLabel(problem));
    }
  });

  return categorized;
}

/**
 * Convert problem ID to human-readable label
 * @param problemId - Problem string in format 'category-problem'
 * @returns Formatted label
 */
function formatProblemLabel(problemId: string): string {
  // Remove category prefix (e.g., 'skin-', 'eye-', 'gait-')
  const withoutPrefix = problemId.split('-').slice(1).join('-');
  
  // Convert to title case and replace dashes with spaces
  return withoutPrefix
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Check if any problems exist in a category
 * @param problems - Array of problem strings
 * @param category - Category to check ('skin', 'eye', or 'gait')
 * @returns True if problems exist in category
 */
export function hasCategoryProblems(problems: string[], category: 'skin' | 'eye' | 'gait'): boolean {
  return problems.some(p => p.startsWith(`${category}-`) && p !== `${category}-none`);
}
