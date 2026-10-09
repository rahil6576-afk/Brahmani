'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export type Theme = 'night' | 'day';

export interface ThemeContextType {
  theme: Theme;
  isNight: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  pullProgress: number; // 0 to 1 during drag
  setPullProgress: (progress: number) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  themeProgress: number; // 0 (pure night) to 1 (full daylight)
  setLiveProgress: (val: number) => void;
  reducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('night');
  const [pullProgress, setPullProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [themeProgress, setThemeProgress] = useState<number>(0); // 0 = night, 1 = day
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Sync theme with localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('brahmani_theme') as Theme | null;
      if (saved === 'day' || saved === 'night') {
        setThemeState(saved);
      }
    } catch {}
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Sync theme class and progress on root HTML element
  useEffect(() => {
    const isDay = theme === 'day';
    const root = document.documentElement;

    if (isDay) {
      root.classList.add('day-mode');
      root.classList.remove('night-mode');
      root.style.setProperty('--theme-progress', '1');
      setThemeProgress(1);
    } else {
      root.classList.add('night-mode');
      root.classList.remove('day-mode');
      root.style.setProperty('--theme-progress', '0');
      setThemeProgress(0);
    }
  }, [theme]);

  // Compatibility hook for live progress during interaction
  const setLiveProgress = useCallback((val: number) => {
    setThemeProgress(val);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const nextTheme = prev === 'night' ? 'day' : 'night';
      try {
        localStorage.setItem('brahmani_theme', nextTheme);
      } catch {}
      return nextTheme;
    });
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('brahmani_theme', newTheme);
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isNight: theme === 'night',
        setTheme,
        toggleTheme,
        pullProgress,
        setPullProgress,
        isDragging,
        setIsDragging,
        themeProgress,
        setLiveProgress,
        reducedMotion,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

