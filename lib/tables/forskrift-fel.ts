import type { ReferenceTable } from './types';

export const FORSKRIFT_FEL: ReferenceTable = {
  id: 'forskrift-fel',
  slug: 'forskrift-fel',
  title: 'FEL — Forskrift om elektriske lavspenningsanlegg',
  description:
    'De viktigste paragrafene i FEL som elektrofagarbeidere må kjenne. Regulerer hvordan nye anlegg planlegges, utføres, kontrolleres og dokumenteres.',
  source: 'FOR-1998-11-06-1060 (FEL) — lovdata.no',
  verifyStatus: 'verifisert',
  verifySources: 'Paragraf-titler og innhold verifisert mot lovdata.no 2026-05. Tittel på §§ 17 og 19 var feil i tidligere versjon — rettet.',
  topic: 'vern',
  glyph: 'FEL',
  order: 15,
  columns: [
    { key: 'paragraph', label: '§', align: 'left', primary: true, copyable: true },
    { key: 'tittel', label: 'Tittel', align: 'left' },
    { key: 'krav', label: 'Kjernekrav', align: 'left' },
  ],
  sections: [
    {
      id: 'planlegging',
      title: 'Planlegging og prosjektering',
      rows: [
        {
          id: 'p10',
          cells: { paragraph: '§ 10', tittel: 'Sikkerhetskrav', krav: 'Anlegget skal være sikkert mot fare for liv, helse og materielle verdier' },
          highlight: true,
          keywords: ['sikkerhet', 'fare'],
        },
        {
          id: 'p16',
          cells: { paragraph: '§ 16', tittel: 'Risikovurdering', krav: 'Risikovurdering kreves FØR prosjektering — dokumenteres skriftlig' },
          highlight: true,
          keywords: ['risiko', 'planlegging'],
        },
      ],
    },
    {
      id: 'kontroll',
      title: 'Kontroll og dokumentasjon',
      rows: [
        {
          id: 'p12',
          cells: { paragraph: '§ 12', tittel: 'Kontroll og samsvarserklæring', krav: 'Sluttkontroll + samsvarserklæring SKAL utstedes ved hver ny installasjon' },
          highlight: true,
          keywords: ['kontroll', 'samsvar', 'dokumentasjon'],
        },
        {
          id: 'p13',
          cells: { paragraph: '§ 13', tittel: 'Oppbevaring av dokumentasjon', krav: 'Eieren skal oppbevare dokumentasjon i hele anleggets levetid' },
          keywords: ['oppbevaring', 'arkiv'],
        },
        {
          id: 'p14',
          cells: { paragraph: '§ 14', tittel: 'Melding til netteier', krav: 'Nye anlegg / endringer skal meldes til netteier før og etter arbeid' },
          highlight: true,
          warning: 'OBS: FEL §14 = melding. Ikke forveksles med FSE §14 (frakobling).',
          keywords: ['melding', 'netteier'],
        },
      ],
    },
    {
      id: 'drift',
      title: 'Drift, vedlikehold og jording',
      rows: [
        {
          id: 'p17',
          cells: { paragraph: '§ 17', tittel: 'Tilgjengelighet for vedlikehold', krav: 'Anlegget skal være tilgjengelig for ettersyn, vedlikehold og reparasjon uten fare — tilstrekkelig plass for komponentutskifting' },
          keywords: ['vedlikehold', 'tilgjengelighet'],
        },
        {
          id: 'p19',
          cells: { paragraph: '§ 19', tittel: 'Jordingsanlegg', krav: 'Jordingssystemet må tilpasses fordelingssystemet (TN/TT/IT) for å unngå farlig strømgjennomgang, forbrenning og brannfare' },
          keywords: ['jording', 'TN', 'TT', 'IT', 'fordelingssystem'],
        },
      ],
    },
  ],
  notes: [
    'FEL erstatter eldre FEB (Forskrift om elektriske bygningsinstallasjoner).',
    'FEL gir rammene — NEK 400 er den tekniske normen som beskriver HVORDAN sikkerhetskravene oppfylles.',
    'Brudd på FEL kan medføre tap av sertifisering og straffeansvar.',
  ],
};
