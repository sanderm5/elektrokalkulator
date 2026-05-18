import type { ReferenceTable } from './types';

export const KABELTYPER: ReferenceTable = {
  id: 'kabeltyper',
  slug: 'kabeltyper',
  title: 'Kabeltyper — bruksområder og egenskaper',
  description:
    'Vanlige kabeltyper i norsk installasjon, deres bruksområder og typiske egenskaper.',
  source: 'Eltabellen, leverandørdatablad (Nexans, Draka)',
  verifyStatus: 'delvis',
  verifySources: 'Typegjenkjenning og hovedbruksområder er etablert i norsk praksis. Maks ledertemperatur (70/90°C) verifisert mot NEK Kabel datablad. Detaljer per kabeltype må verifiseres mot leverandør.',
  topic: 'kabel',
  glyph: '⏚',
  order: 9,
  columns: [
    { key: 'type', label: 'Kabeltype', align: 'left', primary: true },
    { key: 'isolasjon', label: 'Isolasjon', align: 'center' },
    { key: 'maks_temp', label: 'Maks ledertemp.', align: 'right' },
    { key: 'bruk', label: 'Bruksområde', align: 'left' },
  ],
  sections: [
    {
      id: 'installasjon',
      title: 'Installasjon — fast',
      rows: [
        {
          id: 'pn',
          cells: { type: 'PN (RKK)', isolasjon: 'PVC', maks_temp: '70 °C', bruk: 'Enkeltledere i rør innendørs' },
          highlight: true,
        },
        {
          id: 'pr',
          cells: { type: 'PR (RKUB)', isolasjon: 'PVC', maks_temp: '70 °C', bruk: 'Lyspunkter, flerleder i rør' },
          highlight: true,
        },
        {
          id: 'pfsp',
          cells: { type: 'PFSP', isolasjon: 'PVC + skjerm', maks_temp: '70 °C', bruk: 'EMC-følsomme områder, kontrollkabel' },
        },
        {
          id: 'exq',
          cells: { type: 'EXQ', isolasjon: 'XLPE', maks_temp: '90 °C', bruk: 'Stigeledere, mer strøm enn PVC' },
        },
      ],
    },
    {
      id: 'fleks',
      title: 'Fleksible installasjons-kabler',
      rows: [
        {
          id: 'tfxp',
          cells: { type: 'TFXP (mr.flex)', isolasjon: 'PEX-foam', maks_temp: '90 °C', bruk: 'Fleksibel, frostfri ned til -25°C — inntak, hovedtilførsel' },
          highlight: true,
        },
        {
          id: 'tffr',
          cells: { type: 'TFFR-K (PFXP)', isolasjon: 'PEX', maks_temp: '90 °C', bruk: 'Skjult forlegging i bygg' },
        },
        {
          id: 'rkk',
          cells: { type: 'RKK', isolasjon: 'PVC', maks_temp: '70 °C', bruk: 'Apparatkabel, bevegelige tilkoblinger' },
        },
        {
          id: 'opn',
          cells: { type: 'OPN / IFLK', isolasjon: 'PVC', maks_temp: '70 °C', bruk: 'Lavspenning utendørs midlertidig' },
        },
      ],
    },
    {
      id: 'jord',
      title: 'Jordkabel',
      rows: [
        {
          id: 'pfsp-jord',
          cells: { type: 'PFSP jord', isolasjon: 'PVC + skjerm', maks_temp: '70 °C', bruk: 'Jordet kabel for utendørs nedlegging' },
        },
        {
          id: 'tslf',
          cells: { type: 'TSLF', isolasjon: 'XLPE', maks_temp: '90 °C', bruk: 'Hovedinntak, høyere belastning' },
        },
        {
          id: 'pmtxp',
          cells: { type: 'PMTXP (rør i jord)', isolasjon: 'PEX', maks_temp: '90 °C', bruk: 'Jordkabel via vernerør' },
        },
      ],
    },
  ],
  notes: [
    'Velg kabel basert på krav til strømføringsevne, mekanisk beskyttelse og temperaturklasse.',
    'TFXP er ofte foretrukket for hovedtilførsel pga. fleksibilitet og lav minimum bøyetempera­tur.',
    'For utendørs / jord: bruk kabler beregnet for det miljøet og UV-bestandig kappe der relevant.',
  ],
};
