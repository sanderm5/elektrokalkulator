import type { ReferenceTable } from './types';

export const VERN_IA: ReferenceTable = {
  id: 'vern-ia',
  slug: 'vern-ia',
  title: 'Ia for vern — utløsestrøm etter karakteristikk',
  description:
    'Strømmen vernet garantert utløser ved innen kort tid (typisk < 0,1 s). Brukes for å regne Z_s,maks og verifisere automatisk utkobling ved jordfeil.',
  source: 'NEK 400-4-41 / IEC 60898',
  verifyStatus: 'verifisert',
  verifySources: 'B/C/D-multiplikatorer er forskriftsfestet i IEC 60898 for boliginstallasjon (B/C) og industri (D).',
  topic: 'vern',
  glyph: 'I_a',
  order: 5,
  relatedFormulaIds: ['maks-sloyfeimpedans', 'ik-min', 'kortslutning-jord'],
  columns: [
    { key: 'kar', label: 'Karakteristikk', align: 'left', primary: true },
    { key: 'mult', label: 'I_a / I_n', align: 'right', copyable: true, hint: 'Multiplikator av merkestrøm' },
    { key: 'in10', label: 'I_a ved 10 A', unit: 'A', align: 'right', copyable: true },
    { key: 'in16', label: 'I_a ved 16 A', unit: 'A', align: 'right', copyable: true },
    { key: 'in25', label: 'I_a ved 25 A', unit: 'A', align: 'right', copyable: true },
    { key: 'bruk', label: 'Typisk bruk', align: 'left' },
  ],
  sections: [
    {
      id: 'mcb',
      title: 'Automatsikringer (MCB)',
      rows: [
        {
          id: 'b',
          cells: { kar: 'B', mult: '5·In', in10: 50, in16: 80, in25: 125, bruk: 'Bolig, kontor — vanlig standard' },
          highlight: true,
        },
        {
          id: 'c',
          cells: { kar: 'C', mult: '10·In', in10: 100, in16: 160, in25: 250, bruk: 'Motorer, varme, induktive laster' },
          highlight: true,
        },
        {
          id: 'd',
          cells: { kar: 'D', mult: '20·In', in10: 200, in16: 320, in25: 500, bruk: 'Trafoer, store motorer, høye startstrømmer' },
        },
      ],
    },
    {
      id: 'gg',
      title: 'Smeltesikringer (gG)',
      rows: [
        {
          id: 'gg-merknad',
          cells: { kar: 'gG', mult: '≈ 5–10·In', in10: '50–100', in16: '80–160', in25: '125–250', bruk: 'Industri — eksakt I_a fra kurve, varierer med tid' },
          warning: 'gG har ikke fast multiplikator — sjekk smelte-tid-kurve.',
        },
      ],
    },
  ],
  notes: [
    'I_a er minimumsstrøm for garantert utløsning innen 0,1 s (det "raske" magnetiske området).',
    'NEK 400-4-41 krever Z_s ≤ U₀ / I_a for jordfeilbeskyttelse.',
    'For lange kurser i bolig: B-karakteristikk gir lavere Z_s,maks-krav enn C — derfor B standard for stikkontakter.',
  ],
};
