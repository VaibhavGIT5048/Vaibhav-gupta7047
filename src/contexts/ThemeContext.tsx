import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getThemePreference, saveThemePreference, subscribeToThemeChanges, unsubscribeFromThemeChanges } from '../utils/themeStorage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await getThemePreference();
        setTheme(savedTheme);
        
        // Apply theme to document
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();

    // Subscribe to real-time theme changes
    const subscription = subscribeToThemeChanges((newTheme) => {
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    });

    return () => {
      unsubscribeFromThemeChanges(subscription);
    };
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Optimistically update UI
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Save to Supabase
    try {
      await saveThemePreference(newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
      // Revert on error
      setTheme(theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};