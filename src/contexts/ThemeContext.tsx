"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  isTransitioning: boolean;
  isClient: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // During SSR, return a default theme context instead of throwing
    if (typeof window === 'undefined') {
      return {
        theme: 'mytheme',
        setTheme: () => {},
        isTransitioning: false,
        isClient: false
      };
    }
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState('mytheme'); // default theme
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load theme from localStorage on mount - with SSR check
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('selected-theme');
      if (savedTheme) {
        setThemeState(savedTheme);
      }
      setIsLoaded(true);
    }
  }, [isClient]);

  // Apply theme to document and save to localStorage with smooth transition
  const setTheme = (newTheme: string) => {
    if (newTheme !== theme && isClient && typeof window !== 'undefined') {
      setIsTransitioning(true);
      setThemeState(newTheme);
      localStorage.setItem('selected-theme', newTheme);
      
      // Add smooth transition to document
      document.documentElement.style.transition = 'all 0.3s ease-in-out';
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // End transition after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        document.documentElement.style.transition = '';
      }, 300);
    }
  };

  // Apply theme to document when theme changes on load - with SSR check
  useEffect(() => {
    if (isLoaded && isClient && typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, isLoaded, isClient]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isTransitioning, isClient }}>
      <div className={`theme-transition ${isTransitioning ? 'transitioning' : ''}`}>
        {children}
      </div>
      
      {/* Global transition styles - only render on client */}
      {isClient && (
        <style jsx global>{`
          .theme-transition {
            transition: all 0.3s ease-in-out;
          }
          
          .theme-transition.transitioning {
            pointer-events: none;
          }
          
          /* Smooth transitions for theme-dependent elements */
          .btn, .card, .navbar, .dropdown-content {
            transition: background-color 0.3s ease-in-out,
                       border-color 0.3s ease-in-out,
                       color 0.3s ease-in-out,
                       box-shadow 0.3s ease-in-out !important;
          }
          
          /* Preserve specific animations during theme transitions */
          .animate-pulse, .animate-bounce {
            animation-play-state: running !important;
          }
        `}</style>
      )}
    </ThemeContext.Provider>
  );
};