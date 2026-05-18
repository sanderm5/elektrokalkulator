import Fuse from 'fuse.js';
import { ALL_FORMULAS } from '@/lib/formulas';
import { ALL_TABLES } from '@/lib/tables';
import { ALL_MODULES } from '@/lib/modules';
import { ALL_TEMPLATES } from '@/lib/templates';
import { ALL_SYMBOLS, CATEGORY_LABEL } from '@/lib/symbols';
import { CATEGORIES } from '@/lib/categories';

export type SearchItem = {
  type: 'formel' | 'tabell' | 'symbol' | 'kategori' | 'modul' | 'mal';
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  symbol?: string;
  keywords?: string[];
  href: string;
  glyph?: string;
  /** Sekundær-info, vises som meta — f.eks. kategorinavn. */
  context?: string;
};

/** Bygger en kort, søkbar tittel for én tabellrad. */
function buildRowTitle(
  primaryValue: string,
  tableTitle: string,
): string {
  if (!primaryValue) return tableTitle;
  return `${primaryValue} — ${tableTitle}`;
}

const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function buildSearchItems(): SearchItem[] {
  const formler: SearchItem[] = ALL_FORMULAS.map((f) => {
    const cat = CATEGORY_BY_ID.get(f.category);
    return {
      type: 'formel',
      id: f.id,
      title: f.title,
      subtitle: f.subtitle,
      description: f.description,
      symbol: f.output.symbol,
      keywords: f.keywords,
      href: `/formel/${f.id}/`,
      context: cat?.title,
    };
  });

  const tabeller: SearchItem[] = ALL_TABLES.map((t) => ({
    type: 'tabell',
    id: t.id,
    title: t.title,
    description: t.description,
    glyph: t.glyph,
    href: `/tabeller/${t.slug}/`,
    context: t.source,
  }));

  // Indekser hver tabellrad separat — gjør "701", "FEL 14", "samsvar" søkbare
  // direkte. Treffene peker til tabellsiden med anchor til riktig rad.
  const tabellrader: SearchItem[] = ALL_TABLES.flatMap((t) => {
    const primaryCol =
      t.columns.find((c) => c.primary) ?? t.columns[0];
    const primaryKey = primaryCol?.key;
    return t.sections.flatMap((section) =>
      section.rows.map((row) => {
        const primaryValue =
          primaryKey && row.cells[primaryKey] !== undefined
            ? String(row.cells[primaryKey])
            : '';
        const allCells = Object.values(row.cells)
          .map((v) => String(v))
          .join(' · ');
        return {
          type: 'tabell',
          id: `${t.id}__${row.id}`,
          title: buildRowTitle(primaryValue, t.title),
          description: allCells,
          keywords: row.keywords,
          glyph: t.glyph,
          href: `/tabeller/${t.slug}/#row-${row.id}`,
          context: section.title ?? t.title,
        };
      }),
    );
  });

  const symboler: SearchItem[] = ALL_SYMBOLS.map((s) => ({
    type: 'symbol',
    id: s.id,
    title: s.name,
    subtitle: s.subtitle,
    description: s.description ?? '',
    keywords: [
      ...(s.keywords ?? []),
      s.ref ?? '',
      CATEGORY_LABEL[s.category],
    ].filter(Boolean),
    href: `/skjema/#symbol-${s.id}`,
    context:
      s.kind === 'plantegning'
        ? `Plantegning · ${CATEGORY_LABEL[s.category]}`
        : `Koblingsskjema · ${CATEGORY_LABEL[s.category]}`,
  }));

  const kategorier: SearchItem[] = CATEGORIES.map((c) => ({
    type: 'kategori',
    id: c.id,
    title: c.title,
    description: c.description,
    glyph: c.glyph,
    href: `/kategori/${c.slug}/`,
    context: c.short,
  }));

  const moduler: SearchItem[] = ALL_MODULES.map((m) => {
    const cat = CATEGORY_BY_ID.get(m.category);
    return {
      type: 'modul',
      id: m.id,
      title: m.title,
      subtitle: m.subtitle,
      description: m.description,
      keywords: m.keywords,
      glyph: m.glyph,
      href: `/modul/${m.id}/`,
      context: cat?.title,
    };
  });

  const maler: SearchItem[] = ALL_TEMPLATES.map((t) => ({
    type: 'mal',
    id: t.id,
    title: t.title,
    subtitle: t.subtitle,
    description: t.description,
    keywords: t.keywords,
    glyph: t.glyph,
    href: `/maler/${t.slug}/`,
    context: 'Kundekommunikasjon',
  }));

  return [
    ...formler,
    ...tabeller,
    ...tabellrader,
    ...symboler,
    ...kategorier,
    ...moduler,
    ...maler,
  ];
}

export function createFuse(items: SearchItem[]): Fuse<SearchItem> {
  return new Fuse(items, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'symbol', weight: 3 },
      { name: 'subtitle', weight: 2 },
      { name: 'keywords', weight: 2 },
      { name: 'description', weight: 1 },
      { name: 'context', weight: 0.5 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 1,
    includeScore: true,
  });
}

const RECENT_KEY = 'elektro-kalk-recent';
const RECENT_MAX = 6;

export function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch (err) {
    console.error('Kunne ikke lese nylig brukte:', err);
    return [];
  }
}

export function pushRecent(itemId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecent().filter((id) => id !== itemId);
    const next = [itemId, ...current].slice(0, RECENT_MAX);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('Kunne ikke lagre nylig brukte:', err);
  }
}
