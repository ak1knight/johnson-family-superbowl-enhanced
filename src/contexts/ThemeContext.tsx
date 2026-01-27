"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
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

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('selected-theme');
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    setIsLoaded(true);
  }, []);

  // Apply theme to document and save to localStorage
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('selected-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Apply theme to document when theme changes
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, isLoaded]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};