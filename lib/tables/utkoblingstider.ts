import type { ReferenceTable } from './types';

export const UTKOBLINGSTIDER: ReferenceTable = {
  id: 'utkoblingstider',
  slug: 'utkoblingstider',
  title: 'Utkoblingstider — NEK 400-4-41',
  description:
    'Maksimal tillatt utkoblingstid for vern ved jordfeil. Brytertiden er kritisk for personsikkerhet — den begrenser hvor lang tid en farlig berøringsspenning kan eksistere.',
  source: 'NEK 400-411.3.2.2 tabell 41.1 (utkobling) / 411.6.4 (IT-system)',
  verifyStatus: 'verifisert',
  verifySources: 'NEK 400:2022 tabell 41.1. TN @ 230V = 0,4s, TN @ 400V = 0,2s, TT @ 230V = 0,2s er forskriftsfestet. IT-andre-feil avhenger av om PE er sammenkoblet (TN-regel) eller separat jordet (TT-regel) — se 411.6.4.',
  topic: 'vern',
  glyph: 't',
  order: 6,
  relatedFormulaIds: ['maks-sloyfeimpedans', 'kortslutning-jord', 'ik-min'],
  columns: [
    { key: 'system', label: 'Nettsystem', align: 'left' },
    { key: 'kurstype', label: 'Kurstype', align: 'left', primary: true },
    { key: 'tid', label: 'Maks tid', align: 'right', copyable: true, unit: 's' },
    { key: 'kommentar', label: 'Kommentar', align: 'left' },
  ],
  sections: [
    {
      id: 'tn',
      title: 'TN-system',
      rows: [
        {
          id: 'tn-32-230',
          cells: { system: 'TN', kurstype: 'Kurs ≤ 32 A, 230 V mot jord', tid: '0,4', kommentar: 'Stikkontaktkurser, lyskurser i bolig' },
          highlight: true,
        },
        {
          id: 'tn-32-400',
          cells: { system: 'TN', kurstype: 'Kurs ≤ 32 A, 400 V mot jord', tid: '0,2', kommentar: 'Strengere ved høyere spenning' },
        },
        {
          id: 'tn-stor',
          cells: { system: 'TN', kurstype: 'Kurs > 32 A og matekabler', tid: '5,0', kommentar: 'Fast tilkobling, hovedkurser' },
          highlight: true,
        },
      ],
    },
    {
      id: 'tt',
      title: 'TT-system',
      rows: [
        {
          id: 'tt-stikk',
          cells: { system: 'TT', kurstype: 'Stikkontakt ≤ 32 A', tid: '0,2', kommentar: 'Krever RCD' },
        },
        {
          id: 'tt-stor',
          cells: { system: 'TT', kurstype: 'Faste tilkoblinger > 32 A', tid: '1,0', kommentar: '' },
        },
      ],
    },
    {
      id: 'it',
      title: 'IT-system',
      rows: [
        {
          id: 'it-forste',
          cells: { system: 'IT', kurstype: 'Første jordfeil', tid: '—', kommentar: 'Ikke utkoblingskrav, men varsling pliktig' },
          warning: 'Ved første feil: ikke utkobling. Isolasjonsovervåking varsler.',
        },
        {
          id: 'it-andre-tn-32',
          cells: { system: 'IT', kurstype: 'Andre feil ≤ 32 A — PE sammenkoblet (bolig 230V)', tid: '0,4', kommentar: 'Behandles som TN — vanlig bolig-IT' },
          highlight: true,
        },
        {
          id: 'it-andre-tt-32',
          cells: { system: 'IT', kurstype: 'Andre feil ≤ 32 A — separat jording (TT-regel)', tid: '0,2', kommentar: 'Industri-IT med isolerte deler' },
        },
        {
          id: 'it-andre-stor',
          cells: { system: 'IT', kurstype: 'Andre jordfeil, > 32 A', tid: '5,0', kommentar: 'Fast tilkobling, hovedkurser' },
        },
      ],
    },
  ],
  notes: [
    'TN-S er det vanligste systemet i norske nyere installasjoner.',
    'I bolig: 0,4 s er kravet — alle stikkontakter må oppfylle dette ved jordfeil.',
    'IT-system tåler første feil, men må kobles ut ved andre samtidig (dobbel jordfeil).',
  ],
};
