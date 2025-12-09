'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui';
import { Badge, Select } from '@/src/components/ui';
import { Info, MessageCircle } from 'lucide-react';

// Mock data for the chart
const chartData = [
  { month: 'Jan', reports: 5 },
  { month: 'Feb', reports: 18 },
  { month: 'Mar', reports: 8 },
  { month: 'Apr', reports: 12 },
  { month: 'May', reports: 16 },
  { month: 'Jun', reports: 10 },
  { month: 'Jul', reports: 11 },
  { month: 'Aug', reports: 14 },
  { month: 'Sep', reports: 9 },
  { month: 'Oct', reports: 6 },
  { month: 'Nov', reports: 15 },
  { month: 'Dec', reports: 12 },
];

// Mock data for recent reports
const recentReports = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', avatar: '👤' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', avatar: '👤' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', avatar: '👤' },
  { name: 'William Kim', email: 'will@email.com', avatar: '👤' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', avatar: '👤' },
];

export default function UserDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Your reports total */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">You reported in total</p>
                <p className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mt-1">100 reports</p>
                <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1">by you since you joined</p>
              </div>
              <Info className="w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
            </div>
          </CardContent>
        </Card>

        {/* This week reports */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">You reported this week</p>
                <p className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mt-1">26 reports</p>
                <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1">in the past 7 days</p>
              </div>
              <Info className="w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
            </div>
          </CardContent>
        </Card>

        {/* Campus-wide total */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">Campus-wide total</p>
                <p className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mt-1">1500 reports</p>
                <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1">by all users this year</p>
              </div>
              <Info className="w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
            </div>
          </CardContent>
        </Card>

        {/* Identified strays */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">Identified strays overall</p>
                <p className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mt-1">75 strays</p>
                <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1">found safe homes</p>
              </div>
              <Info className="w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Engagement Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Community Engagement</CardTitle>
              <CardDescription>Overview of report activity</CardDescription>
            </div>
            <Select
              options={[
                { value: 'this-year', label: 'This year' },
                { value: 'last-year', label: 'Last year' },
              ]}
              defaultValue="this-year"
              className="w-32"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 min-h-64">
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(var(--color-text-secondary))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(var(--color-text-secondary))' }}
                  domain={[0, 20]}
                />
                <Bar 
                  dataKey="reports" 
                  fill="rgb(var(--color-primary))" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            <Badge variant="info" size="sm">330 reports this month</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((reporter, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-[rgb(var(--color-border))] last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[rgb(var(--color-background))] rounded-full flex items-center justify-center text-sm">
                    {reporter.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-[rgb(var(--color-text-primary))]">{reporter.name}</p>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">{reporter.email}</p>
                  </div>
                </div>
                <button className="p-2 text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-background))] rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}