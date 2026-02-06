"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ErrorModal from '@/components/ui/ErrorModal';
import { parseServerError, logError, ParsedError } from '@/lib/utils/errorHandler';
import ReportsList, { Report } from './components/ReportsList';
import { fetchUserReports, deleteReport } from './actions';
import { useToast } from '@/hooks/useToast';

interface UserStats {
  totalReports: number;
  pendingReports: number;
  verifiedReports: number;
  rejectedReports: number;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ParsedError>({ title: '', message: '', retryable: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Not authenticated');
      }

      // Fetch user's reports
      const { data: reportsData, error: reportsError } = await fetchUserReports();

      if (reportsError || !reportsData) {
        throw new Error(reportsError || 'Failed to fetch reports');
      }

      setReports(reportsData as Report[]);

      // Calculate stats from reports
      const totalReports = reportsData.length;
      const pendingReports = reportsData.filter(r => r.status === 'pending').length;
      const verifiedReports = reportsData.filter(r => r.status === 'verified').length;
      const rejectedReports = reportsData.filter(r => r.status === 'rejected').length;

      setStats({
        totalReports,
        pendingReports,
        verifiedReports,
        rejectedReports,
      });
      
      setIsLoading(false);
    } catch (err) {
      const parsedError = parseServerError(err);
      logError('User Dashboard - Fetch Data', err);
      setErrorDetails(parsedError);
      setShowErrorModal(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    setShowErrorModal(false);
    fetchData();
  };

  const handleEdit = (reportId: string) => {
    // TODO: Navigate to edit page with report ID
    router.push(`/report/edit/${reportId}`);
  };

  const handleView = (reportId: string) => {
    // TODO: Open modal or navigate to view page
    router.push(`/report/view/${reportId}`);
  };

  const handleDelete = async (reportId: string) => {
    setIsDeleting(true);

    try {
      const result = await deleteReport(reportId);

      if (result.error) {
        error(result.error);
        logError('User Dashboard - Delete Report', result.error);
      } else {
        success('Report deleted successfully');
        // Refresh the data
        await fetchData();
      }
    } catch (err) {
      const parsedError = parseServerError(err);
      error(parsedError.message);
      logError('User Dashboard - Delete Report', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full min-h-[60vh] p-4 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[rgb(var(--color-text))] mb-2">
            Your Report Dashboard
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            Track your contributions to helping stray animals
          </p>
        </div>

        {stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Reports */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-3xl font-bold text-[rgb(var(--color-text))] mb-1">
                  {stats.totalReports}
                </div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">
                  Total Reports
                </div>
              </div>

              {/* Pending Reports */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-2">⏳</div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {stats.pendingReports}
                </div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">
                  Pending Review
                </div>
              </div>

              {/* Verified Reports */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {stats.verifiedReports}
                </div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">
                  Verified
                </div>
              </div>

              {/* Rejected Reports */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-2">❌</div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {stats.rejectedReports}
                </div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">
                  Rejected
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-4">
                Your Reports
              </h2>
              <ReportsList
                reports={reports}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isLoading={isLoading || isDeleting}
        message={isDeleting ? 'Deleting report' : 'Loading your dashboard'}
        submessage={isDeleting ? 'Please wait...' : 'Fetching your report statistics'}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorDetails.title}
        message={errorDetails.message}
        details={errorDetails.details}
        retryable={errorDetails.retryable}
        onRetry={errorDetails.retryable ? handleRetry : undefined}
      />
    </>
  );
}