import type { Formula } from './types';

export const LIKERETTER_FORMULAS: Formula[] = [
  {
    id: 'likeretter-halvbolge',
    category: 'likeretter',
    title: 'Halvbølge likeretter',
    subtitle: 'U_dc = 0,45 · U_rms',
    latex: 'U_{dc} = 0{,}45 \\cdot U_{\\mathrm{rms}}',
    description:
      'Enkel halvbølge-likeretter med én diode slipper kun positiv halvperiode gjennom. Midlere likespenning blir 0,45 ganger inngangsspenningens effektivverdi. Gir høy rippel og dårlig utnyttelse — brukes sjelden i praksis utenom signalkretser.',
    whenToUse:
      'I ELE2 for å vise prinsippet for likeretting. I praksis kun for små signal-likerettere eller når effektivitet ikke er viktig.',
    inputs: [
      { symbol: 'Urms', name: 'Inngangsspenning (U_rms)', unit: 'V', defaultValue: 230, hint: 'Effektivverdi (RMS) på AC-spenningen.', min: 0 },
    ],
    output: { symbol: 'U_dc', name: 'Likespenning (middelverdi)', unit: 'V', decimals: 2 },
    calculate: ({ Urms }) => 0.45 * Urms,
    examples: [
      {
        scenario: '230 V AC inn på en halvbølge-likeretter med én diode.',
        inputs: { Urms: 230 },
        steps: [
          { latex: 'U_{dc} = 0{,}45 \\cdot 230' },
          { latex: 'U_{dc} \\approx 103{,}5\\ \\mathrm{V}' },
        ],
        answer: 'U_dc ≈ 103,5 V',
      },
      {
        scenario: '12 V transformator sekundærspenning på en halvbølge.',
        inputs: { Urms: 12 },
        steps: [
          { latex: 'U_{dc} = 0{,}45 \\cdot 12' },
          { latex: 'U_{dc} = 5{,}4\\ \\mathrm{V}' },
        ],
        answer: 'U_dc = 5,4 V (uten kondensator/filter).',
      },
    ],
    related: ['likeretter-helbolge-bro', 'likeretter-trefase-bro'],
    keywords: ['likeretter', 'halvbølge', 'diode', 'AC til DC'],
    source: 'ELE2 elektroteori',
  },
  {
    id: 'likeretter-helbolge-bro',
    category: 'likeretter',
    title: 'Helbølge likeretter (bro)',
    subtitle: 'U_dc = 0,9 · U_rms',
    latex: 'U_{dc} = 0{,}9 \\cdot U_{\\mathrm{rms}}',
    description:
      'En diodebro (4 dioder) likeretter både positiv og negativ halvperiode. Midlere likespenning er dobbelt så stor som halvbølge: 0,9 · U_rms. Standard byggekloss i strømforsyninger.',
    whenToUse:
      'I alle praktiske enfase strømforsyninger — DC-adaptere, ladere, små motordrivere.',
    inputs: [
      { symbol: 'Urms', name: 'Inngangsspenning (U_rms)', unit: 'V', defaultValue: 230, min: 0 },
    ],
    output: { symbol: 'U_dc', name: 'Likespenning', unit: 'V', decimals: 2 },
    calculate: ({ Urms }) => 0.9 * Urms,
    examples: [
      {
        scenario: '230 V AC inn på en diodebro (helbølge).',
        inputs: { Urms: 230 },
        steps: [
          { latex: 'U_{dc} = 0{,}9 \\cdot 230' },
          { latex: 'U_{dc} = 207\\ \\mathrm{V}' },
        ],
        answer: 'U_dc = 207 V (uten glatningskondensator).',
      },
      {
        scenario: 'Trafosekundær 24 V AC inn på diodebro.',
        inputs: { Urms: 24 },
        steps: [
          { latex: 'U_{dc} = 0{,}9 \\cdot 24' },
          { latex: 'U_{dc} = 21{,}6\\ \\mathrm{V}' },
        ],
        answer: 'U_dc = 21,6 V — med kondensator nærmer den seg toppverdi (≈ 34 V).',
      },
    ],
    related: ['likeretter-halvbolge', 'likeretter-trefase-bro'],
    keywords: ['likeretter', 'helbølge', 'diodebro', 'bro'],
    source: 'ELE2 elektroteori',
  },
  {
    id: 'likeretter-trefase-bro',
    category: 'likeretter',
    title: 'Trefase bro-likeretter (B6)',
    subtitle: 'U_dc = 1,35 · U_L',
    latex: 'U_{dc} = 1{,}35 \\cdot U_{L}',
    description:
      '6-puls trefase bro-likeretter (B6) gir mye glattere DC enn enfase. Midlere likespenning er 1,35 ganger linjespenningen. Brukes i frekvensomformere, store DC-forsyninger og elbil-hurtigladere.',
    whenToUse:
      'For trefase-laster: frekvensomformere (FU), industri-DC, store batteriladere, EV-DC-hurtigladere.',
    inputs: [
      { symbol: 'UL', name: 'Linjespenning (U_L)', unit: 'V', defaultValue: 400, min: 0 },
    ],
    output: { symbol: 'U_dc', name: 'Likespenning', unit: 'V', decimals: 2 },
    calculate: ({ UL }) => 1.35 * UL,
    examples: [
      {
        scenario: '400 V trefase inn på B6 bro.',
        inputs: { UL: 400 },
        steps: [
          { latex: 'U_{dc} = 1{,}35 \\cdot 400' },
          { latex: 'U_{dc} = 540\\ \\mathrm{V}' },
        ],
        answer: 'U_dc = 540 V — typisk DC-bus i FU.',
      },
      {
        scenario: '230 V IT 3-fas (bolig) inn på B6 bro.',
        inputs: { UL: 230 },
        steps: [
          { latex: 'U_{dc} = 1{,}35 \\cdot 230' },
          { latex: 'U_{dc} \\approx 310{,}5\\ \\mathrm{V}' },
        ],
        answer: 'U_dc ≈ 310 V — typisk i bolig-FU for varmepumpe.',
      },
    ],
    related: ['likeretter-halvbolge', 'likeretter-helbolge-bro', 'likeretter-midtuttak'],
    keywords: ['likeretter', 'trefase', 'B6', 'bro', 'FU', 'frekvensomformer'],
    source: 'ELE2 elektroteori',
  },
  {
    id: 'likeretter-midtuttak',
    category: 'likeretter',
    title: 'Helbølge med midtuttak',
    subtitle: 'U_dc = 0,9 · U_rms (per halvdel)',
    latex: 'U_{dc} = 0{,}9 \\cdot U_{\\mathrm{rms,halv}}',
    description:
      'To dioder + midtuttakstrafo. Hver halvdel av sekundærviklin​gen leder annenhver halvperiode. U_dc beregnes ut fra spenningen på halve sekundærviklin​gen, ikke hele. Hver diode må tåle PIV = 2√2 × U_rms,halv — det dobbelte av helbølge-bro fordi den ser fra positiv topp på en halvdel til negativ topp på den andre.',
    whenToUse:
      'I små strømforsyninger der man vil ha helbølge med kun 2 dioder, eller når man har en trafo med midtuttak. Eldre signalforsyninger, audio-utstyr.',
    inputs: [
      {
        symbol: 'Urms',
        name: 'Effektivverdi per halvdel (U_rms,halv)',
        unit: 'V',
        defaultValue: 12,
        hint: 'Effektivverdien på HALVE sekundærviklin​gen (mellom én ytter-pinne og midtuttak).',
        min: 0,
      },
    ],
    output: { symbol: 'U_dc', name: 'Likespenning', unit: 'V', decimals: 2 },
    calculate: ({ Urms }) => 0.9 * Urms,
    examples: [
      {
        scenario: 'En 24+24 V midtuttakstrafo (12 V per halvdel).',
        inputs: { Urms: 12 },
        steps: [
          { latex: 'U_{dc} = 0{,}9 \\cdot 12 = 10{,}8\\ \\mathrm{V}' },
          { latex: 'PIV = 2\\sqrt{2} \\cdot 12 \\approx 33{,}9\\ \\mathrm{V}' },
        ],
        answer: 'U_dc = 10,8 V, og hver diode må tåle PIV ≈ 34 V (velg ≥ 50 V).',
      },
      {
        scenario: '230 V AC over hele sekundærviklin​gen → 115 V per halvdel.',
        inputs: { Urms: 115 },
        steps: [
          { latex: 'U_{dc} = 0{,}9 \\cdot 115 = 103{,}5\\ \\mathrm{V}' },
          { latex: 'PIV = 2\\sqrt{2} \\cdot 115 \\approx 325\\ \\mathrm{V}' },
        ],
        answer: 'U_dc ≈ 103,5 V — hver diode må tåle PIV ≈ 325 V (velg ≥ 600 V).',
      },
    ],
    related: ['likeretter-halvbolge', 'likeretter-helbolge-bro', 'likeretter-trefase-bro'],
    keywords: ['likeretter', 'midtuttak', 'center-tap', 'PIV', '2 dioder'],
    source: 'ELE2 elektroteori',
  },
];
