import type { ReferenceTable } from './types';

/**
 * Verifisert mot:
 *  - Lyskomponenter.no (NEK 400-7-701 oppsummering)
 *  - Trainor / NEK-publikasjoner
 *
 * NB: Sone 1 krever IP65 (ikke IPX4 som ofte feiltolket).
 */
export const SONE_KRAV: ReferenceTable = {
  id: 'sone-krav',
  slug: 'sone-krav',
  title: 'Sonekrav — bad og spesielle miljø',
  description:
    'Krav til kapslingsgrad (IP) og tillatt utstyr iht. NEK 400-7-701 (bad/dusj). Sone 0 og 1 har strenge krav som ofte undervurderes.',
  source: 'NEK 400-7-701 (Områder som inneholder badekar eller dusj)',
  verifyStatus: 'delvis',
  verifySources: 'Sone 0/1/2 IP-krav og høyder verifisert mot Lyskomponenter.no. Sone-grensen 0,6 m og 225 cm verifisert. Andre miljøer (kjøkken/garasje/ute) basert på praksis, ikke direkte NEK-sitat.',
  topic: 'soner',
  glyph: '♨',
  order: 10,
  columns: [
    { key: 'sone', label: 'Sone', align: 'center', primary: true },
    { key: 'omrade', label: 'Område', align: 'left' },
    { key: 'ip', label: 'Min IP', align: 'center', copyable: true },
    { key: 'spenning', label: 'Spenning', align: 'center' },
    { key: 'utstyr', label: 'Tillatt utstyr', align: 'left' },
  ],
  sections: [
    {
      id: 'bad',
      title: 'Bad og dusj (NEK 400-7-701)',
      rows: [
        {
          id: 'sone0',
          cells: {
            sone: '0',
            omrade: 'Innvendig i kar/dusj + hele baderomsgulvet (+5 cm opp på vegg)',
            ip: 'IP67',
            spenning: 'Kun klasse III (SELV ≤50V)',
            utstyr: 'Fast tilkoblet utstyr beregnet for sonen. Strenge krav.',
          },
        },
        {
          id: 'sone1',
          cells: {
            sone: '1',
            omrade: 'Vegger i dusj og over/rundt badekar, inntil 225 cm høyde',
            ip: 'IP65',
            spenning: 'Kun klasse III (SELV ≤50V)',
            utstyr: 'Belysning og varmtvannsbereder beregnet for sone 1. Ingen stikkontakter.',
          },
          highlight: true,
        },
        {
          id: 'sone2',
          cells: {
            sone: '2',
            omrade: 'Over 225 cm + 60 cm utenfor sone 1',
            ip: 'IP44',
            spenning: 'Klasse I (jordet), II (dobbelt­isolert), III (SELV)',
            utstyr: 'Belysning, varmeovn. Stikkontakt kun med RCD 30 mA, ≥ 0,6 m fra sone 1.',
          },
          highlight: true,
        },
        {
          id: 'utenfor',
          cells: {
            sone: 'Utenfor',
            omrade: 'Resten av badet',
            ip: 'IPX1',
            spenning: 'Alle klasser',
            utstyr: 'Vanlig installasjon. Alle stikkontakter må ha RCD 30 mA (NEK 400-4-41).',
          },
        },
      ],
    },
    {
      id: 'andre',
      title: 'Andre miljøer',
      rows: [
        {
          id: 'kjokken',
          cells: {
            sone: 'Kjøkken',
            omrade: 'Vask / oppvask området',
            ip: 'IPX1 / lokalt IPX4',
            spenning: '230V',
            utstyr: 'RCD 30 mA på alle stikkontakter',
          },
        },
        {
          id: 'garasje',
          cells: {
            sone: 'Garasje',
            omrade: 'Privat garasje (innvendig)',
            ip: 'IPX1',
            spenning: '230V',
            utstyr: 'RCD 30 mA på alle stikk + elbillader­kurs',
          },
          highlight: true,
        },
        {
          id: 'ute',
          cells: {
            sone: 'Utendørs',
            omrade: 'Hagen / terrasse',
            ip: 'IP44',
            spenning: '230V',
            utstyr: 'Alt utstyr må ha IP44 minimum, RCD 30 mA',
          },
        },
        {
          id: 'sauna',
          cells: {
            sone: 'Badstu',
            omrade: 'Interiør badstuovn-rom',
            ip: 'IPX4 (varmebestandig)',
            spenning: '230V',
            utstyr: 'Egne krav etter NEK 400-7-703',
          },
        },
      ],
    },
  ],
  notes: [
    'IP-koden: første tall = beskyttelse mot faste objekter (0–6), andre tall = beskyttelse mot vann (0–9).',
    'Sone 1 krever IP65, ikke IPX4 — dette er en vanlig feil i selv tabellsamlinger. Verifiser alltid.',
    'På bad: alle stikkontakter (selv utenfor sone) må ha jordfeilbryter på maks 30 mA iht. NEK 400-4-41.',
    'Sone 2 er 60 cm utenfor sone 1, og strekker seg fra gulv til 225 cm.',
    'Verifiser mot NEK 400-7-701 før prosjektering på faktiske bad.',
  ],
};
