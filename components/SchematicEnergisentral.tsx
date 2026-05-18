/**
 * Enlinjeskjema for energisentral 200 kW (TN-S):
 * netteier → hovedvern → fordeling → kurser for varmepumpe, varmtvannstanker,
 * sirkulasjonspumper og ventilasjon. Demonstrerer en typisk eksamens-case.
 */
export function SchematicEnergisentral() {
  return (
    <div className="glass rounded-2xl p-4 sm:p-6 overflow-x-auto">
      <svg
        viewBox="0 0 520 520"
        className="w-full text-copper-300"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        role="img"
        aria-label="Enlinjeskjema for energisentral 200 kW"
      >
        {/* === Inntak === */}
        <line x1="260" y1="20" x2="260" y2="55" />
        <text
          x="272"
          y="40"
          fontSize="11"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          400/230 V TN-S · 200 kW
        </text>

        {/* === Hovedvern (NH3, 400 A gG) === */}
        <rect x="235" y="55" width="50" height="40" rx="2" />
        <line x1="245" y1="68" x2="275" y2="68" strokeWidth="1.1" />
        <line x1="245" y1="82" x2="275" y2="82" strokeWidth="1.1" />
        <text
          x="295"
          y="80"
          fontSize="10"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Hovedvern gG 400 A (NH3)
        </text>
        <line x1="260" y1="95" x2="260" y2="125" />

        {/* === Måling === */}
        <circle cx="260" cy="145" r="20" />
        <text
          x="260"
          y="149"
          textAnchor="middle"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          fill="currentColor"
          stroke="none"
        >
          kWh
        </text>
        <text
          x="290"
          y="149"
          fontSize="10"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Måler m/ effekttransformatorer
        </text>
        <line x1="260" y1="165" x2="260" y2="200" />

        {/* === Hoved-effektbryter (MCCB) === */}
        <rect x="235" y="200" width="50" height="35" rx="2" />
        <text
          x="260"
          y="222"
          textAnchor="middle"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="700"
          fill="currentColor"
          stroke="none"
        >
          MCCB
        </text>
        <text
          x="295"
          y="222"
          fontSize="10"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Effektbryter 400 A, justerbar
        </text>
        <line x1="260" y1="235" x2="260" y2="265" />

        {/* === Hovedsamleskinne === */}
        <line x1="40" y1="265" x2="480" y2="265" strokeWidth="2.4" />
        <circle cx="260" cy="265" r="2.5" fill="currentColor" />
        <text
          x="40"
          y="257"
          fontSize="9"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          Hovedsamleskinne 690 V
        </text>

        {/* === Kurser === */}
        {[
          { x: 80, label: 'VP1', vern: 'C100', kabel: '50 mm²', P: '55 kW', extra: 'FU + RCD type B 300 mA' },
          { x: 180, label: 'VP2', vern: 'C100', kabel: '50 mm²', P: '55 kW', extra: 'FU + RCD type B 300 mA' },
          { x: 280, label: 'VV-tank', vern: 'C63', kabel: '16 mm²', P: '32 kW', extra: 'Termostatstyrt' },
          { x: 380, label: 'Pumper', vern: 'C32', kabel: '6 mm²', P: '15 kW', extra: 'Sirkulasjon 3-fas' },
          { x: 460, label: 'Vent.', vern: 'C25', kabel: '4 mm²', P: '11 kW', extra: 'FU' },
        ].map((kurs) => (
          <g key={kurs.label}>
            <line x1={kurs.x} y1="265" x2={kurs.x} y2="295" />
            <circle cx={kurs.x} cy="265" r="2" fill="currentColor" />
            <rect x={kurs.x - 12} y="295" width="24" height="28" rx="1" />
            <text
              x={kurs.x}
              y="313"
              textAnchor="middle"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="700"
              fill="currentColor"
              stroke="none"
            >
              {kurs.vern}
            </text>
            <line x1={kurs.x} y1="323" x2={kurs.x} y2="355" />
            {/* Last-symbol */}
            <circle cx={kurs.x} cy="370" r="14" />
            <text
              x={kurs.x}
              y="374"
              textAnchor="middle"
              fontSize="9"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
            >
              {kurs.label}
            </text>
            <text
              x={kurs.x}
              y="400"
              textAnchor="middle"
              fontSize="8"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
            >
              {kurs.P}
            </text>
            <text
              x={kurs.x}
              y="412"
              textAnchor="middle"
              fontSize="8"
              fontFamily="monospace"
              fill="currentColor"
              stroke="none"
            >
              {kurs.kabel}
            </text>
          </g>
        ))}

        {/* === PE/PEN-skinne === */}
        <line x1="40" y1="478" x2="480" y2="478" strokeWidth="2.4" />
        <line x1="46" y1="486" x2="64" y2="486" strokeWidth="1.4" />
        <line x1="50" y1="494" x2="60" y2="494" strokeWidth="1" />
        <text
          x="76"
          y="490"
          fontSize="9"
          fontFamily="monospace"
          fill="currentColor"
          stroke="none"
        >
          PE-skinne — utjevning til byggets jordsystem
        </text>
      </svg>

      <figcaption className="mt-4 text-xs text-ink-500 leading-relaxed">
        <strong className="text-ink-200">Energisentral 200 kW (TN-S):</strong>{' '}
        Næringsbygg med to varmepumper (55 kW hver), varmtvannstanker,
        sirkulasjonspumper og ventilasjon. Varmepumpene har frekvensomformer
        (FU) og krever RCD type B (allstrømsfølsom). Hovedvern dimensjonert
        for samtidighet ≈ 0,7. Maks Ik3p sjekkes mot vernets bryteevne.
      </figcaption>
    </div>
  );
}
