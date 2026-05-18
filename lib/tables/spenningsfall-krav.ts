import type { ReferenceTable } from './types';

export const SPENNINGSFALL_KRAV: ReferenceTable = {
  id: 'spenningsfall-krav',
  slug: 'spenningsfall-krav',
  title: 'Spenningsfall — krav fra NEK 400',
  description:
    'Maksimalt tillatt spenningsfall fra inntakssted til siste utstyr. Brukt for å vurdere om kabel er stort nok dimensjonert.',
  source: 'NEK 400-5-52 / NK 64 anbefalinger',
  verifyStatus: 'verifisert',
  verifySources: '3% lys / 5% kraft verifisert mot Strinda VGS fagressurs og NEK 400 tillegg 52F. Motor-startverdi (15%) bransjeprosis.',
  topic: 'spenningsfall',
  glyph: 'ΔU',
  order: 4,
  relatedFormulaIds: [
    'spenningsfall-enfase-forenklet',
    'spenningsfall-trefase-forenklet',
    'spenningsfall-prosent',
  ],
  columns: [
    { key: 'type', label: 'Type kurs / installasjon', align: 'left' },
    { key: 'krav', label: 'Maks ΔU', align: 'right', copyable: true, primary: true },
    { key: 'kommentar', label: 'Kommentar', align: 'left' },
  ],
  sections: [
    {
      id: 'standard',
      title: 'Standard krav (offentlig forsyning)',
      rows: [
        { id: 'lys', cells: { type: 'Belysning', krav: '3 %', kommentar: 'Synlig flimring ved større fall' }, highlight: true },
        { id: 'kraft', cells: { type: 'Stikkontakt / kraft / varme', krav: '5 %', kommentar: 'Motor­start kan kreve mindre' }, highlight: true },
        { id: 'motor-drift', cells: { type: 'Motor under drift', krav: '5 %', kommentar: 'Mer kan gi tap av moment' } },
        { id: 'motor-start', cells: { type: 'Motor ved start (kortvarig)', krav: '15 %', kommentar: 'Akseptabelt under oppstart' } },
      ],
    },
    {
      id: 'spesial',
      title: 'Spesielle anlegg',
      rows: [
        { id: 'lavspenning', cells: { type: 'Lavspenning (PELV/SELV ≤ 50 V)', krav: '10 %', kommentar: 'Egne grenser' } },
        { id: 'eget-trafo', cells: { type: 'Anlegg fra egen trafo', krav: '+ 2 %', kommentar: 'Kan øke grensa med 2 %-poeng' } },
      ],
    },
  ],
  notes: [
    'Verdiene er grenseverdier — vi prosjekterer ofte for halvparten for å ha margin.',
    'Måles fra netteiers inntaksklemme til siste utstyr i installasjonen.',
  ],
};
