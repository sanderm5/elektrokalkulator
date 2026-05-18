type Props = {
  /** Detaljnivå om hva som er verifisert, vises som tooltip / aria-label. */
  status?: 'verifisert' | 'delvis' | 'uverifisert';
  /** Hva som er kilden(e) som er sjekket. */
  sources?: string;
};

const STATUS_TEXT: Record<NonNullable<Props['status']>, string> = {
  verifisert: 'Kryssjekket mot 2+ kilder',
  delvis: 'Delvis verifisert — sjekk markerte verdier',
  uverifisert: 'Ikke verifisert — bruk med forsiktighet',
};

const STATUS_COLOR: Record<NonNullable<Props['status']>, string> = {
  verifisert: 'border-live-500/30 bg-live-500/[0.04] text-live-400',
  delvis: 'border-copper-400/30 bg-copper-400/[0.05] text-copper-200',
  uverifisert: 'border-red-500/40 bg-red-500/[0.06] text-red-300',
};

export function VerifyBanner({ status = 'delvis', sources }: Props) {
  return (
    <aside
      role="note"
      className={`mb-8 rounded-xl border px-4 py-3 ${STATUS_COLOR[status]}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-base leading-none mt-0.5" aria-hidden="true">⚠</span>
        <div className="flex-1 text-xs leading-relaxed">
          <p className="font-mono uppercase tracking-wider text-[10px] mb-1 opacity-80">
            Verifikasjon: {STATUS_TEXT[status]}
          </p>
          <p className="text-ink-200">
            <span className="font-medium">Verifiser alle verdier mot Eltabellen eller
            gjeldende NEK 400 før de brukes i samsvarserklæring.</span>{' '}
            Denne kalkulatoren er et eksamens-hjelpemiddel, ikke en autoritativ kilde.
            {sources && (
              <span className="block mt-1.5 italic opacity-70">{sources}</span>
            )}
          </p>
        </div>
      </div>
    </aside>
  );
}
