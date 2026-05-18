'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

type Props = {
  /** KaTeX-streng. */
  latex: string;
  /** Block-modus rendrer større og sentrert. */
  display?: boolean;
  /** Klassenavn på wrapper-elementet. */
  className?: string;
  /** Tilgjengelig tekst-fallback for skjermlesere. */
  ariaLabel?: string;
};

export function FormulaDisplay({
  latex,
  display = false,
  className = '',
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      katex.render(latex, ref.current, {
        displayMode: display,
        throwOnError: false,
        output: 'html',
        strict: 'ignore',
        trust: false,
      });
    } catch (err) {
      console.error('KaTeX render failed for:', latex, err);
      if (ref.current) ref.current.textContent = latex;
    }
  }, [latex, display]);

  return (
    <span
      ref={ref}
      className={className}
      role="math"
      aria-label={ariaLabel ?? latex}
    />
  );
}
