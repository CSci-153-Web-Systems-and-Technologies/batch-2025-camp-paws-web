'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HamburgerMenu from './components/HamburgerMenu';
import { ThemeToggle } from '@/src/components/ThemeSwitcher';

const PAGE_HEADERS: Record<string, { title: string; description: string }> = {
  '/user-dashboard': {
    title: 'User Dashboard',
    description: 'See your reporting activity and the campus-wide summary of stray sightings.'
  },
  '/report': {
    title: 'Report Animal',
    description: 'Submit a new stray animal sighting report.'
  },
  '/profile': {
    title: 'Profile',
    description: 'Manage your account settings and preferences.'
  },
  // Admin pages
  '/admin-dashboard': {
    title: 'Admin Dashboard',
    description: 'Monitor and manage all stray animal reports across campus.'
  },
  '/verify': {
    title: 'Verify Reports',
    description: 'Review and verify submitted stray animal reports.'
  },
  '/map': {
    title: 'Campus Map',
    description: 'View all reported stray animal locations on the map.'
  },
  '/records': {
    title: 'Animal Records',
    description: 'Browse and manage verified stray animal records.'
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Determine if user is on admin pages
  const isAdminPage = pathname.startsWith('/admin-dashboard') || 
                      pathname.startsWith('/verify') || 
                      pathname.startsWith('/map') || 
                      pathname.startsWith('/records');
  
  const userRole = isAdminPage ? 'admin' : 'user';
  
  const headerInfo = PAGE_HEADERS[pathname] || { 
    title: 'CAMP-PAWS Dashboard', 
    description: '' 
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Prevent body scroll on mobile when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} userRole={userRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Hamburger Menu */}
        <header className="bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu for Mobile */}
            <HamburgerMenu isOpen={isSidebarOpen} onClick={toggleSidebar} />
            
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-500">{headerInfo.title}</h1>
              {headerInfo.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base hidden sm:block">{headerInfo.description}</p>
              )}
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
