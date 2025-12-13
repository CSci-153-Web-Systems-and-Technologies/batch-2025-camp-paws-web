// Single Responsibility Principle: Component focused only on health assessment
// Retains exact styling and content from original PhysicalDetails.tsx
import { HealthAssessmentProps } from '../types/PhysicalDetailsTypes';

export default function HealthAssessment({ selectedProblems, onProblemsChange }: HealthAssessmentProps) {
  // Exact problem definitions from original PhysicalDetails.tsx
  const skinProblems = [
    { id: 'skin-none', label: 'None/Normal', description: 'No visible skin issues, coat looks healthy.' },
    { id: 'skin-hair-loss', label: 'Missing Hair/Bald Patches', description: 'Noticeable areas where fur is missing.' },
    { id: 'skin-redness', label: 'Redness/Irritation', description: 'Skin looks inflamed, bright red, or heavily scratched.' },
    { id: 'skin-wounds', label: 'Wounds/Cuts/Blood', description: 'An open, bloody cut, tear, or severe scrape is visible.' },
    { id: 'skin-lumps', label: 'Lumps/Bumps/Swelling', description: 'Any significant raised area, lump, or general swelling under the skin.' },
    { id: 'skin-parasites', label: 'Heavy Parasites', description: 'Visible fleas, ticks, or excessive black "flea dirt" in the coat.' }
  ];

  const eyeProblems = [
    { id: 'eye-none', label: 'None/Normal', description: 'Eyes appear clear, open, and free of excessive discharge.' },
    { id: 'eye-squinting', label: 'Squinting/Shut', description: 'The pet is constantly blinking, squinting, or holding one eye tightly shut (indicates pain).' },
    { id: 'eye-discharge', label: 'Thick/Colored Discharge', description: 'A noticeable amount of green, yellow, or thick pus coming from one or both eyes.' },
    { id: 'eye-tearing', label: 'Excessive Tearing/Watery', description: 'The eye is constantly running with clear, watery fluid.' },
    { id: 'eye-cloudy', label: 'Cloudy/Hazy Eye', description: 'The front part of the eye (cornea/pupil area) looks hazy, gray, or blue/white.' },
    { id: 'eye-red', label: 'Red/Inflamed Eyelids', description: 'The eyelids or the white part of the eye are noticeably very red or swollen.' }
  ];

  const gaitProblems = [
    { id: 'gait-none', label: 'None/Normal', description: 'Walks and runs without limping or difficulty.' },
    { id: 'gait-mild-limp', label: 'Mild Limping/Favoring a Limb', description: 'Has a slight limp or puts noticeably less weight on one or more legs.' },
    { id: 'gait-severe-limp', label: 'Severe Limping/3-Legged Walk', description: 'Is holding a leg up completely and walking on only three legs.' },
    { id: 'gait-wobbly', label: 'Stumbling/Wobbly/Uncoordinated', description: 'Walks with a wide stance, stumbles, sways side-to-side, or loses balance easily.' },
    { id: 'gait-dragging', label: 'Dragging/Knuckling', description: 'Is dragging a foot or walking on the top of the paw/knuckles instead of the pad.' },
    { id: 'gait-reluctant', label: 'Reluctance to Move/Stiffness', description: 'Struggles to stand up, moves very slowly, or refuses to jump or run.' }
  ];

  // Handle problem selection with exact logic from original PhysicalDetails.tsx
  const handleProblemToggle = (problemId: string) => {
    const currentProblems = selectedProblems || [];
    const isSelected = currentProblems.includes(problemId);
    let newProblems;
    
    if (problemId === 'skin-none') {
      // If selecting "None", clear all other skin problems
      newProblems = isSelected ? [] : [problemId];
    } else if (problemId.startsWith('skin-')) {
      // If selecting a specific problem, remove "None" and toggle this problem
      const filteredProblems = currentProblems.filter(p => p !== 'skin-none');
      newProblems = isSelected 
        ? filteredProblems.filter(p => p !== problemId)
        : [...filteredProblems, problemId];
    } else if (problemId === 'eye-none') {
      // If selecting "None", clear all other eye problems
      const nonEyeProblems = currentProblems.filter(p => !p.startsWith('eye-'));
      newProblems = isSelected ? nonEyeProblems : [...nonEyeProblems, problemId];
    } else if (problemId.startsWith('eye-')) {
      // If selecting a specific problem, remove "None" and toggle this problem
      const filteredProblems = currentProblems.filter(p => p !== 'eye-none');
      newProblems = isSelected 
        ? filteredProblems.filter(p => p !== problemId)
        : [...filteredProblems, problemId];
    } else if (problemId === 'gait-none') {
      // If selecting "None", clear all other gait problems
      const nonGaitProblems = currentProblems.filter(p => !p.startsWith('gait-'));
      newProblems = isSelected ? nonGaitProblems : [...nonGaitProblems, problemId];
    } else if (problemId.startsWith('gait-')) {
      // If selecting a specific problem, remove "None" and toggle this problem
      const filteredProblems = currentProblems.filter(p => p !== 'gait-none');
      newProblems = isSelected 
        ? filteredProblems.filter(p => p !== problemId)
        : [...filteredProblems, problemId];
    }
    
    onProblemsChange(newProblems || []);
  };

  const renderProblemSection = (title: string, problems: typeof skinProblems) => (
    <div className="mb-8">
      <h4 className="text-base font-medium text-[rgb(var(--color-text-primary))] mb-4">
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {problems.map((problem) => (
          <button
            key={problem.id}
            type="button"
            onClick={() => handleProblemToggle(problem.id)}
            className={`text-left p-4 rounded-lg border-2 transition-all duration-200 transform ${
              (selectedProblems || []).includes(problem.id)
                ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary-light))] shadow-md ring-2 ring-[rgb(var(--color-primary-light))]'
                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:border-[rgb(var(--color-primary))]'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`shrink-0 w-5 h-5 min-w-5 min-h-5 rounded border-2 flex items-center justify-center transition-colors ${
                (selectedProblems || []).includes(problem.id)
                  ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]'
                  : 'border-[rgb(var(--color-border))]'
              }`}>
                {(selectedProblems || []).includes(problem.id) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className={`font-medium text-sm transition-colors ${
                  (selectedProblems || []).includes(problem.id)
                    ? 'text-[rgb(var(--color-primary))]'
                    : 'text-[rgb(var(--color-text-primary))]'
                }`}>
                  {problem.label}
                </div>
                <div className={`text-xs mt-1 transition-colors ${
                  (selectedProblems || []).includes(problem.id)
                    ? 'text-[rgb(var(--color-primary))]'
                    : 'text-[rgb(var(--color-text-secondary))]'
                }`}>
                  {problem.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {renderProblemSection('Skin Problems (Select all that apply)', skinProblems)}
      {renderProblemSection('Eye Problems (Select all that apply)', eyeProblems)}
      {renderProblemSection('Gait Problems (Select all that apply)', gaitProblems)}
    </div>
  );
}