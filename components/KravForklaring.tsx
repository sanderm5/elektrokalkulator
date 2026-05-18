import { FormulaDisplay } from './FormulaDisplay';

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
      {children}
    </h3>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <article className="glass rounded-xl p-5 sm:p-6">{children}</article>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-ink-700/60 px-3 py-2 text-left font-mono text-[11px] uppercase tracking-wider text-ink-500">
      {children}
    </th>
  );
}

function Td({
  children,
  mono = false,
}: {
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <td
      className={`border-b border-ink-700/30 px-3 py-2 align-top text-sm text-ink-200 leading-relaxed ${
        mono ? 'font-mono' : ''
      }`}
    >
      {children}
    </td>
  );
}

export function KravForklaring() {
  return (
    <section className="mt-10" aria-labelledby="krav-forklaring-tittel">
      <h2
        id="krav-forklaring-tittel"
        className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-500"
      >
        Detaljert forklaring
      </h2>

      <div className="space-y-4">
        {/* Virkeområde — viktig avgrensning */}
        <Card>
          <SectionHeader>Hvem gjelder disse reglene for?</SectionHeader>
          <p className="text-sm text-ink-200 leading-relaxed">
            Krav 1 og krav 2 slik de står her gjelder{' '}
            <span className="text-ink-50">kun for bolig</span>, og for
            kabeltverrsnitt{' '}
            <span className="text-ink-50">1,5 mm², 2,5 mm² og 4 mm²</span>.
          </p>
          <div className="mt-3 rounded-lg border-l-2 border-copper-400/40 bg-copper-500/5 px-4 py-3 text-sm text-ink-200 leading-relaxed">
            For tverrsnitt fra <span className="text-ink-50">6 mm²</span> og
            større i bolig, og for{' '}
            <span className="text-ink-50">industri</span>, finnes det egne krav
            1 og 2.
          </div>
        </Card>

        {/* Hvordan velger vi sikring og kabel */}
        <Card>
          <SectionHeader>
            Hvordan bestemmer vi størrelse på sikring og kabel?
          </SectionHeader>
          <p className="text-sm text-ink-200 leading-relaxed">
            Vi dimensjonerer ved å oppfylle to krav for beskyttelse mot
            overbelastning — krav 1 og krav 2. Først må vi forstå hva
            bokstavene betyr.
          </p>
        </Card>

        {/* Ib */}
        <Card>
          <SectionHeader>
            <FormulaDisplay latex="I_{b}" /> — belastningsstrøm
          </SectionHeader>
          <p className="text-sm text-ink-200 leading-relaxed">
            Den maksimale strømmen som går i kretsen ved normal drift. Denne
            regnes ofte ut fra effekten til utstyret:
          </p>
          <div className="mt-3 rounded-lg bg-ink-900/60 p-3">
            <FormulaDisplay
              latex="I_{b}=P/U=2000\,\mathrm{W}/230\,\mathrm{V}=8{,}7\,\mathrm{A}"
              display
            />
          </div>
          <p className="mt-3 text-sm text-ink-200 leading-relaxed">
            Eksempel: 1 varmeovn på 2000 W gir{' '}
            <FormulaDisplay latex="I_{b}=8{,}7\,\mathrm{A}" />.
          </p>
          <p className="mt-3 text-sm text-ink-200 leading-relaxed">
            Alternativt kan en sette belastningsstrømmen lik
            sikringsstørrelsen:
          </p>
          <div className="mt-2 rounded-lg bg-ink-900/60 p-3">
            <FormulaDisplay latex="I_{b}=I_{n}=10\,\mathrm{A}" />
          </div>
        </Card>

        {/* In */}
        <Card>
          <SectionHeader>
            <FormulaDisplay latex="I_{n}" /> — nominell strøm (sikringens størrelse)
          </SectionHeader>
          <p className="text-sm text-ink-200 leading-relaxed">
            Sikringens størrelse. Vanlige sikringsstørrelser i bolig:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              '10 A',
              '13 A',
              '15 A',
              '16 A',
              '20 A',
              '25 A',
              '32 A',
              '40 A',
              '50 A',
              '63 A',
            ].map((v) => (
              <span
                key={v}
                className="rounded-md bg-ink-900/60 px-2.5 py-1 font-mono text-xs text-ink-200"
              >
                {v}
              </span>
            ))}
          </div>
        </Card>

        {/* Iz */}
        <Card>
          <SectionHeader>
            <FormulaDisplay latex="I_{z}" /> — ledningens strømføringsevne
          </SectionHeader>
          <p className="text-sm text-ink-200 leading-relaxed">
            Den maksimale strømmen som kan gå i ledningen før den blir for
            varm — som igjen kan føre til smelting av isolasjon, brann og så
            videre.
          </p>
          <p className="mt-3 text-sm text-ink-200 leading-relaxed">
            Strømføringsevnen kan bli påvirket av{' '}
            <span className="text-ink-50">omgivelsestemperatur</span> eller om
            kabelen ligger sammen med{' '}
            <span className="text-ink-50">andre kabler</span>. Se eget avsnitt
            om dette lenger ned.
          </p>
          <p className="mt-3 text-sm text-ink-200 leading-relaxed">
            <FormulaDisplay latex="I_{z}" /> finner vi i{' '}
            <span className="text-ink-50">tabell 52B-2</span> og videre i NEK
            400.
          </p>
        </Card>

        {/* I2 — utdypende */}
        <Card>
          <SectionHeader>
            <FormulaDisplay latex="I_{2}" /> — sikringens garanterte utløserstrøm
          </SectionHeader>
          <p className="text-sm text-ink-200 leading-relaxed">
            <FormulaDisplay latex="I_{2}" /> er oppgitt av leverandøren av
            sikringen / automaten / jordfeilautomaten. Det er den strømmen som
            sikrer utkobling av vernet{' '}
            <span className="text-ink-50">innen 1 time</span> (innen en viss
            tid). Leverandørene har forskjellig verdi på sine automater.
          </p>
          <div className="mt-3 rounded-lg bg-ink-900/60 p-3">
            <FormulaDisplay latex="I_{2}=\text{faktor}\cdot I_{n}" display />
          </div>

          <h4 className="mt-5 mb-2 font-mono text-[11px] uppercase tracking-wider text-ink-500">
            Hvorfor har vi I₂?
          </h4>
          <p className="text-sm text-ink-200 leading-relaxed">
            En automat bruker et <span className="text-ink-50">bimetall</span>{' '}
            som overbelastningsbeskyttelse. Et bimetall beveger seg når det
            blir varmt, og går tilbake til normal posisjon når det blir kaldt
            igjen.
          </p>
          <p className="mt-3 text-sm text-ink-200 leading-relaxed">
            Hvis det går for mye strøm i kretsen (overbelastning), bøyer
            bimetallet seg og bryter kretsen — samme prinsipp som en enpolt
            bryter. Jo mer strøm over merkestrømmen, jo fortere bryter
            sikringen. Er det bare litt over, kan det ta veldig lang tid.
          </p>
          <p className="mt-3 text-sm text-ink-200 leading-relaxed">
            Derfor kan ikke leverandørene garantere at en sikring på f.eks.
            10 A alltid vil slå ut på 11 A umiddelbart.{' '}
            <FormulaDisplay latex="I_{2}" /> er leverandørens garanti for den
            strømmen som <span className="text-ink-50">garantert</span> slår ut
            sikringen innen 1 time.
          </p>
          <div className="mt-3 rounded-lg border-l-2 border-copper-400/40 bg-copper-500/5 px-4 py-3 text-sm text-ink-200 leading-relaxed">
            <span className="text-copper-300">Eksempel:</span> En Eaton 10 A
            automat har <FormulaDisplay latex="I_{2}=1{,}3\cdot I_{n}" />, altså{' '}
            <FormulaDisplay latex="I_{2}=1{,}3\cdot 10=13\,\mathrm{A}" />. Eaton
            garanterer at hvis 13 A går gjennom en 10 A sikring i 1 time, så
            vil sikringen bryte. Derfor krever vi at ledningen tåler mer enn{' '}
            <FormulaDisplay latex="I_{2}" /> — ellers begynner den å bli for
            varm før sikringen reagerer.
          </div>
        </Card>

        {/* Leverandørtabell */}
        <Card>
          <SectionHeader>
            <FormulaDisplay latex="I_{2}" />-verdier hos de vanligste leverandørene
          </SectionHeader>
          <p className="mb-4 text-sm text-ink-200 leading-relaxed">
            Verdiene varierer fra leverandør til leverandør. Sjekk{' '}
            <span className="text-ink-50">alltid</span> databladet for den
            sikringen du skal bruke.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <Th>Leverandør</Th>
                  <Th>Automat-type</Th>
                  <Th>
                    <FormulaDisplay latex="I_{2}" />
                  </Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>ABB</Td>
                  <Td>CK-automater</Td>
                  <Td mono>
                    <FormulaDisplay latex="1{,}2\cdot I_{n}" />
                  </Td>
                </tr>
                <tr>
                  <Td>Eaton</Td>
                  <Td>OL-automater</Td>
                  <Td mono>
                    <FormulaDisplay latex="1{,}3\cdot I_{n}" />
                  </Td>
                </tr>
                <tr>
                  <Td>Chint</Td>
                  <Td>K-automater</Td>
                  <Td mono>
                    <FormulaDisplay latex="1{,}3\cdot I_{n}" />
                  </Td>
                </tr>
                <tr>
                  <Td>Gewiss</Td>
                  <Td>15 A-automater</Td>
                  <Td mono>
                    <FormulaDisplay latex="1{,}3\cdot I_{n}" />
                  </Td>
                </tr>
                <tr>
                  <Td>Hager</Td>
                  <Td>15 A-automater</Td>
                  <Td mono>
                    <FormulaDisplay latex="1{,}3\cdot I_{n}" />
                  </Td>
                </tr>
                <tr>
                  <Td>Schneider</Td>
                  <Td>15 A-automater</Td>
                  <Td mono>
                    <FormulaDisplay latex="1{,}3\cdot I_{n}" />
                  </Td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Krav 1 og krav 2 */}
        <Card>
          <SectionHeader>De to kravene</SectionHeader>
          <p className="mb-5 text-sm text-ink-200 leading-relaxed">
            Dimensjonering av kabeltykkelse og sikringsstørrelse gjøres etter
            følgende to krav for beskyttelse mot overbelastning:
          </p>

          {/* Krav 1 */}
          <div className="mb-5">
            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-copper-300">
                Krav 1
              </span>
            </div>
            <div className="rounded-lg bg-ink-900/60 p-4">
              <FormulaDisplay latex="I_{b}\leq I_{n}" display />
            </div>
            <p className="mt-3 text-sm text-ink-200 leading-relaxed">
              Belastningsstrømmen <FormulaDisplay latex="I_{b}" /> (strømmen
              som skal gå gjennom ledningen) må være mindre enn — eller lik —
              størrelsen på sikringen <FormulaDisplay latex="I_{n}" />.
            </p>
          </div>

          {/* Krav 2 */}
          <div>
            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-copper-300">
                Krav 2
              </span>
            </div>
            <div className="rounded-lg bg-ink-900/60 p-4">
              <FormulaDisplay latex="I_{2}\leq I_{z}" display />
            </div>
            <p className="mt-3 text-sm text-ink-200 leading-relaxed">
              Videre må sikringens <FormulaDisplay latex="I_{2}" />-verdi være
              mindre eller lik den strømmen som ledningen tåler,{' '}
              <FormulaDisplay latex="I_{z}" />. Ledninger blir varme av
              strømmen de skal lede, og <FormulaDisplay latex="I_{z}" /> er den
              største strømmen ledningen kan tåle før den blir for varm — dvs.{' '}
              <span className="text-ink-50">70 °C</span> for PVC-isolert kabel.
            </p>
          </div>
        </Card>

        {/* Iz og referanseinstallasjonsmetode */}
        <Card>
          <SectionHeader>
            <FormulaDisplay latex="I_{z}" /> og referanseinstallasjonsmetode
          </SectionHeader>
          <p className="text-sm text-ink-200 leading-relaxed">
            <FormulaDisplay latex="I_{z}" /> finner vi ved å bruke{' '}
            <span className="text-ink-50">tabell 52B-2</span> i NEK 400. Her må
            vi ta hensyn til måten ledninger / kabler er lagt —{' '}
            <span className="text-ink-50">referanseinstallasjonsmetoden</span>.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink-200 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-copper-300 shrink-0">·</span>
              <span>
                <span className="font-mono text-copper-300">A1</span> — ledninger
                inni rør inne i veggen (skjult installasjon)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-copper-300 shrink-0">·</span>
              <span>
                <span className="font-mono text-copper-300">C</span> — kabel
                direkte på vegg (åpen installasjon)
              </span>
            </li>
          </ul>
        </Card>

        {/* Spesialtilfelle: 2.5mm² i A1 */}
        <Card>
          <SectionHeader>
            Spesialtilfelle — egne automater for 2,5 mm² i skjult installasjon (A1)
          </SectionHeader>
          <p className="text-sm text-ink-200 leading-relaxed">
            Du vil oppdage at en{' '}
            <span className="text-ink-50">ikke kan bruke 2,5 mm²</span> i
            skjult installasjon på en vanlig 16 A automat — strømføringsevnen{' '}
            <FormulaDisplay latex="I_{z}" /> i A1 tåler «bare» 19,5 A (se
            tabell 52B-2).
          </p>
          <p className="mt-3 text-sm text-ink-200 leading-relaxed">
            Dette gjelder <span className="text-ink-50">ikke</span> for åpen
            installasjon — der går det fint med 2,5 mm² på 16 A automat i
            referanseinstallasjonsmetode <span className="font-mono">C</span>,
            siden <FormulaDisplay latex="I_{z}=27\,\mathrm{A}" /> i C.
          </p>

          <div className="mt-4 rounded-lg bg-ink-900/60 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-ink-500">
              Regnestykket — Eaton 16 A i A1
            </p>
            <FormulaDisplay
              latex="I_{2}=1{,}39\cdot 16\,\mathrm{A}=22{,}24\,\mathrm{A}"
              display
            />
            <p className="mt-2 text-sm text-ink-200 leading-relaxed">
              22,24 A er <span className="text-danger-400">større</span> enn{' '}
              <FormulaDisplay latex="I_{z}=19{,}5\,\mathrm{A}" /> i A1 — krav 2
              brytes.
            </p>
          </div>

          <p className="mt-4 text-sm text-ink-200 leading-relaxed">
            Eaton og mange andre leverandører har derfor laget egne automater
            med <FormulaDisplay latex="I_{2}=1{,}3\cdot I_{n}" /> for å
            tilfredsstille disse kravene.
          </p>
        </Card>

        {/* Omgivelsestemperatur */}
        <Card>
          <SectionHeader>
            Andre faktorer — omgivelsestemperatur
          </SectionHeader>
          <p className="text-sm text-ink-200 leading-relaxed">
            Temperaturen rundt kabelen påvirker hvor fort den blir varm — og
            kan smelte isolasjonen. Alle tall i tabell 52B-2 er tatt med
            utgangspunkt i et rom på{' '}
            <span className="text-ink-50">30 °C</span>.
          </p>
          <p className="mt-3 text-sm text-ink-200 leading-relaxed">
            Dersom temperaturen i rommet er annet enn 30 °C, må{' '}
            <FormulaDisplay latex="I_{z}" /> ganges med en korreksjonsfaktor
            tilsvarende tabellen under (PVC-isolert kabel):
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <Th>Omgivelsestemp.</Th>
                  <Th>Korreksjonsfaktor</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['10 °C', '1,22'],
                  ['15 °C', '1,17'],
                  ['20 °C', '1,12'],
                  ['25 °C', '1,06'],
                  ['30 °C', '1,00'],
                  ['35 °C', '0,94'],
                  ['40 °C', '0,87'],
                  ['45 °C', '0,79'],
                  ['50 °C', '0,71'],
                  ['55 °C', '0,61'],
                  ['60 °C', '0,50'],
                ].map(([t, k]) => (
                  <tr key={t}>
                    <Td mono>{t}</Td>
                    <Td mono>
                      {k === '1,00' ? (
                        <span className="text-live-400">{k}</span>
                      ) : (
                        k
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-500 italic">
            Standard NEK 400 PVC-faktorer — sjekk tabellen i NEK 400 for andre
            isolasjonstyper.
          </p>
        </Card>
      </div>
    </section>
  );
}
