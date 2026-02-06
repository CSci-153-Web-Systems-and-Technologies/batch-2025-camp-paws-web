// Utility: normalize server-side report rows to AcceptedReport
// Simplified with denormalized schema - no ID lookups or fallbacks needed!

import type { AcceptedReport } from '../../app/(dashboard)/(admin)/records/types/RecordsTypes';

function toString(v: unknown): string {
  return v === undefined || v === null ? '' : String(v);
}

function asArray(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}

/**
 * Transform database row to AcceptedReport type.
 * With the new schema, columns are already denormalized - no lookups needed!
 */
export function normalizeRow(r: AcceptedReport | Record<string, unknown>): AcceptedReport {
  // If already normalized (has animalType), return as-is
  if ((r as AcceptedReport).animalType !== undefined) {
    return r as AcceptedReport;
  }

  const row = r as Record<string, unknown>;

  // Direct column access - no ID fallbacks needed!
  const animalType = toString(row['animal_type'] || row['animalType']).trim().toLowerCase() as AcceptedReport['animalType'];
  const sex = toString(row['sex']).trim().toLowerCase() as AcceptedReport['sex'];
  
  // Collar status: 'with'/'without' from DB
  const collarRaw = toString(row['collar_status'] ?? row['collar']).toLowerCase();
  const collar: AcceptedReport['collar'] = collarRaw.includes('with') ? 'yes' : 'no';

  return {
    id: toString(row['id']),
    groupId: row['group_id'] ? toString(row['group_id']) : null,
    photoUrl: toString(row['photo_url']),
    animalType,
    sex,
    collar,
    colorPattern: toString(row['color_pattern'] || row['colorPattern']),
    primaryColor: toString(row['primary_color'] || row['primaryColor']),
    bodyConditionScore: Number(row['body_condition_score'] ?? row['bodyConditionScore'] ?? 5),
    
    // Health conditions - already arrays in DB!
    skinProblems: asArray(row['skin_problems'] || row['skin_conditions'] || row['skinProblems']),
    eyeProblems: asArray(row['eye_problems'] || row['eye_conditions'] || row['eyeProblems']),
    gaitProblems: asArray(row['gait_problems'] || row['gait_conditions'] || row['gaitProblems']),
    
    notes: toString(row['additional_notes'] || row['notes']),
    latitude: Number(row['latitude'] ?? 0),
    longitude: Number(row['longitude'] ?? 0),
    locationDescription: toString(row['location_description'] || row['locationDescription']),
    spottedDate: toString(row['spotted_date'] || row['spottedDate']),
    spottedTime: toString(row['spotted_time'] || row['spottedTime']),
    
    // User info
    reportedBy: toString(row['user_id'] || row['reportedBy']),
    reporterEmail: toString(row['user_email'] || row['reporterEmail']),
    
    // Status & verification
    status: 'verified',
    verifiedBy: toString(row['verified_by'] || row['verifiedBy']) || undefined,
    verifiedAt: toString(row['verified_at'] || row['verifiedAt']) || undefined,
    acceptedAt: toString(row['verified_at'] || row['accepted_at'] || row['acceptedAt']),
    
    // Timestamps
    createdAt: toString(row['created_at'] || row['createdAt']),
    updatedAt: toString(row['updated_at'] || row['updatedAt']) || undefined,
    
    // Grouping
    isGrouped: Boolean(row['is_grouped'] || row['isGrouped']),
  } as AcceptedReport;
}

export function normalizeRows(rows: Array<AcceptedReport | Record<string, unknown>>): AcceptedReport[] {
  return (rows || []).map(r => normalizeRow(r));
}

export default normalizeRow;
