import type { Formula } from './types';

export const KORTSLUTNING_FORMULAS: Formula[] = [
  {
    id: 'kortslutning-trefase',
    category: 'kortslutning',
    title: 'Trepolet kortslutningsstrøm',
    subtitle: 'I_k3 = U_L / (√3 · Z_k)',
    latex: 'I_{k3} = \\dfrac{U_{L}}{\\sqrt{3} \\cdot Z_{k}}',
    description:
      'Trepolet kortslutningsstrøm beregnes ut fra linjespenningen og kortslutningsimpedansen Z_k. Z_k er total impedans fra spenningskilde til kortslutningspunktet (transformator + ledere).',
    whenToUse:
      'For å verifisere at vern bryter kortslutninger innen kravet (5 s for fast tilkobling). Også for å sjekke at kabel og vern tåler maksimal I_k.',
    inputs: [
      { symbol: 'UL', name: 'Linjespenning', unit: 'V', defaultValue: 400, min: 0 },
      { symbol: 'Zk', name: 'Kortslutningsimpedans (Z_k)', unit: 'Ω', defaultValue: 0.4, hint: 'Total impedans fra trafo til kortslutningspunktet.', min: 0 },
    ],
    output: { symbol: 'I_k3', name: 'Kortslutningsstrøm', unit: 'A', decimals: 2 },
    calculate: ({ UL, Zk }) => {
      if (Zk <= 0) throw new Error('Z_k må være > 0.');
      return UL / (Math.sqrt(3) * Zk);
    },
    examples: [
      {
        scenario: 'Et anlegg har U_L = 400 V og Z_k = 0,4 Ω. Hva er trepolet I_k?',
        inputs: { UL: 400, Zk: 0.4 },
        steps: [
          { latex: 'I_{k3} = \\dfrac{400}{\\sqrt{3} \\cdot 0{,}4}' },
          { latex: 'I_{k3} \\approx 577{,}4\\ \\mathrm{A}' },
        ],
        answer: 'I_k3 ≈ 577 A',
      },
    ],
    related: ['kortslutning-tofase', 'kortslutning-jord', 'smelteintegral'],
    keywords: ['kortslutning', 'Ik', 'trefase'],
  },
  {
    id: 'kortslutning-tofase',
    category: 'kortslutning',
    title: 'Topolet kortslutningsstrøm',
    subtitle: 'I_k2 = U_L / (2 · Z_k)',
    latex: 'I_{k2} = \\dfrac{U_{L}}{2 \\cdot Z_{k}}',
    description:
      'Topolet kortslutning er kortslutning mellom to faser uten jord. Strømmen er ca. 87 % av tre-polet (√3/2). Brukes for å sjekke at vern også bryter ved den minst alvorlige typen.',
    whenToUse:
      'I anlegg der det er behov for å sjekke det minst gunstige tilfellet av kortslutning — gjelder spesielt vern med treg utløsningskarakteristikk.',
    inputs: [
      { symbol: 'UL', name: 'Linjespenning', unit: 'V', defaultValue: 400, min: 0 },
      { symbol: 'Zk', name: 'Kortslutningsimpedans', unit: 'Ω', defaultValue: 0.4, min: 0 },
    ],
    output: { symbol: 'I_k2', name: 'Topolet I_k', unit: 'A', decimals: 2 },
    calculate: ({ UL, Zk }) => {
      if (Zk <= 0) throw new Error('Z_k må være > 0.');
      return UL / (2 * Zk);
    },
    examples: [
      {
        scenario: 'U_L = 400 V, Z_k = 0,4 Ω. Hva er topolet I_k?',
        inputs: { UL: 400, Zk: 0.4 },
        steps: [
          { latex: 'I_{k2} = \\dfrac{400}{2 \\cdot 0{,}4}' },
          { latex: 'I_{k2} = 500\\ \\mathrm{A}' },
        ],
        answer: 'I_k2 = 500 A',
      },
    ],
    related: ['kortslutning-trefase'],
    keywords: ['kortslutning', 'topolet', 'Ik2'],
  },
  {
    id: 'kortslutning-jord',
    category: 'kortslutning',
    title: 'Enpolet jordfeilstrøm (TN-system)',
    subtitle: 'I_k1 = U_F / Z_s',
    latex: 'I_{k1} = \\dfrac{U_{F}}{Z_{s}}',
    description:
      'Enpolet kortslutning til jord i et TN-system beregnes ut fra fasespenningen og total sløyfeimpedans Z_s (fase + PE-leder + trafo). Brukes for å verifisere at overstrømsvern bryter innen kravet.',
    whenToUse:
      'For å verifisere automatisk utkobling ved jordfeil iht. NEK 400-4-41 (0,4 s for stikk, 5 s for fast).',
    inputs: [
      { symbol: 'UF', name: 'Fasespenning', unit: 'V', defaultValue: 230, min: 0 },
      { symbol: 'Zs', name: 'Sløyfeimpedans (Z_s)', unit: 'Ω', defaultValue: 1.0, hint: 'Måles eller beregnes som sum av fase + PE.', min: 0 },
    ],
    output: { symbol: 'I_k1', name: 'Jordfeilstrøm', unit: 'A', decimals: 2 },
    calculate: ({ UF, Zs }) => {
      if (Zs <= 0) throw new Error('Z_s må være > 0.');
      return UF / Zs;
    },
    examples: [
      {
        scenario: 'I et TN-anlegg er U_F = 230 V og Z_s = 1,0 Ω. Hva er jordfeilstrømmen?',
        inputs: { UF: 230, Zs: 1.0 },
        steps: [
          { latex: 'I_{k1} = \\dfrac{230}{1{,}0}' },
          { latex: 'I_{k1} = 230\\ \\mathrm{A}' },
        ],
        answer: 'I_k1 = 230 A — sjekk at vern bryter dette innen utkoblingstid.',
      },
    ],
    related: ['kortslutning-trefase', 'utkoblingstid', 'maks-sloyfeimpedans'],
    keywords: ['jordfeil', 'sløyfe', 'TN'],
    source: 'NEK 400-4-41',
  },
  {
    id: 'smelteintegral',
    category: 'kortslutning',
    title: 'Smelteintegral I²t — termisk kabelkontroll',
    subtitle: 'S ≥ I_k · √t / k',
    latex: 'S \\geq \\dfrac{I_{k} \\cdot \\sqrt{t}}{k}',
    description:
      'Minimum kabelareal for å tåle en kortslutning som varer tiden t. k er en materialkonstant: kobber PVC = 115, kobber XLPE = 143, aluminium PVC = 76. Strømmen I_k er kortslutningsstrømmen som vernet slipper gjennom.',
    whenToUse:
      'For å verifisere at en kabel termisk tåler en kortslutning helt til vernet bryter — kritisk del av kabeldimensjonering iht. NEK 400-4-43.',
    inputs: [
      { symbol: 'Ik', name: 'Kortslutningsstrøm', unit: 'A', defaultValue: 577, min: 0 },
      { symbol: 't', name: 'Utkoblingstid', unit: 's', defaultValue: 0.1, hint: 'Tid før vern bryter — fra karakteristikk.', min: 0 },
      { symbol: 'k', name: 'Materialkonstant (k)', unit: '', defaultValue: 115, hint: 'Cu/PVC: 115. Cu/XLPE: 143. Al/PVC: 76.', min: 0 },
    ],
    output: { symbol: 'S_min', name: 'Min. tverrsnitt', unit: 'mm²', decimals: 2 },
    calculate: ({ Ik, t, k }) => {
      if (k <= 0) throw new Error('k må være > 0.');
      return (Ik * Math.sqrt(t)) / k;
    },
    examples: [
      {
        scenario: 'I_k = 577 A, vern bryter på t = 0,1 s, kobberkabel med PVC (k = 115).',
        inputs: { Ik: 577, t: 0.1, k: 115 },
        steps: [
          { latex: 'S \\geq \\dfrac{577 \\cdot \\sqrt{0{,}1}}{115}' },
          { latex: 'S \\geq \\dfrac{577 \\cdot 0{,}316}{115}' },
          { latex: 'S \\geq 1{,}59\\ \\mathrm{mm}^{2}' },
        ],
        answer: 'S ≥ 1,59 mm² — velg neste standardareal (1,5 mm² er for lite, bruk 2,5 mm²).',
      },
    ],
    related: ['kortslutning-trefase'],
    keywords: ['I2t', 'smelteintegral', 'termisk', 'k'],
    source: 'NEK 400-4-43',
  },
  {
    id: 'maks-sloyfeimpedans',
    category: 'kortslutning',
    title: 'Maks sløyfeimpedans for vern',
    subtitle: 'Z_s ≤ U₀ / I_a',
    latex: 'Z_{s} \\leq \\dfrac{U_{0}}{I_{a}}',
    description:
      'For at vernet skal bryte innen kravtid må sløyfeimpedansen være lav nok. U₀ er fasespenningen (230 V i Norge). I_a er strømmen som garantert utløser vernet i den krevde tiden — typisk 5× B-vern eller 10× C-vern.',
    whenToUse:
      'Når du skal kontrollere at en kurs er beskyttet etter NEK 400-4-41 — sentral del av sluttkontroll.',
    inputs: [
      { symbol: 'U0', name: 'Fasespenning (U₀)', unit: 'V', defaultValue: 230, min: 0 },
      { symbol: 'Ia', name: 'Garantert utløserstrøm (I_a)', unit: 'A', defaultValue: 80, hint: 'B16: 5·16 = 80 A. C16: 10·16 = 160 A. D16: 20·16 = 320 A.', min: 0 },
    ],
    output: { symbol: 'Z_s,maks', name: 'Maks sløyfeimpedans', unit: 'Ω', decimals: 3 },
    calculate: ({ U0, Ia }) => {
      if (Ia <= 0) throw new Error('I_a må være > 0.');
      return U0 / Ia;
    },
    examples: [
      {
        scenario: 'For en B16 (I_a = 5·16 = 80 A) ved 230 V. Hva er maks tillatt Z_s?',
        inputs: { U0: 230, Ia: 80 },
        steps: [
          { latex: 'Z_{s,\\max} = \\dfrac{230}{80}' },
          { latex: 'Z_{s,\\max} = 2{,}875\\ \\Omega' },
        ],
        answer: 'Z_s,maks ≈ 2,88 Ω',
      },
    ],
    related: ['kortslutning-jord', 'utkoblingstid'],
    keywords: ['sløyfeimpedans', 'Zs', 'vern', 'NEK'],
    source: 'NEK 400-4-41',
  },
  {
    id: 'ik-maks',
    category: 'kortslutning',
    title: 'Ik maks — maksimal kortslutningsstrøm',
    subtitle: 'I_k,maks = c_maks · U / (√3 · Z_s,min)',
    latex: 'I_{k,\\max} = \\dfrac{c_{\\max} \\cdot U}{\\sqrt{3} \\cdot Z_{s,\\min}}',
    description:
      'Maks 3-fas kortslutningsstrøm regnet med spenningskoeffisient c_maks = 1,05 og minste sløyfeimpedans (kald kabel, sterkest mate). Brukes til å sjekke at vernets BRYTEEVNE (kA) er stor nok. NEK 400-4-43 krever I_cn ≥ I_k,maks ved punktet vernet sitter.',
    whenToUse:
      'Når vern skal velges — sammenlign med bryteevne (typisk 6/10/15/25 kA for MCB). Også når kabel skal sjekkes for termisk holdfasthet med worst case.',
    inputs: [
      { symbol: 'cmax', name: 'c_maks', unit: '', defaultValue: 1.05, hint: 'NEK 400 / EN 60909: 1,05 for ≤1 kV.', min: 0, max: 2 },
      { symbol: 'U', name: 'Linjespenning', unit: 'V', defaultValue: 400, hint: '400 V (TN), 230 V (IT linje).', min: 0 },
      { symbol: 'Zsmin', name: 'Z_s,min', unit: 'Ω', defaultValue: 0.1, hint: 'Worst case: kald kabel, full nettkraft fra trafo.', min: 0 },
    ],
    output: { symbol: 'I_k,maks', name: 'Maks kortslutning', unit: 'A', decimals: 0 },
    calculate: ({ cmax, U, Zsmin }) => {
      if (Zsmin <= 0) throw new Error('Z_s,min må være > 0.');
      return (cmax * U) / (Math.sqrt(3) * Zsmin);
    },
    examples: [
      {
        scenario: 'Hovedfordeling 400 V, Z_s,min = 0,05 Ω. Hva er I_k maks?',
        inputs: { cmax: 1.05, U: 400, Zsmin: 0.05 },
        steps: [
          { latex: 'I_{k,\\max} = \\dfrac{1{,}05 \\cdot 400}{\\sqrt{3} \\cdot 0{,}05}' },
          { latex: 'I_{k,\\max} \\approx 4849\\ \\mathrm{A} \\approx 4{,}85\\ \\mathrm{kA}' },
        ],
        answer: 'I_k,maks ≈ 4,85 kA — 6 kA MCB er tilstrekkelig.',
      },
      {
        scenario: 'Industri-tavle nær trafo: 400 V, Z_s,min = 0,025 Ω.',
        inputs: { cmax: 1.05, U: 400, Zsmin: 0.025 },
        steps: [
          { latex: 'I_{k,\\max} = \\dfrac{1{,}05 \\cdot 400}{\\sqrt{3} \\cdot 0{,}025}' },
          { latex: 'I_{k,\\max} \\approx 9698\\ \\mathrm{A} \\approx 9{,}7\\ \\mathrm{kA}' },
        ],
        answer: 'I_k,maks ≈ 9,7 kA — krever minimum 10 kA bryteevne.',
      },
    ],
    related: ['ik-min', 'kortslutning-trefase', 'smelteintegral'],
    keywords: ['Ik maks', 'bryteevne', 'cmax', 'kortslutning'],
    source: 'NEK 400-4-43 / EN 60909',
  },
  {
    id: 'ik-min',
    category: 'kortslutning',
    title: 'Ik min — minste kortslutningsstrøm',
    subtitle: 'I_k,min = c_min · U₀ / Z_s',
    latex: 'I_{k,\\min} = \\dfrac{c_{\\min} \\cdot U_{0}}{Z_{s}}',
    description:
      'Minste kortslutningsstrøm i slutten av kursen — verst tilfelle for utkobling. c_min = 0,95 (lav nettspenning), U₀ = 230 V (fase mot jord). Brukes til å verifisere at vern bryter innen utkoblingstid (0,4 s / 5 s).',
    whenToUse:
      'For å sjekke at sløyfeimpedansen i sluttenden av kursen er lav nok. Hvis I_k,min < I_a for vernet er kursen ikke beskyttet ved jordfeil.',
    inputs: [
      { symbol: 'cmin', name: 'c_min', unit: '', defaultValue: 0.95, hint: 'NEK 400 / EN 60909: 0,95 for ≤1 kV.', min: 0, max: 2 },
      { symbol: 'U0', name: 'Fasespenning (U₀)', unit: 'V', defaultValue: 230, hint: '230 V mot jord. IT-system: bruk linjespenning.', min: 0 },
      { symbol: 'Zs', name: 'Sløyfeimpedans (Z_s)', unit: 'Ω', defaultValue: 1.0, hint: 'Målt eller beregnet fra inntak + fase + PE.', min: 0 },
    ],
    output: { symbol: 'I_k,min', name: 'Min kortslutning', unit: 'A', decimals: 1 },
    calculate: ({ cmin, U0, Zs }) => {
      if (Zs <= 0) throw new Error('Z_s må være > 0.');
      return (cmin * U0) / Zs;
    },
    examples: [
      {
        scenario: 'Z_s = 1,0 Ω, U₀ = 230 V, c_min = 0,95.',
        inputs: { cmin: 0.95, U0: 230, Zs: 1.0 },
        steps: [
          { latex: 'I_{k,\\min} = \\dfrac{0{,}95 \\cdot 230}{1{,}0}' },
          { latex: 'I_{k,\\min} = 218{,}5\\ \\mathrm{A}' },
        ],
        answer: 'I_k,min = 218,5 A — sammenlign med I_a for vernet.',
      },
      {
        scenario: 'Lang kurs i bolig: 1,5 mm² PFXP 30 m, Z_s ≈ 1,4 Ω. Vern B16 (I_a = 80 A).',
        inputs: { cmin: 0.95, U0: 230, Zs: 1.4 },
        steps: [
          { latex: 'I_{k,\\min} = \\dfrac{0{,}95 \\cdot 230}{1{,}4}' },
          { latex: 'I_{k,\\min} \\approx 156\\ \\mathrm{A}' },
        ],
        answer: '156 A > 80 A → vern bryter innen 0,4 s. OK.',
      },
    ],
    related: ['ik-maks', 'maks-sloyfeimpedans', 'utkoblingstid', 'ik2pmin-montor'],
    keywords: ['Ik min', 'cmin', 'utkobling', 'sløyfe'],
    source: 'NEK 400-4-41 / EN 60909',
  },
  {
    id: 'ik2pmin-montor',
    category: 'kortslutning',
    title: 'Ik2p min — Montørhåndbokens metode',
    subtitle: 'I_k2p,min ≈ U_n / (2 · Z_loop)',
    latex: 'I_{k2p,\\min} = \\dfrac{0{,}95 \\cdot U_{n}}{2 \\cdot 1{,}2 \\cdot (Z_{\\text{ytre}} + r_{\\text{fase}} \\cdot L)}',
    description:
      'Praktisk metode fra Montørhåndboka for 2-polt kortslutning ved kursens ende. Konstantene 0,95 (lav nettspenning) og 1,2 (varm kabel ved 70 °C) er innebygd. Faktoren 2 fanger opp fram- og tilbakeleder. Z_ytre er fra inntak til fordeling; r_fase er kabelens motstand per meter.',
    whenToUse:
      'Når du har målt eller fått oppgitt Z_ytre fra netteier, og må regne ut Ik2p,min for kursen din. Brukes på eksamen som forenklet alternativ til full Z_s-beregning.',
    inputs: [
      { symbol: 'Un', name: 'Nominell spenning (linje)', unit: 'V', defaultValue: 230, hint: 'IT: 230 V. TN: 400 V.', min: 0 },
      { symbol: 'Zytre', name: 'Z_ytre (forankoblet)', unit: 'Ω', defaultValue: 0.4, hint: 'Fra inntak til fordeling — målt eller fra netteier.', min: 0 },
      { symbol: 'rfase', name: 'r_fase per meter', unit: 'Ω/m', defaultValue: 0.0073, hint: '2,5 mm² Cu @ 20°C: 7,3 mΩ/m. 1,5: 12,1. 4: 4,4. 6: 2,9.', min: 0 },
      { symbol: 'L', name: 'Kabellengde', unit: 'm', defaultValue: 30, min: 0 },
    ],
    output: { symbol: 'I_k2p,min', name: 'Min 2p-kortslutning', unit: 'A', decimals: 1 },
    calculate: ({ Un, Zytre, rfase, L }) => {
      const Z = Zytre + rfase * L;
      if (Z <= 0) throw new Error('Impedansen må være > 0.');
      return (0.95 * Un) / (2 * 1.2 * Z);
    },
    examples: [
      {
        scenario: 'IT 230 V, Z_ytre = 0,4 Ω, kurs 30 m 2,5 mm² (r = 7,3 mΩ/m).',
        inputs: { Un: 230, Zytre: 0.4, rfase: 0.0073, L: 30 },
        steps: [
          { latex: 'Z_{tot} = 0{,}4 + 0{,}0073 \\cdot 30 = 0{,}619\\ \\Omega' },
          { latex: 'I_{k2p,\\min} = \\dfrac{0{,}95 \\cdot 230}{2 \\cdot 1{,}2 \\cdot 0{,}619}' },
          { latex: 'I_{k2p,\\min} \\approx 147{,}1\\ \\mathrm{A}' },
        ],
        answer: 'I_k2p,min ≈ 147 A → C13 (I_a = 130 A) eller B16 (80 A) er OK.',
      },
      {
        scenario: 'TN 400 V, Z_ytre = 0,05 Ω, lang kurs 80 m 4 mm² (r = 4,4 mΩ/m).',
        inputs: { Un: 400, Zytre: 0.05, rfase: 0.0044, L: 80 },
        steps: [
          { latex: 'Z_{tot} = 0{,}05 + 0{,}0044 \\cdot 80 = 0{,}402\\ \\Omega' },
          { latex: 'I_{k2p,\\min} = \\dfrac{0{,}95 \\cdot 400}{2 \\cdot 1{,}2 \\cdot 0{,}402}' },
          { latex: 'I_{k2p,\\min} \\approx 393{,}7\\ \\mathrm{A}' },
        ],
        answer: 'I_k2p,min ≈ 394 A — B25 (I_a = 125 A) eller C25 (250 A) holder.',
      },
    ],
    related: ['ik-min', 'maks-sloyfeimpedans', 'utkoblingstid'],
    keywords: ['Ik2p', 'Montørhåndbok', 'kortslutning', '2-polt', 'temperaturfaktor'],
    source: 'Montørhåndboka (Trainor / Elforlaget)',
  },
  {
    id: 'termisk-kontroll-i2t',
    category: 'kortslutning',
    title: 'Termisk kontroll I²·t ≤ k²·S²',
    subtitle: 'I_k² · t ≤ k² · S²',
    latex: 'I_{k}^{2} \\cdot t \\leq k^{2} \\cdot S^{2}',
    description:
      'Verifiserer at en kabel termisk tåler kortslutningen helt til vernet bryter. Returnerer marginen i prosent: positiv = innenfor termisk grense, negativ = kabel kan ta skade. Reorganisert versjon av smelteintegral-formelen som svarer direkte med PASS/FAIL.',
    whenToUse:
      'Etter at både Krav 1 og Krav 2 er sjekket — siste termiske sjekk. Bruk I_k,maks for verste tilfelle og utkoblingstid fra vernets karakteristikk.',
    inputs: [
      { symbol: 'Ik', name: 'Kortslutningsstrøm (I_k)', unit: 'A', defaultValue: 1500, hint: 'Bruk I_k,maks for verste tilfelle.', min: 0 },
      { symbol: 't', name: 'Utkoblingstid (t)', unit: 's', defaultValue: 0.1, hint: 'Fra vernets karakteristikk.', min: 0 },
      { symbol: 'k', name: 'Materialkonstant (k)', unit: '', defaultValue: 115, hint: 'Cu/PVC 115. Cu/XLPE 143. Cu/Gummi 141. Al/PVC 76. Al/XLPE 94.', min: 0 },
      { symbol: 'S', name: 'Tverrsnitt (S)', unit: 'mm²', defaultValue: 4, hint: 'Faktisk lagt kabelareal.', min: 0 },
    ],
    output: { symbol: 'Margin', name: 'Margin (k²·S² − I²·t)', unit: 'A²·s', decimals: 0 },
    calculate: ({ Ik, t, k, S }) => {
      const left = Ik * Ik * t;
      const right = k * k * S * S;
      if (left > right) throw new Error(`Termisk grense overskredet: I²·t = ${left.toFixed(0)} > k²·S² = ${right.toFixed(0)}. Velg større tverrsnitt eller raskere vern.`);
      return right - left;
    },
    examples: [
      {
        scenario: 'I_k = 1500 A, t = 0,1 s, kabel 4 mm² Cu/PVC (k = 115).',
        inputs: { Ik: 1500, t: 0.1, k: 115, S: 4 },
        steps: [
          { latex: 'I_{k}^{2} \\cdot t = 1500^{2} \\cdot 0{,}1 = 225\\,000' },
          { latex: 'k^{2} \\cdot S^{2} = 115^{2} \\cdot 4^{2} = 211\\,600' },
          { latex: '225\\,000 > 211\\,600\\ \\Rightarrow\\ \\text{IKKE OK}' },
        ],
        answer: 'Kabelen tåler ikke kortslutningen — velg 6 mm² eller raskere vern.',
      },
      {
        scenario: 'I_k = 1500 A, t = 0,02 s (gG-sikring), kabel 4 mm² Cu/PVC.',
        inputs: { Ik: 1500, t: 0.02, k: 115, S: 4 },
        steps: [
          { latex: 'I_{k}^{2} \\cdot t = 1500^{2} \\cdot 0{,}02 = 45\\,000' },
          { latex: 'k^{2} \\cdot S^{2} = 211\\,600' },
          { latex: '45\\,000 \\leq 211\\,600\\ \\Rightarrow\\ \\text{OK}' },
        ],
        answer: 'OK — stor margin. gG bryter raskt nok.',
      },
    ],
    related: ['smelteintegral', 'ik-maks'],
    keywords: ['termisk', 'I2t', 'k2S2', 'kortslutning', 'kabel'],
    source: 'NEK 400-4-43.4',
  },
];
