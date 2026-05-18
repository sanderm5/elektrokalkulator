/**
 * Formaterer et tall til norsk lokale (komma som desimalskiller),
 * med angitt antall desimaler. Klipper bort etterfølgende nuller
 * når det gir mening (f.eks. 4,600 → 4,6).
 */
export function formatNumber(value: number, decimals = 3): string {
  if (!Number.isFinite(value)) return '—';
  const fixed = value.toFixed(decimals);
  // Fjern trailing zeroes etter desimaltegnet, men behold minst én desimal
  const trimmed = fixed.includes('.')
    ? fixed.replace(/0+$/, '').replace(/\.$/, '')
    : fixed;
  return trimmed.replace('.', ',');
}

/**
 * Parser et input-felt som potensielt bruker komma som desimaltegn.
 * Returnerer NaN ved tom streng eller ugyldig input.
 */
export function parseNumber(raw: string): number {
  if (raw.trim() === '') return NaN;
  const normalized = raw.replace(',', '.').trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}
