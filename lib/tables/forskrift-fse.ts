import type { ReferenceTable } from './types';

export const FORSKRIFT_FSE: ReferenceTable = {
  id: 'forskrift-fse',
  slug: 'forskrift-fse',
  title: 'FSE — Forskrift om sikkerhet ved arbeid i og drift av elektriske anlegg',
  description:
    'Regulerer hvordan ARBEID på elektriske anlegg skal utføres trygt — planlegging, ansvarsfordeling og frakoblingsprosedyrer. Sentral for alle elektrikere i felt.',
  source: 'FOR-2006-04-28-458 (FSE) — lovdata.no',
  verifyStatus: 'verifisert',
  verifySources: 'Paragraf-titler og innhold verifisert mot lovdata.no 2026-05. §§ 10, 15 og 17 var feilattribuert i tidligere versjon — rettet.',
  topic: 'vern',
  glyph: 'FSE',
  order: 16,
  columns: [
    { key: 'paragraph', label: '§', align: 'left', primary: true, copyable: true },
    { key: 'tittel', label: 'Tittel', align: 'left' },
    { key: 'krav', label: 'Kjernekrav', align: 'left' },
  ],
  sections: [
    {
      id: 'planlegging',
      title: 'Planlegging og ansvar',
      rows: [
        {
          id: 'p7',
          cells: { paragraph: '§ 7', tittel: 'Overordnet planlegging', krav: 'Virksomheten skal etablere planleggingssystemer; ansatte skal ha tilgang til forskrifter, opplæring, øvelser og instrukser' },
          highlight: true,
          keywords: ['planlegging', 'opplæring', 'instruks'],
        },
        {
          id: 'p10',
          cells: { paragraph: '§ 10', tittel: 'Planlegging av arbeid', krav: 'Før arbeid begynner: hent inn anleggsinformasjon og gjør risikovurdering. Bestem metode, utstyr, PVU og personell' },
          highlight: true,
          keywords: ['planlegging', 'risikovurdering', 'SJA', 'PVU'],
        },
      ],
    },
    {
      id: 'frakobling',
      title: 'Sikker frakobling og arbeid',
      rows: [
        {
          id: 'p14',
          cells: { paragraph: '§ 14', tittel: 'Arbeid på frakoblet anlegg — etablering av sikkerhetstiltak', krav: '5 steg: 1) Frakobling, 2) sikring mot innkobling, 3) kontroll av spenningsløshet, 4) jording og kortslutning (obligatorisk for høyspent), 5) beskyttelse mot andre spenningssatte deler' },
          highlight: true,
          warning: 'OBS: FSE §14 = frakobling (5 steg). Ikke forveksles med FEL §14 (melding til netteier).',
          keywords: ['frakobling', '5 sikre', 'spenningsløs'],
        },
        {
          id: 'p15',
          cells: { paragraph: '§ 15', tittel: 'Arbeid på frakoblet anlegg — avvikling av sikkerhetstiltak', krav: 'Varsle alle involverte før sikkerhetstiltakene fjernes. Sjekk at alle har forlatt anlegget før innkobling' },
          keywords: ['avvikling', 'innkobling', 'varsling'],
        },
        {
          id: 'p17',
          cells: { paragraph: '§ 17', tittel: 'Arbeid nær ved spenningssatte deler — etablering av sikkerhetstiltak', krav: 'Marker sikkerhetsavstander, etabler avskjerming/barrierer, bruk verneutstyr for å hindre kortslutning og berøring av spenningssatte deler' },
          highlight: true,
          keywords: ['nær spenning', 'avskjerming', 'PVU', 'barrierer'],
        },
      ],
    },
  ],
  notes: [
    'FSE §14 (frakobling) er De 5 sikre — pugges utenat. Brukes hver gang før spenningsløst arbeid.',
    'FSE krever DOKUMENTERT årlig opplæring for alle som arbeider på elektriske anlegg.',
    'FEL og FSE har OVERLAPP i §14 — men de regulerer ulike ting (melding vs. frakobling).',
  ],
};
