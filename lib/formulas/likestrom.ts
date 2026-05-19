import type { Formula } from './types';

export const LIKESTROM_FORMULAS: Formula[] = [
  // --- OHMS LOV --------------------------------------------------------
  {
    id: 'ohms-lov-stromme',
    category: 'likestrom',
    title: 'Ohms lov — finn strømmen',
    subtitle: 'I = U / R',
    latex: 'I = \\dfrac{U}{R}',
    description:
      'Ohms lov beskriver sammenhengen mellom spenning (U), strøm (I) og motstand (R) i en likestrømskrets. Strømmen som går gjennom en motstand er lik spenningen over motstanden delt på motstandens verdi.',
    whenToUse:
      'Når du kjenner spenningen over en komponent og motstanden i kretsen, og skal finne strømmen. Grunnformelen i nesten alle DC-beregninger.',
    inputs: [
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, hint: 'Spenning i volt. F.eks. 230 V for husholdning.', min: 0 },
      { symbol: 'R', name: 'Motstand', unit: 'Ω', defaultValue: 50, hint: 'Motstandens verdi i ohm. Må være større enn 0.', min: 0 },
    ],
    output: { symbol: 'I', name: 'Strøm', unit: 'A', decimals: 3 },
    calculate: ({ U, R }) => {
      if (R <= 0) throw new Error('Motstand må være større enn 0 Ω.');
      return U / R;
    },
    examples: [
      {
        scenario: 'En lampe på 230 V trekker strøm gjennom en motstand på 50 Ω. Hvor stor er strømmen?',
        inputs: { U: 230, R: 50 },
        steps: [
          { latex: 'I = \\dfrac{U}{R}' },
          { latex: 'I = \\dfrac{230\\ \\mathrm{V}}{50\\ \\Omega}' },
          { latex: 'I = 4{,}6\\ \\mathrm{A}' },
        ],
        answer: 'I = 4,6 A',
      },
      {
        scenario: 'Et varmeelement har motstand 22 Ω og kobles til 230 V. Beregn strømmen.',
        inputs: { U: 230, R: 22 },
        steps: [
          { latex: 'I = \\dfrac{230}{22}' },
          { latex: 'I \\approx 10{,}45\\ \\mathrm{A}' },
        ],
        answer: 'I ≈ 10,45 A',
      },
    ],
    related: ['ohms-lov-spenning', 'ohms-lov-motstand', 'effekt-ui'],
    keywords: ['ohm', 'strøm', 'I', 'ampere'],
  },
  {
    id: 'ohms-lov-spenning',
    category: 'likestrom',
    title: 'Ohms lov — finn spenningen',
    subtitle: 'U = R · I',
    latex: 'U = R \\cdot I',
    description:
      'Spenningsfallet over en motstand er lik motstanden multiplisert med strømmen som går gjennom den. Ohms lov løst med hensyn på spenning.',
    whenToUse:
      'Når du kjenner strømmen og motstanden — typisk for å regne spenningsfall over enkelte komponenter eller deler av en krets.',
    inputs: [
      { symbol: 'R', name: 'Motstand', unit: 'Ω', defaultValue: 50, hint: 'Motstand i ohm.', min: 0 },
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 4.6, hint: 'Strøm gjennom motstanden i ampere.', min: 0 },
    ],
    output: { symbol: 'U', name: 'Spenning', unit: 'V', decimals: 3 },
    calculate: ({ R, I }) => R * I,
    examples: [
      {
        scenario: 'En strøm på 4,6 A går gjennom en motstand på 50 Ω. Hva er spenningen?',
        inputs: { R: 50, I: 4.6 },
        steps: [
          { latex: 'U = R \\cdot I' },
          { latex: 'U = 50\\ \\Omega \\cdot 4{,}6\\ \\mathrm{A}' },
          { latex: 'U = 230\\ \\mathrm{V}' },
        ],
        answer: 'U = 230 V',
      },
    ],
    related: ['ohms-lov-stromme', 'ohms-lov-motstand'],
    keywords: ['ohm', 'spenning', 'U', 'volt'],
  },
  {
    id: 'ohms-lov-motstand',
    category: 'likestrom',
    title: 'Ohms lov — finn motstanden',
    subtitle: 'R = U / I',
    latex: 'R = \\dfrac{U}{I}',
    description:
      'Motstanden i en komponent kan beregnes hvis du kjenner spenningen over den og strømmen som går gjennom den.',
    whenToUse:
      'Når du måler spenning og strøm, og skal regne ut motstandsverdien. Også nyttig for å finne ekvivalent motstand av en last.',
    inputs: [
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, hint: 'Spenning over komponenten.', min: 0 },
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 4.6, hint: 'Strøm i kretsen. Må være større enn 0.', min: 0 },
    ],
    output: { symbol: 'R', name: 'Motstand', unit: 'Ω', decimals: 3 },
    calculate: ({ U, I }) => {
      if (I <= 0) throw new Error('Strøm må være større enn 0 A.');
      return U / I;
    },
    examples: [
      {
        scenario: 'Et varmeelement trekker 10 A ved 230 V. Hvor stor er motstanden?',
        inputs: { U: 230, I: 10 },
        steps: [
          { latex: 'R = \\dfrac{U}{I} = \\dfrac{230}{10}' },
          { latex: 'R = 23\\ \\Omega' },
        ],
        answer: 'R = 23 Ω',
      },
    ],
    related: ['ohms-lov-stromme', 'ohms-lov-spenning'],
    keywords: ['ohm', 'motstand', 'R', 'resistans'],
  },

  // --- EFFEKT ----------------------------------------------------------
  {
    id: 'effekt-ui',
    category: 'likestrom',
    title: 'Effekt fra spenning og strøm',
    subtitle: 'P = U · I',
    latex: 'P = U \\cdot I',
    description:
      'Elektrisk effekt er produktet av spenning og strøm. Effekten sier hvor mye energi som omsettes per sekund — og i likestrøm er det enkelt produkt av U og I.',
    whenToUse:
      'Når du kjenner spenningen over en last og strømmen den trekker. Den enkleste måten å beregne effekt i likestrøm og rene resistive AC-laster.',
    inputs: [
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, min: 0 },
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 10, min: 0 },
    ],
    output: { symbol: 'P', name: 'Effekt', unit: 'W', decimals: 2 },
    calculate: ({ U, I }) => U * I,
    examples: [
      {
        scenario: 'En panelovn trekker 10 A ved 230 V. Hvor stor effekt har den?',
        inputs: { U: 230, I: 10 },
        steps: [
          { latex: 'P = U \\cdot I' },
          { latex: 'P = 230\\ \\mathrm{V} \\cdot 10\\ \\mathrm{A}' },
          { latex: 'P = 2300\\ \\mathrm{W} = 2{,}3\\ \\mathrm{kW}' },
        ],
        answer: 'P = 2300 W (2,3 kW)',
      },
    ],
    related: ['effekt-i2r', 'effekt-u2r', 'arbeid-energi'],
    keywords: ['effekt', 'watt', 'P'],
  },
  {
    id: 'effekt-i2r',
    category: 'likestrom',
    title: 'Effekt fra strøm og motstand',
    subtitle: 'P = I² · R',
    latex: 'P = I^{2} \\cdot R',
    description:
      'Effekten som omsettes i en motstand er kvadratet av strømmen multiplisert med motstanden. Følger direkte av Ohms lov satt inn i P = U·I.',
    whenToUse:
      'Når du kjenner strømmen og motstanden, men ikke spenningen. Brukes mye for å beregne effekttap i ledere og kabler.',
    inputs: [
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 10, min: 0 },
      { symbol: 'R', name: 'Motstand', unit: 'Ω', defaultValue: 23, min: 0 },
    ],
    output: { symbol: 'P', name: 'Effekt', unit: 'W', decimals: 2 },
    calculate: ({ I, R }) => I * I * R,
    examples: [
      {
        scenario: 'En leder har 0,2 Ω motstand. Det går 25 A gjennom den. Hvor stort er effekttapet?',
        inputs: { I: 25, R: 0.2 },
        steps: [
          { latex: 'P = I^{2} \\cdot R' },
          { latex: 'P = 25^{2} \\cdot 0{,}2 = 625 \\cdot 0{,}2' },
          { latex: 'P = 125\\ \\mathrm{W}' },
        ],
        answer: 'P = 125 W (effekttap)',
      },
    ],
    related: ['effekt-ui', 'effekt-u2r'],
    keywords: ['effekt', 'effekttap', 'leder', 'P'],
  },
  {
    id: 'effekt-u2r',
    category: 'likestrom',
    title: 'Effekt fra spenning og motstand',
    subtitle: 'P = U² / R',
    latex: 'P = \\dfrac{U^{2}}{R}',
    description:
      'Effekten kan også beregnes når du kjenner spenningen over en motstand og motstandens verdi. Følger av P = U·I og I = U/R.',
    whenToUse:
      'Når du kjenner spenningen og motstanden — typisk for varmeelementer som har fast motstandsverdi og en bestemt driftsspenning.',
    inputs: [
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, min: 0 },
      { symbol: 'R', name: 'Motstand', unit: 'Ω', defaultValue: 23, min: 0 },
    ],
    output: { symbol: 'P', name: 'Effekt', unit: 'W', decimals: 2 },
    calculate: ({ U, R }) => {
      if (R <= 0) throw new Error('Motstand må være større enn 0 Ω.');
      return (U * U) / R;
    },
    examples: [
      {
        scenario: 'Et varmeelement med 23 Ω kobles til 230 V. Hva er effekten?',
        inputs: { U: 230, R: 23 },
        steps: [
          { latex: 'P = \\dfrac{U^{2}}{R}' },
          { latex: 'P = \\dfrac{230^{2}}{23} = \\dfrac{52900}{23}' },
          { latex: 'P = 2300\\ \\mathrm{W}' },
        ],
        answer: 'P = 2300 W',
      },
    ],
    related: ['effekt-ui', 'effekt-i2r'],
    keywords: ['effekt', 'varmeelement', 'P'],
  },

  // --- ENERGI ----------------------------------------------------------
  {
    id: 'arbeid-energi',
    category: 'likestrom',
    title: 'Elektrisk energi (arbeid)',
    subtitle: 'W = P · t',
    latex: 'W = P \\cdot t',
    description:
      'Elektrisk energi (eller arbeid) er effekt multiplisert med tid. I praksis måler vi energi i kilowattimer (kWh): 1 kWh = effekt på 1 kW i 1 time.',
    whenToUse:
      'Når du skal regne strømforbruk, varmemengde produsert av et apparat, eller hva en last koster å drifte over tid.',
    inputs: [
      { symbol: 'P', name: 'Effekt', unit: 'W', defaultValue: 2000, hint: 'Effekt i watt. 2000 W = 2 kW.', min: 0 },
      { symbol: 't', name: 'Tid', unit: 'h', defaultValue: 5, hint: 'Tid i timer.', min: 0 },
    ],
    output: { symbol: 'W', name: 'Energi', unit: 'Wh', decimals: 2 },
    calculate: ({ P, t }) => P * t,
    examples: [
      {
        scenario: 'En panelovn på 2 kW står på i 5 timer. Hvor mye energi forbrukes?',
        inputs: { P: 2000, t: 5 },
        steps: [
          { latex: 'W = P \\cdot t' },
          { latex: 'W = 2000\\ \\mathrm{W} \\cdot 5\\ \\mathrm{h}' },
          { latex: 'W = 10000\\ \\mathrm{Wh} = 10\\ \\mathrm{kWh}' },
        ],
        answer: 'W = 10 kWh',
      },
    ],
    related: ['effekt-ui'],
    keywords: ['energi', 'arbeid', 'kWh', 'forbruk'],
  },

  // --- SERIE/PARALLELL -------------------------------------------------
  {
    id: 'serie-motstand',
    category: 'likestrom',
    title: 'Motstander i serie',
    subtitle: 'R_total = R₁ + R₂ + R₃',
    latex: 'R_{\\mathrm{tot}} = R_{1} + R_{2} + R_{3}',
    description:
      'Når motstander kobles i serie, summeres motstandsverdiene. Samme strøm går gjennom alle motstandene, mens spenningen fordeles mellom dem.',
    whenToUse:
      'Når komponenter ligger etter hverandre i samme strømvei — typisk for spenningsdelere, varmeovner i serie, eller når du regner ledermotstand pluss komponentmotstand.',
    inputs: [
      { symbol: 'R1', name: 'Motstand 1', unit: 'Ω', defaultValue: 10, min: 0 },
      { symbol: 'R2', name: 'Motstand 2', unit: 'Ω', defaultValue: 20, min: 0 },
      { symbol: 'R3', name: 'Motstand 3 (valgfri)', unit: 'Ω', defaultValue: 0, hint: 'Sett 0 hvis du bare har to motstander.', min: 0 },
    ],
    output: { symbol: 'R', name: 'Total motstand', unit: 'Ω', decimals: 3 },
    calculate: ({ R1, R2, R3 }) => R1 + R2 + R3,
    examples: [
      {
        scenario: 'Tre motstander på 10 Ω, 20 Ω og 30 Ω er koblet i serie. Hva er total motstand?',
        inputs: { R1: 10, R2: 20, R3: 30 },
        steps: [
          { latex: 'R_{\\mathrm{tot}} = R_{1} + R_{2} + R_{3}' },
          { latex: 'R_{\\mathrm{tot}} = 10 + 20 + 30' },
          { latex: 'R_{\\mathrm{tot}} = 60\\ \\Omega' },
        ],
        answer: 'R = 60 Ω',
      },
    ],
    related: ['parallell-motstand'],
    keywords: ['serie', 'motstander', 'sum'],
  },
  {
    id: 'parallell-motstand',
    category: 'likestrom',
    title: 'Motstander i parallell (2 stk)',
    subtitle: 'R = (R₁·R₂) / (R₁+R₂)',
    latex: 'R_{\\mathrm{tot}} = \\dfrac{R_{1} \\cdot R_{2}}{R_{1} + R_{2}}',
    description:
      'For to motstander i parallell finner du den ekvivalente motstanden ved produkt-over-sum-formelen. Total motstand blir alltid mindre enn den minste enkeltmotstanden.',
    whenToUse:
      'Når to komponenter deler samme spenning, men strømmene fordeles. Vanlig for to laster koblet til samme kurs eller for parallelle kondensator-/spole-grupperinger.',
    inputs: [
      { symbol: 'R1', name: 'Motstand 1', unit: 'Ω', defaultValue: 10, min: 0 },
      { symbol: 'R2', name: 'Motstand 2', unit: 'Ω', defaultValue: 20, min: 0 },
    ],
    output: { symbol: 'R', name: 'Total motstand', unit: 'Ω', decimals: 3 },
    calculate: ({ R1, R2 }) => {
      if (R1 + R2 <= 0) throw new Error('Sum av motstander må være større enn 0.');
      return (R1 * R2) / (R1 + R2);
    },
    examples: [
      {
        scenario: 'To motstander på 10 Ω og 20 Ω er koblet i parallell. Hva blir total motstand?',
        inputs: { R1: 10, R2: 20 },
        steps: [
          { latex: 'R = \\dfrac{R_{1} \\cdot R_{2}}{R_{1} + R_{2}}' },
          { latex: 'R = \\dfrac{10 \\cdot 20}{10 + 20} = \\dfrac{200}{30}' },
          { latex: 'R \\approx 6{,}67\\ \\Omega' },
        ],
        answer: 'R ≈ 6,67 Ω',
      },
    ],
    related: ['serie-motstand'],
    keywords: ['parallell', 'motstander', 'ekvivalent'],
  },
  {
    id: 'spenningsdeling',
    category: 'likestrom',
    title: 'Spenningsdeling i serie',
    subtitle: 'U_x = U_tot · R_x / R_tot',
    latex: 'U_{x} = U_{\\mathrm{tot}} \\cdot \\dfrac{R_{x}}{R_{\\mathrm{tot}}}',
    description:
      'I en seriekrets fordeles totalspenningen mellom motstandene proporsjonalt med motstandsverdiene. Hver motstand får sin del av spenningen ut fra sin andel av total motstand.',
    whenToUse:
      'For spenningsdelere (potensiometer-aktig dimensjonering), målekretser, eller for å forstå hvordan spenning fordeles i en kabel med kjent indre motstand.',
    inputs: [
      { symbol: 'Utot', name: 'Total spenning', unit: 'V', defaultValue: 12, min: 0 },
      { symbol: 'Rx', name: 'Motstand som måles (R_x)', unit: 'Ω', defaultValue: 4, min: 0 },
      { symbol: 'Rtot', name: 'Total motstand', unit: 'Ω', defaultValue: 10, min: 0 },
    ],
    output: { symbol: 'U_x', name: 'Spenning over R_x', unit: 'V', decimals: 3 },
    calculate: ({ Utot, Rx, Rtot }) => {
      if (Rtot <= 0) throw new Error('Total motstand må være > 0 Ω.');
      return Utot * (Rx / Rtot);
    },
    examples: [
      {
        scenario: 'En spenningsdeler: 12 V over R1 = 6 Ω og R2 = 4 Ω i serie. Hva er spenningen over R2?',
        inputs: { Utot: 12, Rx: 4, Rtot: 10 },
        steps: [
          { latex: 'U_{R2} = 12 \\cdot \\dfrac{4}{10}' },
          { latex: 'U_{R2} = 4{,}8\\ \\mathrm{V}' },
        ],
        answer: 'U_R2 = 4,8 V',
      },
    ],
    related: ['stromdeling', 'serie-motstand'],
    keywords: ['spenningsdeler', 'serie', 'fordeling'],
  },
  {
    id: 'stromdeling',
    category: 'likestrom',
    title: 'Strømdeling i parallell',
    subtitle: 'I_1 = I_tot · R_2 / (R_1 + R_2)',
    latex: 'I_{1} = I_{\\mathrm{tot}} \\cdot \\dfrac{R_{2}}{R_{1} + R_{2}}',
    description:
      'I en parallellkrets fordeles total strømmen omvendt proporsjonalt med motstandene — den minste motstanden får mest strøm. Formelen gjelder for to motstander i parallell.',
    whenToUse:
      'Når en kurs har to parallelle laster og du må finne hvor mye av total strøm som går gjennom hver. Også for å regne ut strømmen i et amperemeter-shunt.',
    inputs: [
      { symbol: 'Itot', name: 'Total strøm', unit: 'A', defaultValue: 10, min: 0 },
      { symbol: 'R1', name: 'Motstand 1 (I_1 går gjennom)', unit: 'Ω', defaultValue: 4, min: 0 },
      { symbol: 'R2', name: 'Motstand 2 (parallell)', unit: 'Ω', defaultValue: 6, min: 0 },
    ],
    output: { symbol: 'I_1', name: 'Strøm i R_1', unit: 'A', decimals: 3 },
    calculate: ({ Itot, R1, R2 }) => {
      const sum = R1 + R2;
      if (sum <= 0) throw new Error('Sum av motstander må være > 0.');
      return Itot * (R2 / sum);
    },
    examples: [
      {
        scenario: '10 A total inn på to parallelle laster R1 = 4 Ω og R2 = 6 Ω. Hva er I_1?',
        inputs: { Itot: 10, R1: 4, R2: 6 },
        steps: [
          { latex: 'I_{1} = 10 \\cdot \\dfrac{6}{4 + 6}' },
          { latex: 'I_{1} = 10 \\cdot 0{,}6' },
          { latex: 'I_{1} = 6\\ \\mathrm{A}' },
        ],
        answer: 'I_1 = 6 A — den minste motstanden trekker mest.',
      },
    ],
    related: ['spenningsdeling', 'parallell-motstand'],
    keywords: ['strømdeler', 'parallell', 'fordeling', 'shunt'],
  },

  // --- RESISTIVITET ----------------------------------------------------
  {
    id: 'resistivitet',
    category: 'likestrom',
    title: 'Motstand i leder (lengde og tverrsnitt)',
    subtitle: 'R = ρ · l / A',
    latex: 'R = \\dfrac{\\rho \\cdot l}{A}',
    description:
      'Motstanden i en leder avhenger av resistiviteten til materialet (ρ), lederens lengde (l) og tverrsnittsareal (A). For kobber er ρ ≈ 0,0175 Ω·mm²/m og for aluminium ≈ 0,028 Ω·mm²/m.',
    whenToUse:
      'For å beregne ledermotstand i kabler — grunnlaget for å regne spenningsfall i installasjoner. Også for å sammenligne kobber vs. aluminium.',
    inputs: [
      { symbol: 'rho', name: 'Resistivitet (ρ)', unit: 'Ω·mm²/m', defaultValue: 0.0175, hint: 'Kobber: 0,0175. Aluminium: 0,028.', min: 0 },
      { symbol: 'l', name: 'Lederlengde', unit: 'm', defaultValue: 50, hint: 'Lengde fra kilde til last (én vei).', min: 0 },
      { symbol: 'A', name: 'Tverrsnitt', unit: 'mm²', defaultValue: 2.5, hint: 'Vanlige verdier: 1,5 — 2,5 — 4 — 6 — 10 — 16 mm².', min: 0 },
    ],
    output: { symbol: 'R', name: 'Motstand', unit: 'Ω', decimals: 4 },
    calculate: ({ rho, l, A }) => {
      if (A <= 0) throw new Error('Tverrsnitt må være større enn 0 mm².');
      return (rho * l) / A;
    },
    examples: [
      {
        scenario: 'En kobberleder er 50 m lang og har tverrsnitt 2,5 mm². Hva er motstanden?',
        inputs: { rho: 0.0175, l: 50, A: 2.5 },
        steps: [
          { latex: 'R = \\dfrac{\\rho \\cdot l}{A}' },
          { latex: 'R = \\dfrac{0{,}0175 \\cdot 50}{2{,}5} = \\dfrac{0{,}875}{2{,}5}' },
          { latex: 'R = 0{,}35\\ \\Omega' },
        ],
        answer: 'R = 0,35 Ω',
      },
    ],
    related: ['tverrsnitt-fra-motstand', 'lengde-fra-motstand', 'temperatur-motstand', 'effekt-i2r'],
    keywords: ['resistivitet', 'rho', 'kobber', 'aluminium', 'leder', 'kabellengde'],
  },

  {
    id: 'tverrsnitt-fra-motstand',
    category: 'likestrom',
    title: 'Tverrsnitt fra ønsket motstand',
    subtitle: 'A = ρ · l / R',
    latex: 'A = \\dfrac{\\rho \\cdot l}{R}',
    description:
      'Omvendt form av R = ρ·l/A. Når du har gitt lengde og maksimalt tillatt motstand, finner du nødvendig tverrsnitt. Rundes opp til nærmeste standard-tverrsnitt (1,5 — 2,5 — 4 — 6 — 10 — 16 — 25 mm²).',
    whenToUse:
      'For å dimensjonere kabel når du har en motstandsgrense — typisk fra et spenningsfallkrav eller termisk grense. Også når du sammenligner Cu vs. Al for samme R-grense.',
    inputs: [
      { symbol: 'rho', name: 'Resistivitet (ρ)', unit: 'Ω·mm²/m', defaultValue: 0.0175, hint: 'Kobber: 0,0175. Aluminium: 0,028.', min: 0 },
      { symbol: 'l', name: 'Lederlengde', unit: 'm', defaultValue: 100, hint: 'Lengde én vei fra kilde til last.', min: 0 },
      { symbol: 'R', name: 'Maks tillatt motstand', unit: 'Ω', defaultValue: 0.5, hint: 'Grenseverdi for hele lederen.', min: 0 },
    ],
    output: { symbol: 'A', name: 'Nødvendig tverrsnitt', unit: 'mm²', decimals: 3 },
    calculate: ({ rho, l, R }) => {
      if (R <= 0) throw new Error('Motstand må være større enn 0 Ω.');
      return (rho * l) / R;
    },
    interpret: (result) => {
      const standard = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
      const next = standard.find((s) => s >= result);
      if (!next) {
        return {
          status: 'warning',
          message: `Beregnet tverrsnitt ${result.toFixed(2)} mm² er over største standard (240 mm²). Vurder parallelle ledere eller annet materiale.`,
        };
      }
      return {
        status: 'ok',
        message: `Bruk neste standardtverrsnitt: ${next} mm² (beregnet ${result.toFixed(2)} mm²).`,
      };
    },
    examples: [
      {
        scenario:
          'En kobberleder skal være maks 100 m lang og ha maks 0,5 Ω motstand. Hvilket tverrsnitt trengs?',
        inputs: { rho: 0.0175, l: 100, R: 0.5 },
        steps: [
          { latex: 'A = \\dfrac{\\rho \\cdot l}{R}' },
          { latex: 'A = \\dfrac{0{,}0175 \\cdot 100}{0{,}5} = \\dfrac{1{,}75}{0{,}5}' },
          { latex: 'A = 3{,}5\\ \\mathrm{mm^{2}} \\rightarrow \\text{velg 4 mm}^{2}' },
        ],
        answer: 'A ≈ 3,5 mm² → bruk 4 mm² (nærmeste standard).',
      },
      {
        scenario:
          'Aluminium-tilførsel 80 m, maks 0,3 Ω. Hvilket tverrsnitt trengs?',
        inputs: { rho: 0.028, l: 80, R: 0.3 },
        steps: [
          { latex: 'A = \\dfrac{0{,}028 \\cdot 80}{0{,}3}' },
          { latex: 'A \\approx 7{,}47\\ \\mathrm{mm^{2}} \\rightarrow \\text{velg 10 mm}^{2}' },
        ],
        answer: 'A ≈ 7,47 mm² → bruk 10 mm² Al.',
      },
    ],
    related: ['resistivitet', 'lengde-fra-motstand', 'spenningsfall-enfase-forenklet'],
    keywords: ['tverrsnitt', 'dimensjonering', 'kobber', 'aluminium', 'mm²'],
  },
  {
    id: 'lengde-fra-motstand',
    category: 'likestrom',
    title: 'Maks lederlengde fra motstandsgrense',
    subtitle: 'l = R · A / ρ',
    latex: 'l = \\dfrac{R \\cdot A}{\\rho}',
    description:
      'Hvor langt du kan legge en kabel før motstanden overstiger en gitt grense. Nyttig for å sjekke om en installasjon kan strekke seg dit du planlegger, eller om du må øke tverrsnittet.',
    whenToUse:
      'Når tverrsnittet er gitt og du må vite hvor langt kabelen kan være. Typisk for å sammenligne mot fysisk avstand i en bygning.',
    inputs: [
      { symbol: 'R', name: 'Maks tillatt motstand', unit: 'Ω', defaultValue: 0.5, hint: 'Grenseverdi for hele lederen.', min: 0 },
      { symbol: 'A', name: 'Tverrsnitt', unit: 'mm²', defaultValue: 2.5, hint: 'Vanlige verdier: 1,5 — 2,5 — 4 — 6 — 10 — 16 mm².', min: 0 },
      { symbol: 'rho', name: 'Resistivitet (ρ)', unit: 'Ω·mm²/m', defaultValue: 0.0175, hint: 'Kobber: 0,0175. Aluminium: 0,028.', min: 0 },
    ],
    output: { symbol: 'l', name: 'Maks lederlengde', unit: 'm', decimals: 2 },
    calculate: ({ R, A, rho }) => {
      if (rho <= 0) throw new Error('Resistivitet må være > 0.');
      return (R * A) / rho;
    },
    examples: [
      {
        scenario:
          'Du har 2,5 mm² kobberkabel og kan ikke overskride 0,5 Ω motstand. Hvor lang kan kabelen være?',
        inputs: { R: 0.5, A: 2.5, rho: 0.0175 },
        steps: [
          { latex: 'l = \\dfrac{R \\cdot A}{\\rho}' },
          { latex: 'l = \\dfrac{0{,}5 \\cdot 2{,}5}{0{,}0175} = \\dfrac{1{,}25}{0{,}0175}' },
          { latex: 'l \\approx 71{,}4\\ \\mathrm{m}' },
        ],
        answer: 'l ≈ 71,4 m maks.',
      },
      {
        scenario:
          'Samme krav (0,5 Ω) med 4 mm² aluminium. Hvor lang?',
        inputs: { R: 0.5, A: 4, rho: 0.028 },
        steps: [
          { latex: 'l = \\dfrac{0{,}5 \\cdot 4}{0{,}028}' },
          { latex: 'l \\approx 71{,}4\\ \\mathrm{m}' },
        ],
        answer: 'l ≈ 71,4 m — sammenlignbart fordi Al-tverrsnittet er større.',
      },
    ],
    related: ['resistivitet', 'tverrsnitt-fra-motstand', 'spenningsfall-enfase-forenklet'],
    keywords: ['lengde', 'kabellengde', 'maks lengde', 'leder'],
  },

  // --- TEMPERATUR ------------------------------------------------------
  {
    id: 'temperatur-motstand',
    category: 'likestrom',
    title: 'Motstand ved temperaturendring',
    subtitle: 'R₂ = R₁ · (1 + α · ΔT)',
    latex: 'R_{2} = R_{1} \\cdot (1 + \\alpha \\cdot \\Delta T)',
    description:
      'Motstand endrer seg med temperatur. For metaller (positiv α) øker motstanden når temperaturen øker. For kobber er α ≈ 0,004 /°C. ΔT er temperaturendringen fra referansen.',
    whenToUse:
      'Når du skal beregne hvor mye motstanden i en leder eller komponent endres ved oppvarming (f.eks. ved kortslutning eller varm omgivelse).',
    inputs: [
      { symbol: 'R1', name: 'Motstand ved start', unit: 'Ω', defaultValue: 10, min: 0 },
      { symbol: 'alpha', name: 'Temperaturkoeff. (α)', unit: '/°C', defaultValue: 0.004, hint: 'Kobber: 0,004. Aluminium: 0,004. Jern: 0,005.', min: 0 },
      { symbol: 'dT', name: 'Temperaturendring (ΔT)', unit: '°C', defaultValue: 40, hint: 'Forskjell fra referansetemperatur (typisk 20 °C).' },
    ],
    output: { symbol: 'R₂', name: 'Ny motstand', unit: 'Ω', decimals: 3 },
    calculate: ({ R1, alpha, dT }) => R1 * (1 + alpha * dT),
    examples: [
      {
        scenario: 'En kobberleder har 10 Ω ved 20 °C. Hva blir motstanden ved 60 °C? (α = 0,004 /°C)',
        inputs: { R1: 10, alpha: 0.004, dT: 40 },
        steps: [
          { latex: 'R_{2} = R_{1} \\cdot (1 + \\alpha \\cdot \\Delta T)' },
          { latex: 'R_{2} = 10 \\cdot (1 + 0{,}004 \\cdot 40)' },
          { latex: 'R_{2} = 10 \\cdot 1{,}16 = 11{,}6\\ \\Omega' },
        ],
        answer: 'R₂ = 11,6 Ω',
      },
    ],
    related: ['resistivitet'],
    keywords: ['temperatur', 'alpha', 'oppvarming'],
    relevans: 'sjelden',
  },

  // --- INDRE MOTSTAND --------------------------------------------------
  {
    id: 'indre-motstand',
    category: 'likestrom',
    title: 'Klemmespenning og indre motstand',
    subtitle: 'U = E − I · Rᵢ',
    latex: 'U_{\\mathrm{klemme}} = E - I \\cdot R_{i}',
    description:
      'En spenningskilde har en indre motstand (Rᵢ). Når den belastes, faller klemmespenningen fordi en del av EMK-en (E) går til å overvinne indre motstand. Ubelastet er klemmespenningen lik EMK-en.',
    whenToUse:
      'For batterier, generatorer og strømforsyninger — for å forstå hvorfor spenningen synker når strømmen øker. Også for å regne ut tomgangsspenning fra målte verdier.',
    inputs: [
      { symbol: 'E', name: 'EMK (tomgangsspenning)', unit: 'V', defaultValue: 12, min: 0 },
      { symbol: 'I', name: 'Lastestrøm', unit: 'A', defaultValue: 5, min: 0 },
      { symbol: 'Ri', name: 'Indre motstand', unit: 'Ω', defaultValue: 0.2, min: 0 },
    ],
    output: { symbol: 'U', name: 'Klemmespenning', unit: 'V', decimals: 3 },
    calculate: ({ E, I, Ri }) => E - I * Ri,
    examples: [
      {
        scenario: 'Et batteri har EMK 12 V og indre motstand 0,2 Ω. Det belastes med 5 A. Hva blir klemmespenningen?',
        inputs: { E: 12, I: 5, Ri: 0.2 },
        steps: [
          { latex: 'U = E - I \\cdot R_{i}' },
          { latex: 'U = 12 - 5 \\cdot 0{,}2 = 12 - 1{,}0' },
          { latex: 'U = 11{,}0\\ \\mathrm{V}' },
        ],
        answer: 'U = 11,0 V',
      },
    ],
    related: ['ohms-lov-stromme'],
    keywords: ['EMK', 'batteri', 'klemmespenning', 'indre motstand'],
    relevans: 'sjelden',
  },
];
