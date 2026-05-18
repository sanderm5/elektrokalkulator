import type { ReferenceTable } from './types';

export const VERN_STANDARDREKKE: ReferenceTable = {
  id: 'vern-standardrekke',
  slug: 'vern-standardrekke',
  title: 'Vern — standardrekke',
  description:
    'Standard rekker for automatsikringer (MCB) og smeltesikringer. Etter beregning rundes alltid opp til neste standardverdi.',
  source: 'IEC 60898-1 (MCB) og IEC 60269-2 (gG-sikring)',
  verifyStatus: 'verifisert',
  verifySources: 'Standardrekken 6/10/13/16/20/25/32/40/50/63/80/100/125 A er forskriftsfestet i IEC 60898-1. Bruksbeskrivelser er typisk norsk praksis, basert på Eltabellen og NK 64-anbefalinger.',
  topic: 'vern',
  glyph: '⏻',
  order: 2,
  relatedFormulaIds: ['vern-mot-overlast', 'utkoblingstid', 'kontinuerlig-belastning'],
  columns: [
    { key: 'In', label: 'I_n', unit: 'A', align: 'right', copyable: true, primary: true },
    { key: 'mcb', label: 'Automat (MCB)', align: 'center' },
    { key: 'gg', label: 'Smeltesikring (gG)', align: 'center' },
    { key: 'kommentar', label: 'Vanlig bruk', align: 'left' },
  ],
  sections: [
    {
      id: 'sma',
      title: 'Små vern (boliginstallasjon)',
      rows: [
        { id: '6a', cells: { In: 6, mcb: '✓', gg: '✓', kommentar: 'Belysning enkelt-kurs' } },
        { id: '10a', cells: { In: 10, mcb: '✓', gg: '✓', kommentar: 'Lys, små stikkurser' } },
        { id: '13a', cells: { In: 13, mcb: '✓', gg: '—', kommentar: 'UK-standard, sjelden i NO' } },
        { id: '16a', cells: { In: 16, mcb: '✓', gg: '✓', kommentar: 'Standard stikkontaktkurs' }, highlight: true },
        { id: '20a', cells: { In: 20, mcb: '✓', gg: '✓', kommentar: 'Kraftige stikkurser, oppvask' } },
        { id: '25a', cells: { In: 25, mcb: '✓', gg: '✓', kommentar: 'Komfyr, varmtvannsbereder' } },
        { id: '32a', cells: { In: 32, mcb: '✓', gg: '✓', kommentar: 'Elbil-lader, sterke kurser' }, highlight: true },
        { id: '40a', cells: { In: 40, mcb: '✓', gg: '✓', kommentar: 'Lite hovedvern, undersentral' } },
      ],
    },
    {
      id: 'medium',
      title: 'Hovedvern bolig / liten næring',
      rows: [
        { id: '50a', cells: { In: 50, mcb: '✓', gg: '✓', kommentar: 'Hovedvern stor bolig' } },
        { id: '63a', cells: { In: 63, mcb: '✓', gg: '✓', kommentar: 'Hovedvern enebolig m/ varmepumpe' }, highlight: true },
        { id: '80a', cells: { In: 80, mcb: '✓ (NH00)', gg: '✓', kommentar: 'Hovedvern stor bolig m/ elbil' }, highlight: true },
        { id: '100a', cells: { In: 100, mcb: '✓ (NH00)', gg: '✓', kommentar: 'Boligblokk inntak per leil.' } },
        { id: '125a', cells: { In: 125, mcb: '✓ (NH00)', gg: '✓', kommentar: 'Næringsbygg' } },
        { id: '160a', cells: { In: 160, mcb: '— (NH1)', gg: '✓', kommentar: 'Større næring' } },
      ],
    },
    {
      id: 'store',
      title: 'Store vern (industri / hovedinntak)',
      rows: [
        { id: '200a', cells: { In: 200, mcb: '— (NH1)', gg: '✓', kommentar: 'Industri / lite næringsbygg' } },
        { id: '250a', cells: { In: 250, mcb: '— (NH2)', gg: '✓', kommentar: 'Industri' } },
        { id: '315a', cells: { In: 315, mcb: '—', gg: '✓', kommentar: 'Stor industri' } },
        { id: '400a', cells: { In: 400, mcb: '— (NH3)', gg: '✓', kommentar: 'Trafostasjon utgang' } },
        { id: '500a', cells: { In: 500, mcb: '—', gg: '✓', kommentar: '' } },
        { id: '630a', cells: { In: 630, mcb: '— (NH3)', gg: '✓', kommentar: 'Trafostasjon' } },
      ],
    },
  ],
  notes: [
    'MCB tilgjengelig opp til ca. 125 A i typiske produktrekker. Over dette: bruk effektbrytere (MCCB) eller NH-sikringer.',
    'Etter dimensjonering velg alltid neste verdi opp i rekken — aldri ned.',
  ],
};
