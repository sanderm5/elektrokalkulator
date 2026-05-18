import type { CategoryId } from '../categories';

/**
 * Tilbakemelding på et input-felt mens brukeren skriver.
 * - 'ok': verdien er i typisk område — grønn bekreftelse
 * - 'info': nøytral kontekst (f.eks. "230 V tolkes som IT-anlegg")
 * - 'warning': uvanlig verdi — sjekk om det er rett
 * - 'error': verdien er ugyldig eller fysisk umulig i konteksten
 */
export type ValidationHint = {
  status: 'ok' | 'info' | 'warning' | 'error';
  message: string;
};

/**
 * Tilbakemelding på resultatet — anbefaling/kontekst som hjelper brukeren
 * vurdere om svaret er rimelig og hva neste praktiske steg er.
 */
export type Interpretation = {
  status: 'ok' | 'info' | 'warning';
  message: string;
};

export type FormulaInput = {
  symbol: string;
  name: string;
  unit: string;
  defaultValue?: number;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  /**
   * Valgfri validering som returnerer en hint mens brukeren skriver.
   * Returner null hvis ingen tilbakemelding skal vises.
   */
  validate?: (
    value: number,
    allInputs: Record<string, number>,
  ) => ValidationHint | null;
};

export type FormulaExampleStep = {
  latex: string;
  note?: string;
};

export type FormulaExample = {
  scenario: string;
  inputs: Record<string, number>;
  steps: FormulaExampleStep[];
  answer: string;
};

export type FormulaOutput = {
  symbol: string;
  name: string;
  unit: string;
  /** Antall desimaler i resultatet (default 3). */
  decimals?: number;
};

export type Formula = {
  id: string;
  category: CategoryId;
  title: string;
  /** Kort underlede — vises under tittel. */
  subtitle?: string;
  /** KaTeX-streng for hoved-formelen. */
  latex: string;
  /** Hva formelen sier — 2–4 setninger. */
  description: string;
  /** Når formelen brukes — konkret kontekst. */
  whenToUse: string;
  inputs: FormulaInput[];
  output: FormulaOutput;
  /**
   * Beregner output fra inputs. Skal kaste hvis input er ugyldig
   * (f.eks. divisjon på null) så Calculator kan vise feilmelding.
   */
  calculate: (inputs: Record<string, number>) => number;
  /**
   * Valgfri tolkning av resultatet — anbefaling, kontekst, eller
   * advarsel basert på beregnet verdi og input-kombinasjonen.
   * Returner null hvis ingen tilbakemelding skal vises.
   */
  interpret?: (
    result: number,
    inputs: Record<string, number>,
  ) => Interpretation | null;
  examples: FormulaExample[];
  related?: string[];
  /** F.eks. "NEK 400-4-43" eller "Eltabellen s. 124". */
  source?: string;
  /** Søkenøkkelord (i tillegg til tittel/beskrivelse). */
  keywords?: string[];
  /**
   * Eksamen-relevans for ELE2/ELE3:
   * - 'kjerne' (default — undefined): kommer ofte i eksamen
   * - 'sjelden': fysikk-/elektronikk-bakgrunn, skjult bak toggle
   */
  relevans?: 'kjerne' | 'sjelden';
};

export type CalculationResult =
  | { ok: true; value: number; formatted: string }
  | { ok: false; error: string };
