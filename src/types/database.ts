/**
 * Database Type Definitions for Schema V2
 * 
 * These types match the simplified schema exactly.
 * Generated from: /docs/schema-v2-simplified.sql
 * 
 * Type naming conventions:
 * - `*Row` - Data returned from SELECT queries
 * - `*Insert` - Data for INSERT operations (optional/auto-generated fields omitted)
 * - `*Update` - Data for UPDATE operations (all fields optional)
 */

import type { AnimalType, Sex, CollarStatus } from '@/lib/constants/animalAttributes';
import type { HealthConditionId } from '@/lib/constants/healthConditions';

// ============================================================================
// BASE TYPES (matching Postgres types)
// ============================================================================

/** UUID string (e.g., '550e8400-e29b-41d4-a716-446655440000') */
export type UUID = string;

/** ISO 8601 timestamp with timezone (e.g., '2026-02-06T12:00:00Z') */
export type Timestamp = string;

/** ISO 8601 date (e.g., '2026-02-06') */
export type DateString = string;

/** Time in HH:MM format (e.g., '14:30') */
export type TimeString = string;

/** Decimal number as string (for precise lat/lng) */
export type DecimalString = string;

// ============================================================================
// USERS TABLE
// ============================================================================

export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'banned';

export interface UserRow {
  id: UUID;
  email: string;
  name: string | null;
  role: UserRole;
  reports_submitted: number;
  warnings: number;
  status: UserStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface UserInsert {
  id: UUID; // From auth.users
  email: string;
  name?: string | null;
  role?: UserRole; // Default: 'user'
  reports_submitted?: number; // Default: 0
  warnings?: number; // Default: 0
  status?: UserStatus; // Default: 'active'
}

export interface UserUpdate {
  email?: string;
  name?: string | null;
  role?: UserRole;
  reports_submitted?: number;
  warnings?: number;
  status?: UserStatus;
}

// ============================================================================
// STRAY_ANIMAL_REPORTS TABLE (Denormalized)
// ============================================================================

export type ReportStatus = 'pending' | 'verified' | 'rejected';

export interface StrayAnimalReportRow {
  // Identity
  id: UUID;
  user_id: UUID;
  
  // Photo
  photo_url: string;
  
  // Basic Identification (direct values, no FKs!)
  animal_type: AnimalType;
  sex: Sex;
  collar_status: CollarStatus;
  
  // Physical Attributes
  color_pattern: string;
  primary_color: string;
  body_condition_score: number; // 1-9
  
  // Health Conditions (arrays!)
  skin_problems: HealthConditionId[];
  eye_problems: HealthConditionId[];
  gait_problems: HealthConditionId[];
  
  // Notes
  physical_additional_notes: string | null;
  additional_notes: string | null;
  
  // Location & Time
  spotted_date: DateString;
  spotted_time: TimeString;
  latitude: number;
  longitude: number;
  location_description: string;
  
  // Status & Verification
  status: ReportStatus;
  verified_by: UUID | null;
  verified_at: Timestamp | null;
  rejection_reason: string | null;
  rejected_at: Timestamp | null;
  
  // Grouping
  is_grouped: boolean;
  
  // Timestamps
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface StrayAnimalReportInsert {
  // Required fields only
  user_id: UUID;
  photo_url: string;
  animal_type: AnimalType;
  sex: Sex;
  collar_status: CollarStatus;
  color_pattern: string;
  primary_color: string;
  body_condition_score: number;
  spotted_date: DateString;
  spotted_time: TimeString;
  latitude: number;
  longitude: number;
  location_description: string;
  
  // Optional fields
  skin_problems?: HealthConditionId[];
  eye_problems?: HealthConditionId[];
  gait_problems?: HealthConditionId[];
  physical_additional_notes?: string | null;
  additional_notes?: string | null;
  status?: ReportStatus; // Default: 'pending'
  is_grouped?: boolean; // Default: false
}

export interface StrayAnimalReportUpdate {
  // All fields optional for updates
  photo_url?: string;
  animal_type?: AnimalType;
  sex?: Sex;
  collar_status?: CollarStatus;
  color_pattern?: string;
  primary_color?: string;
  body_condition_score?: number;
  skin_problems?: HealthConditionId[];
  eye_problems?: HealthConditionId[];
  gait_problems?: HealthConditionId[];
  additional_notes?: string | null;
  spotted_date?: DateString;
  spotted_time?: TimeString;
  latitude?: number;
  longitude?: number;
  location_description?: string;
  status?: ReportStatus;
  verified_by?: UUID | null;
  verified_at?: Timestamp | null;
  rejection_reason?: string | null;
  rejected_at?: Timestamp | null;
  is_grouped?: boolean;
}

// ============================================================================
// ANIMAL_GROUPS TABLE
// ============================================================================

export interface AnimalGroupRow {
  id: UUID;
  name: string;
  description: string | null;
  animal_type: AnimalType;
  sex: Sex | null;
  color_pattern: string | null;
  primary_color: string | null;
  report_count: number;
  first_sighted_date: DateString | null;
  last_sighted_date: DateString | null;
  created_by: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface AnimalGroupInsert {
  name: string;
  animal_type: AnimalType;
  created_by: UUID;
  description?: string | null;
  sex?: Sex | null;
  color_pattern?: string | null;
  primary_color?: string | null;
  report_count?: number; // Default: 0
  first_sighted_date?: DateString | null;
  last_sighted_date?: DateString | null;
}

export interface AnimalGroupUpdate {
  name?: string;
  description?: string | null;
  animal_type?: AnimalType;
  sex?: Sex | null;
  color_pattern?: string | null;
  primary_color?: string | null;
  report_count?: number;
  first_sighted_date?: DateString | null;
  last_sighted_date?: DateString | null;
}

// ============================================================================
// GROUP_REPORTS TABLE (Junction)
// ============================================================================

export interface GroupReportRow {
  group_id: UUID;
  report_id: UUID;
  added_at: Timestamp;
  added_by: UUID;
}

export interface GroupReportInsert {
  group_id: UUID;
  report_id: UUID;
  added_by: UUID;
}

// No update type needed - junction tables are insert/delete only

// ============================================================================
// USER_ACTIONS TABLE (Audit Trail)
// ============================================================================

export type UserActionType = 'warn' | 'suspend' | 'unsuspend' | 'ban' | 'verify' | 'reject';

export interface UserActionRow {
  id: UUID;
  user_id: UUID;
  report_id: UUID | null;
  admin_id: UUID;
  action_type: UserActionType;
  reason: string;
  created_at: Timestamp;
}

export interface UserActionInsert {
  user_id: UUID;
  admin_id: UUID;
  action_type: UserActionType;
  reason: string;
  report_id?: UUID | null;
}

// No update type needed - audit logs are immutable

// ============================================================================
// JOINED/ENRICHED TYPES (for API responses)
// ============================================================================

/**
 * Report with user information joined
 */
export interface ReportWithUser extends StrayAnimalReportRow {
  user_email?: string;
  user_name?: string | null;
  verified_by_email?: string;
  verified_by_name?: string | null;
}

/**
 * Group with creator information
 */
export interface GroupWithCreator extends AnimalGroupRow {
  creator_name?: string | null;
  creator_email?: string;
}

/**
 * User action with related user/admin info
 */
export interface UserActionWithDetails extends UserActionRow {
  user_email?: string;
  user_name?: string | null;
  admin_email?: string;
  admin_name?: string | null;
  report_photo_url?: string | null;
}

// ============================================================================
// DATABASE TYPE MAP (for Supabase type inference)
// ============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      stray_animal_reports: {
        Row: StrayAnimalReportRow;
        Insert: StrayAnimalReportInsert;
        Update: StrayAnimalReportUpdate;
      };
      animal_groups: {
        Row: AnimalGroupRow;
        Insert: AnimalGroupInsert;
        Update: AnimalGroupUpdate;
      };
      group_reports: {
        Row: GroupReportRow;
        Insert: GroupReportInsert;
        Update: never; // Junction table - no updates
      };
      user_actions: {
        Row: UserActionRow;
        Insert: UserActionInsert;
        Update: never; // Audit log - immutable
      };
    };
  };
}

// ============================================================================
// HELPER TYPE UTILITIES
// ============================================================================

/**
 * Extract table name from Database type
 */
export type TableName = keyof Database['public']['Tables'];

/**
 * Get Row type for a table
 */
export type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];

/**
 * Get Insert type for a table
 */
export type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];

/**
 * Get Update type for a table
 */
export type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Type guard to check if a value is a valid UUID
 */
export function isValidUUID(value: unknown): value is UUID {
  if (typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Type guard for ReportStatus
 */
export function isValidReportStatus(value: unknown): value is ReportStatus {
  return value === 'pending' || value === 'verified' || value === 'rejected';
}

/**
 * Type guard for UserRole
 */
export function isValidUserRole(value: unknown): value is UserRole {
  return value === 'user' || value === 'admin';
}

/**
 * Type guard for UserStatus
 */
export function isValidUserStatus(value: unknown): value is UserStatus {
  return value === 'active' || value === 'suspended' || value === 'banned';
}
