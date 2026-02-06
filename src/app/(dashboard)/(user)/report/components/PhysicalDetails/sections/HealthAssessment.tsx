// Single Responsibility Principle: Component focused only on health assessment
import { HealthAssessmentProps } from '../types/PhysicalDetailsTypes';
import { SKIN_CONDITIONS, EYE_CONDITIONS, GAIT_CONDITIONS } from '@/lib/constants/healthConditions';

export default function HealthAssessment({ selectedProblems, onProblemsChange }: HealthAssessmentProps) {
  // Use centralized health condition constants
  const skinProblems = SKIN_CONDITIONS;
  const eyeProblems = EYE_CONDITIONS;
  const gaitProblems = GAIT_CONDITIONS;

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