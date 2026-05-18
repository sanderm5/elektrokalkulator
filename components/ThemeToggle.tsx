'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'elektro-theme';
type Theme = 'dark' | 'light';

function readSavedTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'dark' || v === 'light' ? v : null;
  } catch {
    return null;
  }
}

function readSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

export function ThemeToggle() {
  // Default 'dark' for å unngå hydration mismatch (HTML rendres med
  // data-theme="dark" som default). Riktig tema settes i useEffect.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = readSavedTheme();
    const initial = saved ?? readSystemTheme();
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      console.error('Kunne ikke lagre tema:', err);
    }
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'}
      title={isDark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'}
      className="group inline-flex items-center justify-center w-9 h-9 rounded-full border border-ink-700/50 bg-ink-900/40 text-ink-500 transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-copper-400/40 hover:text-copper-200"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark ? 'rotate-0' : 'rotate-180'
        }`}
      >
        {isDark ? (
          // Måne (vises i dark — klikk for å gå til light)
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        ) : (
          // Sol (vises i light — klikk for å gå til dark)
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        )}
      </svg>
    </button>
  );
}
