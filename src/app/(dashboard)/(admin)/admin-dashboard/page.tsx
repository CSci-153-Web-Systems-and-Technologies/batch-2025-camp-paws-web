"use client";

import { useEffect, useState } from "react";
import { fetchAdminStats, fetchRecentReports, type AdminStats, type RecentReport } from "./actions";
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Users, 
  FolderOpen, 
  TrendingUp, 
  Calendar,
  Dog,
  Cat,
  MapPin,
  FileText,
  ClipboardCheck,
  ArrowRight
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      const [statsResult, reportsResult] = await Promise.all([
        fetchAdminStats(),
        fetchRecentReports()
      ]);
      
      if (statsResult.error) {
        setError(statsResult.error);
      } else {
        setStats(statsResult.data);
      }
      
      if (reportsResult.data) {
        setRecentReports(reportsResult.data);
      }
      
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[rgb(var(--color-card-bg))] rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-[rgb(var(--color-border))] rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-[rgb(var(--color-border))] rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="bg-[rgb(var(--color-card-bg))] rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-[rgb(var(--color-border))] rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-[rgb(var(--color-border))] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-6">Admin Dashboard</h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'verified': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${formattedDate} at ${time}`;
  };

  const statCards = [
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: BarChart3,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Verified Reports",
      value: stats.verifiedReports,
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      title: "Rejected Reports",
      value: stats.rejectedReports,
      icon: XCircle,
      color: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Animal Groups",
      value: stats.totalGroups,
      icon: FolderOpen,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Reports This Week",
      value: stats.reportsThisWeek,
      icon: TrendingUp,
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
    {
      title: "Reports This Month",
      value: stats.reportsThisMonth,
      icon: Calendar,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-6">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-[rgb(var(--color-card-bg))] border border-[rgb(var(--color-border))] rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm text-[rgb(var(--color-text-muted))] mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-[rgb(var(--color-text))]">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-[rgb(var(--color-card-bg))] border border-[rgb(var(--color-border))] rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-4">Recent Activity</h2>
        {recentReports.length === 0 ? (
          <p className="text-[rgb(var(--color-text-muted))] text-center py-8">No recent reports</p>
        ) : (
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-hover))] transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-[rgb(var(--color-card-bg))] rounded-lg">
                    {report.animal_type === 'cat' ? (
                      <Cat className="w-5 h-5 text-[rgb(var(--color-text))]" />
                    ) : (
                      <Dog className="w-5 h-5 text-[rgb(var(--color-text))]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-[rgb(var(--color-text))] capitalize">
                        {report.animal_type} Report
                      </p>
                      <Badge variant={getStatusVariant(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[rgb(var(--color-text-muted))]">
                      {formatDateTime(report.spotted_date, report.spotted_time)} • {report.user_name || report.user_email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/verify"
            className="block bg-[rgb(var(--color-card-bg))] border border-[rgb(var(--color-border))] rounded-lg p-6 hover:shadow-md transition-all hover:border-yellow-500/50 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <ClipboardCheck className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              {stats.pendingReports > 0 && (
                <Badge variant="warning">{stats.pendingReports}</Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-2">Verify Reports</h3>
            <p className="text-sm text-[rgb(var(--color-text-muted))] mb-3">
              Review and verify pending animal reports
            </p>
            <div className="flex items-center text-sm font-medium text-yellow-600 dark:text-yellow-400 group-hover:gap-2 transition-all">
              Go to Verification <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/map"
            className="block bg-[rgb(var(--color-card-bg))] border border-[rgb(var(--color-border))] rounded-lg p-6 hover:shadow-md transition-all hover:border-blue-500/50 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-2">View Map</h3>
            <p className="text-sm text-[rgb(var(--color-text-muted))] mb-3">
              See all reports on an interactive map
            </p>
            <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
              Open Map View <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/records"
            className="block bg-[rgb(var(--color-card-bg))] border border-[rgb(var(--color-border))] rounded-lg p-6 hover:shadow-md transition-all hover:border-purple-500/50 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-2">Animal Records</h3>
            <p className="text-sm text-[rgb(var(--color-text-muted))] mb-3">
              Manage animal groups and records
            </p>
            <div className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:gap-2 transition-all">
              View Records <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}