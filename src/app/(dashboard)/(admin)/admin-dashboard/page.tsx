"use client";

import { useEffect, useState } from "react";
import { fetchAdminStats, type AdminStats } from "./actions";
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Users, 
  FolderOpen, 
  TrendingUp, 
  Calendar 
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      const { data, error: err } = await fetchAdminStats();
      if (err) {
        setError(err);
      } else {
        setStats(data);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[rgb(var(--color-card-bg))] rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-[rgb(var(--color-border))] rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-[rgb(var(--color-border))] rounded w-1/3"></div>
            </div>
          ))}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
}