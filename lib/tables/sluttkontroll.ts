import type { ReferenceTable } from './types';

export const SLUTTKONTROLL: ReferenceTable = {
  id: 'sluttkontroll',
  slug: 'sluttkontroll',
  title: 'Sluttkontroll — målepunkt og krav',
  description:
    'Krav til måleverdier ved sluttkontroll iht. NEK 400-6. Brukes som sjekkliste under verifikasjon av nytt anlegg.',
  source: 'NEK 400-6-61 (Verifikasjon ved første gangs igangsetting) / IEC 61008-1 (RCD-tider)',
  verifyStatus: 'verifisert',
  verifySources: 'Isolasjonsresistans 1 MΩ/0,5 MΩ SELV iht. NEK 400-6 tabell 61. Utkoblingstider konsoliderte mot utkoblingstider.ts (Fase 3 audit). RCD utløsningstider 300/40 ms iht. IEC 61008-1 tabell 1. 10-trinns rekkefølge iht. NEK 400-6-61.',
  topic: 'sluttkontroll',
  glyph: '✓',
  order: 3,
  columns: [
    { key: 'maling', label: 'Måling', align: 'left' },
    { key: 'spenning', label: 'Test­spenning', align: 'center' },
    { key: 'krav', label: 'Forventet verdi', align: 'right', copyable: true, primary: true },
    { key: 'kommentar', label: 'Kommentar', align: 'left' },
  ],
  sections: [
    {
      id: 'rekkefolge',
      title: 'Rekkefølge ved verifikasjon (NEK 400-6-61)',
      description:
        'Punktene utføres i denne rekkefølgen. Dokumenter resultatet for hvert punkt i sluttdokumentasjonen.',
      rows: [
        { id: 'trinn-1', cells: { maling: '1. Visuell kontroll', spenning: '—', krav: 'Iht. tegninger og NEK 400', kommentar: 'Identifikasjon, festemåte, kapsling, merking, samsvar med plantegning.' }, highlight: true },
        { id: 'trinn-2', cells: { maling: '2. Kontinuitet i beskyttelsesleder', spenning: '—', krav: '< 1 Ω', kommentar: 'PE-leder fra hovedjord til hver berøringsfarlig del.' } },
        { id: 'trinn-3', cells: { maling: '3. Isolasjonsmotstand', spenning: '500 V DC', krav: '≥ 1 MΩ', kommentar: 'Per kurs, mellom faser og fase mot PE.' } },
        { id: 'trinn-4', cells: { maling: '4. SELV/PELV-separasjon', spenning: '250 V DC', krav: '≥ 0,5 MΩ', kommentar: 'Der relevant — verifiser galvanisk skille.' } },
        { id: 'trinn-5', cells: { maling: '5. Polaritetstest', spenning: '—', krav: 'L til lampeholder', kommentar: 'Der enpolede brytere brukes — fase skal brytes, ikke nøytral.' } },
        { id: 'trinn-6', cells: { maling: '6. Sløyfeimpedans', spenning: 'Under spenning', krav: 'Zs ≤ Un / I_a', kommentar: 'Verifiser at vernet utløser ved jordfeil.' } },
        { id: 'trinn-7', cells: { maling: '7. Kortslutningsstrøm', spenning: 'Under spenning eller beregnet', krav: 'Ik ≥ k × I_n', kommentar: 'Vernets bryteevne ≥ Ik3p_maks.' } },
        { id: 'trinn-8', cells: { maling: '8. Funksjonsprøving av RCD', spenning: 'Under spenning', krav: '≤ 300 ms @ 1×IΔn, ≤ 40 ms @ 5×IΔn', kommentar: 'Mål utløsningstid og strøm.' } },
        { id: 'trinn-9', cells: { maling: '9. Spenningstesting under spenning', spenning: 'Under spenning', krav: 'Tilsvarende nominell', kommentar: 'Mål fasespenning og linjespenning på alle uttak.' } },
        { id: 'trinn-10', cells: { maling: '10. Faserekkefølge', spenning: 'Under spenning', krav: 'L1–L2–L3', kommentar: 'Der trefase-utstyr brukes — motorer skal gå riktig vei.' } },
      ],
    },
    {
      id: 'kontinuitet',
      title: 'Kontinuitetsmåling — beskyttelsesleder (PE)',
      description: 'Mål mellom jordskinne i fordeling og hver berøringsfarlig del.',
      rows: [
        { id: 'pe', cells: { maling: 'PE-leder mot jord-skinne', spenning: '—', krav: '< 1 Ω', kommentar: 'Lavere er bedre, helst < 0,3 Ω.' }, highlight: true },
        { id: 'pe-skap', cells: { maling: 'PE til kapsling / metallrør', spenning: '—', krav: '< 1 Ω', kommentar: 'Alle ledende deler' } },
      ],
    },
    {
      id: 'isolasjon',
      title: 'Isolasjonsresistans',
      description: 'Måles per kurs, med hovedlast slått av. Sensitivt utstyr senker testspenningen.',
      rows: [
        { id: 'normalt-anlegg', cells: { maling: 'Standard kurs (vekselstrøm)', spenning: '500 V DC', krav: '≥ 1 MΩ', kommentar: 'Vanligvis 999 MΩ ved tørt nytt anlegg' }, highlight: true },
        { id: 'sensitivt', cells: { maling: 'Elektronikk (elbil-lader, FU, dimmer)', spenning: '250 V DC', krav: '≥ 1 MΩ', kommentar: 'Senk test­spenning for å beskytte utstyret' }, highlight: true },
        { id: 'extra-low', cells: { maling: 'PELV / SELV (≤ 50 V)', spenning: '250 V DC', krav: '≥ 0,5 MΩ', kommentar: 'Lavspenning' } },
        { id: 'lavlast', cells: { maling: 'Krav i NEK 400-6 (minimum)', spenning: '500 V DC', krav: '≥ 1 MΩ', kommentar: 'Per kurs, fase mot jord og fase mot fase' } },
      ],
    },
    {
      id: 'utkobling',
      title: 'Utkoblingstid — overstrømsvern (NEK 400 tabell 41A)',
      description: 'Maks utkoblingstid ved jordfeil. Bestemmes av anleggstype, ikke av spenningen.',
      rows: [
        { id: 'tn', cells: { maling: 'TN-system, kurser ≤ 32 A', spenning: '—', krav: '≤ 0,4 s', kommentar: 'Vanlig nett i Norge for nybygg' }, highlight: true },
        { id: 'tt', cells: { maling: 'TT-system, kurser ≤ 32 A', spenning: '—', krav: '≤ 0,2 s', kommentar: 'Vanlig på hytter / eldre anlegg uten egen trafo' } },
        { id: 'it', cells: { maling: 'IT-system, kurser ≤ 32 A', spenning: '—', krav: '≤ 0,4 s', kommentar: 'Boliger med 230V IT 3-fas' }, highlight: true },
        { id: 'fast', cells: { maling: 'Fast tilkobling / hovedkurs (alle systemer)', spenning: '—', krav: '≤ 5 s', kommentar: 'Generelt' } },
      ],
    },
    {
      id: 'rcd',
      title: 'Jordfeilbryter (RCD) — funksjonsprøving',
      rows: [
        { id: 'rcd-30', cells: { maling: 'RCD 30 mA, test ved 0,5×I_Δn', spenning: '—', krav: 'Skal IKKE utløse', kommentar: 'Ved 15 mA' } },
        { id: 'rcd-30-2', cells: { maling: 'RCD 30 mA, test ved 1×I_Δn', spenning: '—', krav: '≤ 300 ms', kommentar: 'Ved 30 mA' } },
        { id: 'rcd-30-3', cells: { maling: 'RCD 30 mA, test ved 5×I_Δn', spenning: '—', krav: '≤ 40 ms', kommentar: 'Ved 150 mA' } },
      ],
    },
    {
      id: 'jord',
      title: 'Jordingsmotstand (driftsjord)',
      description: 'Maks tillatt R_b avhenger av jordfeil­strøm og berøringsspenningskrav.',
      rows: [
        { id: 'rb-it', cells: { maling: 'IT-nett (typisk)', spenning: '—', krav: '< 50 Ω', kommentar: 'Lavere ved store anlegg' } },
        { id: 'rb-tt-rcd30', cells: { maling: 'TT-nett, RCD 30 mA', spenning: '—', krav: '< 1666 Ω', kommentar: '50 V / 0,03 A' } },
        { id: 'rb-tt-rcd300', cells: { maling: 'TT-nett, RCD 300 mA', spenning: '—', krav: '< 166 Ω', kommentar: '50 V / 0,3 A' } },
      ],
    },
  ],
  notes: [
    'Verdiene må alltid sammenholdes med NEK 400-6 og produsentdata.',
    'Husk å registrere måleverdiene i samsvarserklæringen.',
    'For elbil-laderen: bruk 250 V DC for å unngå skade på likeretterne i laderen.',
  ],
};
