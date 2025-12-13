// Utility: normalize server-side report rows (snake_case or camelCase) to AcceptedReport
// Put shared normalization here so multiple views/components reuse the same logic.
import type { AcceptedReport } from '../../app/(dashboard)/(admin)/records/types/RecordsTypes';

function toString(v: unknown) {
  return v === undefined || v === null ? '' : String(v);
}

function asArray(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}

export function normalizeRow(r: AcceptedReport | Record<string, unknown>): AcceptedReport {
  // If the row already looks normalized (has animalType), assume it's AcceptedReport
  if ((r as AcceptedReport).animalType !== undefined) {
    return r as AcceptedReport;
  }

  const row = r as Record<string, unknown>;

  const rawAnimal = toString(row['animal_type'] ?? row['animal_type_id'] ?? row['animalType'] ?? '').trim().toLowerCase();
  let animalType: AcceptedReport['animalType'] = 'cat';
  if (rawAnimal.includes('dog')) animalType = 'dog';
  else if (rawAnimal.includes('cat')) animalType = 'cat';

  const rawSex = toString(row['sex'] ?? row['sex_id'] ?? row['sex'] ?? '').trim().toLowerCase();
  const sex: AcceptedReport['sex'] = rawSex.includes('male') ? 'male' : (rawSex.includes('female') ? 'female' : 'unknown');

  const collarRaw = toString(row['collar_status'] ?? row['collar'] ?? '').toLowerCase();
  const collar: AcceptedReport['collar'] = (collarRaw.includes('yes') || collarRaw.includes('with')) ? 'yes' : ((collarRaw.includes('no') || collarRaw.includes('without')) ? 'no' : 'unknown');

  const photoUrl = row['photo_url'] ? toString(row['photo_url']) : '';
  const colorPattern = row['color_pattern'] ? toString(row['color_pattern']) : (row['colorPattern'] ? toString(row['colorPattern']) : 'unknown');
  const primaryColor = row['primary_color'] ? toString(row['primary_color']) : (row['primaryColor'] ? toString(row['primaryColor']) : 'unknown');

  const bodyConditionScore = Number(row['body_condition_score'] ?? row['bodyConditionScore'] ?? 0) || 0;

  const skinProblems = asArray(row['skin_problems'])
    || asArray(row['skinProblems'])
    || asArray(row['skin_conditions'])
    || asArray(row['skinConditions'])
    || [];

  const eyeProblems = asArray(row['eye_problems'])
    || asArray(row['eyeProblems'])
    || asArray(row['eye_conditions'])
    || asArray(row['eyeConditions'])
    || [];

  const gaitProblems = asArray(row['gait_problems'])
    || asArray(row['gaitProblems'])
    || asArray(row['gait_conditions'])
    || asArray(row['gaitConditions'])
    || [];

  const latitude = Number(row['latitude'] ?? 0) || 0;
  const longitude = Number(row['longitude'] ?? 0) || 0;

  const spottedDate = row['spotted_date'] ? toString(row['spotted_date']) : (row['spottedDate'] ? toString(row['spottedDate']) : new Date().toISOString().split('T')[0]);
  const spottedTime = row['spotted_time'] ? toString(row['spotted_time']) : (row['spottedTime'] ? toString(row['spottedTime']) : '00:00:00');

  const reportedBy = row['user_id'] ? toString(row['user_id']) : (row['reportedBy'] ? toString(row['reportedBy']) : (row['userId'] ? toString(row['userId']) : ''));
  const reporterEmail = row['reporter_email'] ? toString(row['reporter_email']) : (row['reporterEmail'] ? toString(row['reporterEmail']) : (row['user_email'] ? toString(row['user_email']) : (row['userEmail'] ? toString(row['userEmail']) : '')));

  const verifiedBy = row['verified_by'] ? toString(row['verified_by']) : (row['verifiedBy'] ? toString(row['verifiedBy']) : undefined);
  const verifiedAt = row['verified_at'] ? toString(row['verified_at']) : (row['verifiedAt'] ? toString(row['verifiedAt']) : (row['accepted_at'] ? toString(row['accepted_at']) : undefined));

  const groupId = row['group_id'] ? toString(row['group_id']) : (row['groupId'] ? toString(row['groupId']) : null);

  // Map server's is_grouped ('yes'|'no') to boolean
  const isGrouped = String(row['is_grouped'] ?? row['isGrouped'] ?? 'no') === 'yes';

  return {
    id: toString(row['id']),
    groupId,
    photoUrl,
    animalType,
    sex,
    collar,
    colorPattern,
    primaryColor,
    bodyConditionScore,
    skinProblems,
    eyeProblems,
    gaitProblems,
    notes: row['additional_notes'] ? toString(row['additional_notes']) : (row['notes'] ? toString(row['notes']) : ''),
    latitude,
    longitude,
    locationDescription: row['location_description'] ? toString(row['location_description']) : (row['locationDescription'] ? toString(row['locationDescription']) : ''),
    spottedDate,
    spottedTime,
    reportedBy,
    reporterEmail,
    status: String(row['status'] ?? 'verified') === 'verified' ? 'verified' : 'verified',
    verifiedBy,
    verifiedAt,
    acceptedAt: verifiedAt ?? (row['accepted_at'] ? toString(row['accepted_at']) : (row['acceptedAt'] ? toString(row['acceptedAt']) : new Date().toISOString())),
    createdAt: row['created_at'] ? toString(row['created_at']) : (row['createdAt'] ? toString(row['createdAt']) : new Date().toISOString()),
    updatedAt: row['updated_at'] ? toString(row['updated_at']) : (row['updatedAt'] ? toString(row['updatedAt']) : undefined),
    isGrouped,
  } as AcceptedReport;
}

export function normalizeRows(rows: Array<AcceptedReport | Record<string, unknown>>): AcceptedReport[] {
  return (rows || []).map(r => normalizeRow(r));
}

export default normalizeRow;
