import type { Formula } from './types';

export const KABEL_FORMULAS: Formula[] = [
  {
    id: 'belastningsstrom-korreksjon',
    category: 'kabel',
    title: 'Korrigert belastningsstrøm (I_z)',
    subtitle: 'I_z = I_t · k₁ · k₂ · k₃',
    latex: 'I_{z} = I_{t} \\cdot k_{1} \\cdot k_{2} \\cdot k_{3}',
    description:
      'I_t er kabelens tabellverdi for belastningsstrøm (NEK 400 tabell B.52). Korreksjonsfaktorene justerer for omgivelsestemperatur (k₁), gruppering (k₂) og leggemåte (k₃). I_z er den faktiske tillatte belastningen i installasjonen.',
    whenToUse:
      'Når du dimensjonerer kabel for en kurs der forholdene ikke er standard — varm omgivelse, flere kabler sammen, eller spesielle installasjonsmetoder.',
    inputs: [
      { symbol: 'It', name: 'Tabellverdi (I_t)', unit: 'A', defaultValue: 30, hint: 'Fra NEK 400 tabell B.52, ved 30 °C og enkelt kabel.', min: 0 },
      { symbol: 'k1', name: 'k₁ – temperatur', unit: '', defaultValue: 1.0, hint: 'PVC 30°C: 1,0. 40°C: 0,87. 50°C: 0,71.', min: 0 },
      { symbol: 'k2', name: 'k₂ – gruppering', unit: '', defaultValue: 1.0, hint: '2 kabler: 0,80. 3 kabler: 0,70. 4: 0,65.', min: 0 },
      { symbol: 'k3', name: 'k₃ – leggemåte', unit: '', defaultValue: 1.0, hint: 'Sett 1,0 hvis ikke spesielt forhold.', min: 0 },
    ],
    output: { symbol: 'I_z', name: 'Tillatt belastning', unit: 'A', decimals: 2 },
    calculate: ({ It, k1, k2, k3 }) => It * k1 * k2 * k3,
    examples: [
      {
        scenario: 'En 4 mm² kabel (I_t = 32 A) ligger sammen med 2 andre i 40 °C omgivelse. Hva er I_z?',
        inputs: { It: 32, k1: 0.87, k2: 0.7, k3: 1.0 },
        steps: [
          { latex: 'I_{z} = 32 \\cdot 0{,}87 \\cdot 0{,}7 \\cdot 1{,}0' },
          { latex: 'I_{z} \\approx 19{,}5\\ \\mathrm{A}' },
        ],
        answer: 'I_z ≈ 19,5 A — vern må være ≤ 19,5 A.',
      },
    ],
    related: ['vern-mot-overlast'],
    keywords: ['belastningsstrøm', 'korreksjon', 'NEK', 'kabel'],
    source: 'NEK 400 tabell B.52',
  },
  {
    id: 'vern-mot-overlast',
    category: 'kabel',
    title: 'Vern mot overlast — sjekk',
    subtitle: 'I_b ≤ I_n ≤ I_z',
    latex: 'I_{b} \\leq I_{n} \\leq I_{z}',
    description:
      'Beregningsstrømmen I_b må være mindre eller lik vernet I_n, som igjen må være mindre eller lik kabelens tillatte belastning I_z. Dette er grunnregelen for overlastbeskyttelse i NEK 400-4-43.',
    whenToUse:
      'På alle kurser — som kontroll på at vern og kabel er korrekt valgt. Hvis enten I_b > I_n eller I_n > I_z er noe galt.',
    inputs: [
      { symbol: 'Ib', name: 'Beregningsstrøm (I_b)', unit: 'A', defaultValue: 16, hint: 'Forventet driftsstrøm.', min: 0 },
      { symbol: 'In', name: 'Vernets merkestrøm (I_n)', unit: 'A', defaultValue: 16, min: 0 },
      { symbol: 'Iz', name: 'Kabelens I_z', unit: 'A', defaultValue: 19.5, min: 0 },
    ],
    output: { symbol: 'OK?', name: 'Margin (I_z − I_n)', unit: 'A', decimals: 2 },
    calculate: ({ Ib, In, Iz }) => {
      if (Ib > In) throw new Error(`I_b (${Ib} A) > I_n (${In} A). Vernet er for lite.`);
      if (In > Iz) throw new Error(`I_n (${In} A) > I_z (${Iz} A). Kabelen er for tynn.`);
      return Iz - In;
    },
    examples: [
      {
        scenario: 'I_b = 16 A, vern = 16 A, kabel I_z = 19,5 A. Er kursen korrekt dimensjonert?',
        inputs: { Ib: 16, In: 16, Iz: 19.5 },
        steps: [
          { latex: 'I_{b} = 16 \\leq I_{n} = 16 \\leq I_{z} = 19{,}5' },
          { latex: '\\text{Margin: } 19{,}5 - 16 = 3{,}5\\ \\mathrm{A}' },
        ],
        answer: 'OK — margin på 3,5 A.',
      },
    ],
    related: ['belastningsstrom-korreksjon', 'smelteintegral'],
    keywords: ['overlast', 'kabel', 'vern', 'kontroll'],
    source: 'NEK 400-4-43',
  },
  {
    id: 'krav-1-overlast',
    category: 'kabel',
    title: 'Krav 1 — sikringen er stor nok',
    subtitle: 'I_b ≤ I_n',
    latex: 'I_{b} \\leq I_{n}',
    description:
      'Krav 1 sjekker én ting: at belastningsstrømmen som faktisk går i kursen er mindre eller lik sikringens merkestrøm. Hvis den ikke er det, vil sikringen løse ut under normal drift.',
    whenToUse:
      'Første sjekk når du dimensjonerer en kurs. Beregn I_b fra effekten (P/U for 1-fas, P/(U·1,73) for 3-fas), så velg nærmeste standardstørrelse over som I_n.',
    inputs: [
      { symbol: 'Ib', name: 'Belastningsstrøm (I_b)', unit: 'A', defaultValue: 8.7, hint: 'Strømmen i kursen ved normal drift. Beregn fra P/U eller P/(U·1,73).', min: 0 },
      { symbol: 'In', name: 'Vernets merkestrøm (I_n)', unit: 'A', defaultValue: 10, hint: 'Standardrekke: 10, 13, 15, 16, 20, 25, 32, 40, 50, 63 A.', min: 0 },
    ],
    output: { symbol: 'I_n − I_b', name: 'Margin', unit: 'A', decimals: 2 },
    calculate: ({ Ib, In }) => {
      if (Ib > In) throw new Error(`Krav 1 brutt: I_b (${Ib} A) > I_n (${In} A). Velg større sikring.`);
      return In - Ib;
    },
    examples: [
      {
        scenario: 'Varmeovn 2000 W, 230 V. Hva er minste sikring du kan bruke?',
        inputs: { Ib: 8.7, In: 10 },
        steps: [
          { latex: 'I_{b} = 2000/230 = 8{,}7\\ \\mathrm{A}' },
          { latex: '8{,}7 \\leq 10\\ \\Rightarrow\\ \\text{OK}' },
        ],
        answer: 'OK — 10 A sikring holder. Margin: 1,3 A.',
      },
      {
        scenario: 'Kurs på 16 A sikring trekker 18 A belastningsstrøm.',
        inputs: { Ib: 18, In: 16 },
        steps: [
          { latex: '18 > 16\\ \\Rightarrow\\ \\text{IKKE OK}' },
        ],
        answer: 'Krav 1 brutt — sikringen vil løse ut under drift. Øk til 20 A.',
      },
    ],
    related: ['krav-2-automatsikring', 'krav-2-gg-smelte', 'designstrom-enfase', 'belastningsstrom-korreksjon'],
    keywords: ['Krav 1', 'sikring', 'merkestrøm', 'Ib', 'In', 'overlast', 'NEK', 'automat', 'MCB', 'bolig'],
    source: 'NEK 400:2014 823.433.1',
  },
  {
    id: 'krav-2-automatsikring',
    category: 'kabel',
    title: 'Krav 2 — kabelen tåler utløserstrømmen (automat)',
    subtitle: 'I_2 ≤ I_z',
    latex: 'I_{2} \\leq I_{z}',
    description:
      'Krav 2 sjekker én ting: at strømmen sikringen garantert løser ut på (I_2) ikke er større enn det kabelen tåler (I_z). I_2 er fra leverandørens datablad — som regel faktor · I_n. Standard MCB: 1,45. ABB CK: 1,2. Eaton OL / Chint K: 1,3.',
    whenToUse:
      'Andre sjekk etter krav 1. Slå opp I_z i NEK 400 tabell 52B-2 (åpen, skjult, kanal…) og bruk leverandørens faktor for sikringen du har valgt.',
    inputs: [
      { symbol: 'In', name: 'Sikringens størrelse (I_n)', unit: 'A', defaultValue: 16, hint: 'Fra krav 1.', min: 0 },
      { symbol: 'Iz', name: 'Kabelens strømføringsevne (I_z)', unit: 'A', defaultValue: 19.5, hint: 'Fra NEK 400 tabell 52B-2 + korreksjon.', min: 0 },
      { symbol: 'faktor', name: 'Prøvestrømsfaktor', unit: '', defaultValue: 1.45, hint: 'Standard MCB: 1,45 · ABB CK: 1,2 · Eaton OL / Chint K: 1,3', min: 1.0, max: 2.0 },
    ],
    output: { symbol: 'I_2', name: 'Utløserstrøm', unit: 'A', decimals: 2 },
    calculate: ({ In, Iz, faktor }) => {
      const I2 = faktor * In;
      if (I2 > Iz) throw new Error(`Krav 2 brutt: I_2 (${I2.toFixed(2)} A) > I_z (${Iz.toFixed(2)} A). Velg automat med lavere faktor (CK/OL), reduser vern eller øk kabel.`);
      return I2;
    },
    examples: [
      {
        scenario: '2,5 mm² i åpen installasjon (C), vanlig 16 A MCB med faktor 1,45.',
        inputs: { In: 16, Iz: 27, faktor: 1.45 },
        steps: [
          { latex: 'I_{2} = 1{,}45 \\cdot 16 = 23{,}2\\ \\mathrm{A}' },
          { latex: 'I_{z} = 27\\ \\mathrm{A}\\ (\\text{tabell 52B-2, C})' },
          { latex: '23{,}2 \\leq 27\\ \\Rightarrow\\ \\text{OK}' },
        ],
        answer: 'Krav 2 OK — 1,5 mm² ville feilet samme test.',
      },
      {
        scenario: '2,5 mm² i skjult installasjon (A1) med vanlig 16 A MCB — det klassiske problemet.',
        inputs: { In: 16, Iz: 19.5, faktor: 1.45 },
        steps: [
          { latex: 'I_{2} = 1{,}45 \\cdot 16 = 23{,}2\\ \\mathrm{A}' },
          { latex: 'I_{z} = 19{,}5\\ \\mathrm{A}\\ (\\text{tabell 52B-2, A1})' },
          { latex: '23{,}2 > 19{,}5\\ \\Rightarrow\\ \\text{IKKE OK}' },
        ],
        answer: 'Krav 2 brutt: bruk ABB CK (faktor 1,2) eller Eaton OL (1,3) — eller øk til 4 mm².',
      },
      {
        scenario: 'Samme kabel og vern som over, men med ABB CK-automat (faktor 1,2).',
        inputs: { In: 16, Iz: 19.5, faktor: 1.2 },
        steps: [
          { latex: 'I_{2} = 1{,}2 \\cdot 16 = 19{,}2\\ \\mathrm{A}' },
          { latex: '19{,}2 \\leq 19{,}5\\ \\Rightarrow\\ \\text{OK (knapp margin)}' },
        ],
        answer: 'CK-automat løser det — derfor finnes egne 2,5 mm² A1-automater.',
      },
    ],
    related: ['krav-1-overlast', 'krav-2-gg-smelte'],
    keywords: ['Krav 2', 'automat', 'automatsikring', 'MCB', 'I2', '1,45', 'bolig', 'CK', 'OL', 'sikring'],
    source: 'NEK 400:2014 823.433.1',
  },
  {
    id: 'krav-2-gg-smelte',
    category: 'kabel',
    title: 'Krav 2 — kabelen tåler utløserstrømmen (gG)',
    subtitle: 'I_2 ≤ I_z',
    latex: 'I_{2} \\leq I_{z}',
    description:
      'Samme sjekk som for automat, men gG-smeltesikringer har fast faktor på 1,6. Det er strengere enn de fleste automater, så gG faller oftere på krav 2.',
    whenToUse:
      'Når kursen sikres med smeltesikring (gG-karakteristikk) i stedet for automat. Sjekkes alltid — faktor 1,6 gir mindre margin enn automat.',
    inputs: [
      { symbol: 'In', name: 'Sikringens størrelse (I_n)', unit: 'A', defaultValue: 16, hint: 'Fra krav 1.', min: 0 },
      { symbol: 'Iz', name: 'Kabelens strømføringsevne (I_z)', unit: 'A', defaultValue: 27, hint: 'Fra NEK 400 tabell 52B-2 + korreksjon.', min: 0 },
    ],
    output: { symbol: 'I_2', name: 'Utløserstrøm', unit: 'A', decimals: 2 },
    calculate: ({ In, Iz }) => {
      const I2 = 1.6 * In;
      if (I2 > Iz) throw new Error(`Krav 2 brutt (gG): I_2 (${I2.toFixed(2)} A) > I_z (${Iz.toFixed(2)} A). Du må øke kabel eller bytte til MCB med lavere faktor.`);
      return I2;
    },
    examples: [
      {
        scenario: 'gG 10 A med 1,5 mm² i åpen installasjon (C), I_z = 19,5 A.',
        inputs: { In: 10, Iz: 19.5 },
        steps: [
          { latex: 'I_{2} = 1{,}6 \\cdot 10 = 16\\ \\mathrm{A}' },
          { latex: '16 \\leq 19{,}5\\ \\Rightarrow\\ \\text{OK}' },
        ],
        answer: 'Krav 2 OK — gG 10 A passer fint på 1,5 mm² åpent.',
      },
      {
        scenario: 'gG 16 A med 2,5 mm² i åpen installasjon (C), I_z = 27 A.',
        inputs: { In: 16, Iz: 27 },
        steps: [
          { latex: 'I_{2} = 1{,}6 \\cdot 16 = 25{,}6\\ \\mathrm{A}' },
          { latex: '25{,}6 \\leq 27\\ \\Rightarrow\\ \\text{OK}' },
        ],
        answer: 'Krav 2 OK — men marginal. Skjult (I_z=19,5 A) ville feilet.',
      },
      {
        scenario: 'gG 16 A med 2,5 mm² i skjult installasjon (A1), I_z = 19,5 A.',
        inputs: { In: 16, Iz: 19.5 },
        steps: [
          { latex: 'I_{2} = 1{,}6 \\cdot 16 = 25{,}6\\ \\mathrm{A}' },
          { latex: '25{,}6 > 19{,}5\\ \\Rightarrow\\ \\text{IKKE OK}' },
        ],
        answer: 'Krav 2 brutt: bruk MCB med lavere faktor, eller øk til 4 mm².',
      },
    ],
    related: ['krav-1-overlast', 'krav-2-automatsikring'],
    keywords: ['Krav 2', 'gG', 'smeltesikring', 'smelte', 'I2', '1,6', 'bolig', 'sikring'],
    source: 'NEK 400:2014 823.433.1',
  },
];
