import type { ReferenceTable } from './types';

export const RCD: ReferenceTable = {
  id: 'rcd',
  slug: 'rcd',
  title: 'Jordfeilbryter (RCD) — type, krav og bruk',
  description:
    'Oversikt over jordfeilbryter-typer, maksimal beskyttelses­jording og bruksområder. RCD er førstelinjeforsvar mot berøringsspenning.',
  source: 'NEK 400-4-41 / NEK 400-823 / IEC 61008-1 / IEC 61009-1',
  verifyStatus: 'verifisert',
  verifySources: 'Utløsningstider 300/40 ms forskriftsfestet i IEC 61008-1 tabell 1 (standard RCD type AC/A). R_a = 50 V / I_Δn basert på NEK 400-411.5.3.',
  topic: 'vern',
  glyph: '⏚',
  order: 5,
  relatedFormulaIds: ['rcd-beroringsspenning', 'beskyttelsesjording-tt'],
  columns: [
    { key: 'kolonne', label: 'Egenskap', align: 'left' },
    { key: 'verdi', label: 'Verdi', align: 'right', copyable: true, primary: true },
    { key: 'kommentar', label: 'Kommentar', align: 'left' },
  ],
  sections: [
    {
      id: 'typer',
      title: 'RCD-typer (følsomhet for ulike feilstrømmer)',
      rows: [
        { id: 'ac', cells: { kolonne: 'Type AC', verdi: 'AC', kommentar: 'Kun ren AC. Ikke godkjent for nyere installasjon i NO.' }, warning: 'Ikke tillatt i ny installasjon.' },
        { id: 'a', cells: { kolonne: 'Type A', verdi: 'A', kommentar: 'AC + pulserende DC. Standard for stikkontaktkurser.' }, highlight: true },
        { id: 'f', cells: { kolonne: 'Type F', verdi: 'F', kommentar: 'Som A + høyfrekvente komponenter (frekvensomformere).' } },
        { id: 'b', cells: { kolonne: 'Type B', verdi: 'B', kommentar: 'Alle feilformer inkl. ren DC. Krav for elbil-lader uten innebygget DC-RCD.' }, highlight: true },
      ],
    },
    {
      id: 'folsomheit',
      title: 'Følsomhet (I_Δn) og typisk bruk',
      rows: [
        { id: '10ma', cells: { kolonne: '10 mA', verdi: '10 mA', kommentar: 'Spesielle sensitive områder (sjelden)' } },
        { id: '30ma', cells: { kolonne: '30 mA', verdi: '30 mA', kommentar: 'Personvern — alle forbrukerkurser i boliganlegg iht. NEK 400-823.411.3.3' }, highlight: true },
        { id: '100ma', cells: { kolonne: '100 mA', verdi: '100 mA', kommentar: 'Industri / bakvern' } },
        { id: '300ma', cells: { kolonne: '300 mA', verdi: '300 mA', kommentar: 'Brannvern — hovedfordeling' }, highlight: true },
        { id: '500ma', cells: { kolonne: '500 mA', verdi: '500 mA', kommentar: 'Stort anlegg / industri' } },
      ],
    },
    {
      id: 'maks-ra',
      title: 'Maks beskyttelsesjording R_a per RCD-størrelse (TT)',
      description: 'R_a ≤ 50 V / I_Δn — basert på 50 V berøringsspennings­grense.',
      rows: [
        { id: 'ra-10', cells: { kolonne: 'RCD 10 mA', verdi: '5000 Ω', kommentar: '50 V / 0,01 A' } },
        { id: 'ra-30', cells: { kolonne: 'RCD 30 mA', verdi: '1667 Ω', kommentar: '50 V / 0,03 A — sjelden et problem' }, highlight: true },
        { id: 'ra-100', cells: { kolonne: 'RCD 100 mA', verdi: '500 Ω', kommentar: '50 V / 0,1 A' } },
        { id: 'ra-300', cells: { kolonne: 'RCD 300 mA', verdi: '167 Ω', kommentar: '50 V / 0,3 A' } },
        { id: 'ra-500', cells: { kolonne: 'RCD 500 mA', verdi: '100 Ω', kommentar: '50 V / 0,5 A' } },
      ],
    },
    {
      id: 'utlosning',
      title: 'Utløsningstider (standard / S-type)',
      rows: [
        { id: 'std', cells: { kolonne: 'Standard RCD ved 1×I_Δn', verdi: '≤ 300 ms', kommentar: '' } },
        { id: 'std-5', cells: { kolonne: 'Standard RCD ved 5×I_Δn', verdi: '≤ 40 ms', kommentar: '' } },
        { id: 's', cells: { kolonne: 'S-type ved 1×I_Δn', verdi: '130–500 ms', kommentar: 'Forsinket for selektivitet' } },
        { id: 's-5', cells: { kolonne: 'S-type ved 5×I_Δn', verdi: '40–150 ms', kommentar: 'For bakvern' } },
      ],
    },
  ],
  notes: [
    'For elbil-lader: bruk Type B eller produkt med innebygget 6 mA DC-RCD + Type A oppstrøms.',
    'I bolig kombineres ofte 30 mA per stikkurs (personvern) + 300 mA S-type på hovedinntak (brannvern, selektivt).',
  ],
};
