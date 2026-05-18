export type CellValue = string | number;

export type TableColumn = {
  key: string;
  label: string;
  unit?: string;
  /** Tekst-justering — default left for tekst, right for tall. */
  align?: 'left' | 'right' | 'center';
  /** Vis kopier-knapp på cellene i denne kolonnen. */
  copyable?: boolean;
  /** Sett til true for å fremheve verdien visuelt (kobber). */
  primary?: boolean;
  /** Hjelpetekst som vises som tooltip på kolonneoverskriften. */
  hint?: string;
};

export type TableRow = {
  id: string;
  cells: Record<string, CellValue>;
  /** Markert som anbefalt/standardvalg. */
  highlight?: boolean;
  /** Advarselsmarkør med tekst — for verdier som må verifiseres. */
  warning?: string;
  /** Søkenøkkelord på radnivå (i tillegg til cellenes innhold). */
  keywords?: string[];
};

export type TableSection = {
  id: string;
  title?: string;
  description?: string;
  rows: TableRow[];
};

export type VerifyStatus = 'verifisert' | 'delvis' | 'uverifisert';

export type ReferenceTable = {
  id: string;
  slug: string;
  title: string;
  /** Kort beskrivelse — vises som lead. */
  description: string;
  /** Kilde, f.eks. "NEK 400 tillegg B.52". */
  source?: string;
  /** Verifikasjons-status mot autoritativ kilde. */
  verifyStatus?: VerifyStatus;
  /** Hvilke kilder som er sjekket — vises i banner. */
  verifySources?: string;
  /** Hvilken pensum-kategori dette hører til (for kryss-lenking). */
  topic?: string;
  columns: TableColumn[];
  sections: TableSection[];
  /** Fotnoter under tabellen. */
  notes?: string[];
  /** Formel-IDer som bruker disse verdiene — for kryss-lenking. */
  relatedFormulaIds?: string[];
  /** ASCII-glyph for kategorikortet. */
  glyph?: string;
  /** Visningsrekkefølge på oversiktssiden. */
  order?: number;
};
