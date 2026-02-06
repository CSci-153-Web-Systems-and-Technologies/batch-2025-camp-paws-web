/**
 * Error Handler Utility
 * Centralized error handling and user-friendly error messages
 */

export interface ParsedError {
  title: string;
  message: string;
  details?: string;
  retryable: boolean;
}

/**
 * Parse server action errors into user-friendly messages
 */
export function parseServerError(error: unknown): ParsedError {
  const errorStr = String(error);
  const errorLower = errorStr.toLowerCase();

  // Authentication errors
  if (errorLower.includes('auth') || errorLower.includes('unauthenticated')) {
    return {
      title: 'Authentication Required',
      message: 'Please log in to continue',
      retryable: false,
    };
  }

  // Permission errors
  if (errorLower.includes('permission') || errorLower.includes('unauthorized')) {
    return {
      title: 'Permission Denied',
      message: 'You do not have permission to perform this action',
      retryable: false,
    };
  }

  // Network errors
  if (errorLower.includes('network') || errorLower.includes('fetch failed')) {
    return {
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      retryable: true,
    };
  }

  // Database errors
  if (errorLower.includes('database') || errorLower.includes('postgres')) {
    return {
      title: 'Database Error',
      message: 'There was a problem saving your data. Please try again.',
      details: 'If this problem persists, please contact support.',
      retryable: true,
    };
  }

  // Validation errors
  if (errorLower.includes('validation') || errorLower.includes('invalid')) {
    return {
      title: 'Validation Error',
      message: 'Please check your input and try again',
      details: errorStr,
      retryable: false,
    };
  }

  // File upload errors
  if (errorLower.includes('upload') || errorLower.includes('storage')) {
    return {
      title: 'Upload Failed',
      message: 'Failed to upload file. Please try again.',
      details: 'Make sure the file is under 5MB and in a supported format (JPG, PNG, WEBP)',
      retryable: true,
    };
  }

  // Bucket not found
  if (errorLower.includes('bucket not found')) {
    return {
      title: 'Storage Error',
      message: 'Photo storage is not configured. Please contact an administrator.',
      retryable: false,
    };
  }

  // Timeout errors
  if (errorLower.includes('timeout')) {
    return {
      title: 'Request Timeout',
      message: 'The request took too long. Please try again.',
      retryable: true,
    };
  }

  // RLS policy errors
  if (errorLower.includes('policy') || errorLower.includes('row-level security')) {
    return {
      title: 'Access Denied',
      message: 'You do not have permission to access this resource',
      retryable: false,
    };
  }

  // Generic server error
  if (errorLower.includes('internal server error') || errorLower.includes('500')) {
    return {
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.',
      retryable: true,
    };
  }

  // Default error
  return {
    title: 'Error',
    message: 'An unexpected error occurred',
    details: errorStr,
    retryable: true,
  };
}

/**
 * Format error for display in toast notifications
 */
export function formatErrorForToast(error: unknown): string {
  const parsed = parseServerError(error);
  let message = `${parsed.title}: ${parsed.message}`;
  
  if (parsed.details) {
    message += `\n${parsed.details}`;
  }
  
  return message;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  return parseServerError(error).retryable;
}

/**
 * Parse form validation errors
 */
export function parseValidationError(field: string, value: unknown): string | null {
  // Required field
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${field} is required`;
  }

  // File validation
  if (field.toLowerCase().includes('photo') || field.toLowerCase().includes('image')) {
    if (value instanceof File) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (value.size > maxSize) {
        return 'File size must be under 5MB';
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
      if (!validTypes.includes(value.type)) {
        return 'File must be an image (JPG, PNG, WEBP, or HEIC)';
      }
    }
  }

  return null;
}

/**
 * Network status detector
 */
export function checkNetworkStatus(): boolean {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true; // Assume online if can't detect
}

/**
 * Error logger for debugging
 */
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
  
  // In production, you might want to send to error tracking service
  // e.g., Sentry, LogRocket, etc.
}
