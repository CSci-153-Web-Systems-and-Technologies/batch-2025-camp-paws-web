'use client';
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 shadow-sm mt-4 mr-4 ml-4 rounded-lg transition-colors">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
            CAMP-PAWS
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
