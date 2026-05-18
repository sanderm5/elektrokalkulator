import type { ReferenceTable } from './types';

/**
 * Eksakt gjengivelse av NEK 400:2010 Tabell 52B-4.
 * PVC-isolert, 3 belastede ledere (typisk PFXP/TFFR-kabel i 3-fas eller fase+N+PE).
 * Referansetemperaturer: ledertemperatur 70 °C, omgivelse 30 °C i luft, 20 °C i jord.
 *
 * Brukes som primært oppslag på eksamen — KOLONNENE TIL HØYRE GIR HØYERE Iz.
 *
 * Forlegningsmetoder (jf. tabell 52B-1):
 *   A1 — enleder kabel i isolert vegg
 *   A2 — flerleder kabel i isolert vegg
 *   B1 — enleder i rør på vegg
 *   B2 — flerleder kabel i rør på vegg
 *   C  — kabel klamret direkte på vegg/tak (eller på trebjelker)
 *   D1 — enleder kabel i rør i jord
 *   D2 — flerleder kabel direkte i jord
 */
export const NEK_52B_4: ReferenceTable = {
  id: 'nek-52b-4',
  slug: 'nek-52b-4',
  title: 'NEK 400 Tabell 52B-4 — Strømføringsevne 3-leder PVC (Cu/Al)',
  description:
    'Strømføringsevne i ampere for referanseinstallasjonsmetoder iht. NEK 400 Tabell 52B-4. PVC-isolert, tre belastede ledere (3-fas, eller 1-fas med PE). Ledertemperatur 70 °C, omgivelse 30 °C i luft / 20 °C i jord. Korrigeres med k₁ (temperatur) og k₂ (gruppering) for faktiske forhold.',
  source: 'NEK 400:2010 Tabell 52B-4 (gjengitt av Eaton Electric AS — Eaton Store Blå)',
  verifyStatus: 'verifisert',
  verifySources: 'Direkte gjengivelse av Tabell 52B-4 fra fysisk eksamensbilag. Kobber og aluminium 1,5–300 mm², kolonnene A1/A2/B1/B2/C/D1/D2.',
  topic: 'kabel',
  glyph: 'Iz',
  order: 5,
  relatedFormulaIds: [
    'belastningsstrom-korreksjon',
    'krav-1-overlast',
    'vern-mot-overlast',
  ],
  columns: [
    { key: 'A', label: 'Tverrsnitt', unit: 'mm²', align: 'right', primary: true, copyable: true },
    { key: 'A1', label: 'A1', unit: 'A', align: 'right', copyable: true, hint: 'Enleder i isolert vegg' },
    { key: 'A2', label: 'A2', unit: 'A', align: 'right', copyable: true, hint: 'Flerleder i isolert vegg' },
    { key: 'B1', label: 'B1', unit: 'A', align: 'right', copyable: true, hint: 'Enleder i rør på vegg' },
    { key: 'B2', label: 'B2', unit: 'A', align: 'right', copyable: true, hint: 'Flerleder i rør på vegg' },
    { key: 'C', label: 'C', unit: 'A', align: 'right', copyable: true, hint: 'Klamret direkte på vegg/tak' },
    { key: 'D1', label: 'D1', unit: 'A', align: 'right', copyable: true, hint: 'Enleder i rør i jord' },
    { key: 'D2', label: 'D2', unit: 'A', align: 'right', copyable: true, hint: 'Flerleder i jord' },
  ],
  sections: [
    {
      id: 'kobber',
      title: 'Kobber (Cu) — 3-leder PVC ved 70 °C ledertemperatur',
      rows: [
        { id: 'cu-1.5', cells: { A: 1.5, A1: 13.5, A2: 13, B1: 15.5, B2: 15, C: 17.5, D1: 18, D2: 19 } },
        { id: 'cu-2.5', cells: { A: 2.5, A1: 18, A2: 17.5, B1: 21, B2: 20, C: 24, D1: 24, D2: 24 }, highlight: true },
        { id: 'cu-4', cells: { A: 4, A1: 24, A2: 23, B1: 28, B2: 27, C: 32, D1: 30, D2: 33 } },
        { id: 'cu-6', cells: { A: 6, A1: 31, A2: 29, B1: 36, B2: 34, C: 41, D1: 38, D2: 41 }, highlight: true },
        { id: 'cu-10', cells: { A: 10, A1: 42, A2: 39, B1: 50, B2: 46, C: 57, D1: 50, D2: 54 } },
        { id: 'cu-16', cells: { A: 16, A1: 56, A2: 52, B1: 68, B2: 62, C: 76, D1: 64, D2: 70 }, highlight: true },
        { id: 'cu-25', cells: { A: 25, A1: 73, A2: 68, B1: 89, B2: 80, C: 96, D1: 82, D2: 92 } },
        { id: 'cu-35', cells: { A: 35, A1: 89, A2: 83, B1: 110, B2: 99, C: 119, D1: 98, D2: 110 } },
        { id: 'cu-50', cells: { A: 50, A1: 108, A2: 99, B1: 134, B2: 118, C: 144, D1: 116, D2: 130 } },
        { id: 'cu-70', cells: { A: 70, A1: 136, A2: 125, B1: 171, B2: 149, C: 184, D1: 143, D2: 162 } },
        { id: 'cu-95', cells: { A: 95, A1: 164, A2: 150, B1: 207, B2: 179, C: 223, D1: 169, D2: 193 } },
        { id: 'cu-120', cells: { A: 120, A1: 188, A2: 172, B1: 239, B2: 206, C: 259, D1: 192, D2: 220 } },
        { id: 'cu-150', cells: { A: 150, A1: 216, A2: 196, B1: 262, B2: 225, C: 299, D1: 217, D2: 246 } },
        { id: 'cu-185', cells: { A: 185, A1: 245, A2: 223, B1: 296, B2: 255, C: 341, D1: 243, D2: 278 } },
        { id: 'cu-240', cells: { A: 240, A1: 286, A2: 261, B1: 346, B2: 297, C: 403, D1: 280, D2: 320 } },
        { id: 'cu-300', cells: { A: 300, A1: 328, A2: 298, B1: 394, B2: 339, C: 464, D1: 316, D2: 359 } },
      ],
    },
    {
      id: 'aluminium',
      title: 'Aluminium (Al) — 3-leder PVC ved 70 °C ledertemperatur',
      rows: [
        { id: 'al-2.5', cells: { A: 2.5, A1: 14, A2: 13.5, B1: 16.5, B2: 15.5, C: 18.5, D1: 18.5, D2: '—' } },
        { id: 'al-4', cells: { A: 4, A1: 18.5, A2: 17.5, B1: 22, B2: 21, C: 25, D1: 24, D2: '—' } },
        { id: 'al-6', cells: { A: 6, A1: 24, A2: 23, B1: 28, B2: 27, C: 32, D1: 30, D2: '—' } },
        { id: 'al-10', cells: { A: 10, A1: 32, A2: 31, B1: 39, B2: 36, C: 44, D1: 39, D2: '—' } },
        { id: 'al-16', cells: { A: 16, A1: 43, A2: 41, B1: 53, B2: 48, C: 59, D1: 50, D2: 53 } },
        { id: 'al-25', cells: { A: 25, A1: 57, A2: 53, B1: 70, B2: 62, C: 73, D1: 64, D2: 69 } },
        { id: 'al-35', cells: { A: 35, A1: 70, A2: 65, B1: 86, B2: 77, C: 90, D1: 77, D2: 83 } },
        { id: 'al-50', cells: { A: 50, A1: 84, A2: 78, B1: 104, B2: 92, C: 110, D1: 91, D2: 99 } },
        { id: 'al-70', cells: { A: 70, A1: 107, A2: 98, B1: 133, B2: 116, C: 140, D1: 112, D2: 122 } },
        { id: 'al-95', cells: { A: 95, A1: 129, A2: 118, B1: 161, B2: 139, C: 170, D1: 132, D2: 148 } },
        { id: 'al-120', cells: { A: 120, A1: 149, A2: 135, B1: 186, B2: 160, C: 197, D1: 150, D2: 169 } },
        { id: 'al-150', cells: { A: 150, A1: 170, A2: 155, B1: 204, B2: 176, C: 227, D1: 169, D2: 189 } },
        { id: 'al-185', cells: { A: 185, A1: 194, A2: 176, B1: 230, B2: 199, C: 259, D1: 190, D2: 214 } },
        { id: 'al-240', cells: { A: 240, A1: 227, A2: 207, B1: 269, B2: 232, C: 305, D1: 218, D2: 250 } },
        { id: 'al-300', cells: { A: 300, A1: 261, A2: 237, B1: 306, B2: 265, C: 351, D1: 247, D2: 282 } },
      ],
    },
  ],
  notes: [
    'MERKNAD fra original tabell: I kolonnene 3, 5, 6, 7 og 8 (A2, B2, C, D1, D2) er det forutsatt et sirkulært ledertverrsnitt for ledertverrsnitt opp til og med 16 mm². For større ledertverrsnitt er det forutsatt sektorformede ledertverrsnitt, men strømføringsevnene kan trygt anvendes for ledere med sirkulært ledertverrsnitt.',
    'C er den vanligste forlegningsmetoden i bolig — kabel klamret direkte på vegg/tak.',
    'Verdiene er for 30 °C omgivelse i luft / 20 °C i jord. Korrigeres med k₁ (se tabellen "Korreksjonsfaktorer") for andre temperaturer.',
    'Ved gruppering (flere kabler nær hverandre): multipliser med k₂ fra korreksjonsfaktor-tabellen.',
    'Tabellen gjelder PVC-isolasjon (PFXP). For TFXP MR Flex (PEX 90 °C) gir 30–35 % høyere Iz — se egen kabeltabell.',
  ],
};
