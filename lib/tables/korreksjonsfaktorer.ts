import type { ReferenceTable } from './types';

export const KORREKSJONSFAKTORER: ReferenceTable = {
  id: 'korreksjonsfaktorer',
  slug: 'korreksjonsfaktorer',
  title: 'Korreksjonsfaktorer (k₁, k₂)',
  description:
    'Faktorer for å justere kabelens strømføringsevne for ikke-standard forhold. I_z faktisk = I_tabell · k₁ · k₂.',
  source: 'NEK 400-5-52 tabell B.52.14 (k₁ temperatur) / B.52.17 (k₂ gruppering)',
  verifyStatus: 'verifisert',
  verifySources: 'k₁ ved 35°C/40°C verifisert mot NEK 400 tillegg 52F. k₂ for 2 kabler i samme rør = 0,80 iht. tabell B.52.17 (ikke 0,85 — den verdien gjelder kun "i nærhet uten innesluttet rom"). 2 lag på stige = 0,87 iht. tabell B.52.20.',
  topic: 'kabel',
  glyph: 'k',
  order: 8,
  relatedFormulaIds: ['belastningsstrom-korreksjon'],
  columns: [
    { key: 'beskrivelse', label: 'Forhold', align: 'left' },
    { key: 'verdi', label: 'Faktor', align: 'right', copyable: true, primary: true },
    { key: 'kommentar', label: 'Kommentar', align: 'left' },
  ],
  sections: [
    {
      id: 'k1-temp',
      title: 'k₁ — omgivelsestemperatur (PVC-isolert kabel)',
      description: 'Bruk dette ved omgivelse forskjellig fra 30 °C.',
      rows: [
        { id: 't10', cells: { beskrivelse: '10 °C', verdi: 1.22, kommentar: 'Kjølig kjeller / utendørs vinter' } },
        { id: 't15', cells: { beskrivelse: '15 °C', verdi: 1.17, kommentar: '' } },
        { id: 't20', cells: { beskrivelse: '20 °C', verdi: 1.12, kommentar: 'Normal inneluft' } },
        { id: 't25', cells: { beskrivelse: '25 °C', verdi: 1.06, kommentar: '' } },
        { id: 't30', cells: { beskrivelse: '30 °C (referanse)', verdi: 1.00, kommentar: 'Standard tabellverdi' }, highlight: true },
        { id: 't35', cells: { beskrivelse: '35 °C', verdi: 0.94, kommentar: '' } },
        { id: 't40', cells: { beskrivelse: '40 °C', verdi: 0.87, kommentar: 'Varm omgivelse' } },
        { id: 't45', cells: { beskrivelse: '45 °C', verdi: 0.79, kommentar: '' } },
        { id: 't50', cells: { beskrivelse: '50 °C', verdi: 0.71, kommentar: 'Industri / motorrom' } },
        { id: 't55', cells: { beskrivelse: '55 °C', verdi: 0.61, kommentar: '' } },
        { id: 't60', cells: { beskrivelse: '60 °C', verdi: 0.50, kommentar: 'Maks for PVC' } },
      ],
    },
    {
      id: 'k2-grupp',
      title: 'k₂ — gruppering (kabler i samme rør eller på samme kanal)',
      description: 'Tabellen forutsetter at alle kabler er like belastet.',
      rows: [
        { id: 'g1', cells: { beskrivelse: '1 kabel (referanse)', verdi: 1.00, kommentar: 'Enkelt forlagt' }, highlight: true },
        { id: 'g2', cells: { beskrivelse: '2 kabler', verdi: 0.80, kommentar: '' } },
        { id: 'g3', cells: { beskrivelse: '3 kabler', verdi: 0.70, kommentar: '' } },
        { id: 'g4', cells: { beskrivelse: '4 kabler', verdi: 0.65, kommentar: '' } },
        { id: 'g5', cells: { beskrivelse: '5 kabler', verdi: 0.60, kommentar: '' } },
        { id: 'g6', cells: { beskrivelse: '6 kabler', verdi: 0.57, kommentar: '' } },
        { id: 'g7', cells: { beskrivelse: '7–9 kabler', verdi: 0.50, kommentar: '' } },
        { id: 'g10', cells: { beskrivelse: '10–12 kabler', verdi: 0.45, kommentar: '' } },
        { id: 'g16', cells: { beskrivelse: '13–19 kabler', verdi: 0.40, kommentar: '' } },
      ],
    },
    {
      id: 'k2-grupp-tak',
      title: 'k₂ — gruppering på kabelstige / horisontal lufting',
      description: 'For kabler i flere lag eller tett pakket på stiger.',
      rows: [
        { id: 'st1', cells: { beskrivelse: '1 lag, mellomrom ≥ kabelens diameter', verdi: 1.00, kommentar: '' }, highlight: true },
        { id: 'st2', cells: { beskrivelse: '2 lag', verdi: 0.87, kommentar: '' } },
        { id: 'st3', cells: { beskrivelse: '3 lag', verdi: 0.77, kommentar: '' } },
      ],
    },
  ],
  notes: [
    'Multipliser alle korreksjonsfaktorer som gjelder: I_z = I_tabell · k₁ · k₂ · k₃ …',
    'Hvis flere ulike forhold gjelder samtidig, kan kabelens strømføringsevne reduseres mye.',
    'For kabler i jord brukes egne tabeller (faktor på jordens termiske motstand).',
  ],
};
