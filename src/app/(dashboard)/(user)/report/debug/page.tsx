'use client';

import { useState } from 'react';
import { submitReport, ReportSubmissionResult } from '../actions/submitReport';
import { mockReportData, mockReportWithProblems } from '../actions/debugReport';
import Button from '@/components/ui/Button';

export default function DebugReportPage() {
  const [result, setResult] = useState<ReportSubmissionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testBasicReport = async () => {
    setIsLoading(true);
    setResult(null);
    console.clear();
    console.log('🧪 Testing basic report submission...');
    
    const res = await submitReport(mockReportData);
    setResult(res);
    setIsLoading(false);
  };

  const testReportWithProblems = async () => {
    setIsLoading(true);
    setResult(null);
    console.clear();
    console.log('🧪 Testing report with health problems...');
    
    const res = await submitReport(mockReportWithProblems);
    setResult(res);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Report Submission Debugger</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Report Submission</h2>
          <p className="text-gray-600 mb-6">
            Click the buttons below to test report submission with mock data. 
            Open browser console (F12) to see detailed logs.
          </p>
          
          <div className="space-y-4">
            <div>
              <Button 
                onClick={testBasicReport}
                disabled={isLoading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isLoading ? 'Testing...' : '🐱 Test Basic Report (Cat, No Problems)'}
              </Button>
            </div>
            
            <div>
              <Button 
                onClick={testReportWithProblems}
                disabled={isLoading}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                {isLoading ? 'Testing...' : '🐶 Test Report with Health Problems (Dog)'}
              </Button>
            </div>
          </div>
        </div>

        {result && (
          <div className={`rounded-lg shadow-lg p-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h2 className="text-xl font-semibold mb-4">
              {result.success ? '✅ Success!' : '❌ Failed'}
            </h2>
            
            {result.success ? (
              <div className="space-y-2">
                <p className="text-green-800">
                  <strong>Report ID:</strong> {result.reportId}
                </p>
                <p className="text-sm text-green-700">
                  Check your Supabase database to see the inserted report!
                </p>
                <div className="mt-4 p-4 bg-white rounded border border-green-200">
                  <p className="text-sm font-mono text-gray-800">
                    SQL to verify:
                  </p>
                  <code className="text-xs bg-gray-100 p-2 rounded block mt-2">
                    SELECT * FROM stray_animal_reports WHERE id = &apos;{result.reportId}&apos;;
                  </code>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-800">
                  <strong>Error:</strong> {result.error}
                </p>
                <p className="text-sm text-red-700">
                  Check the browser console for detailed error logs.
                </p>
              </div>
            )}
            
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold">
                View Full Response
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Debugging Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Open browser console (F12) to see detailed logs</li>
            <li>Each log shows what step is being executed</li>
            <li>Look for ❌ or ⚠️ symbols indicating errors</li>
            <li>Check your Supabase database after successful submission</li>
            <li>Verify RLS policies are set correctly if insertion fails</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
