// Debug/Test file for report submission
// Run this to test if submitReport works with mock data

import { submitReport, ReportSubmissionData } from './submitReport';

/**
 * Mock data for testing report submission
 */
export const mockReportData: ReportSubmissionData = {
  // Use a real photo URL from Supabase or a placeholder
  photoUrl: 'https://via.placeholder.com/400x300.jpg',
  
  // Basic identification
  animalType: 'cat',
  sex: 'male',
  collar: 'without',
  
  // Physical attributes
  colorPattern: 'tabby-puspin',
  primaryColor: 'brown',
  bodyConditionScore: 5,
  
  // Health conditions
  skinProblems: ['skin-none'],
  eyeProblems: ['eye-none'],
  gaitProblems: ['gait-none'],
  
  // Notes
  additionalNotes: 'Test report submission - friendly cat near the library',
  
  // Location and time
  latitude: 14.5995, // Example coordinates (Manila)
  longitude: 120.9842,
  locationDescription: 'Near the main library entrance',
  spottedDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  spottedTime: '14:30', // 2:30 PM
};

/**
 * Test function - Call this to debug report submission
 */
export async function testReportSubmission() {
  console.log('🧪 Testing report submission with mock data...');
  console.log('📋 Mock Data:', mockReportData);
  
  const result = await submitReport(mockReportData);
  
  console.log('\n✨ Submission Result:', result);
  
  if (result.success) {
    console.log('✅ SUCCESS! Report ID:', result.reportId);
    console.log('🔗 Check your database for report:', result.reportId);
  } else {
    console.log('❌ FAILED:', result.error);
  }
  
  return result;
}

/**
 * Test with health problems
 */
export const mockReportWithProblems: ReportSubmissionData = {
  photoUrl: 'https://via.placeholder.com/400x300.jpg',
  animalType: 'dog',
  sex: 'female',
  collar: 'with',
  colorPattern: 'plain',
  primaryColor: 'black',
  bodyConditionScore: 3,
  
  // Multiple health problems
  skinProblems: ['skin-hair-loss', 'skin-wounds'],
  eyeProblems: ['eye-discharge', 'eye-red'],
  gaitProblems: ['gait-mild-limp'],
  
  additionalNotes: 'Dog with multiple health issues - needs immediate attention',
  latitude: 14.5995,
  longitude: 120.9842,
  locationDescription: 'Behind the cafeteria',
  spottedDate: new Date().toISOString().split('T')[0],
  spottedTime: '09:15',
};

export async function testReportWithHealthProblems() {
  console.log('🧪 Testing report with health problems...');
  console.log('📋 Mock Data:', mockReportWithProblems);
  
  const result = await submitReport(mockReportWithProblems);
  
  console.log('\n✨ Submission Result:', result);
  
  if (result.success) {
    console.log('✅ SUCCESS! Report ID:', result.reportId);
    console.log('🔗 Check database for health conditions in junction tables');
  } else {
    console.log('❌ FAILED:', result.error);
  }
  
  return result;
}

// Extend window interface for debug functions
declare global {
  interface Window {
    testReportSubmission: typeof testReportSubmission;
    testReportWithHealthProblems: typeof testReportWithHealthProblems;
    mockReportData: typeof mockReportData;
  }
}

// Export for use in browser console or test file
if (typeof window !== 'undefined') {
  window.testReportSubmission = testReportSubmission;
  window.testReportWithHealthProblems = testReportWithHealthProblems;
  window.mockReportData = mockReportData;
  console.log('🎯 Debug functions available:');
  console.log('  - testReportSubmission()');
  console.log('  - testReportWithHealthProblems()');
  console.log('  - mockReportData');
}
