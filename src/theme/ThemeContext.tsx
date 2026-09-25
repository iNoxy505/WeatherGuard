import React, { createContext, useContext, useMemo } from 'react';
import { useThemeStore } from '../state/useThemeStore';
import { getTheme, ThemeColors } from './colors';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: getTheme(isDark),
      isDark,
      toggleTheme,
    }),
    [isDark, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
