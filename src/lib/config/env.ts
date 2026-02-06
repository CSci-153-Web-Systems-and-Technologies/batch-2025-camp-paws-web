/**
 * Environment variable validation and helpers
 * Ensures required env vars are present and provides type-safe access
 */

interface EnvironmentVariables {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string; // Optional, only needed server-side
}

class EnvironmentError extends Error {
  constructor(varName: string) {
    super(
      `Missing required environment variable: ${varName}\n` +
      `Please add it to your .env.local file.\n` +
      `See README.md for setup instructions.`
    );
    this.name = 'EnvironmentError';
  }
}

/**
 * Validates that all required environment variables are present
 * Call this at app initialization to fail fast if config is missing
 */
export function validateEnvironment(): void {
  const required: (keyof EnvironmentVariables)[] = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing: string[] = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new EnvironmentError(missing[0]);
  }

  // Validate URL format
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url && !url.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must start with https://');
  }
}

/**
 * Get Supabase URL with runtime validation
 * @throws {EnvironmentError} If the URL is not configured
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new EnvironmentError('NEXT_PUBLIC_SUPABASE_URL');
  }
  return url;
}

/**
 * Get Supabase anon key with runtime validation
 * @throws {EnvironmentError} If the key is not configured
 */
export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new EnvironmentError('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return key;
}

/**
 * Get Supabase service role key (server-side only!)
 * @throws {EnvironmentError} If the key is not configured
 */
export function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new EnvironmentError('SUPABASE_SERVICE_ROLE_KEY');
  }
  return key;
}

/**
 * Check if we're running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
