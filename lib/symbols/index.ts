import type { ElectroSymbol, SymbolCategory } from './types';
import { PLANTEGNING_SYMBOLER } from './plantegning';
import { KOBLINGSSKJEMA_SYMBOLER } from './koblingsskjema';

export type { ElectroSymbol, SymbolCategory, SymbolKind } from './types';

export const ALL_SYMBOLS: ElectroSymbol[] = [
  ...PLANTEGNING_SYMBOLER,
  ...KOBLINGSSKJEMA_SYMBOLER,
];

export { PLANTEGNING_SYMBOLER, KOBLINGSSKJEMA_SYMBOLER };

export function getSymbol(id: string): ElectroSymbol | undefined {
  return ALL_SYMBOLS.find((s) => s.id === id);
}

export const CATEGORY_LABEL: Record<SymbolCategory, string> = {
  bryter: 'Brytere',
  stikk: 'Stikkontakter',
  'tak-stikk': 'Tak-stikkontakter',
  'uttak-svakstrom': 'Svakstrøm-uttak',
  lys: 'Lyspunkt og armatur',
  tavle: 'Tavle og fordeling',
  maling: 'Måling og styring',
  varme: 'Varme',
  vern: 'Vern og brytere',
  maskin: 'Maskiner',
  jord: 'Jord og utjevning',
  kobling: 'Linjer og koblinger',
};
