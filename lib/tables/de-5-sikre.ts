import type { ReferenceTable } from './types';

export const DE_5_SIKRE: ReferenceTable = {
  id: 'de-5-sikre',
  slug: 'de-5-sikre',
  title: 'De 5 sikre — to versjoner du må kjenne',
  description:
    'To uavhengige "5 sikre"-konsepter med samme navn: dokumentasjonsversjonen (Elsikkerhets­portalen) og prosedyreversjonen (FSE §14). Pugges utenat — kommer ofte på fagprøve.',
  source: 'Elsikkerhetsportalen / FSE §14',
  verifyStatus: 'verifisert',
  verifySources: 'Begge versjoner er fast pensum på elektrofag­brev. Verifisert mot eksamen-veiledning og FSE-håndbok.',
  topic: 'vern',
  glyph: '5✓',
  order: 18,
  relatedFormulaIds: [],
  columns: [
    { key: 'nr', label: 'Nr', align: 'right' },
    { key: 'punkt', label: 'Punkt', align: 'left', primary: true },
    { key: 'kommentar', label: 'Kommentar', align: 'left' },
  ],
  sections: [
    {
      id: 'dokumentasjon',
      title: 'Elsikkerhetsportalen — De 5 sikre (DOKUMENTER)',
      description: 'Disse fem dokumentene SKAL leveres ved hver ny installasjon.',
      rows: [
        {
          id: 'd1',
          cells: { nr: 1, punkt: 'Risikovurdering', kommentar: 'FEL §16: kreves FØR prosjektering' },
          highlight: true,
        },
        {
          id: 'd2',
          cells: { nr: 2, punkt: 'Samsvarserklæring', kommentar: 'FEL §12: utstedes ved sluttkontroll' },
          highlight: true,
        },
        {
          id: 'd3',
          cells: { nr: 3, punkt: 'Sluttkontroll / måleprotokoll', kommentar: 'Visuell + målinger + funksjon' },
          highlight: true,
        },
        {
          id: 'd4',
          cells: { nr: 4, punkt: 'Kursfortegnelse', kommentar: 'Oversikt over alle kurser i sikringsskapet' },
          highlight: true,
        },
        {
          id: 'd5',
          cells: { nr: 5, punkt: 'Utstyrsdokumentasjon (FDV)', kommentar: 'Datablad og bruksanvisninger for alt installert utstyr' },
          highlight: true,
        },
      ],
    },
    {
      id: 'frakobling',
      title: 'FSE §14 — De 5 sikre (FRAKOBLING)',
      description: '5-stegs prosedyre for sikker frakobling før arbeid. ALDRI bytt rekkefølge.',
      rows: [
        {
          id: 'f1',
          cells: { nr: 1, punkt: 'Koble fra', kommentar: 'Bryt strømmen ved hovedbryter eller skillebryter' },
          highlight: true,
        },
        {
          id: 'f2',
          cells: { nr: 2, punkt: 'Sikre mot innkobling', kommentar: 'Lås bryter, sett opp skilt, fjern sikringer' },
          highlight: true,
        },
        {
          id: 'f3',
          cells: { nr: 3, punkt: 'Kontroller spenningsløst', kommentar: 'Mål alle faser + N + PE med spenningsprøver — test prøveren før og etter' },
          highlight: true,
        },
        {
          id: 'f4',
          cells: { nr: 4, punkt: 'Jord og kortslutt', kommentar: 'Påkrevd for høyspent. På lavspent: når behov for ekstra sikkerhet' },
          highlight: true,
        },
        {
          id: 'f5',
          cells: { nr: 5, punkt: 'Skjerm av nærliggende', kommentar: 'Forhindre kontakt med spenningssatte deler i nærheten' },
          highlight: true,
        },
      ],
    },
  ],
  notes: [
    'Begge versjoner har "5 sikre" som navn — på eksamen må du kjenne BEGGE og vite forskjellen.',
    'FSE §14 brukes hver dag i feltarbeid. Elsikkerhetsportalens versjon brukes ved hver ny installasjon.',
    'Skritt 3 i FSE §14 (kontroller spenningsløst): prøveren testes FØR og ETTER målingen for å bekrefte at den fungerer.',
  ],
};
