'use client';

import { useState } from 'react';
import type { Template } from '@/lib/templates/types';

type Props = {
  template: Template;
};

export function KundekommunikasjonView({ template }: Props) {
  const [kopiertStatus, setKopiertStatus] = useState<'idle' | 'kopiert' | 'feil'>('idle');

  const fullText = template.signature
    ? `${template.body}\n\n${template.signature}`
    : template.body;

  const kopierTilUtklippstavle = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(fullText);
        setKopiertStatus('kopiert');
        window.setTimeout(() => setKopiertStatus('idle'), 2200);
      } else {
        setKopiertStatus('feil');
      }
    } catch (err) {
      console.error('Kunne ikke kopiere mal:', err);
      setKopiertStatus('feil');
    }
  };

  return (
    <article className="space-y-8">
      <div className="glass rounded-2xl p-5 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
            Mal
          </h2>
          <button
            type="button"
            onClick={kopierTilUtklippstavle}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 ease-out-quart ${
              kopiertStatus === 'kopiert'
                ? 'border-live-400/60 bg-live-400/[0.10] text-live-400'
                : kopiertStatus === 'feil'
                ? 'border-danger-400/60 bg-danger-400/[0.10] text-danger-300'
                : 'border-copper-400/40 bg-copper-400/[0.06] text-copper-200 hover:bg-copper-400/[0.12]'
            }`}
            aria-live="polite"
          >
            {kopiertStatus === 'kopiert' && <span aria-hidden="true">✓</span>}
            {kopiertStatus === 'feil' && <span aria-hidden="true">!</span>}
            {kopiertStatus === 'idle' && <span aria-hidden="true">⎘</span>}
            {kopiertStatus === 'kopiert'
              ? 'Kopiert!'
              : kopiertStatus === 'feil'
              ? 'Kunne ikke kopiere'
              : 'Kopier hele teksten'}
          </button>
        </div>

        <pre className="whitespace-pre-wrap font-mono text-[13px] sm:text-sm text-ink-200 leading-relaxed">
          {template.body}
        </pre>
        {template.signature && (
          <>
            <div className="my-4 border-t border-ink-700/40" />
            <pre className="whitespace-pre-wrap font-mono text-[13px] sm:text-sm text-ink-500 leading-relaxed">
              {template.signature}
            </pre>
          </>
        )}
      </div>

      <div className="glass rounded-2xl p-5 sm:p-7">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-copper-300">
          Plassholdere å fylle inn
        </h2>
        <ul className="space-y-3" role="list">
          {template.fields.map((f) => (
            <li
              key={f.placeholder}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 border-b border-ink-700/30 pb-3 last:border-0 last:pb-0"
            >
              <code className="font-mono text-xs text-copper-200">
                [{f.placeholder}]
              </code>
              <p className="text-sm text-ink-200 leading-relaxed">
                {f.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
