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
import Button from '@/components/ui/Button';
import { BarChart3, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';

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
        {stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Reports */}
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg shadow-sm p-6 border border-blue-100 dark:border-blue-900">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-[rgb(var(--color-text))] mb-1">
                  {stats.totalReports}
                </div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">
                  Total Reports
                </div>
              </div>

              {/* Pending Reports */}
              <div className="bg-orange-50 dark:bg-orange-950 rounded-lg shadow-sm p-6 border border-orange-100 dark:border-orange-900">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mb-3">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-[rgb(var(--color-text))] mb-1">
                  {stats.pendingReports}
                </div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">
                  Pending Review
                </div>
              </div>

              {/* Verified Reports */}
              <div className="bg-green-50 dark:bg-green-950 rounded-lg shadow-sm p-6 border border-green-100 dark:border-green-900">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-3xl font-bold text-[rgb(var(--color-text))] mb-1">
                  {stats.verifiedReports}
                </div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">
                  Verified
                </div>
              </div>

              {/* Rejected Reports */}
              <div className="bg-red-50 dark:bg-red-950 rounded-lg shadow-sm p-6 border border-red-100 dark:border-red-900">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg mb-3">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-3xl font-bold text-[rgb(var(--color-text))] mb-1">
                  {stats.rejectedReports}
                </div>
                <div className="text-sm text-[rgb(var(--color-text-muted))]">
                  Rejected
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                  Your Reports
                </h2>
                <Button
                  variant="primary"
                  onClick={() => router.push('/report')}
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Report
                  </span>
                </Button>
              </div>
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