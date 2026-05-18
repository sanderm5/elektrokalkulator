import Link from 'next/link';
import { InteractiveChecklist, type ChecklistItem } from '@/components/InteractiveChecklist';

export const metadata = {
  title: 'Sjekkliste — Elektroberegning',
  description:
    'Eksamen-sjekkliste, arbeidsflyt for installasjonsoppgaver, og De 5 sikre.',
};

const ARBEIDSFLYT: { id: string; title: string; details: string }[] = [
  {
    id: 'risiko',
    title: '1. Risikovurdering',
    details:
      'Av installasjonen + SJA/FSE for selve arbeidet. Vurder omgivelser, brukere, spesialutstyr, FEL §16.',
  },
  {
    id: 'kartlegging',
    title: '2. Kartlegging av eksisterende anlegg',
    details:
      'Fordelingssystem (TN/TT/IT), I_k ved tilkoblingspunkt, eksisterende vern, jordingssystem.',
  },
  {
    id: 'beregninger',
    title: '3. Beregninger',
    details:
      'I_b → Krav 1 (I_b ≤ I_n ≤ I_z) → Krav 2 (1,45·I_n eller 1,6·I_n) → ΔU → I_k maks/min → t → termisk I²t ≤ k²S² → selektivitet.',
  },
  {
    id: 'komponenter',
    title: '4. Valg av komponenter',
    details:
      'Vern (B/C/D, MCB/gG), RCD-type (A/B), kabel (PFXP/TFXP/EXQ), tverrsnitt. ALLTID med begrunnelse.',
  },
  {
    id: 'utforelse',
    title: '5. Utførelse',
    details:
      'Kabelvei, montasje, merking. Følg DSB og NEK 400 utførelseskrav. FSE §14 før spenningsløst arbeid.',
  },
  {
    id: 'sluttkontroll',
    title: '6. Sluttkontroll',
    details:
      'Visuell + måling + funksjon. Forventede verdier (PE < 1 Ω, isolasjon ≥ 1 MΩ, utkoblingstid). Se "Sluttkontroll"-tabellen.',
  },
  {
    id: 'dokumentasjon',
    title: '7. Dokumentasjon',
    details:
      'Full pakke: risikovurdering, samsvarserklæring, sluttkontroll/måleprotokoll, kursfortegnelse, FDV. Se "De 5 sikre".',
  },
];

const EKSAMEN_SJEKKLISTE: ChecklistItem[] = [
  {
    id: 'lest-oppgave',
    label: 'Oppgaveteksten lest 2 ganger',
    hint: 'Marker hva som etterspørres, hva som er gitt og hva som må antas.',
  },
  {
    id: 'risikovurdering',
    label: 'Risikovurdering dekker omgivelser, brukere, spesialutstyr',
    hint: 'FEL §16: før prosjektering. Husk SJA hvis arbeid på spenning.',
  },
  {
    id: 'kartlegging-eksisterende',
    label: 'Eksisterende anlegg kartlagt',
    hint: 'Fordelingssystem, I_k, vern, jording. Avgjør valg av komponenter.',
  },
  {
    id: 'samtidighet',
    label: 'Samtidighetsfaktor begrunnet',
    hint: 'Bolig 0,4–0,8 avhengig av kurstype. Vis hvilken som er valgt og hvorfor.',
  },
  {
    id: 'krav-1',
    label: 'Krav 1 sjekket med korreksjonsfaktorer',
    hint: 'I_b ≤ I_n ≤ I_z·K_t·K_g·K_h. Slå opp i tabellene.',
  },
  {
    id: 'krav-2',
    label: 'Krav 2 sjekket (særlig gG og bolig ≤ 4 mm²)',
    hint: 'MCB: 1,45·I_n ≤ 1,45·I_z. gG: 1,6·I_n ≤ 1,45·I_z (strengere).',
  },
  {
    id: 'spenningsfall',
    label: 'Spenningsfall regnet og under grensa',
    hint: 'Belysning 3 %, kraft/varme 5 %, motor start 15 %.',
  },
  {
    id: 'ik-maks',
    label: 'I_k maks mot vernets bryteevne',
    hint: 'I_cn ≥ I_k,maks ved hvert verns plass.',
  },
  {
    id: 'ik-min',
    label: 'I_k min mot utkoblingstid',
    hint: 'I_k,min ≥ I_a (B/C/D-multiplikator). Z_s ≤ U₀/I_a.',
  },
  {
    id: 'termisk',
    label: 'Termisk I²t ≤ k²S² verifisert',
    hint: 'Cu/PVC k=115, Cu/XLPE k=143, Al/PVC k=76.',
  },
  {
    id: 'selektivitet',
    label: 'Selektivitet vurdert',
    hint: 'Foran-koblet vern skal IKKE bryte før bak-koblet ved kortslutning.',
  },
  {
    id: 'spesialrom',
    label: 'Spesialrom-krav anvendt (§701, §702, §722 osv.)',
    hint: 'Sone-krav, RCD-type, IP, lokal utjevning.',
  },
  {
    id: 'spd',
    label: 'SPD (overspenningsvern) vurdert',
    hint: 'Krav iht. NEK 400-4-44 — typisk pliktig i nye boliger.',
  },
  {
    id: 'brannstopp',
    label: 'Brannstopp og tetning nevnt',
    hint: 'Gjennomføringer i brannskiller skal tettes — TEK17 / forvaltningskrav.',
  },
  {
    id: 'komponentvalg-begrunnet',
    label: 'Komponentvalg BEGRUNNET',
    hint: 'Ikke bare hvilket vern, men HVORFOR. Sensor ser etter begrunnelse.',
  },
  {
    id: 'sluttkontroll',
    label: 'Sluttkontroll med forventede verdier',
    hint: 'PE < 1 Ω, isolasjon ≥ 1 MΩ, utkoblingstid, RCD-prøving.',
  },
  {
    id: 'dokumentasjon',
    label: 'Dokumentasjonspakke komplett',
    hint: 'De 5 sikre — Elsikkerhetsportalen-versjon.',
  },
  {
    id: 'antakelser',
    label: 'Antakelser eksplisitt nevnt',
    hint: 'Når noe ikke er oppgitt: skriv "Jeg antar at …" — viser at du vet hva som mangler.',
  },
];

export default function SjekklisterPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-24 pt-10 sm:pt-14">
      <nav aria-label="Brødsmuler" className="mb-6">
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-wider text-ink-500 hover:text-copper-300 transition-colors"
        >
          ← Forside
        </Link>
      </nav>

      <header className="mb-10">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Eksamen
        </p>
        <h1 className="font-display text-3xl sm:text-5xl tracking-tight text-ink-50 leading-[1.05]">
          Sjekkliste &amp; arbeidsflyt
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-200 leading-relaxed">
          Arbeidsflyten for installasjonsoppgaver, eksamen-sjekklista og De 5 sikre
          — samlet på ett sted, til hjelp under tidspress.
        </p>
      </header>

      <section className="mb-14" aria-labelledby="arbeidsflyt-tittel">
        <h2
          id="arbeidsflyt-tittel"
          className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Arbeidsflyt — fra oppgave til ferdig anlegg
        </h2>
        <div className="space-y-2.5">
          {ARBEIDSFLYT.map((step) => (
            <details
              key={step.id}
              className="glass rounded-xl overflow-hidden"
            >
              <summary className="cursor-pointer px-5 py-4 flex items-center justify-between gap-4 list-none">
                <span className="font-display text-lg text-ink-50">{step.title}</span>
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-ink-500 transition-transform"
                >
                  ▾
                </span>
              </summary>
              <div className="px-5 pb-4 -mt-1">
                <p className="text-sm text-ink-200 leading-relaxed">
                  {step.details}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="mb-14" aria-labelledby="sjekkliste-tittel">
        <h2
          id="sjekkliste-tittel"
          className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          Sjekkliste før innlevering ({EKSAMEN_SJEKKLISTE.length} punkter)
        </h2>
        <InteractiveChecklist
          storageKey="elektro-kalk-sjekkliste-v1"
          items={EKSAMEN_SJEKKLISTE}
          ariaLabel="Eksamen-sjekkliste — interaktiv"
        />
      </section>

      <section aria-labelledby="de-5-tittel">
        <h2
          id="de-5-tittel"
          className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
        >
          De 5 sikre
        </h2>
        <Link
          href="/tabeller/de-5-sikre/"
          className="glass glass-hover group block rounded-xl p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-display text-2xl text-copper-300 leading-none">
                  5✓
                </span>
                <h3 className="font-display text-lg text-ink-50 group-hover:text-copper-200 transition-colors">
                  Elsikkerhetsportalen + FSE §14
                </h3>
              </div>
              <p className="text-sm text-ink-500 leading-relaxed">
                Begge versjoner av &laquo;De 5 sikre&raquo; — dokumentasjon ved
                installasjon og 5-stegs frakobling før spenningsløst arbeid.
              </p>
            </div>
            <span
              aria-hidden="true"
              className="text-ink-500 group-hover:text-copper-300 transition-all group-hover:translate-x-0.5"
            >
              →
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}
