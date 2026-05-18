import type { ReferenceTable } from './types';

export const K_VERDIER_TERMISK: ReferenceTable = {
  id: 'k-verdier-termisk',
  slug: 'k-verdier-termisk',
  title: 'k-verdier — termisk kortslutningsholdfasthet',
  description:
    'Materialkonstant k brukt i I²·t ≤ k²·S² for å verifisere at en kabel termisk tåler en kortslutning. Avhenger av lederens materiale (Cu/Al) og isolasjon (PVC/XLPE/gummi).',
  source: 'NEK 400 tabell 43A',
  verifyStatus: 'verifisert',
  verifySources: 'NEK 400:2022 tabell 43A / IEC 60364-4-43. Verdier brukt på fagprøve eksamen.',
  topic: 'kortslutning',
  glyph: 'k',
  order: 11,
  relatedFormulaIds: ['smelteintegral', 'termisk-kontroll-i2t'],
  columns: [
    { key: 'leder', label: 'Leder', align: 'left' },
    { key: 'isolasjon', label: 'Isolasjon', align: 'left', primary: true },
    { key: 'k', label: 'k', align: 'right', copyable: true },
    { key: 'maxtemp', label: 'Maks ledertemp.', align: 'right', unit: '°C' },
  ],
  sections: [
    {
      id: 'cu',
      title: 'Kobberledere',
      rows: [
        { id: 'cu-pvc', cells: { leder: 'Cu', isolasjon: 'PVC (PN, PR)', k: 115, maxtemp: 70 }, highlight: true },
        { id: 'cu-gummi', cells: { leder: 'Cu', isolasjon: 'EPR / Gummi', k: 141, maxtemp: 90 } },
        { id: 'cu-xlpe', cells: { leder: 'Cu', isolasjon: 'XLPE / PEX', k: 143, maxtemp: 90 }, highlight: true },
      ],
    },
    {
      id: 'al',
      title: 'Aluminiumsledere',
      rows: [
        { id: 'al-pvc', cells: { leder: 'Al', isolasjon: 'PVC', k: 76, maxtemp: 70 } },
        { id: 'al-xlpe', cells: { leder: 'Al', isolasjon: 'XLPE / PEX', k: 94, maxtemp: 90 } },
      ],
    },
    {
      id: 'pe',
      title: 'Beskyttelsesledere (PE), egen tabell',
      rows: [
        { id: 'pe-cu-bart', cells: { leder: 'Cu bart', isolasjon: 'Ikke i kabelhylse', k: 159, maxtemp: 200 } },
        { id: 'pe-cu-pvc', cells: { leder: 'Cu', isolasjon: 'PVC (i kabel)', k: 143, maxtemp: 160 } },
        { id: 'pe-al-xlpe', cells: { leder: 'Al', isolasjon: 'XLPE', k: 87, maxtemp: 200 } },
      ],
    },
  ],
  notes: [
    'Bruk verdien som passer til kabelens MERKE-isolasjon — ikke faktisk drift­stemperatur.',
    'For sjekken I²·t ≤ k²·S² er S kabelens areal i mm² — ikke korrigert.',
    'PE-leder kan ofte tåle høyere k fordi den vanligvis er kjølere under drift.',
  ],
};
