import type { ReferenceTable } from './types';

export const FORSKRIFT_FEK: ReferenceTable = {
  id: 'forskrift-fek',
  slug: 'forskrift-fek',
  title: 'FEK — Forskrift om elektroforetak og kvalifikasjonskrav',
  description:
    'Regulerer hvem som har lov til å prosjektere, utføre og drive elektriske anlegg — kvalifikasjonskrav for personer og godkjenningsregler for foretak.',
  source: 'FOR-2013-06-19-739 (FEK) — lovdata.no',
  verifyStatus: 'verifisert',
  verifySources: 'Paragrafer §§ 3, 4-5, 6 og 7 verifisert mot lovdata.no 2026-05.',
  topic: 'vern',
  glyph: 'FEK',
  order: 17,
  columns: [
    { key: 'omrade', label: 'Område', align: 'left', primary: true },
    { key: 'krav', label: 'Krav', align: 'left' },
  ],
  sections: [
    {
      id: 'foretak',
      title: 'Krav til foretak',
      rows: [
        {
          id: 'reg',
          cells: { omrade: '§ 3 Registrering', krav: 'Foretak som tilbyr/utfører arbeid på elektriske anlegg må være registrert i Elvirksomhetsregisteret hos DSB' },
          highlight: true,
          keywords: ['registrering', 'DSB', 'Elvirksomhetsregisteret'],
        },
        {
          id: 'kvalifisert-personell',
          cells: { omrade: '§§ 4–5 Bruk av kvalifisert personell', krav: 'Foretak skal bare bruke kvalifisert personell som er fast ansatt og oppdatert på faglig utvikling' },
          highlight: true,
          keywords: ['kvalifisert', 'fast ansatt'],
        },
        {
          id: 'faglig-ansvar',
          cells: { omrade: '§ 7 Faglig ansvarlig', krav: 'Master-/bachelor-/fagskole + relevant fagbrev + minst 3 års relevant praksis. For bygging/vedlikehold av andres anlegg: DSB-prøve påkrevd' },
          highlight: true,
          keywords: ['faglig ansvarlig', 'fagskole', 'DSB-prøve'],
        },
      ],
    },
    {
      id: 'personer',
      title: 'Krav til personer',
      rows: [
        {
          id: 'el-fagbrev',
          cells: { omrade: '§ 6 Fagbrev for elektrofagarbeider', krav: 'Den som bygger/vedlikeholder elektriske anlegg skal ha fagbrev innenfor elektrofag relevant for arbeidsoppgavene' },
          highlight: true,
          keywords: ['fagbrev', 'svennebrev', 'elektriker', 'selvstendig arbeid'],
        },
        {
          id: 'sakkyndig',
          cells: { omrade: 'Sakkyndig drift', krav: 'Drift av spenningssatt anlegg krever sakkyndig — typisk fagbrev + dokumentert kompetanse' },
        },
        {
          id: 'larling',
          cells: { omrade: 'Lærling / under opplæring', krav: 'Skal alltid arbeide under tilsyn av kvalifisert person' },
        },
      ],
    },
  ],
  notes: [
    'FEK setter rammene for HVEM som har lov — FEL setter rammene for HVORDAN anlegget bygges.',
    'Brudd på FEK kan medføre tap av registrering hos DSB og virksomhetsforbud.',
    'På fagprøve: hovedkonseptene er viktigst — eksakt paragraf trenger du ikke pugge.',
  ],
};
