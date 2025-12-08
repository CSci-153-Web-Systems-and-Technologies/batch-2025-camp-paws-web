// Dependency Inversion Principle: Abstract data transformation
import { PhysicalDetailsFormData, BackendPhysicalData } from '../types/PhysicalDetailsTypes';

export interface DataTransformer<TInput, TOutput> {
  transform(input: TInput): TOutput;
}

export class PhysicalDetailsTransformer implements DataTransformer<PhysicalDetailsFormData, BackendPhysicalData> {
  transform(formData: PhysicalDetailsFormData): BackendPhysicalData {
    const skinProblems = this.filterProblemsByCategory(formData.physicalProblems, 'skin');
    const eyeProblems = this.filterProblemsByCategory(formData.physicalProblems, 'eye');
    const gaitProblems = this.filterProblemsByCategory(formData.physicalProblems, 'gait');

    return {
      // Basic identification
      animal_type: formData.animalType,
      sex: formData.sex,
      collar_status: formData.collar,
      
      // Physical attributes
      body_condition_score: formData.bodyConditionScore!,
      color_pattern: formData.colorPattern,
      primary_color: formData.primaryColor,
      
      // Physical assessment (structured for easy querying)
      health_assessment: {
        skin_problems: skinProblems,
        eye_problems: eyeProblems,
        gait_problems: gaitProblems,
      },
      
      // Additional notes (optional)
      additional_notes: formData.notes.trim() || null,
      
      // Metadata for tracking
      form_completed_at: new Date().toISOString(),
      form_version: '1.0',
    };
  }

  private filterProblemsByCategory(problems: string[], category: string): string[] {
    return problems.filter(problem => problem.startsWith(`${category}-`));
  }
}