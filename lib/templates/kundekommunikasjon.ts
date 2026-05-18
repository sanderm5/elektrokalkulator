import type { Template } from './types';

export const KUNDEKOMMUNIKASJON_TEMPLATES: Template[] = [
  {
    id: 'avviksrapport',
    slug: 'avviksrapport',
    kind: 'kundekommunikasjon',
    title: 'Avviksrapport ved feil på eksisterende anlegg',
    subtitle: 'Skriftlig melding når kontroll avdekker avvik',
    description:
      'Brukes når en kunde har bestilt en jobb og kontrollen avdekker feil eller mangler som må utbedres før videre arbeid kan utføres.',
    whenToUse:
      'Etter visuell kontroll, sluttkontroll eller jobbing på eksisterende anlegg der vi oppdager noe som strider mot NEK 400 eller FEL.',
    body:
      'Til [KUNDENAVN]\n\nGjelder: [ANLEGGSADRESSE]\nDato: [DATO]\nUtført av: [ELEKTRIKER]\n\nVed kontroll av anlegget den [DATO] ble følgende avvik konstatert:\n\n1. [AVVIK_1]\n   Konsekvens: [KONSEKVENS_1]\n   Henvisning: [FORSKRIFT_1]\n\n2. [AVVIK_2]\n   Konsekvens: [KONSEKVENS_2]\n   Henvisning: [FORSKRIFT_2]\n\nAvvikene utgjør risiko for [BRANN/PERSONSKADE/DRIFTSAVBRUDD] og må utbedres før anlegget kan godkjennes.\n\nForeslått utbedring og prisestimat:\n[TILTAK_OG_PRIS]\n\nFrist for utbedring: [FRIST_DATO].',
    signature:
      'Med vennlig hilsen\n[ELEKTRIKER]\n[FORETAK] — registrert i DSB\nTlf: [TELEFON] · E-post: [E-POST]',
    fields: [
      { placeholder: 'KUNDENAVN', description: 'Kundens navn eller firmanavn' },
      { placeholder: 'ANLEGGSADRESSE', description: 'Anleggets adresse' },
      { placeholder: 'DATO', description: 'Datoen kontrollen ble utført' },
      { placeholder: 'ELEKTRIKER', description: 'Navnet til den som utførte kontrollen' },
      { placeholder: 'AVVIK_1, AVVIK_2', description: 'Kortfattet beskrivelse av hvert avvik' },
      { placeholder: 'KONSEKVENS_1, KONSEKVENS_2', description: 'Hva avviket kan føre til (fare, brann, e.l.)' },
      { placeholder: 'FORSKRIFT_1, FORSKRIFT_2', description: 'NEK 400-referanse eller FEL-paragraf' },
      { placeholder: 'BRANN/PERSONSKADE/DRIFTSAVBRUDD', description: 'Velg risikoen som er aktuell' },
      { placeholder: 'TILTAK_OG_PRIS', description: 'Hva som må gjøres og estimert kostnad' },
      { placeholder: 'FRIST_DATO', description: 'Tidsfrist for når utbedring må være ferdig' },
    ],
    source: 'FEL § 12 (sluttkontroll og samsvar) / NEK 400-6.',
    keywords: ['avvik', 'rapport', 'feil', 'eksisterende anlegg', 'kontroll'],
    glyph: '⚠',
    order: 1,
  },

  {
    id: 'midlertidig-losning',
    slug: 'midlertidig-losning',
    kind: 'kundekommunikasjon',
    title: 'Midlertidig løsning ved akutt feil',
    subtitle: 'Skriftlig anbefaling om frakobling i påvente av utbedring',
    description:
      'Når en feil ikke kan rettes umiddelbart, og utstyret må kobles fra eller begrenses i bruk. Eksempel: jordfeil på varmekabel som ikke kan byttes samme dag.',
    whenToUse:
      'Når kunden må informeres om at en del av anlegget er gjort spenningsløst eller har begrenset funksjon, og hva slags risiko midlertidigheten innebærer.',
    body:
      'Til [KUNDENAVN]\n\nGjelder: [ANLEGGSADRESSE]\nDato: [DATO]\nUtført av: [ELEKTRIKER]\n\nVed feilsøking ble følgende feil avdekket:\n\nFeilsymptom: [SYMPTOM]\nDiagnose: [DIAGNOSE]\nMåleresultat: [MÅLERESULTAT]\n\nFor å unngå [BRANN/PERSONSKADE] er følgende midlertidige tiltak utført i dag:\n\n• [TILTAK_1]\n• [TILTAK_2]\n\nDet er trygt å bruke resten av anlegget. Den frakoblede delen ([HVA_ER_FRAKOBLET]) må IKKE settes i drift før utbedring er gjennomført.\n\nAnbefalt utbedring:\n[ANBEFALT_UTBEDRING]\n\nForeslått tidspunkt for endelig utbedring: [PLANLAGT_DATO].\n\nKunden er muntlig informert og har akseptert den midlertidige situasjonen.',
    signature:
      'Med vennlig hilsen\n[ELEKTRIKER]\n[FORETAK]\nTlf: [TELEFON]',
    fields: [
      { placeholder: 'KUNDENAVN', description: 'Kundens navn' },
      { placeholder: 'ANLEGGSADRESSE', description: 'Anleggets adresse' },
      { placeholder: 'DATO', description: 'Datoen for tiltaket' },
      { placeholder: 'ELEKTRIKER', description: 'Den som utfører jobben' },
      { placeholder: 'SYMPTOM', description: 'Hva kunden meldte / hva man observerte' },
      { placeholder: 'DIAGNOSE', description: 'Hva som faktisk er feil' },
      { placeholder: 'MÅLERESULTAT', description: 'Konkrete måleverdier, f.eks. "R_iso 0,3 MΩ fase-PE"' },
      { placeholder: 'BRANN/PERSONSKADE', description: 'Risikoen som unngås' },
      { placeholder: 'TILTAK_1, TILTAK_2', description: 'Hva som ble frakoblet eller sikret' },
      { placeholder: 'HVA_ER_FRAKOBLET', description: 'Beskrivelse av delen som er ute av drift' },
      { placeholder: 'ANBEFALT_UTBEDRING', description: 'Hva som må gjøres for å rette feilen permanent' },
      { placeholder: 'PLANLAGT_DATO', description: 'Når endelig reparasjon er planlagt' },
    ],
    source: 'FSE § 14 (sikker frakobling) / FEL § 16.',
    keywords: ['midlertidig', 'jordfeil', 'frakobling', 'varmekabel', 'akutt'],
    glyph: '⏸',
    order: 2,
  },

  {
    id: 'sluttkontroll-info',
    slug: 'sluttkontroll-info',
    kind: 'kundekommunikasjon',
    title: 'Sluttkontroll-informasjon til kunde',
    subtitle: 'Kort informasjon om hva sluttkontroll innebærer',
    description:
      'Brukes ved overlevering av nytt anlegg — forklarer hvilke målinger som er gjort og hva samsvarserklæringen betyr.',
    whenToUse:
      'Når ny installasjon er ferdig og kunden skal motta dokumentasjon — gir kort, ikke-fagteknisk forklaring av hva sluttkontrollen avdekket.',
    body:
      'Til [KUNDENAVN]\n\nGratulerer med ny elektrisk installasjon på [ANLEGGSADRESSE].\n\nFør anlegget kan tas i bruk gjennomfører vi en lovpålagt sluttkontroll iht. NEK 400-6 og FEL § 12. Kontrollen sikrer at anlegget er trygt og fungerer som det skal.\n\nFor anlegget ditt har vi kontrollert:\n\n• Visuell tilstand og merking\n• Beskyttelseslederens kontinuitet (jording)\n• Isolasjonsresistans på alle kurser\n• Sløyfeimpedans og kortslutningsstrøm\n• Jordfeilbryterens funksjon og utløsningstid\n• Spenning og faserekkefølge\n\nAlle målinger er innenfor kravene og dokumentert i vedlagt målerapport.\n\nDu får følgende dokumentasjon:\n• Samsvarserklæring (FEL § 12) — oppbevares hele anleggets levetid\n• Sluttkontroll-rapport med måleverdier\n• Tegninger og dokumentasjon over anlegget\n\nVed funksjons-problemer eller spørsmål senere, kontakt oss på [TELEFON] eller [E-POST].\n\nVelkommen som kunde!',
    signature: '[ELEKTRIKER]\n[FORETAK] — registrert i DSB',
    fields: [
      { placeholder: 'KUNDENAVN', description: 'Kundens navn' },
      { placeholder: 'ANLEGGSADRESSE', description: 'Anleggets adresse' },
      { placeholder: 'TELEFON', description: 'Foretakets telefon' },
      { placeholder: 'E-POST', description: 'Foretakets e-post' },
      { placeholder: 'ELEKTRIKER', description: 'Navnet på den som overleverer' },
      { placeholder: 'FORETAK', description: 'Foretakets navn' },
    ],
    source: 'FEL § 12 / NEK 400-6.',
    keywords: ['sluttkontroll', 'samsvar', 'overlevering', 'dokumentasjon'],
    glyph: '✓',
    order: 3,
  },

  {
    id: 'utbytting-frist',
    slug: 'utbytting-frist',
    kind: 'kundekommunikasjon',
    title: 'Pålegg om utbytting med tidsfrist',
    subtitle: 'Skriftlig melding om at utstyr må byttes',
    description:
      'Når sikker drift krever bytte av komponent (gammel sikring, slitt RCD, jordfeilrele) og kunden må gjøres oppmerksom på fristen.',
    whenToUse:
      'Ved kontroll eller service der utstyr ikke lenger oppfyller forskriftens krav. Skriftlig dokumentasjon sikrer at ansvar overføres til kunden ved bruk etter frist.',
    body:
      'Til [KUNDENAVN]\n\nGjelder: [ANLEGGSADRESSE]\nKontrolldato: [DATO]\nUtført av: [ELEKTRIKER]\n\nFølgende komponent oppfyller IKKE krav iht. NEK 400 / FEL og må byttes:\n\nKomponent: [KOMPONENT]\nPlassering: [PLASSERING]\nFeil/avvik: [HVA_ER_GALT]\nMåleverdi/observasjon: [DOKUMENTASJON]\nHenvisning: [FORSKRIFT]\n\nRisiko ved fortsatt bruk:\n[RISIKO]\n\nAnbefalt utbytting:\n[ANBEFALT_KOMPONENT]\nEstimert kostnad: [KOSTNAD]\n\nTidsfrist for utbytting: [FRIST_DATO]\n\nFor at anlegget skal være trygt og forskriftsmessig må utbytting gjennomføres innen ovenstående frist. Etter denne datoen står eier ansvarlig dersom feilen forblir uutbedret.',
    signature:
      'Med vennlig hilsen\n[ELEKTRIKER]\n[FORETAK]\nTlf: [TELEFON]',
    fields: [
      { placeholder: 'KUNDENAVN', description: 'Kundens navn' },
      { placeholder: 'ANLEGGSADRESSE', description: 'Anleggets adresse' },
      { placeholder: 'KOMPONENT', description: 'Den konkrete komponenten som må byttes' },
      { placeholder: 'PLASSERING', description: 'Hvor komponenten er installert' },
      { placeholder: 'HVA_ER_GALT', description: 'Hvorfor må den byttes' },
      { placeholder: 'DOKUMENTASJON', description: 'Måleverdi eller visuell observasjon' },
      { placeholder: 'FORSKRIFT', description: 'Henvisning til NEK 400-paragraf eller FEL' },
      { placeholder: 'RISIKO', description: 'Konsekvens dersom det ikke byttes' },
      { placeholder: 'ANBEFALT_KOMPONENT', description: 'Hva som anbefales å installere i stedet' },
      { placeholder: 'KOSTNAD', description: 'Estimert pris inkl. mva.' },
      { placeholder: 'FRIST_DATO', description: 'Konkret tidsfrist (måned + år eller dato)' },
    ],
    source: 'FEL § 17 (tilgjengelighet for vedlikehold) / NEK 400-6.',
    keywords: ['utbytting', 'pålegg', 'tidsfrist', 'avvik', 'bytte'],
    glyph: '⌛',
    order: 4,
  },

  {
    id: 'overlevering',
    slug: 'overlevering',
    kind: 'kundekommunikasjon',
    title: 'Overleveringsbrev ved nyinstallasjon',
    subtitle: 'Generisk overlevering med dokumentasjonsoversikt',
    description:
      'Brev som følger med ved overlevering av nytt anlegg. Bekrefter at jobben er ferdig, lister leveranseinnhold og garantitid.',
    whenToUse:
      'Ved formell overlevering av nyinstallasjon til kunde — kan brukes som vedlegg til samsvarserklæringen.',
    body:
      'Til [KUNDENAVN]\n\nDato: [DATO]\nProsjekt: [PROSJEKTNAVN]\nAdresse: [ANLEGGSADRESSE]\n\nVi bekrefter herved at elektroinstallasjonen er ferdig utført og kontrollert iht. NEK 400 og FEL.\n\nLeveranse:\n• [PROSJEKTBESKRIVELSE]\n\nFølgende dokumentasjon medfølger:\n• Samsvarserklæring (FEL § 12)\n• Sluttkontroll-rapport med måleverdier\n• Tegningsoppdaterte plantegninger og enlinjeskjema\n• Brukerveiledning og merking\n• Datablader for installert utstyr\n\nGaranti:\n[GARANTI_TEKST]\n\nVed feil eller spørsmål — kontakt oss på [TELEFON] eller [E-POST]. Vi bistår gjerne med veiledning og service.\n\nDet er kundens ansvar å oppbevare dokumentasjonen iht. FEL § 13 — i hele anleggets levetid.\n\nTakk for tilliten — vi ønsker deg lykke til med det nye anlegget!',
    signature: '[ELEKTRIKER]\n[FORETAK] — registrert i DSB\nTlf: [TELEFON] · E-post: [E-POST]',
    fields: [
      { placeholder: 'KUNDENAVN', description: 'Kundens navn' },
      { placeholder: 'PROSJEKTNAVN', description: 'Prosjektets navn eller ID' },
      { placeholder: 'ANLEGGSADRESSE', description: 'Anleggets adresse' },
      { placeholder: 'PROSJEKTBESKRIVELSE', description: 'Kort beskrivelse av hva som ble levert (1-3 setninger)' },
      { placeholder: 'GARANTI_TEKST', description: 'Standard garantitekst for jobben (typisk 2 år arbeid, 5 år utstyr)' },
      { placeholder: 'ELEKTRIKER', description: 'Navnet på den som overleverer' },
      { placeholder: 'TELEFON', description: 'Foretakets telefon' },
      { placeholder: 'E-POST', description: 'Foretakets e-post' },
    ],
    source: 'FEL § 12 og § 13.',
    keywords: ['overlevering', 'ferdig', 'nytt anlegg', 'dokumentasjon', 'samsvar'],
    glyph: '✉',
    order: 5,
  },
];
