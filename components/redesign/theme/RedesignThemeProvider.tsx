'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type RedesignTheme = 'dark' | 'light';

const COOKIE_NAME = 'rd-theme';
const STORAGE_KEY = 'rd-theme';

interface ThemeContextValue {
  theme: RedesignTheme;
  setTheme: (t: RedesignTheme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside RedesignThemeProvider');
  return ctx;
}

function persist(theme: RedesignTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

interface RedesignThemeProviderProps {
  children: React.ReactNode;
  /** Theme resolved server-side from the `rd-theme` cookie — avoids FOUC on first paint. */
  initialTheme: RedesignTheme;
}

export function RedesignThemeProvider({ children, initialTheme }: RedesignThemeProviderProps) {
  const [theme, setThemeState] = useState<RedesignTheme>(initialTheme);

  // Reconcile with localStorage after mount (cookie is the SSR source of
  // truth, but localStorage may be newer if the cookie failed to persist).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as RedesignTheme | null;
      if (stored && stored !== theme && (stored === 'dark' || stored === 'light')) {
        setThemeState(stored);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((t: RedesignTheme) => {
    setThemeState(t);
    persist(t);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      persist(next);
      return next;
    });
  }, []);

  // Mirror the theme onto <html> so [data-theme] tokens (in particular
  // --bg-base) reach the real page background — body/html sit outside the
  // .rd-shell wrapper below and would otherwise keep the live dashboard's
  // hardcoded dark background (see `body` in app/globals.css). Cleaned up
  // on unmount so leaving /redesign can't leak theme.css onto live pages.
  //
  // <html> is the ONLY element that carries data-theme: custom properties
  // cascade from the nearest ancestor that (re)defines them, so if the
  // .rd-shell div below also declared it, its value would shadow <html>'s
  // for every component inside — .rd-shell just inherits the tokens.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      <div className="rd-shell">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
