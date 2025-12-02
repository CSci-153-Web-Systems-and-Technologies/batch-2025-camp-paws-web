'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const chartData = [
  { month: 'Jan', reports: 10 },
  { month: 'Feb', reports: 200 },
  { month: 'Mar', reports: 50 },
  { month: 'Apr', reports: 80 },
  { month: 'May', reports: 160 },
  { month: 'Jun', reports: 100 },
  { month: 'Jul', reports: 120 },
  { month: 'Aug', reports: 140 },
  { month: 'Sep', reports: 90 },
  { month: 'Oct', reports: 40 },
  { month: 'Nov', reports: 150 },
  { month: 'Dec', reports: 110 },
];

// Mock data for recent reports
const recentReports = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', avatar: '👤' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', avatar: '👤' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', avatar: '👤' },
  { name: 'William Kim', email: 'will@email.com', avatar: '👤' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', avatar: '👤' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total verified reports */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total verified reports</p>
              <p className="text-2xl font-bold text-gray-900">999 reports</p>
              <p className="text-xs text-gray-500">26 reports this month</p>
            </div>
            <div className="text-gray-400">ℹ️</div>
          </div>
        </div>

        {/* Pending verifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending verifications</p>
              <p className="text-2xl font-bold text-gray-900">112 reports</p>
              <p className="text-xs text-gray-500">40 reports this week</p>
            </div>
            <div className="text-gray-400">ℹ️</div>
          </div>
        </div>

        {/* Campus-wide total */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Campus-wide total</p>
              <p className="text-2xl font-bold text-gray-900">1500 reports</p>
              <p className="text-xs text-gray-500">300 reports this month</p>
            </div>
            <div className="text-gray-400">ℹ️</div>
          </div>
        </div>

        {/* Identified strays overall */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Identified strays overall</p>
              <p className="text-2xl font-bold text-gray-900">75 strays</p>
              <p className="text-xs text-gray-500">3 new this month</p>
            </div>
            <div className="text-gray-400">ℹ️</div>
          </div>
        </div>
      </div>

      {/* Community Engagement Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Community Engagement</h2>
          <select className="text-sm border border-gray-300 rounded px-3 py-1">
            <option>This year</option>
            <option>Last year</option>
          </select>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Overview</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                  domain={[0, 200]}
                />
                <Bar 
                  dataKey="reports" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          <p className="text-sm text-gray-600">300 reports this month</p>
        </div>
        
        <div className="space-y-3">
          {recentReports.map((reporter, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                  {reporter.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{reporter.name}</p>
                  <p className="text-sm text-gray-500">{reporter.email}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                💬
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}