// Session timeout management
'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth/actions';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_BEFORE_LOGOUT = 5 * 60 * 1000; // Warn 5 minutes before logout

/**
 * Hook to handle session timeout
 */
export function useSessionTimeout() {
  const router = useRouter();

  const logout = useCallback(async () => {
    await signOut();
    router.push('/login?reason=session-expired');
  }, [router]);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetTimers = () => {
      // Clear existing timers
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (warningTimer) clearTimeout(warningTimer);

      // Set warning timer
      warningTimer = setTimeout(() => {
        // You can show a modal/toast here warning the user
        console.warn('Session will expire in 5 minutes due to inactivity');
      }, INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT);

      // Set logout timer
      inactivityTimer = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Reset timers on any activity
    events.forEach(event => {
      document.addEventListener(event, resetTimers, true);
    });

    // Initialize timers
    resetTimers();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimers, true);
      });
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [logout]);
}
