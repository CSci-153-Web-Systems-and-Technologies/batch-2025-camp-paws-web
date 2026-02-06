"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ErrorModal from '@/components/ui/ErrorModal';
import { parseServerError, logError } from '@/lib/utils/errorHandler';

interface UserStats {
  totalReports: number;
  pendingReports: number;
  verifiedReports: number;
  rejectedReports: number;
}

export default function UserDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ title: '', message: '', details: '', retryable: false });

  const fetchUserStats = async () => {
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Not authenticated');
      }

      // Fetch user's reports with status counts
      const { data: reports, error: reportsError } = await supabase
        .from('stray_animal_reports')
        .select('status')
        .eq('user_id', user.id);

      if (reportsError) {
        throw reportsError;
      }

      // Calculate stats
      const totalReports = reports?.length || 0;
      const pendingReports = reports?.filter(r => r.status === 'pending').length || 0;
      const verifiedReports = reports?.filter(r => r.status === 'verified').length || 0;
      const rejectedReports = reports?.filter(r => r.status === 'rejected').length || 0;

      setStats({
        totalReports,
        pendingReports,
        verifiedReports,
        rejectedReports,
      });
      
      setIsLoading(false);
    } catch (err) {
      const parsedError = parseServerError(err);
      logError('User Dashboard - Fetch Stats', err);
      setErrorDetails(parsedError);
      setShowErrorModal(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  const handleRetry = () => {
    setShowErrorModal(false);
    fetchUserStats();
  };

  return (
    <>
      <div className="flex items-center justify-center h-full min-h-[60vh] p-4">
        {stats ? (
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[rgb(var(--color-text))] mb-2">
                Your Report Dashboard
              </h1>
              <p className="text-sm text-[rgb(var(--color-text-muted))]">
                Track your contributions to helping stray animals
              </p>
            </div>

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

            {/* Coming Soon Section */}
            <div className="text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">📈</div>
              <h2 className="text-2xl font-semibold text-[rgb(var(--color-text))] mb-2">
                More Features Coming Soon
              </h2>
              <p className="text-sm text-[rgb(var(--color-text-muted))]">
                We're working on charts, report history, and more insights — check back later.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h1 className="text-2xl font-semibold text-[rgb(var(--color-text))] mb-2">
              Loading Dashboard
            </h1>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">
              Please wait...
            </p>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isLoading={isLoading}
        message="Loading your dashboard"
        submessage="Fetching your report statistics"
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