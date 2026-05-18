import type { ReferenceTable } from './types';

export const RESISTANS: ReferenceTable = {
  id: 'resistans',
  slug: 'resistans',
  title: 'Resistans og reaktans per meter',
  description:
    'Typisk ledermotstand for kobber- og aluminiumkabler ved 20 °C (kald) og 70 °C (driftstemperatur). Reaktans er omtrent uavhengig av temperatur.',
  source: 'Eltabellen / IEC 60228 (ledermotstand) / IEC 60909-2 (reaktans)',
  verifyStatus: 'verifisert',
  verifySources: 'Cu 20°C verifisert mot Strinda VGS fagressurs (1,5–10 mm²). Cu 70°C = Cu 20°C × 1,2 matematisk verifisert via α = 0,004/°C × ΔT 50°C. Al-verdier i samme faktor. Reaktans X iht. IEC 60909-2 typeverdier.',
  topic: 'spenningsfall',
  glyph: 'Ω',
  order: 7,
  relatedFormulaIds: [
    'resistivitet',
    'spenningsfall-trefase-med-cosphi',
    'kortslutning-trefase',
  ],
  columns: [
    { key: 'A', label: 'Tverrsnitt', unit: 'mm²', align: 'right', primary: true, copyable: true },
    { key: 'cu20', label: 'Cu @ 20 °C', unit: 'Ω/km', align: 'right', copyable: true },
    { key: 'cu70', label: 'Cu @ 70 °C', unit: 'Ω/km', align: 'right', copyable: true },
    { key: 'al20', label: 'Al @ 20 °C', unit: 'Ω/km', align: 'right', copyable: true },
    { key: 'al70', label: 'Al @ 70 °C', unit: 'Ω/km', align: 'right', copyable: true },
    { key: 'x', label: 'X (reaktans)', unit: 'Ω/km', align: 'right', copyable: true },
  ],
  sections: [
    {
      id: 'kabel',
      title: 'Vanlige tverrsnitt',
      rows: [
        { id: '1.5', cells: { A: 1.5, cu20: 12.1, cu70: 14.5, al20: '—', al70: '—', x: 0.115 } },
        { id: '2.5', cells: { A: 2.5, cu20: 7.41, cu70: 8.87, al20: '—', al70: '—', x: 0.110 }, highlight: true },
        { id: '4', cells: { A: 4, cu20: 4.61, cu70: 5.52, al20: '—', al70: '—', x: 0.107 } },
        { id: '6', cells: { A: 6, cu20: 3.08, cu70: 3.69, al20: '—', al70: '—', x: 0.100 }, highlight: true },
        { id: '10', cells: { A: 10, cu20: 1.83, cu70: 2.19, al20: 3.08, al70: 3.69, x: 0.094 } },
        { id: '16', cells: { A: 16, cu20: 1.15, cu70: 1.38, al20: 1.91, al70: 2.29, x: 0.090 } },
        { id: '25', cells: { A: 25, cu20: 0.727, cu70: 0.871, al20: 1.20, al70: 1.44, x: 0.086 } },
        { id: '35', cells: { A: 35, cu20: 0.524, cu70: 0.628, al20: 0.868, al70: 1.04, x: 0.083 } },
        { id: '50', cells: { A: 50, cu20: 0.387, cu70: 0.464, al20: 0.641, al70: 0.768, x: 0.083 } },
        { id: '70', cells: { A: 70, cu20: 0.268, cu70: 0.321, al20: 0.443, al70: 0.531, x: 0.082 } },
        { id: '95', cells: { A: 95, cu20: 0.193, cu70: 0.232, al20: 0.320, al70: 0.384, x: 0.082 } },
        { id: '120', cells: { A: 120, cu20: 0.153, cu70: 0.184, al20: 0.253, al70: 0.304, x: 0.080 } },
        { id: '150', cells: { A: 150, cu20: 0.124, cu70: 0.149, al20: 0.206, al70: 0.247, x: 0.080 } },
        { id: '185', cells: { A: 185, cu20: 0.0991, cu70: 0.119, al20: 0.164, al70: 0.197, x: 0.079 } },
        { id: '240', cells: { A: 240, cu20: 0.0754, cu70: 0.0903, al20: 0.125, al70: 0.150, x: 0.079 } },
      ],
    },
  ],
  notes: [
    'For kortslutningsberegning brukes typisk Cu @ 20 °C (kald start).',
    'For belastet drift brukes Cu @ 70 °C — mer realistisk for spenningsfall under last.',
    'Aluminium har ca. 1,65 × motstanden til kobber for samme tverrsnitt.',
    'X (reaktansen) varierer lite med temperatur og er omtrent uavhengig av materiale.',
  ],
};

type ResistansEntry = {
  A: number;
  cu20: number;
  cu70: number;
  al20: number | null;
  al70: number | null;
  x: number;
};

const RESISTANS_LOOKUP: ResistansEntry[] = RESISTANS.sections[0].rows.map((r) => ({
  A: Number(r.cells.A),
  cu20: Number(r.cells.cu20),
  cu70: Number(r.cells.cu70),
  al20: typeof r.cells.al20 === 'number' ? r.cells.al20 : null,
  al70: typeof r.cells.al70 === 'number' ? r.cells.al70 : null,
  x: Number(r.cells.x),
}));

/** Standardrekken for tverrsnitt i mm². */
export const TVERRSNITT_REKKE = RESISTANS_LOOKUP.map((e) => e.A);

/**
 * Returnerer resistans i Ω/km for kobber ved 70 °C for et gitt tverrsnitt.
 * Returnerer undefined hvis tverrsnittet ikke finnes i tabellen.
 */
export function getResistansCu70(A_mm2: number): number | undefined {
  const e = RESISTANS_LOOKUP.find((r) => r.A === A_mm2);
  return e?.cu70;
}

/** Cu ved 20 °C — bruk for kortslutningsberegning (kald start). */
export function getResistansCu20(A_mm2: number): number | undefined {
  const e = RESISTANS_LOOKUP.find((r) => r.A === A_mm2);
  return e?.cu20;
}

/** Reaktans i Ω/km — uavhengig av leder-materiale. */
export function getReaktans(A_mm2: number): number | undefined {
  const e = RESISTANS_LOOKUP.find((r) => r.A === A_mm2);
  return e?.x;
}
