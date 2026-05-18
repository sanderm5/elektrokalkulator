import type { ReferenceTable } from './types';

export const HALVLEDERKOMPONENTER: ReferenceTable = {
  id: 'halvlederkomponenter',
  slug: 'halvlederkomponenter',
  title: 'Halvlederkomponenter — hurtigoppslag',
  description:
    'Diode-spenningsfall, BJT/FET-styring, tyristor og IGBT-egenskaper. Brukes som hurtigoppslag på ELE2 — særlig ved skjema-tolkning og kretsforståelse.',
  source: 'ELE2 elektroteori — generisk halvlederlitteratur.',
  verifyStatus: 'verifisert',
  verifySources: 'Standardverdier fra Sedra/Smith Microelectronic Circuits og IEC 60747-serien for power-halvledere.',
  topic: 'likeretter',
  glyph: '◁',
  order: 30,
  relatedFormulaIds: ['likeretter-halvbolge', 'likeretter-helbolge-bro', 'likeretter-midtuttak', 'likeretter-trefase-bro'],
  columns: [
    { key: 'komponent', label: 'Komponent', align: 'left', primary: true },
    { key: 'symbol', label: 'Symbol', align: 'center' },
    { key: 'verdi', label: 'Typisk verdi / parameter', align: 'left', copyable: true },
    { key: 'styring', label: 'Styring', align: 'left' },
    { key: 'bruk', label: 'Typisk bruk', align: 'left' },
  ],
  sections: [
    {
      id: 'dioder',
      title: 'Dioder',
      rows: [
        {
          id: 'silisium',
          cells: {
            komponent: 'Silisiumdiode (Si)',
            symbol: '▷|',
            verdi: 'U_F ≈ 0,7 V',
            styring: 'Passiv — leder fra anode til katode ved U > 0,7 V',
            bruk: 'Likeretting, signal-clamping, frihjul-diode i indikatorkretser.',
          },
          highlight: true,
          keywords: ['diode', 'silisium', '0,7 V'],
        },
        {
          id: 'germanium',
          cells: {
            komponent: 'Germaniumdiode (Ge)',
            symbol: '▷|',
            verdi: 'U_F ≈ 0,3 V',
            styring: 'Passiv',
            bruk: 'Sjelden i moderne kretser — RF-detektorer, eldre utstyr.',
          },
          keywords: ['diode', 'germanium', '0,3 V'],
        },
        {
          id: 'zener',
          cells: {
            komponent: 'Zenerdiode',
            symbol: '▷|⊥',
            verdi: 'U_Z = 3,3 / 5,1 / 12 / 24 V …',
            styring: 'Passiv — bryter sammen i sperreretning ved U_Z',
            bruk: 'Spennings-referanse, overspenningsvern, regulering av lav effekt.',
          },
          keywords: ['zener', 'spenningsreferanse'],
        },
        {
          id: 'schottky',
          cells: {
            komponent: 'Schottky-diode',
            symbol: '▷|',
            verdi: 'U_F ≈ 0,2–0,4 V',
            styring: 'Passiv — meget rask switchetid',
            bruk: 'Switch-mode-likeretter, RF, hurtige logikk-clampinger.',
          },
          keywords: ['schottky', 'rask'],
        },
        {
          id: 'led',
          cells: {
            komponent: 'Lysdiode (LED)',
            symbol: '▷|≁',
            verdi: 'U_F ≈ 1,8 V (rød) – 3,4 V (blå/hvit)',
            styring: 'Passiv — lyser ved fremover-strøm',
            bruk: 'Indikering, belysning, opto-isolatorer.',
          },
          keywords: ['LED', 'lysdiode'],
        },
      ],
    },
    {
      id: 'transistorer',
      title: 'Transistorer',
      rows: [
        {
          id: 'bjt',
          cells: {
            komponent: 'BJT (bipolar transistor)',
            symbol: 'NPN / PNP',
            verdi: 'β = 50–500, U_BE ≈ 0,7 V',
            styring: 'Strømstyrt — I_C = β × I_B',
            bruk: 'Forsterkere, switch i lav-frekvens, drivere for relé.',
          },
          highlight: true,
          keywords: ['BJT', 'transistor', 'NPN', 'PNP', 'bipolar', 'beta'],
        },
        {
          id: 'fet',
          cells: {
            komponent: 'MOSFET',
            symbol: 'N-FET / P-FET',
            verdi: 'R_DS(on) = mΩ til Ω, U_GS(th) ≈ 2–4 V',
            styring: 'Spenningsstyrt — gate styrer kanal',
            bruk: 'Switch-mode strømforsyninger, motorstyring, høyfrekvens-bryter.',
          },
          highlight: true,
          keywords: ['FET', 'MOSFET', 'spenningsstyrt'],
        },
        {
          id: 'jfet',
          cells: {
            komponent: 'JFET',
            symbol: 'N-JFET',
            verdi: 'Sjelden brukt — for-strømmet ved U_GS=0',
            styring: 'Spenningsstyrt — krever negativ U_GS for å sperre',
            bruk: 'Audio-forsterkere, høy input-impedans.',
          },
          keywords: ['JFET'],
        },
      ],
    },
    {
      id: 'effekt-halvledere',
      title: 'Power-halvledere',
      rows: [
        {
          id: 'tyristor',
          cells: {
            komponent: 'Tyristor (SCR)',
            symbol: '▷⊥|',
            verdi: 'U_GT ≈ 0,7 V, I_H = holdestrøm',
            styring: 'Pulses på gate → leder til strøm < I_H',
            bruk: 'AC-fasevinkel-regulering, soft-start, gamle frekvensomformere.',
          },
          highlight: true,
          keywords: ['tyristor', 'SCR', 'thyristor', 'fasevinkel'],
        },
        {
          id: 'triac',
          cells: {
            komponent: 'TRIAC',
            symbol: '↔⊥|',
            verdi: 'Som tyristor i begge retninger',
            styring: 'Bidireksjonell tyristor — leder i begge retninger',
            bruk: 'Lysdimmere, varmestyring, små motorkontroller.',
          },
          keywords: ['triac', 'lysdimmer'],
        },
        {
          id: 'igbt',
          cells: {
            komponent: 'IGBT',
            symbol: 'IGBT',
            verdi: 'U_CE(sat) ≈ 1,5–2,5 V, bytte 5–20 kHz',
            styring: 'Spenningsstyrt (som FET) men tåler høy spenning (som BJT)',
            bruk: 'Frekvensomformere, hurtigladere, store invertere, EV-traksjon.',
          },
          highlight: true,
          keywords: ['IGBT', 'frekvensomformer', 'FU', 'inverter'],
        },
        {
          id: 'sic',
          cells: {
            komponent: 'SiC MOSFET',
            symbol: 'SiC',
            verdi: 'R_DS(on) lavere, tåler 650–1700 V, bytter til 100 kHz+',
            styring: 'Spenningsstyrt',
            bruk: 'Moderne EV-ladere, solcelleinvertere, høy-effekt SMPS.',
          },
          keywords: ['SiC', 'silisiumkarbid'],
        },
      ],
    },
    {
      id: 'piv-oppslag',
      title: 'PIV per likeretter-topologi (sperrespenning per diode)',
      description:
        'PIV = Peak Inverse Voltage — maksimal sperrespenning hver diode ser. Velg diode med tåleevne ≥ 1,5 × PIV.',
      rows: [
        { id: 'piv-hb', cells: { komponent: 'Halvbølge enfase', symbol: '1 diode', verdi: 'PIV = √2 × U_rms ≈ 1,41 × U_rms', styring: '—', bruk: 'For 230 V AC: PIV ≈ 325 V.' } },
        { id: 'piv-helb', cells: { komponent: 'Helbølge bro enfase', symbol: '4 dioder', verdi: 'PIV = √2 × U_rms ≈ 1,41 × U_rms', styring: '—', bruk: 'For 230 V AC: PIV ≈ 325 V per diode.' }, highlight: true },
        { id: 'piv-midt', cells: { komponent: 'Helbølge med midtuttak', symbol: '2 dioder', verdi: 'PIV = 2√2 × U_rms ≈ 2,83 × U_rms', styring: '—', bruk: 'Per halvdel — høyest PIV-krav av enfase-topologier.' } },
        { id: 'piv-3f', cells: { komponent: 'Trefase bro (B6)', symbol: '6 dioder', verdi: 'PIV = √2 × U_L', styring: '—', bruk: 'For 400 V AC: PIV ≈ 565 V per diode.' }, highlight: true },
      ],
    },
  ],
  notes: [
    'Toppspenning U_topp = √2 × U_rms — bruk dette i alle PIV-beregninger.',
    'Velg alltid komponent med ≥ 1,5 × beregnet PIV/I_F som margin mot transienter og temperatur.',
    'For frekvensomformere (FU) brukes B6-bro + IGBT-inverter. DC-bus blir typisk 540 V ved 400 V AC inn.',
  ],
};
