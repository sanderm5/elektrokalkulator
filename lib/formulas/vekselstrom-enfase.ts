import type { Formula } from './types';

export const VEKSELSTROM_FORMULAS: Formula[] = [
  // --- FREKVENS / PERIODE ----------------------------------------------
  {
    id: 'periode-frekvens',
    category: 'vekselstrom',
    title: 'Periode fra frekvens',
    subtitle: 'T = 1 / f',
    latex: 'T = \\dfrac{1}{f}',
    description:
      'Periodetiden T er den tiden det tar for én hel svingning. Den er den omvendte av frekvensen. I Norge er nettfrekvensen 50 Hz, så T = 20 ms.',
    whenToUse:
      'Når du jobber med vekselstrømsignaler, oscilloskop-måling eller skal beregne reaktans/impedans for en kjent frekvens.',
    inputs: [
      { symbol: 'f', name: 'Frekvens', unit: 'Hz', defaultValue: 50, hint: 'Norsk nettfrekvens: 50 Hz.', min: 0 },
    ],
    output: { symbol: 'T', name: 'Periode', unit: 's', decimals: 6 },
    calculate: ({ f }) => {
      if (f <= 0) throw new Error('Frekvens må være større enn 0 Hz.');
      return 1 / f;
    },
    examples: [
      {
        scenario: 'Hva er periodetiden ved nettfrekvens 50 Hz?',
        inputs: { f: 50 },
        steps: [
          { latex: 'T = \\dfrac{1}{f} = \\dfrac{1}{50}' },
          { latex: 'T = 0{,}02\\ \\mathrm{s} = 20\\ \\mathrm{ms}' },
        ],
        answer: 'T = 20 ms',
      },
    ],
    related: ['vinkelfrekvens'],
    keywords: ['periode', 'frekvens', 'hz', 'tid'],
  },
  {
    id: 'vinkelfrekvens',
    category: 'vekselstrom',
    title: 'Vinkelfrekvens',
    subtitle: 'ω = 2π · f',
    latex: '\\omega = 2\\pi \\cdot f',
    description:
      'Vinkelfrekvensen ω (omega) sier hvor mange radianer signalet svinger seg gjennom per sekund. Brukes når vi beregner reaktans og impedans, og når vekselspenningen skrives som u(t) = Û·sin(ωt).',
    whenToUse:
      'Når du skal beregne induktiv reaktans X_L = ωL eller kapasitiv reaktans X_C = 1/(ωC). Også relevant for resonans og fase.',
    inputs: [
      { symbol: 'f', name: 'Frekvens', unit: 'Hz', defaultValue: 50, min: 0 },
    ],
    output: { symbol: 'ω', name: 'Vinkelfrekvens', unit: 'rad/s', decimals: 3 },
    calculate: ({ f }) => 2 * Math.PI * f,
    examples: [
      {
        scenario: 'Hva er vinkelfrekvensen ved 50 Hz?',
        inputs: { f: 50 },
        steps: [
          { latex: '\\omega = 2\\pi \\cdot 50' },
          { latex: '\\omega \\approx 314{,}16\\ \\mathrm{rad/s}' },
        ],
        answer: 'ω ≈ 314,16 rad/s',
      },
    ],
    related: ['periode-frekvens', 'reaktans-spole', 'reaktans-kondensator'],
    keywords: ['omega', 'vinkelfrekvens', 'rad/s'],
  },

  // --- EFFEKTIVVERDI ---------------------------------------------------
  {
    id: 'effektivverdi-fra-topp',
    category: 'vekselstrom',
    title: 'Effektivverdi fra toppverdi',
    subtitle: 'U = Û / √2',
    latex: 'U = \\dfrac{\\hat{U}}{\\sqrt{2}}',
    description:
      'Effektivverdien (RMS) av en sinusformet vekselspenning er toppverdien delt på √2. Effektivverdien er det som måles med multimeter og det som gir samme varmeeffekt som tilsvarende likestrøm.',
    whenToUse:
      'Når du leser toppverdi fra et oscilloskop og skal omregne til RMS-verdi som brukes i alle effektberegninger.',
    inputs: [
      { symbol: 'Uhatt', name: 'Toppverdi (Û)', unit: 'V', defaultValue: 325, hint: 'Toppverdien til 230 V RMS er ca. 325 V.', min: 0 },
    ],
    output: { symbol: 'U', name: 'Effektivverdi (RMS)', unit: 'V', decimals: 3 },
    calculate: ({ Uhatt }) => Uhatt / Math.SQRT2,
    examples: [
      {
        scenario: 'Et oscilloskop viser toppverdi 325 V. Hva er effektivverdien?',
        inputs: { Uhatt: 325 },
        steps: [
          { latex: 'U = \\dfrac{\\hat{U}}{\\sqrt{2}} = \\dfrac{325}{1{,}414}' },
          { latex: 'U \\approx 229{,}8\\ \\mathrm{V}' },
        ],
        answer: 'U ≈ 230 V',
      },
    ],
    related: [],
    keywords: ['RMS', 'effektivverdi', 'toppverdi', 'sinus'],
  },

  // --- REAKTANS --------------------------------------------------------
  {
    id: 'reaktans-spole',
    category: 'vekselstrom',
    title: 'Induktiv reaktans (spole)',
    subtitle: 'X_L = 2π · f · L',
    latex: 'X_{L} = 2\\pi \\cdot f \\cdot L',
    description:
      'Induktiv reaktans er motstanden en spole gir mot vekselstrøm. Den øker med frekvensen og med induktansen L. Måles i ohm, men forskyver strømmen 90° bak spenningen.',
    whenToUse:
      'For å beregne impedansen i kretser med spoler — motorviklinger, transformatorer, kontaktorspoler, dimmer-induktanser.',
    inputs: [
      { symbol: 'f', name: 'Frekvens', unit: 'Hz', defaultValue: 50, min: 0 },
      { symbol: 'L', name: 'Induktans', unit: 'H', defaultValue: 0.1, hint: 'Induktans i henry. 100 mH = 0,1 H.', min: 0 },
    ],
    output: { symbol: 'X_L', name: 'Induktiv reaktans', unit: 'Ω', decimals: 3 },
    calculate: ({ f, L }) => 2 * Math.PI * f * L,
    examples: [
      {
        scenario: 'En spole har induktans 100 mH og kobles til 50 Hz. Hva er reaktansen?',
        inputs: { f: 50, L: 0.1 },
        steps: [
          { latex: 'X_{L} = 2\\pi \\cdot f \\cdot L' },
          { latex: 'X_{L} = 2\\pi \\cdot 50 \\cdot 0{,}1' },
          { latex: 'X_{L} \\approx 31{,}4\\ \\Omega' },
        ],
        answer: 'X_L ≈ 31,4 Ω',
      },
    ],
    related: ['reaktans-kondensator', 'impedans-rl'],
    keywords: ['reaktans', 'spole', 'induktans', 'XL'],
  },
  {
    id: 'reaktans-kondensator',
    category: 'vekselstrom',
    title: 'Kapasitiv reaktans (kondensator)',
    subtitle: 'X_C = 1 / (2π · f · C)',
    latex: 'X_{C} = \\dfrac{1}{2\\pi \\cdot f \\cdot C}',
    description:
      'Kapasitiv reaktans er motstanden en kondensator gir mot vekselstrøm. Den synker med frekvensen — høyere frekvens, lavere motstand. Måles i ohm, strømmen ligger 90° foran spenningen.',
    whenToUse:
      'For fasekompensering, filtre, og analyse av RC-kretser. Også sentralt for å beregne kapasitansen som trengs for å heve cos φ.',
    inputs: [
      { symbol: 'f', name: 'Frekvens', unit: 'Hz', defaultValue: 50, min: 0 },
      { symbol: 'C', name: 'Kapasitans', unit: 'F', defaultValue: 0.00001, hint: 'I farad. 10 µF = 0,00001 F.', min: 0 },
    ],
    output: { symbol: 'X_C', name: 'Kapasitiv reaktans', unit: 'Ω', decimals: 3 },
    calculate: ({ f, C }) => {
      if (f * C <= 0) throw new Error('Frekvens og kapasitans må være > 0.');
      return 1 / (2 * Math.PI * f * C);
    },
    examples: [
      {
        scenario: 'En kondensator på 10 µF kobles til 50 Hz. Hva er den kapasitive reaktansen?',
        inputs: { f: 50, C: 0.00001 },
        steps: [
          { latex: 'X_{C} = \\dfrac{1}{2\\pi \\cdot 50 \\cdot 10 \\cdot 10^{-6}}' },
          { latex: 'X_{C} \\approx 318{,}3\\ \\Omega' },
        ],
        answer: 'X_C ≈ 318,3 Ω',
      },
    ],
    related: ['reaktans-spole', 'fasekompensering'],
    keywords: ['reaktans', 'kondensator', 'XC', 'kapasitans'],
  },

  // --- IMPEDANS --------------------------------------------------------
  {
    id: 'impedans-rl',
    category: 'vekselstrom',
    title: 'Impedans i RL-krets',
    subtitle: 'Z = √(R² + X_L²)',
    latex: 'Z = \\sqrt{R^{2} + X_{L}^{2}}',
    description:
      'Den totale motstanden (impedansen) i en seriekrets med motstand og spole er hypotenusen i en rettvinklet trekant der R og X_L er katetene. Det er Pythagoras for elektrisk motstand.',
    whenToUse:
      'For motorer, viklinger og last med både resistiv og induktiv del — typisk alle reelle motorer og transformatorer.',
    inputs: [
      { symbol: 'R', name: 'Motstand', unit: 'Ω', defaultValue: 30, min: 0 },
      { symbol: 'XL', name: 'Induktiv reaktans', unit: 'Ω', defaultValue: 40, min: 0 },
    ],
    output: { symbol: 'Z', name: 'Impedans', unit: 'Ω', decimals: 3 },
    calculate: ({ R, XL }) => Math.sqrt(R * R + XL * XL),
    examples: [
      {
        scenario: 'En motor har R = 30 Ω og X_L = 40 Ω. Hva er impedansen?',
        inputs: { R: 30, XL: 40 },
        steps: [
          { latex: 'Z = \\sqrt{R^{2} + X_{L}^{2}}' },
          { latex: 'Z = \\sqrt{30^{2} + 40^{2}} = \\sqrt{900 + 1600}' },
          { latex: 'Z = \\sqrt{2500} = 50\\ \\Omega' },
        ],
        answer: 'Z = 50 Ω',
      },
    ],
    related: ['cos-phi', 'effekttrekant'],
    keywords: ['impedans', 'Z', 'RL', 'pythagoras'],
  },

  // --- COS PHI ---------------------------------------------------------
  {
    id: 'cos-phi',
    category: 'vekselstrom',
    title: 'Effektfaktor (cos φ)',
    subtitle: 'cos φ = R / Z = P / S',
    latex: '\\cos\\varphi = \\dfrac{R}{Z} = \\dfrac{P}{S}',
    description:
      'Effektfaktoren forteller hvor stor del av den tilsynelatende effekten som er aktiv (nyttig) effekt. cos φ = 1 betyr ren resistiv last, cos φ < 1 betyr induktiv eller kapasitiv komponent. Lav cos φ = mye blindstrøm.',
    whenToUse:
      'For å vurdere om en last belaster nettet effektivt. Lav cos φ gir høyere strøm enn nødvendig og krever fasekompensering. Nettleverandører kan ta ekstra betalt for cos φ < 0,9.',
    inputs: [
      { symbol: 'R', name: 'Motstand', unit: 'Ω', defaultValue: 30, min: 0 },
      { symbol: 'Z', name: 'Impedans', unit: 'Ω', defaultValue: 50, min: 0 },
    ],
    output: { symbol: 'cos φ', name: 'Effektfaktor', unit: '', decimals: 3 },
    calculate: ({ R, Z }) => {
      if (Z <= 0) throw new Error('Impedans må være større enn 0.');
      return R / Z;
    },
    examples: [
      {
        scenario: 'En motor har R = 30 Ω og Z = 50 Ω. Hva er cos φ?',
        inputs: { R: 30, Z: 50 },
        steps: [
          { latex: '\\cos\\varphi = \\dfrac{R}{Z} = \\dfrac{30}{50}' },
          { latex: '\\cos\\varphi = 0{,}6' },
        ],
        answer: 'cos φ = 0,6 (induktiv)',
      },
    ],
    related: ['impedans-rl', 'effekttrekant', 'fasekompensering'],
    keywords: ['cos phi', 'effektfaktor', 'fase'],
  },

  // --- EFFEKTTREKANT ---------------------------------------------------
  {
    id: 'aktiv-effekt-enfase',
    category: 'vekselstrom',
    title: 'Aktiv effekt — enfase',
    subtitle: 'P = U · I · cos φ',
    latex: 'P = U \\cdot I \\cdot \\cos\\varphi',
    description:
      'Aktiv effekt er den effekten som faktisk utfører nyttig arbeid (varme, lys, mekanisk arbeid). Måles i watt og er det vi betaler for via strømregningen.',
    whenToUse:
      'For alle enfase laster — varmeovner, motorer, lamper. Standard på alle enfase-effektberegninger.',
    inputs: [
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, min: 0 },
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 10, min: 0 },
      { symbol: 'cosphi', name: 'cos φ', unit: '', defaultValue: 0.85, hint: 'Mellom 0 og 1. Motor: ~0,85. Varme: 1,0.', min: 0, max: 1 },
    ],
    output: { symbol: 'P', name: 'Aktiv effekt', unit: 'W', decimals: 2 },
    calculate: ({ U, I, cosphi }) => U * I * cosphi,
    examples: [
      {
        scenario: 'En enfase motor trekker 10 A ved 230 V med cos φ = 0,85. Hva er aktiv effekt?',
        inputs: { U: 230, I: 10, cosphi: 0.85 },
        steps: [
          { latex: 'P = U \\cdot I \\cdot \\cos\\varphi' },
          { latex: 'P = 230 \\cdot 10 \\cdot 0{,}85' },
          { latex: 'P = 1955\\ \\mathrm{W}' },
        ],
        answer: 'P ≈ 1955 W',
      },
    ],
    related: ['reaktiv-effekt-enfase', 'tilsynelatende-effekt-enfase', 'effekttrekant'],
    keywords: ['aktiv effekt', 'enfase', 'P'],
  },
  {
    id: 'reaktiv-effekt-enfase',
    category: 'vekselstrom',
    title: 'Reaktiv effekt — enfase',
    subtitle: 'Q = U · I · sin φ',
    latex: 'Q = U \\cdot I \\cdot \\sin\\varphi',
    description:
      'Reaktiv effekt (blindeffekt) er energien som svinger frem og tilbake mellom kilden og en induktiv eller kapasitiv komponent. Den utfører ikke arbeid, men belaster ledningene. Måles i VAr (volt-ampere reaktiv).',
    whenToUse:
      'For å beregne hvor mye fasekompensering en induktiv last trenger. Også grunnlaget for å regne ut hva kondensatorbatteriet skal yte.',
    inputs: [
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, min: 0 },
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 10, min: 0 },
      { symbol: 'cosphi', name: 'cos φ', unit: '', defaultValue: 0.85, min: 0, max: 1 },
    ],
    output: { symbol: 'Q', name: 'Reaktiv effekt', unit: 'VAr', decimals: 2 },
    calculate: ({ U, I, cosphi }) => {
      const sinphi = Math.sqrt(1 - cosphi * cosphi);
      return U * I * sinphi;
    },
    examples: [
      {
        scenario: 'Samme motor som over (230 V, 10 A, cos φ = 0,85). Hva er reaktiv effekt?',
        inputs: { U: 230, I: 10, cosphi: 0.85 },
        steps: [
          { latex: '\\sin\\varphi = \\sqrt{1 - 0{,}85^{2}} \\approx 0{,}527' },
          { latex: 'Q = 230 \\cdot 10 \\cdot 0{,}527' },
          { latex: 'Q \\approx 1212\\ \\mathrm{VAr}' },
        ],
        answer: 'Q ≈ 1212 VAr',
      },
    ],
    related: ['aktiv-effekt-enfase', 'fasekompensering'],
    keywords: ['reaktiv', 'blindeffekt', 'Q', 'VAr'],
  },
  {
    id: 'tilsynelatende-effekt-enfase',
    category: 'vekselstrom',
    title: 'Tilsynelatende effekt — enfase',
    subtitle: 'S = U · I',
    latex: 'S = U \\cdot I',
    description:
      'Tilsynelatende effekt er produktet av effektivverdien av spenning og strøm — uavhengig av faseforskyvning. Måles i volt-ampere (VA). Forholdet mellom S, P og Q vises i effekttrekanten: S² = P² + Q².',
    whenToUse:
      'For dimensjonering av transformatorer, kabler og generatorer — disse må takle den totale strømmen, ikke bare den nyttige delen.',
    inputs: [
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, min: 0 },
      { symbol: 'I', name: 'Strøm', unit: 'A', defaultValue: 10, min: 0 },
    ],
    output: { symbol: 'S', name: 'Tilsynelatende effekt', unit: 'VA', decimals: 2 },
    calculate: ({ U, I }) => U * I,
    examples: [
      {
        scenario: 'Last trekker 10 A ved 230 V. Hva er tilsynelatende effekt?',
        inputs: { U: 230, I: 10 },
        steps: [
          { latex: 'S = U \\cdot I = 230 \\cdot 10' },
          { latex: 'S = 2300\\ \\mathrm{VA}' },
        ],
        answer: 'S = 2300 VA',
      },
    ],
    related: ['aktiv-effekt-enfase', 'reaktiv-effekt-enfase', 'effekttrekant'],
    keywords: ['tilsynelatende', 'VA', 'S'],
  },
  {
    id: 'effekttrekant',
    category: 'vekselstrom',
    title: 'Effekttrekant — finn S fra P og Q',
    subtitle: 'S = √(P² + Q²)',
    latex: 'S = \\sqrt{P^{2} + Q^{2}}',
    description:
      'Effekttrekanten knytter aktiv effekt (P), reaktiv effekt (Q) og tilsynelatende effekt (S) sammen som sidene i en rettvinklet trekant. Vinkelen mellom S og P er fasevinkelen φ.',
    whenToUse:
      'Når du har P og Q, og skal finne S. Også for å verifisere måling: hvis P og Q er målt, må S stemme.',
    inputs: [
      { symbol: 'P', name: 'Aktiv effekt', unit: 'W', defaultValue: 1955, min: 0 },
      { symbol: 'Q', name: 'Reaktiv effekt', unit: 'VAr', defaultValue: 1212, min: 0 },
    ],
    output: { symbol: 'S', name: 'Tilsynelatende effekt', unit: 'VA', decimals: 2 },
    calculate: ({ P, Q }) => Math.sqrt(P * P + Q * Q),
    examples: [
      {
        scenario: 'En last har P = 1955 W og Q = 1212 VAr. Hva er S?',
        inputs: { P: 1955, Q: 1212 },
        steps: [
          { latex: 'S = \\sqrt{1955^{2} + 1212^{2}}' },
          { latex: 'S = \\sqrt{3{,}82 \\cdot 10^{6} + 1{,}47 \\cdot 10^{6}}' },
          { latex: 'S \\approx 2300\\ \\mathrm{VA}' },
        ],
        answer: 'S ≈ 2300 VA',
      },
    ],
    related: ['aktiv-effekt-enfase', 'reaktiv-effekt-enfase', 'tilsynelatende-effekt-enfase'],
    keywords: ['effekttrekant', 'S', 'pythagoras'],
  },

  // --- FASEKOMPENSERING -----------------------------------------------
  {
    id: 'fasekompensering',
    category: 'vekselstrom',
    title: 'Kondensator for fasekompensering',
    subtitle: 'C = Q_C / (2π · f · U²)',
    latex: 'C = \\dfrac{Q_{C}}{2\\pi \\cdot f \\cdot U^{2}}',
    description:
      'For å heve cos φ fra cos φ₁ til cos φ₂ må vi tilføre kapasitiv reaktiv effekt Q_C = P · (tan φ₁ − tan φ₂). Kondensatoren som gir denne Q_C beregnes ut fra spenning, frekvens og ønsket Q_C.',
    whenToUse:
      'Når en bedrift får gebyr for lav cos φ (typisk < 0,9), og du skal dimensjonere kondensatorbatteri for å heve den.',
    inputs: [
      { symbol: 'Qc', name: 'Trengt blindeffekt (Q_C)', unit: 'VAr', defaultValue: 700, hint: 'Forskjellen i Q før og etter komp.', min: 0 },
      { symbol: 'f', name: 'Frekvens', unit: 'Hz', defaultValue: 50, min: 0 },
      { symbol: 'U', name: 'Spenning', unit: 'V', defaultValue: 230, min: 0 },
    ],
    output: { symbol: 'C', name: 'Kapasitans', unit: 'F', decimals: 8 },
    calculate: ({ Qc, f, U }) => {
      if (f <= 0 || U <= 0) throw new Error('Frekvens og spenning må være > 0.');
      return Qc / (2 * Math.PI * f * U * U);
    },
    examples: [
      {
        scenario: 'En motor må kompenseres med Q_C = 700 VAr ved 230 V og 50 Hz. Hvor stor kondensator?',
        inputs: { Qc: 700, f: 50, U: 230 },
        steps: [
          { latex: 'C = \\dfrac{Q_{C}}{2\\pi \\cdot f \\cdot U^{2}}' },
          { latex: 'C = \\dfrac{700}{2\\pi \\cdot 50 \\cdot 230^{2}}' },
          { latex: 'C \\approx 42{,}1\\ \\mu F' },
        ],
        answer: 'C ≈ 42 µF',
      },
    ],
    related: ['cos-phi', 'reaktiv-effekt-enfase'],
    keywords: ['fasekompensering', 'kondensator', 'cos phi'],
  },

  // --- RESONANS --------------------------------------------------------
  {
    id: 'resonans',
    category: 'vekselstrom',
    title: 'Resonansfrekvens (LC-krets)',
    subtitle: 'f₀ = 1 / (2π · √(L·C))',
    latex: 'f_{0} = \\dfrac{1}{2\\pi \\sqrt{L \\cdot C}}',
    description:
      'I en seriekrets med spole og kondensator inntreffer resonans når X_L = X_C. Da blir impedansen kun resistiv (Z = R), og strømmen blir maksimal. Også grunnlag for filtre og oscillatorer.',
    whenToUse:
      'For å designe filtre, dimme/EMC-kretser, og forstå hvorfor visse frekvenser kan gi uventet høy strøm i en krets.',
    inputs: [
      { symbol: 'L', name: 'Induktans', unit: 'H', defaultValue: 0.1, min: 0 },
      { symbol: 'C', name: 'Kapasitans', unit: 'F', defaultValue: 0.00001, min: 0 },
    ],
    output: { symbol: 'f₀', name: 'Resonansfrekvens', unit: 'Hz', decimals: 3 },
    calculate: ({ L, C }) => {
      if (L * C <= 0) throw new Error('L og C må være > 0.');
      return 1 / (2 * Math.PI * Math.sqrt(L * C));
    },
    examples: [
      {
        scenario: 'En krets har L = 100 mH og C = 10 µF. Hva er resonansfrekvensen?',
        inputs: { L: 0.1, C: 0.00001 },
        steps: [
          { latex: 'f_{0} = \\dfrac{1}{2\\pi \\sqrt{0{,}1 \\cdot 10^{-5}}}' },
          { latex: 'f_{0} = \\dfrac{1}{2\\pi \\cdot 10^{-3}}' },
          { latex: 'f_{0} \\approx 159{,}2\\ \\mathrm{Hz}' },
        ],
        answer: 'f₀ ≈ 159 Hz',
      },
    ],
    related: ['reaktans-spole', 'reaktans-kondensator'],
    keywords: ['resonans', 'LC', 'frekvens'],
    relevans: 'sjelden',
  },
];
