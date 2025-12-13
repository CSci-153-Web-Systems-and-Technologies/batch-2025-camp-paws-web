/*
  readReports.js

  Node script to fetch the server-proxied reports endpoint and map the
  returned DB rows into the frontend "Report" shape using the same
  transform logic as `transformToReport` in
  `src/app/(dashboard)/(admin)/verify/services/ReportService.ts`.

  Usage:
    # default (assumes dev Next server on localhost:3000)
    node src/scripts/readReports.js

    # custom base URL (if your dev server runs elsewhere)
    BASE_URL=http://127.0.0.1:3000 node src/scripts/readReports.js
*/

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function fetchReports() {
  const url = `${BASE_URL}/api/admin/reports`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    let payload = {};
    try { payload = await res.json(); } catch (e) { /* ignore */ }
    const msg = payload?.error || `Failed to fetch reports: ${res.status}`;
    throw new Error(msg);
  }

  const json = await res.json();
  const rows = json.data ?? [];
  return (rows || []).map(transformToReport);
}

// JS version of transformToReport from ReportService.ts
function transformToReport(row) {
  const r = row || {};
  const users = r.users || undefined;
  const usersName = users ? users.name : undefined;
  const usersEmail = users ? users.email : undefined;

  return {
    id: r.id,
    photoUrl: r.photo_url || r.photoUrl || r.photo || '/placeholder.jpg',
    animalType: r.animal_type || r.animalType || 'dog',
    sex: r.sex || 'unknown',
    collar: r.collar || 'unknown',
    colorPattern: r.color_pattern || r.colorPattern || 'solid',
    primaryColor: r.primary_color || r.primaryColor || '',
    bodyConditionScore: r.body_condition_score || r.bodyConditionScore || 5,
    physicalProblems: r.physical_problems || r.physicalProblems || [],
    notes: r.notes || '',
    latitude: Number(r.latitude) || 0,
    longitude: Number(r.longitude) || 0,
    locationDescription: r.location_description || r.locationDescription || '',
    spottedDate: r.spotted_date || r.spottedDate || '',
    spottedTime: r.spotted_time || r.spottedTime || '',
    reportedBy: usersName || r.reported_by || r.reportedBy || '',
    reporterEmail: usersEmail || r.reporter_email || r.reporterEmail || '',
    reporterId: r.reported_by || r.reportedBy || r.reporter_id || undefined,
    reportsSubmitted: r.reports_submitted || r.reportsSubmitted || 0,
    warnings: r.warnings || 0,
    status: r.status || 'pending',
    createdAt: r.created_at || r.createdAt || new Date().toISOString(),
  };
}

(async () => {
  try {
    const reports = await fetchReports();
    console.log(JSON.stringify(reports, null, 2));
  } catch (err) {
    console.error('Error reading reports:', err);
    process.exitCode = 1;
  }
})();
