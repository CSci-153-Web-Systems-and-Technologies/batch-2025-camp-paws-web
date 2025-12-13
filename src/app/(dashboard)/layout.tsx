'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HamburgerMenu from './components/HamburgerMenu';
import { ThemeToggle } from '@/components/ThemeSwitcher';
import { createClient } from '@/lib/supabase/client';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';

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
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
  const [isLoading, setIsLoading] = useState(true);
  
  // Enable session timeout
  useSessionTimeout();
  
  // Fetch actual user role from database
  useEffect(() => {
    async function fetchUserRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      const role = userData?.role || 'user';
      setUserRole(role);
      setIsLoading(false);
      
      // Check if user is trying to access admin pages without permission
      const isAdminPage = pathname.startsWith('/admin-dashboard') || 
                          pathname.startsWith('/verify') || 
                          pathname.startsWith('/map') || 
                          pathname.startsWith('/records');
      
      if (isAdminPage && role !== 'admin') {
        router.push('/user-dashboard');
      }
    }
    
    fetchUserRole();
  }, [pathname, router]);
  
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
  
  // Show loading state while fetching user role
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[rgb(var(--color-background))]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[rgb(var(--color-text-secondary))]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[rgb(var(--color-background))]">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} userRole={userRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Hamburger Menu */}
        <header className="bg-[rgb(var(--color-surface))] shadow-sm p-4 flex items-center justify-between border-b border-[rgb(var(--color-border))]">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu for Mobile */}
            <HamburgerMenu isOpen={isSidebarOpen} onClick={toggleSidebar} />
            
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-primary))]">{headerInfo.title}</h1>
              {headerInfo.description && (
                <p className="text-[rgb(var(--color-text-secondary))] mt-1 text-sm sm:text-base hidden sm:block">{headerInfo.description}</p>
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
