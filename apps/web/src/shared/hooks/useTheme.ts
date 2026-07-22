import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'eenglish-admin-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * useTheme — manages dark/light mode for the admin panel.
 * - Persists preference in localStorage under `eenglish-admin-theme`
 * - Applies/removes the `.dark` class on `<html>` (Tailwind `darkMode: "class"`)
 * - Falls back to OS preference on first visit
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setLight = useCallback(() => setTheme('light'), []);
  const setDark  = useCallback(() => setTheme('dark'),  []);

  return { theme, toggleTheme, setLight, setDark } as const;
}
