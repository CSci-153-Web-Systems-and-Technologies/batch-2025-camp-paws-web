// Dependency Inversion Principle: Abstract validation logic
import { FileValidationResult, FileConstraints } from '../types/PhotoUploadTypes';

export interface FileValidator {
  validate(file: File): FileValidationResult;
}

export class PhotoFileValidator implements FileValidator {
  private constraints: FileConstraints;

  constructor(constraints?: Partial<FileConstraints>) {
    // Default constraints
    this.constraints = {
      maxSizeMB: constraints?.maxSizeMB ?? 10,
      allowedTypes: constraints?.allowedTypes ?? ['image/jpeg', 'image/jpg', 'image/png'],
      maxFiles: constraints?.maxFiles ?? 3,
    };
  }

  validate(file: File): FileValidationResult {
    // Check if file exists
    if (!file) {
      return {
        isValid: false,
        error: 'No file selected',
      };
    }

    // Check file type
    if (!this.isValidType(file)) {
      return {
        isValid: false,
        error: `Invalid file type. Only ${this.getAllowedExtensions()} are allowed.`,
      };
    }

    // Check file size
    if (!this.isValidSize(file)) {
      return {
        isValid: false,
        error: `File size exceeds ${this.constraints.maxSizeMB}MB limit.`,
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  private isValidType(file: File): boolean {
    return this.constraints.allowedTypes.includes(file.type);
  }

  private isValidSize(file: File): boolean {
    const fileSizeMB = file.size / (1024 * 1024);
    return fileSizeMB <= this.constraints.maxSizeMB;
  }

  private getAllowedExtensions(): string {
    return this.constraints.allowedTypes
      .map(type => type.split('/')[1].toUpperCase())
      .join(', ');
  }

  getConstraints(): FileConstraints {
    return { ...this.constraints };
  }
}
