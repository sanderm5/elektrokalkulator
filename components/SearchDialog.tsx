'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  buildSearchItems,
  createFuse,
  getRecent,
  pushRecent,
  type SearchItem,
} from '@/lib/search';

const TYPE_LABEL: Record<SearchItem['type'], string> = {
  formel: 'Formel',
  modul: 'Modul',
  tabell: 'Tabell',
  mal: 'Mal',
  symbol: 'Symbol',
  kategori: 'Kategori',
};

const TYPE_GLYPH: Record<SearchItem['type'], string> = {
  formel: 'ƒ',
  modul: '⌬',
  tabell: '▦',
  mal: '✉',
  symbol: '⌬',
  kategori: '◇',
};

const TYPE_ORDER: SearchItem['type'][] = ['modul', 'formel', 'mal', 'tabell', 'symbol', 'kategori'];

type GroupedResults = {
  type: SearchItem['type'];
  items: { item: SearchItem; flatIndex: number }[];
}[];

function groupResults(results: SearchItem[]): GroupedResults {
  const byType = new Map<SearchItem['type'], SearchItem[]>();
  for (const r of results) {
    const arr = byType.get(r.type) ?? [];
    arr.push(r);
    byType.set(r.type, arr);
  }
  const groups: GroupedResults = [];
  let flatIndex = 0;
  for (const type of TYPE_ORDER) {
    const items = byType.get(type);
    if (!items || items.length === 0) continue;
    groups.push({
      type,
      items: items.map((item) => ({ item, flatIndex: flatIndex++ })),
    });
  }
  return groups;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const items = useMemo(() => buildSearchItems(), []);
  const fuse = useMemo(() => createFuse(items), [items]);
  const itemById = useMemo(
    () => new Map(items.map((i) => [`${i.type}:${i.id}`, i])),
    [items],
  );

  const flatResults: SearchItem[] = useMemo(() => {
    const q = query.trim();
    if (!q) {
      if (!open) return [];
      const recent = getRecent();
      return recent
        .map((key) => itemById.get(key))
        .filter((it): it is SearchItem => Boolean(it));
    }
    return fuse.search(q).slice(0, 30).map((r) => r.item);
  }, [query, fuse, open, itemById]);

  const grouped = useMemo(() => groupResults(flatResults), [flatResults]);
  const showingRecent = open && !query.trim() && flatResults.length > 0;

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setQuery('');
      setSelected(0);
      triggerRef.current?.focus();
    }, 140);
  }, []);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      pushRecent(`${item.type}:${item.id}`);
      router.push(item.href);
      close();
    },
    [router, close],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // `/`-snarvei: kun når ingen tekst-input er fokusert
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName;
        const isTextField =
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          (t as HTMLElement | null)?.isContentEditable === true;
        if (!isTextField) {
          e.preventDefault();
          setOpen(true);
        }
      }
    }
    function onOpenEvent(e: Event) {
      const detail = (e as CustomEvent<{ query?: string }>).detail;
      setOpen(true);
      if (detail?.query) setQuery(detail.query);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('elektro-open-search', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('elektro-open-search', onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery('');
      setSelected(0);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector(
      `[data-flat-index="${selected}"]`,
    ) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) =>
          flatResults.length ? (s + 1) % flatResults.length : 0,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) =>
          flatResults.length
            ? (s - 1 + flatResults.length) % flatResults.length
            : 0,
        );
      } else if (e.key === 'Enter') {
        const item = flatResults[selected];
        if (item) {
          e.preventDefault();
          handleSelect(item);
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, flatResults, selected, handleSelect, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="search-trigger group inline-flex items-center gap-2.5 rounded-full border border-ink-700/60 bg-ink-800/40 pl-3 pr-1.5 py-1.5 text-sm text-ink-200 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-copper-400/50 hover:bg-ink-700/40"
        style={{
          boxShadow: 'none',
        }}
        aria-label="Åpne søk (Cmd+K)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ink-500 group-hover:text-copper-400 transition-colors"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden sm:inline text-ink-200 group-hover:text-copper-400 transition-colors">
          Søk formel eller tabell
        </span>
        <span className="sm:hidden text-ink-500">Søk</span>
        <kbd className="hidden sm:inline-flex items-center justify-center min-w-[28px] h-[22px] rounded-full bg-ink-700/40 border border-ink-600/40 px-1.5 font-mono text-[10px] text-ink-200 group-hover:bg-copper-400/15 group-hover:border-copper-400/40 group-hover:text-copper-400 transition-colors">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[9vh] sm:pt-[14vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Søk i formler og tabeller"
        >
          <div
            className={`absolute inset-0 bg-ink-950/85 backdrop-blur-md transition-opacity duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              closing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={close}
            aria-hidden="true"
          />

          <div
            className={`search-modal relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-ink-700/40 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              closing
                ? 'opacity-0 translate-y-2 scale-[0.98]'
                : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            <div className="relative flex items-center border-b border-ink-700/30 pl-5 pr-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-copper-300"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                placeholder="Søk etter formel, symbol, tabell…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 py-5 text-lg text-ink-50 placeholder:text-ink-500 focus:outline-none font-display tracking-tight"
                autoComplete="off"
                spellCheck={false}
                autoCorrect="off"
                aria-controls="search-results"
                aria-activedescendant={
                  flatResults[selected] ? `result-${selected}` : undefined
                }
              />
              <button
                type="button"
                onClick={close}
                className="font-mono text-[10px] uppercase tracking-wider text-ink-500 hover:text-copper-300 transition-colors rounded-full border border-ink-700/50 px-2.5 py-1"
                aria-label="Lukk søk"
              >
                Esc
              </button>
            </div>

            <div
              ref={listRef}
              id="search-results"
              role="listbox"
              className="max-h-[60vh] overflow-y-auto"
              aria-live="polite"
              aria-atomic="false"
            >
              {flatResults.length === 0 ? (
                <EmptyState query={query} />
              ) : (
                <div className="py-2">
                  {showingRecent && (
                    <div className="px-5 pt-2 pb-1 flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-copper-300">
                        Nylig brukt
                      </span>
                      <span className="h-px flex-1 bg-ink-700/30" />
                    </div>
                  )}
                  {grouped.map((group, gi) => (
                    <div key={group.type}>
                      {!showingRecent && grouped.length > 1 && (
                        <div className={`px-5 pb-1 flex items-center gap-2 ${gi === 0 ? 'pt-2' : 'pt-4'}`}>
                          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-500">
                            {TYPE_LABEL[group.type]}
                            <span className="ml-1.5 text-ink-700">
                              · {group.items.length}
                            </span>
                          </span>
                          <span className="h-px flex-1 bg-ink-700/30" />
                        </div>
                      )}
                      {group.items.map(({ item, flatIndex }) => (
                        <ResultRow
                          key={`${item.type}:${item.id}`}
                          item={item}
                          flatIndex={flatIndex}
                          isSelected={flatIndex === selected}
                          onSelect={() => handleSelect(item)}
                          onHover={() => setSelected(flatIndex)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <footer className="flex items-center justify-between border-t border-ink-700/30 px-5 py-2.5 bg-ink-950/40">
              <span className="flex items-center gap-4 text-[10px] font-mono text-ink-500">
                <KbdHint label="naviger">↑ ↓</KbdHint>
                <KbdHint label="åpne">↵</KbdHint>
                <KbdHint label="lukk">Esc</KbdHint>
              </span>
              {flatResults.length > 0 && (
                <span className="font-mono text-[10px] text-copper-300/70">
                  {flatResults.length} {flatResults.length === 1 ? 'treff' : 'treff'}
                </span>
              )}
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

function ResultRow({
  item,
  flatIndex,
  isSelected,
  onSelect,
  onHover,
}: {
  item: SearchItem;
  flatIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <div
      data-flat-index={flatIndex}
      id={`result-${flatIndex}`}
      role="option"
      aria-selected={isSelected}
    >
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={onHover}
        className={`group relative w-full flex items-center gap-4 pl-5 pr-4 py-2.5 text-left transition-colors duration-150 ${
          isSelected ? 'bg-copper-400/[0.08]' : 'hover:bg-ink-800/30'
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isSelected ? 'bg-copper-400 opacity-100' : 'opacity-0'
          }`}
        />

        <span
          className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full font-display text-base leading-none transition-all duration-200 ${
            isSelected
              ? 'bg-copper-400/20 text-copper-200'
              : 'bg-ink-800/60 text-ink-500'
          }`}
          aria-hidden="true"
        >
          {TYPE_GLYPH[item.type]}
        </span>

        <span className="flex-1 min-w-0">
          <span
            className={`block text-[15px] truncate transition-colors ${
              isSelected ? 'text-copper-50' : 'text-ink-50'
            }`}
          >
            {item.title}
          </span>
          <span className="block text-xs text-ink-500 truncate mt-0.5">
            {item.subtitle ?? item.context ?? item.description}
          </span>
        </span>

        {item.symbol && (
          <span
            className={`shrink-0 font-mono text-sm tabular-nums transition-colors ${
              isSelected ? 'text-copper-300' : 'text-ink-500'
            }`}
          >
            {item.symbol}
          </span>
        )}

        <span
          aria-hidden="true"
          className={`shrink-0 transition-all duration-200 ${
            isSelected
              ? 'opacity-100 translate-x-0 text-copper-300'
              : 'opacity-0 -translate-x-1 text-ink-500'
          }`}
        >
          ↵
        </span>
      </button>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  const trimmed = query.trim();
  if (trimmed) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-sm text-ink-200">Ingen treff på «{trimmed}»</p>
        <p className="mt-1 text-xs text-ink-500">
          Prøv «ohm», «trefase», «kortslutning», «B16» …
        </p>
      </div>
    );
  }
  return (
    <div className="px-5 py-10">
      <p className="text-sm text-ink-200">
        Søk etter formelnavn, symbol, kategori eller stikkord.
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {['ohm', 'spenningsfall', 'samtidighet', 'kortslutning', 'cos φ', 'IT 230V', 'sluttkontroll'].map((s) => (
          <span
            key={s}
            className="inline-flex items-center rounded-full border border-ink-700/50 bg-ink-900/40 px-2.5 py-0.5 text-[11px] font-mono text-ink-500"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function KbdHint({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <kbd className="inline-flex items-center justify-center min-w-[20px] h-[18px] rounded border border-ink-700/50 bg-ink-900/60 px-1 text-ink-300">
        {children}
      </kbd>
      <span className="text-ink-500">{label}</span>
    </span>
  );
}
