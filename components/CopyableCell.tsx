'use client';

import { useState } from 'react';

type Props = {
  value: string;
  display?: string;
  align?: 'left' | 'right' | 'center';
  primary?: boolean;
};

export function CopyableCell({ value, display, align = 'right', primary }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error('Kopiering feilet:', err);
    }
  };

  const alignClass =
    align === 'right' ? 'justify-end text-right'
    : align === 'center' ? 'justify-center text-center'
    : 'justify-start text-left';

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`group inline-flex items-baseline gap-2 font-mono tabular-nums w-full ${alignClass} ${
        primary ? 'text-copper-200' : 'text-ink-50'
      } hover:text-copper-300 focus-visible:text-copper-300 transition-colors`}
      aria-label={`Kopier verdi: ${display ?? value}`}
      title="Klikk for å kopiere"
    >
      <span>{display ?? value}</span>
      <span
        aria-hidden="true"
        className={`text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 transition-opacity ${
          copied ? '!opacity-100 text-live-400' : ''
        }`}
      >
        {copied ? 'Kopiert' : 'Kopier'}
      </span>
    </button>
  );
}
