import type { ElectroSymbol } from '@/lib/symbols';

type Props = {
  symbol: ElectroSymbol;
  /** Sett til true for kompakt versjon uten navn og beskrivelse. */
  bare?: boolean;
};

export function SymbolView({ symbol, bare = false }: Props) {
  return (
    <article
      className="glass group rounded-xl p-4 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-copper-400/40"
      id={`symbol-${symbol.id}`}
    >
      <div className="flex items-center justify-center h-20 mb-3 text-copper-300">
        <svg
          viewBox={symbol.viewBox}
          aria-label={symbol.name}
          role="img"
          className="h-full w-auto"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {symbol.paths}
        </svg>
      </div>
      {!bare && (
        <>
          <h3 className="text-sm font-display text-ink-50 leading-tight">
            {symbol.name}
          </h3>
          {symbol.subtitle && (
            <p className="mt-0.5 text-[11px] font-mono text-copper-300">
              {symbol.subtitle}
            </p>
          )}
          {symbol.ref && (
            <p className="mt-0.5 text-[10px] font-mono uppercase tracking-wider text-ink-700">
              PDF-ref {symbol.ref}
            </p>
          )}
          {symbol.description && (
            <p className="mt-2 text-xs text-ink-500 leading-relaxed line-clamp-3">
              {symbol.description}
            </p>
          )}
        </>
      )}
    </article>
  );
}

/** Inline-versjon for bruk i eksempel-skjemaer — kun SVG, ingen ramme. */
export function InlineSymbol({
  symbol,
  size = 60,
}: {
  symbol: ElectroSymbol;
  size?: number;
}) {
  return (
    <svg
      viewBox={symbol.viewBox}
      width={size}
      height={size}
      aria-label={symbol.name}
      role="img"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className="text-copper-300"
    >
      {symbol.paths}
    </svg>
  );
}
