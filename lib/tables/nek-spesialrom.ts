import type { ReferenceTable } from './types';

export const NEK_SPESIALROM: ReferenceTable = {
  id: 'nek-spesialrom',
  slug: 'nek-spesialrom',
  title: 'NEK 400 — spesialrom og særskilte miljøer',
  description:
    'Oversikt over de viktigste paragraf-numrene i NEK 400-7 (særskilte installasjoner) med kjernekrav. For detaljert §701 sone-info, se egen sone-krav-tabell.',
  source: 'NEK 400-7 (særskilte installasjoner)',
  verifyStatus: 'delvis',
  verifySources: 'Kjernekrav fra NEK 400:2022 del 7. Detaljer i hver § må slås opp i selve normen for konkrete installasjoner.',
  topic: 'vern',
  glyph: '§',
  order: 14,
  relatedFormulaIds: ['rcd-beroringsspenning', 'it-beroringsspenning'],
  columns: [
    { key: 'paragraph', label: '§', align: 'left', primary: true, copyable: true },
    { key: 'rom', label: 'Rom / miljø', align: 'left' },
    { key: 'krav', label: 'Hovedkrav', align: 'left' },
  ],
  sections: [
    {
      id: 'vatrom',
      title: 'Våtrom og vannmiljøer',
      rows: [
        {
          id: 'p701',
          cells: { paragraph: '701', rom: 'Bad og dusj', krav: 'Sone 0/1/2, RCD 30 mA pliktig, lokal utjevningsforbindelse, IP-krav per sone' },
          highlight: true,
          keywords: ['bad', 'dusj', 'våtrom', 'sone'],
        },
        {
          id: 'p702',
          cells: { paragraph: '702', rom: 'Svømmebasseng og fonteneanlegg', krav: 'Sone 0/1/2, ekstra utjevning, SELV ≤ 12 V i sone 0/1' },
          keywords: ['basseng', 'svømme', 'fontene'],
        },
        {
          id: 'p703',
          cells: { paragraph: '703', rom: 'Badstu / sauna', krav: 'Temperaturklasser opp til 125 °C, varmebestandig kabel, ingen stikk i sauna' },
          keywords: ['badstu', 'sauna'],
        },
      ],
    },
    {
      id: 'utendors',
      title: 'Utendørs og spesielle bygg',
      rows: [
        {
          id: 'p704',
          cells: { paragraph: '704', rom: 'Byggeplass', krav: 'IP44 min, RCD 30 mA på stikkontakter ≤ 32 A, tydelig merking' },
          keywords: ['byggeplass', 'midlertidig'],
        },
        {
          id: 'p705',
          cells: { paragraph: '705', rom: 'Landbruk og gartneri', krav: 'Korrosjonsbeskyttelse, dyrebeskyttelse, strengere RCD-krav (30 mA på alle stikk)' },
          keywords: ['landbruk', 'gartneri', 'fjøs', 'dyr'],
        },
        {
          id: 'p708',
          cells: { paragraph: '708', rom: 'Camping og caravan-plasser', krav: 'IP44 min, individuell RCD 30 mA per stikkontakt, maks 1 stikk per kurs' },
          keywords: ['camping', 'caravan'],
        },
      ],
    },
    {
      id: 'spesielle',
      title: 'Medisinske og mobile anlegg',
      rows: [
        {
          id: 'p710',
          cells: { paragraph: '710', rom: 'Medisinske rom', krav: 'Gruppe 0/1/2 etter risiko, IT-medisinsk i gruppe 2, ekstra streng utjevning' },
          keywords: ['medisin', 'sykehus', 'operasjon'],
        },
        {
          id: 'p717',
          cells: { paragraph: '717', rom: 'Mobile og transportable enheter', krav: 'Caravan, kjøretøy, fartøy — egne regler for tilkobling og jording' },
          keywords: ['caravan', 'kjøretøy', 'mobile'],
        },
      ],
    },
    {
      id: 'spesialinstallasjon',
      title: 'Spesialinstallasjon',
      rows: [
        {
          id: 'p722',
          cells: { paragraph: '722', rom: 'EV-lading (elbil)', krav: 'RCD type B (eller A + DC-vakt), dedikert kurs per ladepunkt, maks 32 A 1-fas' },
          highlight: true,
          keywords: ['EV', 'elbil', 'lading', 'ladestasjon'],
        },
        {
          id: 'p753',
          cells: { paragraph: '753', rom: 'Gulvvarme og takvarme', krav: 'Termisk beskyttelse mot overoppheting, RCD 30 mA, temperatur­begrenser' },
          keywords: ['gulvvarme', 'takvarme', 'varmekabel'],
        },
        {
          id: 'p823',
          cells: { paragraph: '823', rom: 'Boliginstallasjon (NK 64)', krav: 'Samtidighet, ≤ 4 mm² strengere krav, minimum antall kurser per romtype' },
          highlight: true,
          keywords: ['bolig', 'NK 64'],
        },
      ],
    },
  ],
  notes: [
    '§701 har egen detaljert sone-tabell — slå opp "Sone-krav" for konkret IP/spenning per sone.',
    'For EV-lading (§722) er RCD type B nesten alltid kravet — kun unntak hvis ladestasjonen selv har DC-vakt.',
    'På fagprøve kan eksaminator spørre om en konkret installasjon: husk å nevne RCD-krav, IP-krav, og evt. spesialvern.',
  ],
};
