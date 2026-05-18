'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export type ChecklistItem = {
  id: string;
  label: string;
  hint?: string;
};

type Props = {
  storageKey: string;
  items: ChecklistItem[];
  /** Tittel som vises over progresjons-linja. */
  ariaLabel: string;
};

type CheckedMap = Record<string, boolean>;

function readStore(storageKey: string): CheckedMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object') {
      return parsed as CheckedMap;
    }
    return {};
  } catch (err) {
    console.error('Kunne ikke lese sjekkliste:', err);
    return {};
  }
}

function writeStore(storageKey: string, store: CheckedMap): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(store));
  } catch (err) {
    console.error('Kunne ikke lagre sjekkliste:', err);
  }
}

export function InteractiveChecklist({ storageKey, items, ariaLabel }: Props) {
  const [checked, setChecked] = useState<CheckedMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChecked(readStore(storageKey));
    setHydrated(true);
  }, [storageKey]);

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        writeStore(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const reset = useCallback(() => {
    setChecked({});
    writeStore(storageKey, {});
  }, [storageKey]);

  const done = useMemo(
    () => items.filter((i) => checked[i.id]).length,
    [items, checked],
  );
  const pct = items.length === 0 ? 0 : Math.round((done / items.length) * 100);

  return (
    <div aria-label={ariaLabel}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2.5">
          <span
            className="font-display text-2xl tabular-nums text-copper-200"
            aria-live="polite"
          >
            {hydrated ? done : 0}
            <span className="text-ink-700">/{items.length}</span>
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-500">
            ferdig
          </span>
        </div>
        {hydrated && done > 0 && (
          <button
            type="button"
            onClick={reset}
            className="text-xs font-mono uppercase tracking-wider text-ink-500 hover:text-copper-300 transition-colors rounded-full border border-ink-700/50 px-3 py-1.5"
          >
            Nullstill
          </button>
        )}
      </div>

      <div
        className="h-1 rounded-full bg-ink-800/60 overflow-hidden mb-6"
        role="progressbar"
        aria-valuenow={hydrated ? pct : 0}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-copper-400 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${hydrated ? pct : 0}%` }}
        />
      </div>

      <ul className="space-y-1.5" role="list">
        {items.map((item) => {
          const isChecked = hydrated && Boolean(checked[item.id]);
          return (
            <li key={item.id}>
              <label
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isChecked
                    ? 'border-copper-400/30 bg-copper-400/[0.05]'
                    : 'border-ink-700/40 bg-ink-900/30 hover:border-ink-600/60 hover:bg-ink-800/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(item.id)}
                  className="sr-only peer"
                />
                <span
                  aria-hidden="true"
                  className={`shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isChecked
                      ? 'border-copper-400 bg-copper-400 text-ink-950'
                      : 'border-ink-600 bg-ink-950/40'
                  }`}
                >
                  {isChecked && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className={`block text-[15px] leading-snug transition-colors ${
                      isChecked ? 'text-ink-500 line-through' : 'text-ink-50'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.hint && (
                    <span className="block mt-0.5 text-xs text-ink-500 leading-relaxed">
                      {item.hint}
                    </span>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
