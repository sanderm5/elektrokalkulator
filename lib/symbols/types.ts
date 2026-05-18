import type { ReactNode } from 'react';

export type SymbolCategory =
  | 'bryter'
  | 'stikk'
  | 'tak-stikk'
  | 'uttak-svakstrom'
  | 'lys'
  | 'tavle'
  | 'maling'
  | 'varme'
  | 'vern'
  | 'maskin'
  | 'jord'
  | 'kobling';

export type SymbolKind = 'plantegning' | 'koblingsskjema';

export type ElectroSymbol = {
  id: string;
  /** Navn som vises under symbol-grid og i søk. */
  name: string;
  /** Liten støttetekst — én linje, mindre font under navn. */
  subtitle?: string;
  category: SymbolCategory;
  kind: SymbolKind;
  /** PDF-referanse for plantegnings-symboler, f.eks. "A1" eller "C5". */
  ref?: string;
  /** Stikkord for søk. */
  keywords?: string[];
  /** Lengre forklaring vises som tooltip eller på hover-kort. */
  description?: string;
  /**
   * SVG-paths som rendres inne i en <svg viewBox={viewBox}>.
   * Bruk stroke="currentColor" + strokeWidth + fill="none" for å arve farge.
   */
  paths: ReactNode;
  /** ViewBox — standardiseres på "0 0 60 60" der mulig. */
  viewBox: string;
};
