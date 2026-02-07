'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut } from '@/lib/auth/actions';
import { createClient } from '@/lib/supabase/client';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'user' | 'admin'; // Add role prop
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function Sidebar({ isOpen, onClose, userRole = 'user' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userName, setUserName] = useState('Loading...');
  const [userEmail, setUserEmail] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [totalReports, setTotalReports] = useState(0);
  const [verifiedReports, setVerifiedReports] = useState(0);
  const [accountStatus, setAccountStatus] = useState<'active' | 'suspended' | 'banned'>('active');

  // Fetch current user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserEmail(user.email || '');
        
        // Try to get user data from users table
        const { data: userData } = await supabase
          .from('users')
          .select('name, created_at, reports_submitted, status')
          .eq('id', user.id)
          .single();
        
        if (userData) {
          setUserName(userData.name || user.email?.split('@')[0] || 'User');
          setMemberSince(new Date(userData.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }));
          setTotalReports(userData.reports_submitted || 0);
          setAccountStatus(userData.status || 'active');

          // Fetch verified reports count
          const { count } = await supabase
            .from('stray_animal_reports')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'verified');
          
          setVerifiedReports(count || 0);
        } else {
          setUserName(user.email?.split('@')[0] || 'User');
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      setShowProfileModal(false);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion
    alert('Account deletion functionality will be implemented');
  };

  // Get initials for avatar
  const getInitials = (name: string, email: string) => {
    if (name && name !== 'Loading...') {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  // User navigation items
  const userNavItems: NavItem[] = [
    {
      href: '/user-dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/report',
      label: 'Report Animal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    }
    // {
    //   href: '/profile',
    //   label: 'Profile',
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    //     </svg>
    //   ),
    // },
  ];

  // Admin navigation items
  const adminNavItems: NavItem[] = [
    {
      href: '/admin-dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      href: '/verify',
      label: 'Verify Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: '/map',
      label: 'Map',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      href: '/records',
      label: 'Animal Records',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  // Select navigation items based on role
  const navigationItems = userRole === 'admin' ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-10005 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-10006 w-64 bg-[rgb(var(--color-surface))] shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--color-border))]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[rgb(var(--color-primary))] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="font-bold text-[rgb(var(--color-text-primary))]">CAMP-PAWS</span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-background))]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose} // Close sidebar on mobile when clicking a link
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${isActive
                        ? 'bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))]'
                        : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-background))] hover:text-[rgb(var(--color-text-primary))]'
                      }
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer - Positioned at bottom */}
        <div className="mt-auto p-4 border-t border-[rgb(var(--color-border))]">
          <button
            onClick={() => setShowProfileModal(true)}
            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[rgb(var(--color-background))] transition-colors"
          >
            <div className="w-8 h-8 bg-[rgb(var(--color-primary))] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(userName, userEmail)}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate">{userName}</p>
              <p className="text-xs text-[rgb(var(--color-text-secondary))] truncate">{userEmail}</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Profile Settings Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Profile Settings"
        size="md"
      >
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[rgb(var(--color-primary))] rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {getInitials(userName, userEmail)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">{userName}</h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">{userEmail}</p>
            </div>
          </div>

          {/* Account Overview */}
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-4">
            <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">
              Account Overview
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">Member Since</p>
                <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {memberSince || 'Loading...'}
                </p>
              </div>
              <div>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">Total Reports</p>
                <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {totalReports} reports
                </p>
              </div>
              <div>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">Verified Reports</p>
                <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                  {verifiedReports} reports
                </p>
              </div>
              <div>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">Account Status</p>
                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                  accountStatus === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : accountStatus === 'suspended'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {accountStatus.charAt(0).toUpperCase() + accountStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-left border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-background))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-[rgb(var(--color-text-primary))]">
              {isLoggingOut ? 'Logging out...' : 'Sign Out'}
            </span>
          </button>

          {/* Danger Zone */}
          <div className="border border-red-200 dark:border-red-900/30 rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
            <div className="flex items-start space-x-2 mb-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h5 className="text-sm font-semibold text-red-700 dark:text-red-400">Danger Zone</h5>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Deleting your account is permanent and cannot be undone. All your reports and data will be removed.
                </p>
              </div>
            </div>
            <Button
              onClick={handleDeleteAccount}
              variant="danger"
              fullWidth
              className="mt-2"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Account
              </span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}