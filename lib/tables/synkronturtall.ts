import type { ReferenceTable } from './types';

export const SYNKRONTURTALL: ReferenceTable = {
  id: 'synkronturtall',
  slug: 'synkronturtall',
  title: 'Synkronturtall ved 50 Hz',
  description:
    'Synkron rotasjonshastighet n_s for trefase asynkronmotor ved 50 Hz nettfrekvens. Den faktiske turtallen er litt lavere (slip), typisk 2–5 % for standard motorer.',
  source: 'ELE2 elektroteori — n_s = 60·f/p',
  verifyStatus: 'verifisert',
  topic: 'motor',
  glyph: 'n_s',
  order: 12,
  relatedFormulaIds: ['synkron-hastighet', 'slip', 'moment-fra-effekt'],
  columns: [
    { key: 'p', label: 'Polpar (p)', align: 'right' },
    { key: 'poler', label: 'Polantall (2p)', align: 'right' },
    { key: 'ns', label: 'n_s', unit: 'o/min', align: 'right', copyable: true, primary: true },
    { key: 'bruk', label: 'Typisk bruk', align: 'left' },
  ],
  sections: [
    {
      id: 'standard',
      title: 'Standard motorer (50 Hz)',
      rows: [
        { id: 'p1', cells: { p: 1, poler: 2, ns: 3000, bruk: 'Pumper, vifter — høy hastighet' } },
        { id: 'p2', cells: { p: 2, poler: 4, ns: 1500, bruk: 'Universell — vanligste motorvalg' }, highlight: true },
        { id: 'p3', cells: { p: 3, poler: 6, ns: 1000, bruk: 'Vifter, kompressorer' } },
        { id: 'p4', cells: { p: 4, poler: 8, ns: 750, bruk: 'Lavhastighets-drift, heise­anlegg' } },
        { id: 'p5', cells: { p: 5, poler: 10, ns: 600, bruk: 'Spesialdrift' } },
        { id: 'p6', cells: { p: 6, poler: 12, ns: 500, bruk: 'Mølle/kran' } },
      ],
    },
  ],
  notes: [
    'Formel: n_s = 60 · f / p (i o/min ved 50 Hz).',
    'Slip s = (n_s − n) / n_s — typisk 2–5 % for standard 4-pol motor.',
    'For 60 Hz nett (USA) er turtallet 20 % høyere: 4-pol = 1800 o/min.',
    'Frekvensomformer (FU) endrer turtallet ved å endre f — derfor brukt til hastighetsregulering.',
  ],
};
