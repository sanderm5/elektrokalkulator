import type { ReferenceTable } from './types';

/**
 * Verifisert mot:
 *  - NEK Kabel AS datablad (april 2019), siterer NEK 400-5-52 tabell 52B-10/-11/-12, 2018-utgave
 *  - Datele DA undervisningsmateriale (Vg2 elektro) — krysssjekk PFXP-verdier
 *
 * Tabellen viser PFXP (kobber PVC, 70°C ledertemp) og TFXP MR Flex (PEX, 90°C).
 * Sander: dobbeltsjekk mot Eltabellen før samsvarserklæring.
 */
export const KABEL_BELASTNING: ReferenceTable = {
  id: 'kabel-belastning',
  slug: 'kabel-belastning',
  title: 'Kabel — strømføringsevne (NEK 400-5-52, tabell 52B)',
  description:
    'Maks kontinuerlig strøm (I_z) ved 30 °C omgivelse og enkelt forlagt. Korrigeres med k₁ (temperatur) og k₂ (gruppering) for faktiske forhold. PFXP = kobber PVC (70 °C ledertemp). TFXP MR Flex = PEX (90 °C, tåler høyere strøm).',
  source: 'NEK 400:2022 vedlegg 52B (IEC 60364-5-52 tabell B.52.1–B.52.13). Verifisert mot NEK Kabel AS datablad (2021) og Datele DA undervisningsmateriale.',
  verifyStatus: 'verifisert',
  verifySources: 'PFXP 2-leder A2 alle tverrsnitt + PFXP 3-leder A2 (1,5–16 mm²) verifisert mot NEK Kabel AS datablad. TFXP MR Flex matcher Sammenliknings­tabell TFXP vs PFXP (NEK Kabel, sep 2021). PFXP 3-leder B2/C/D2/E for ≥25 mm² markert "—" (krever oppslag i Eltabellen for samsvarserklæring).',
  topic: 'kabel',
  glyph: '∅',
  order: 6,
  relatedFormulaIds: ['belastningsstrom-korreksjon', 'vern-mot-overlast'],
  columns: [
    { key: 'A', label: 'Tverrsnitt', unit: 'mm²', align: 'right', primary: true, copyable: true },
    { key: 'A2', label: 'A2', unit: 'A', align: 'right', copyable: true, hint: 'I rør i isolert vegg' },
    { key: 'B2', label: 'B2', unit: 'A', align: 'right', copyable: true, hint: 'I rør på vegg' },
    { key: 'C', label: 'C', unit: 'A', align: 'right', copyable: true, hint: 'Klamret direkte på vegg/tak' },
    { key: 'D2', label: 'D2', unit: 'A', align: 'right', copyable: true, hint: 'Direkte i jord' },
    { key: 'E', label: 'E', unit: 'A', align: 'right', copyable: true, hint: 'Fritt i luft / kabelstige' },
  ],
  sections: [
    {
      id: 'pfxp-2leder',
      title: 'PFXP — kobber PVC, 2 belastede ledere (enfase)',
      description: 'Brukes for enfase 230 V (fase + N). Ledertemperatur 70 °C.',
      rows: [
        { id: 'pfxp-1.5-2', cells: { A: 1.5, A2: 14, B2: 16.5, C: 19.5, D2: 22, E: 23 } },
        { id: 'pfxp-2.5-2', cells: { A: 2.5, A2: 18.5, B2: 23, C: 27, D2: 29, E: 31 }, highlight: true },
        { id: 'pfxp-4-2', cells: { A: 4, A2: 25, B2: 30, C: 36, D2: 38, E: 42 } },
        { id: 'pfxp-6-2', cells: { A: 6, A2: 32, B2: 38, C: 46, D2: 47, E: 54 } },
        { id: 'pfxp-10-2', cells: { A: 10, A2: 43, B2: 52, C: 63, D2: 63, E: 75 } },
        { id: 'pfxp-16-2', cells: { A: 16, A2: 57, B2: 69, C: 85, D2: 81, E: 100 } },
        { id: 'pfxp-25-2', cells: { A: 25, A2: 75, B2: 90, C: 112, D2: 104, E: 133 } },
        { id: 'pfxp-35-2', cells: { A: 35, A2: 92, B2: 111, C: 138, D2: 125, E: 164 } },
        { id: 'pfxp-50-2', cells: { A: 50, A2: 110, B2: 133, C: 168, D2: 148, E: '—' }, warning: 'E-kolonne ikke verifisert for større tverrsnitt' },
        { id: 'pfxp-70-2', cells: { A: 70, A2: 139, B2: 168, C: 213, D2: 183, E: '—' } },
        { id: 'pfxp-95-2', cells: { A: 95, A2: 167, B2: 201, C: 258, D2: 216, E: '—' } },
        { id: 'pfxp-120-2', cells: { A: 120, A2: 192, B2: 232, C: 299, D2: 246, E: '—' } },
      ],
    },
    {
      id: 'pfxp-3leder',
      title: 'PFXP — kobber PVC, 3 belastede ledere (trefase)',
      description: 'For 400 V TN 3-fas eller 230 V IT 3-fas. Ledertemperatur 70 °C.',
      rows: [
        { id: 'pfxp-1.5-3', cells: { A: 1.5, A2: 13, B2: 15, C: 17.5, D2: '—', E: '—' }, warning: 'D2/E for PFXP 3-leder ikke verifisert' },
        { id: 'pfxp-2.5-3', cells: { A: 2.5, A2: 17.5, B2: 20, C: 24, D2: '—', E: '—' }, highlight: true },
        { id: 'pfxp-4-3', cells: { A: 4, A2: 23, B2: 27, C: 32, D2: '—', E: '—' } },
        { id: 'pfxp-6-3', cells: { A: 6, A2: 29, B2: 34, C: 41, D2: '—', E: '—' }, highlight: true },
        { id: 'pfxp-10-3', cells: { A: 10, A2: 39, B2: 46, C: 57, D2: '—', E: '—' } },
        { id: 'pfxp-16-3', cells: { A: 16, A2: 52, B2: 62, C: 76, D2: '—', E: '—' } },
        { id: 'pfxp-25-3', cells: { A: 25, A2: 68, B2: '—', C: '—', D2: '—', E: '—' }, warning: 'Kun A2 verifisert' },
        { id: 'pfxp-35-3', cells: { A: 35, A2: 83, B2: '—', C: '—', D2: '—', E: '—' } },
        { id: 'pfxp-50-3', cells: { A: 50, A2: 99, B2: '—', C: '—', D2: '—', E: '—' } },
        { id: 'pfxp-70-3', cells: { A: 70, A2: 125, B2: '—', C: '—', D2: '—', E: '—' } },
        { id: 'pfxp-95-3', cells: { A: 95, A2: 150, B2: '—', C: '—', D2: '—', E: '—' } },
      ],
    },
    {
      id: 'tfxp-2leder',
      title: 'TFXP MR Flex — PEX, 2 belastede ledere (enfase)',
      description: 'Moderne fleksibel kabel. Ledertemperatur 90 °C, tåler 30–35 % mer strøm enn PFXP.',
      rows: [
        { id: 'tfxp-1.5-2', cells: { A: 1.5, A2: 18.5, B2: 22, C: 24, D2: 27, E: 26 } },
        { id: 'tfxp-2.5-2', cells: { A: 2.5, A2: 25, B2: 30, C: 33, D2: 35, E: 36 }, highlight: true },
        { id: 'tfxp-4-2', cells: { A: 4, A2: 33, B2: 40, C: 45, D2: 46, E: 49 } },
        { id: 'tfxp-6-2', cells: { A: 6, A2: 42, B2: 51, C: 58, D2: 58, E: 63 }, highlight: true },
        { id: 'tfxp-10-2', cells: { A: 10, A2: 57, B2: 69, C: 80, D2: 77, E: 86 } },
        { id: 'tfxp-16-2', cells: { A: 16, A2: 76, B2: 91, C: 107, D2: 100, E: 115 } },
        { id: 'tfxp-25-2', cells: { A: 25, A2: 99, B2: 119, C: 138, D2: 129, E: 149 } },
        { id: 'tfxp-35-2', cells: { A: 35, A2: 121, B2: 146, C: 171, D2: 155, E: 185 } },
        { id: 'tfxp-50-2', cells: { A: 50, A2: 145, B2: 175, C: 209, D2: 183, E: 225 } },
        { id: 'tfxp-70-2', cells: { A: 70, A2: 183, B2: 221, C: 269, D2: 225, E: 289 } },
        { id: 'tfxp-95-2', cells: { A: 95, A2: 220, B2: 265, C: 328, D2: 270, E: 352 } },
      ],
    },
    {
      id: 'tfxp-3leder',
      title: 'TFXP MR Flex — PEX, 3 belastede ledere (trefase)',
      description: 'For 400 V TN 3-fas eller 230 V IT 3-fas. Ledertemperatur 90 °C.',
      rows: [
        { id: 'tfxp-1.5-3', cells: { A: 1.5, A2: 16.5, B2: 19.5, C: 22, D2: 23, E: 23 } },
        { id: 'tfxp-2.5-3', cells: { A: 2.5, A2: 22, B2: 26, C: 30, D2: 30, E: 32 }, highlight: true },
        { id: 'tfxp-4-3', cells: { A: 4, A2: 30, B2: 35, C: 40, D2: 39, E: 42 } },
        { id: 'tfxp-6-3', cells: { A: 6, A2: 38, B2: 44, C: 52, D2: 49, E: 54 }, highlight: true },
        { id: 'tfxp-10-3', cells: { A: 10, A2: 51, B2: 60, C: 71, D2: 65, E: 75 } },
        { id: 'tfxp-16-3', cells: { A: 16, A2: 68, B2: 80, C: 96, D2: 84, E: 100 } },
        { id: 'tfxp-25-3', cells: { A: 25, A2: 89, B2: 105, C: 119, D2: 107, E: 127 } },
        { id: 'tfxp-35-3', cells: { A: 35, A2: 109, B2: 128, C: 147, D2: 129, E: 158 } },
        { id: 'tfxp-50-3', cells: { A: 50, A2: 130, B2: 154, C: 179, D2: 153, E: 192 } },
        { id: 'tfxp-70-3', cells: { A: 70, A2: 164, B2: 194, C: 229, D2: 188, E: 246 } },
        { id: 'tfxp-95-3', cells: { A: 95, A2: 197, B2: 233, C: 278, D2: 226, E: 298 } },
      ],
    },
  ],
  notes: [
    'Forleggingsmetode-koder: A2 = i rør i isolert vegg, B2 = i rør på vegg, C = direkte på vegg/tak, D2 = direkte i jord, E = fritt i luft / kabelstige.',
    'Tabellen forutsetter omgivelse 30 °C (luft) / 20 °C (jord). Bruk k₁ for andre temperaturer.',
    'For 4G og 5G kabel (TN-S) gjelder samme verdier som 3-leder (kun 3 belastede).',
    'PFXP 3-leder D2/E er ikke fullstendig verifisert mot offentlig kilde — sjekk mot Eltabellen.',
    'For aluminium: bruk ca. 78 % av tabellverdien for kobber.',
    'VIKTIG: Verifiser alle verdier mot Eltabellen eller gjeldende NEK 400-utgave før samsvarserklæring.',
  ],
};
