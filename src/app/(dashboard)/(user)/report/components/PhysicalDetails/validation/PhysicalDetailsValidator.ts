// Dependency Inversion Principle: Abstract validation logic
import { PhysicalDetailsFormData, FormValidationResult } from '../types/PhysicalDetailsTypes';

export interface ValidationErrors {
  animalType?: string | null;
  sex?: string | null;
  collar?: string | null;
  bodyConditionScore?: string | null;
  colorPattern?: string | null;
  primaryColor?: string | null;
}

export interface FormValidator {
  validate(data: PhysicalDetailsFormData): FormValidationResult & { errors: ValidationErrors };
  getMissingFields(data: PhysicalDetailsFormData): string[];
}

export class PhysicalDetailsValidator implements FormValidator {
  validate(data: PhysicalDetailsFormData): FormValidationResult & { errors: ValidationErrors } {
    const missingFields = this.getMissingFields(data);
    const errors = this.getFieldErrors(data);
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      errors
    };
  }

  getFieldErrors(data: PhysicalDetailsFormData): ValidationErrors {
    const errors: ValidationErrors = {};
    
    // Basic identification validation
    if (!data.animalType) errors.animalType = 'Please select animal type (Dog or Cat)';
    if (!data.sex) errors.sex = 'Please select the animal\'s sex';
    if (!data.collar) errors.collar = 'Please indicate collar status';
    
    // Physical attributes validation
    if (data.bodyConditionScore === null) errors.bodyConditionScore = 'Please select a body condition score';
    if (!data.colorPattern) errors.colorPattern = 'Please select the color pattern';
    if (!data.primaryColor) errors.primaryColor = 'Please select the primary color';
    
    return errors;
  }

  getMissingFields(data: PhysicalDetailsFormData): string[] {
    const missing = [];
    
    // Basic identification validation
    if (!data.animalType) missing.push('Animal Type (Dog or Cat)');
    if (!data.sex) missing.push('Sex (Male or Female)');
    if (!data.collar) missing.push('Collar Status (With or Without)');
    
    // Physical attributes validation
    if (data.bodyConditionScore === null) missing.push('Body Condition Score (1, 3, 5, 7, or 9)');
    if (!data.colorPattern) missing.push('Color Pattern');
    if (!data.primaryColor) missing.push('Primary Color');
    
    // Health assessment validation
    const hasSkinAssessment = data.physicalProblems.some(problem => problem.startsWith('skin-'));
    const hasEyeAssessment = data.physicalProblems.some(problem => problem.startsWith('eye-'));
    const hasGaitAssessment = data.physicalProblems.some(problem => problem.startsWith('gait-'));
    
    if (!hasSkinAssessment) missing.push('Skin Problems Assessment');
    if (!hasEyeAssessment) missing.push('Eye Problems Assessment');
    if (!hasGaitAssessment) missing.push('Gait Problems Assessment');
    
    return missing;
  }

  private hasAssessmentCategory(problems: string[], category: string): boolean {
    return problems.some(problem => problem.startsWith(`${category}-`));
  }
}