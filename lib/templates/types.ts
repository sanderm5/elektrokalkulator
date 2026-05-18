export type TemplateKind = 'kundekommunikasjon';

export type TemplateField = {
  /** Plassholder-navn som vises i klartekst, f.eks. "KUNDENAVN". */
  placeholder: string;
  /** Brukervennlig hjelpetekst for hva som skal fylles inn. */
  description: string;
};

export type Template = {
  id: string;
  slug: string;
  kind: TemplateKind;
  title: string;
  subtitle?: string;
  description: string;
  whenToUse: string;
  /** Hele malens tekstinnhold. Plassholdere skrives som [NAVN]. */
  body: string;
  /** Plassholdere som finnes i `body`. Vises som tjekkpunkter under malen. */
  fields: TemplateField[];
  /** Underskrift / avsluttende linje (kan inneholde plassholdere). */
  signature?: string;
  source?: string;
  keywords?: string[];
  glyph?: string;
  order: number;
};
