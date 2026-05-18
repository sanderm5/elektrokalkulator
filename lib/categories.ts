export type CategoryId =
  | 'likestrom'
  | 'vekselstrom'
  | 'trefase'
  | 'spenningsfall'
  | 'kortslutning'
  | 'vern'
  | 'kabel'
  | 'belastningsberegning'
  | 'nettsystemer'
  | 'transformator'
  | 'motor'
  | 'likeretter'
  | 'belysning'
  | 'energi-varme'
  | 'elektromagnetisme'
  | 'diagnose'
  | 'anlegg-system';

/** Kategorier som inneholder moduler (multi-output) i stedet for formler. */
export const MODULE_CATEGORIES: ReadonlyArray<CategoryId> = ['diagnose', 'anlegg-system'];

export function isModuleCategory(id: CategoryId): boolean {
  return MODULE_CATEGORIES.includes(id);
}

export type Category = {
  id: CategoryId;
  slug: string;
  title: string;
  short: string;
  description: string;
  /** Symbol som vises på kategori-kortet. Bevisst valg: ASCII, ikke emoji. */
  glyph: string;
  /** Sortering på forsiden. */
  order: number;
};

export const CATEGORIES: Category[] = [
  {
    id: 'likestrom',
    slug: 'likestrom',
    title: 'Likestrøm',
    short: 'DC',
    description:
      'Ohms lov, effekt, energi, resistans i serie/parallell, resistivitet og temperaturavhengighet.',
    glyph: '=',
    order: 1,
  },
  {
    id: 'vekselstrom',
    slug: 'vekselstrom',
    title: 'Vekselstrøm — enfase',
    short: 'AC',
    description:
      'Frekvens, reaktans, impedans, effektfaktor, aktiv/reaktiv/tilsynelatende effekt, resonans.',
    glyph: '~',
    order: 2,
  },
  {
    id: 'trefase',
    slug: 'trefase',
    title: 'Trefase',
    short: '3∼',
    description:
      'Stjerne- og trekantkobling, linje- og fasestørrelser, trefaseeffekt, usymmetri.',
    glyph: 'Y',
    order: 3,
  },
  {
    id: 'spenningsfall',
    slug: 'spenningsfall',
    title: 'Spenningsfall',
    short: 'ΔU',
    description:
      'Enfase og trefase, med og uten cos φ, NEK 400 krav (3 % / 5 %), prosentberegning.',
    glyph: 'ΔU',
    order: 4,
  },
  {
    id: 'kortslutning',
    slug: 'kortslutning',
    title: 'Kortslutning',
    short: 'Ik',
    description:
      'Kortslutningsstrøm, sløyfeimpedans, smelteintegral I²t, krav til utkobling.',
    glyph: 'Ik',
    order: 5,
  },
  {
    id: 'vern',
    slug: 'vern',
    title: 'Vern og selektivitet',
    short: 'B/C/D',
    description:
      'Karakteristikker, utkoblingstider, RCD, berøringsspenning og selektivitet.',
    glyph: '⏻',
    order: 6,
  },
  {
    id: 'kabel',
    slug: 'kabel',
    title: 'Kabeldimensjonering',
    short: 'mm²',
    description:
      'Belastningsstrøm, korreksjonsfaktorer, termisk kortslutningstoleranse, kontroll mot spenningsfall.',
    glyph: '∅',
    order: 7,
  },
  {
    id: 'belastningsberegning',
    slug: 'belastningsberegning',
    title: 'Belastningsberegning',
    short: 'P_dim',
    description:
      'Dimensjonerende effekt, samtidighetsfaktor, 80%-regel, maks last fra hovedvern — praktisk dimensjonering for eksamensoppgaver.',
    glyph: 'Σ',
    order: 8,
  },
  {
    id: 'nettsystemer',
    slug: 'nettsystemer',
    title: 'Nettsystemer',
    short: 'TN/TT/IT',
    description:
      'TN-C, TN-S, TN-C-S, TT og IT. Jordfeilsløyfer, driftsjording, beskyttelsesjording.',
    glyph: '⏚',
    order: 9,
  },
  {
    id: 'transformator',
    slug: 'transformator',
    title: 'Transformator',
    short: 'N₁/N₂',
    description:
      'Omsetningsforhold, virkningsgrad, kortslutningsspenning, vektorgrupper.',
    glyph: '⊏⊐',
    order: 10,
  },
  {
    id: 'motor',
    slug: 'motor',
    title: 'Motor — asynkron',
    short: 'M',
    description:
      'Synkron hastighet, sluring, moment, trefase motoreffekt, startmetoder.',
    glyph: 'M',
    order: 11,
  },
  {
    id: 'likeretter',
    slug: 'likeretter',
    title: 'Likeretter',
    short: 'AC→DC',
    description:
      'Halvbølge, helbølge bro, trefase bro — sammenheng mellom Urms og Udc.',
    glyph: '⇒',
    order: 12,
  },
  {
    id: 'belysning',
    slug: 'belysning',
    title: 'Belysning',
    short: 'lx',
    description:
      'Belysningsstyrke, lysutbytte, vedlikeholdsfaktor.',
    glyph: '☀',
    order: 13,
  },
  {
    id: 'energi-varme',
    slug: 'energi-varme',
    title: 'Energi og varme',
    short: 'kWh',
    description: 'Elektrisk energi, varmemengde, virkningsgrad varmer, varmekabler.',
    glyph: 'Q',
    order: 14,
  },
  {
    id: 'elektromagnetisme',
    slug: 'elektromagnetisme',
    title: 'Elektromagnetisme',
    short: 'Φ',
    description:
      'Kondensator- og spole-energi, tidskonstanter, magnetisk fluks.',
    glyph: 'Φ',
    order: 15,
  },
  {
    id: 'diagnose',
    slug: 'diagnose',
    title: 'Diagnose fra måleverdier',
    short: 'Ω→',
    description:
      'Isolasjonsmåling, kontinuitet, RCD-test og sløyfeimpedans — fra måleverdi til tolkning og tiltak.',
    glyph: '⌬',
    order: 16,
  },
  {
    id: 'anlegg-system',
    slug: 'anlegg-system',
    title: 'Anlegg og system',
    short: 'TN/IT',
    description:
      'Trafo til TN- og IT-nett, PIV per likeretter, sammenhengende installasjonsanalyse — multi-output for hele anlegg.',
    glyph: '⌗',
    order: 17,
  },
];

export function getCategory(id: CategoryId): Category {
  const cat = CATEGORIES.find((c) => c.id === id);
  if (!cat) throw new Error(`Ukjent kategori: ${id}`);
  return cat;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
