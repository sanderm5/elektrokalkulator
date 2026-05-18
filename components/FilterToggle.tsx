'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'elektro-show-fysikk';

/**
 * Toggle som styrer om "sjelden" (fysikk-bakgrunn) formler vises.
 * CSS-basert via data-attribut på <body> — server-rendret HTML
 * forblir uendret, kun synlighet endres klient-side.
 */
export function FilterToggle() {
  const [showFysikk, setShowFysikk] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Les lagret tilstand ved mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const next = stored === 'true';
      setShowFysikk(next);
      document.body.dataset.showFysikk = next ? 'true' : 'false';
    } catch (err) {
      console.error('Kunne ikke lese fysikk-toggle:', err);
    }
  }, []);

  // Oppdater body når toggle endres
  useEffect(() => {
    if (!mounted) return;
    document.body.dataset.showFysikk = showFysikk ? 'true' : 'false';
    try {
      window.localStorage.setItem(STORAGE_KEY, String(showFysikk));
    } catch (err) {
      console.error('Kunne ikke lagre fysikk-toggle:', err);
    }
  }, [showFysikk, mounted]);

  return (
    <button
      type="button"
      onClick={() => setShowFysikk((v) => !v)}
      role="switch"
      aria-checked={showFysikk}
      aria-label={
        showFysikk
          ? 'Skjul fysikk-bakgrunn (resonans, RC/RL, kondensator-energi)'
          : 'Vis fysikk-bakgrunn (resonans, RC/RL, kondensator-energi)'
      }
      title={
        showFysikk
          ? 'Skjul fysikk-stoff (sjelden på ELE2/ELE3)'
          : 'Vis fysikk-stoff (sjelden på ELE2/ELE3)'
      }
      className="group inline-flex items-center gap-2 rounded-full border border-ink-700/50 bg-ink-900/40 px-3 py-1.5 text-xs text-ink-500 transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-copper-400/40 hover:text-copper-200"
    >
      <span
        aria-hidden="true"
        className={`relative inline-flex h-4 w-7 rounded-full border transition-colors duration-200 ${
          showFysikk
            ? 'bg-copper-400/30 border-copper-400/50'
            : 'bg-ink-800/60 border-ink-700/60'
        }`}
      >
        <span
          className={`absolute top-[1px] h-[12px] w-[12px] rounded-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            showFysikk
              ? 'left-[13px] bg-copper-300'
              : 'left-[1px] bg-ink-500'
          }`}
        />
      </span>
      <span className="hidden md:inline font-mono text-[10px] uppercase tracking-wider">
        Fysikk
      </span>
    </button>
  );
}
