'use client';

/**
 * Theme Provider - Manages theme state and provides theme context
 * Supports light/dark mode with system preference detection
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'camp-paws-theme';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

// Get system preference
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Resolve theme (system -> actual theme)
const resolveTheme = (currentTheme: Theme): ResolvedTheme => {
  if (currentTheme === 'system') {
    return getSystemTheme();
  }
  return currentTheme;
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  // Update DOM and state
  const updateTheme = (newTheme: Theme) => {
    const resolved = resolveTheme(newTheme);
    
    // Update DOM
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    
    // Update state
    setThemeState(newTheme);
    setResolvedTheme(resolved);
    
    // Persist to storage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    }
  };

  // Set theme
  const setTheme = (newTheme: Theme) => {
    updateTheme(newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Get saved preference
        const savedTheme = localStorage.getItem(storageKey) as Theme | null;
        const initialTheme = savedTheme || defaultTheme;
        
        const resolved = resolveTheme(initialTheme);
        
        // Update DOM
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        
        // Update state
        setThemeState(initialTheme);
        setResolvedTheme(resolved);
        setMounted(true);
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
        const resolved = resolveTheme(defaultTheme);
        const root = document.documentElement;
        root.classList.add(resolved);
        setThemeState(defaultTheme);
        setResolvedTheme(resolved);
        setMounted(true);
      }
    };

    initializeTheme();
  }, [defaultTheme, storageKey]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newResolvedTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolvedTheme);
      
      // Update DOM
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolvedTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper hook for className based on theme
export function useThemeAwareClassName(lightClass: string, darkClass: string): string {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? darkClass : lightClass;
}
