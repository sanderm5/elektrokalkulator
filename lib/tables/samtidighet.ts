import type { ReferenceTable } from './types';

export const SAMTIDIGHET: ReferenceTable = {
  id: 'samtidighet',
  slug: 'samtidighet',
  title: 'Samtidighetsfaktorer',
  description:
    'Veiledende samtidighetsfaktor per kurstype, brukt ved dimensjonering av hovedinntak og fordelinger. Faktoren tar hensyn til at ikke alle laster brukes samtidig.',
  source: 'NEK 400-8-823 (Bolignormen) / Eltabellen / praksis',
  verifyStatus: 'delvis',
  verifySources: 'NEK 400-8-823 angir typisk 0,3–0,5 for enebolig (samlet). Per-kurs-faktorer (komfyr=1,0, varmtvann kontinuerlig=1,0, elbil=1,0, panelovn=0,8) er praksis-basert fra Eltabellen og REN-blader — IKKE direkte NEK-sitat. Bruk eksamen-oppgavens oppgitte faktor først.',
  topic: 'belastningsberegning',
  glyph: 'Σ',
  order: 1,
  relatedFormulaIds: ['dimensjonerende-effekt', 'strom-fra-dimensjonerende-effekt'],
  columns: [
    { key: 'kurstype', label: 'Kurstype', align: 'left' },
    { key: 'faktor', label: 'k_samt', align: 'right', copyable: true, primary: true },
    { key: 'kommentar', label: 'Kommentar', align: 'left' },
  ],
  sections: [
    {
      id: 'bolig',
      title: 'Bolig',
      rows: [
        { id: 'lys', cells: { kurstype: 'Lyskurser / belysning', faktor: 0.8, kommentar: 'Allmenn belysning, termostatfri.' } },
        { id: 'stikk', cells: { kurstype: 'Stikkontaktkurser (alminnelig)', faktor: 0.2, kommentar: '0,2–0,3 — lavt forbruk per kurs.' } },
        { id: 'komfyr', cells: { kurstype: 'Komfyr / kokeplate', faktor: 1.0, kommentar: 'Dimensjoneres for full last — ofte langvarig drift.' }, highlight: true, keywords: ['komfyr', 'kokeplate'] },
        { id: 'kjokken', cells: { kurstype: 'Kjøkken samlet (komfyr + hvitevarer)', faktor: 0.6, kommentar: 'Når flere kjøkken-laster kombineres.' } },
        { id: 'varme-panel', cells: { kurstype: 'Panelovn / varmekurs', faktor: 0.8, kommentar: 'Termostatstyrt.' }, keywords: ['panelovn', 'varme'] },
        { id: 'gulvvarme', cells: { kurstype: 'Gulvvarme', faktor: 0.6, kommentar: 'Termostatstyrt.' } },
        { id: 'bereder-kont', cells: { kurstype: 'Varmtvannsbereder (kontinuerlig)', faktor: 1.0, kommentar: 'Uten styring eller alltid på.' }, highlight: true },
        { id: 'bereder-tid', cells: { kurstype: 'Varmtvannsbereder (tidsstyrt)', faktor: 0.35, kommentar: '0,2–0,5 — typisk natt/billig-time-styring.' } },
        { id: 'varmepumpe', cells: { kurstype: 'Varmepumpe', faktor: 1.0, kommentar: 'Kontinuerlig drift ved kalde forhold.' }, highlight: true },
        { id: 'elbil', cells: { kurstype: 'Elbil-lader', faktor: 1.0, kommentar: 'Full last under lading.' }, highlight: true },
        { id: 'sauna', cells: { kurstype: 'Badstu', faktor: 0.5, kommentar: 'Brukes sjelden.' } },
      ],
    },
    {
      id: 'samlet-bolig',
      title: 'Samlet bolig (for hovedinntak)',
      description: 'Når flere typer kurser kombineres er total samtidighet typisk lavere.',
      rows: [
        { id: 'liten-bolig', cells: { kurstype: 'Liten bolig (< 100 m²)', faktor: 0.6, kommentar: 'Typisk leilighet' } },
        { id: 'normal-bolig', cells: { kurstype: 'Normal bolig (100–200 m²)', faktor: 0.5, kommentar: 'Enebolig uten elbil' } },
        { id: 'stor-bolig', cells: { kurstype: 'Stor bolig m/ varmepumpe + elbil', faktor: 0.5, kommentar: 'Eksamenscase' }, highlight: true },
      ],
    },
    {
      id: 'naring',
      title: 'Næring',
      rows: [
        { id: 'kontor', cells: { kurstype: 'Kontor', faktor: 0.5, kommentar: 'Belysning + PC-er.' } },
        { id: 'butikk', cells: { kurstype: 'Butikk', faktor: 0.7, kommentar: 'Mye lys og kjøl.' } },
        { id: 'kjol-frys', cells: { kurstype: 'Kjøl/frys næring', faktor: 1.0, kommentar: 'Dimensjoneres for full last — drift hele døgnet.' }, highlight: true, keywords: ['kjøl', 'frys', 'kjøling', 'kuldemøbler'] },
        { id: 'lager', cells: { kurstype: 'Lager / industri', faktor: 0.5, kommentar: 'Varierer mye med drift.' } },
        { id: 'verksted', cells: { kurstype: 'Verksted', faktor: 0.6, kommentar: 'Maskiner ikke alltid på.' } },
        { id: 'restaurant', cells: { kurstype: 'Restaurant', faktor: 0.7, kommentar: 'Kjøkken er hovedlast.' } },
      ],
    },
  ],
  notes: [
    'Faktorene er veiledende. Sjekk alltid mot den enkelte oppgaven, NEK 700 og lokale retningslinjer.',
    'For elbil og varmepumpe brukes 1,0 fordi disse går ofte under full last samtidig med annet forbruk.',
    'I eksamen vil du som regel få oppgitt samtidighetsfaktoren — bruk den eksamensspesifikke verdien.',
  ],
};
