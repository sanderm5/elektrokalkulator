'use client';

import { useMemo, useState } from 'react';
import type { ReferenceTable, TableRow } from '@/lib/tables/types';
import { CopyableCell } from './CopyableCell';

type Props = {
  table: ReferenceTable;
};

function formatCell(value: string | number): string {
  if (typeof value === 'number') {
    // Norske desimaltegn for tall
    return Number.isInteger(value)
      ? value.toString()
      : value.toString().replace('.', ',');
  }
  return value;
}

function matchesQuery(row: TableRow, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  const haystack = [
    ...Object.values(row.cells).map((v) => String(v).toLowerCase()),
    ...(row.keywords ?? []).map((k) => k.toLowerCase()),
    row.warning?.toLowerCase() ?? '',
  ].join(' ');
  // splitt på space, alle ord må finnes
  return lower.split(/\s+/).every((term) => haystack.includes(term));
}

export function TableView({ table }: Props) {
  const [query, setQuery] = useState('');

  const filteredSections = useMemo(() => {
    if (!query.trim()) return table.sections;
    return table.sections
      .map((s) => ({ ...s, rows: s.rows.filter((r) => matchesQuery(r, query)) }))
      .filter((s) => s.rows.length > 0);
  }, [table.sections, query]);

  const totalMatches = filteredSections.reduce((acc, s) => acc + s.rows.length, 0);
  const totalRows = table.sections.reduce((acc, s) => acc + s.rows.length, 0);

  return (
    <div>
      <div className="mb-6">
        <label className="block">
          <span className="sr-only">Filtrer rader</span>
          <input
            type="search"
            placeholder="Filtrer tabellen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="calc-input w-full rounded-lg px-3.5 py-2.5 text-sm"
            autoComplete="off"
            spellCheck={false}
            aria-label="Filtrer tabellen"
          />
        </label>
        {query && (
          <p className="mt-2 text-xs text-ink-500" aria-live="polite">
            {totalMatches} av {totalRows} rader
          </p>
        )}
      </div>

      {filteredSections.length === 0 ? (
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-sm text-ink-200">
            Ingen rader matcher «{query}».
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredSections.map((section) => (
            <section key={section.id}>
              {section.title && (
                <header className="mb-3">
                  <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-copper-300">
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="mt-1 text-xs text-ink-500">
                      {section.description}
                    </p>
                  )}
                </header>
              )}
              <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink-700/60 bg-ink-900/40">
                        {table.columns.map((col) => (
                          <th
                            key={col.key}
                            className={`px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-ink-500 ${
                              col.align === 'right' ? 'text-right'
                              : col.align === 'center' ? 'text-center'
                              : 'text-left'
                            }`}
                            title={col.hint}
                          >
                            {col.label}
                            {col.unit && (
                              <span className="ml-1 text-ink-700 normal-case">
                                ({col.unit})
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row) => (
                        <tr
                          key={row.id}
                          id={`row-${row.id}`}
                          className={`border-b border-ink-700/30 last:border-0 hover:bg-ink-800/30 transition-colors scroll-mt-24 ${
                            row.highlight ? 'bg-copper-400/[0.06]' : ''
                          }`}
                        >
                          {table.columns.map((col) => {
                            const raw = row.cells[col.key];
                            const display = raw === undefined ? '—' : formatCell(raw);
                            return (
                              <td
                                key={col.key}
                                className={`px-4 py-2.5 ${
                                  col.align === 'right' ? 'text-right'
                                  : col.align === 'center' ? 'text-center'
                                  : 'text-left'
                                }`}
                              >
                                {col.copyable && raw !== undefined ? (
                                  <CopyableCell
                                    value={String(raw)}
                                    display={display}
                                    align={col.align ?? 'right'}
                                    primary={col.primary}
                                  />
                                ) : (
                                  <span
                                    className={`font-mono tabular-nums ${
                                      col.primary ? 'text-copper-200' : 'text-ink-50'
                                    }`}
                                  >
                                    {display}
                                  </span>
                                )}
                                {row.warning && col.key === table.columns[0].key && (
                                  <span
                                    className="ml-2 inline-flex items-center text-[10px] text-copper-300"
                                    title={row.warning}
                                  >
                                    ⚠
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {table.notes && table.notes.length > 0 && (
        <aside className="mt-8 space-y-1">
          {table.notes.map((note, i) => (
            <p key={i} className="text-xs text-ink-500 leading-relaxed">
              {note}
            </p>
          ))}
        </aside>
      )}
    </div>
  );
}
