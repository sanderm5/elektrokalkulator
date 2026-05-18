'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * "Forrige resultat huskes" — kjede Ib → Krav 1 → ΔU.
 *
 * Lagrer siste OK-resultat per output-symbol i sessionStorage (forsvinner
 * når fanen lukkes, ikke ved navigasjon). Neste kalkulator kan slå opp på
 * input.symbol og foreslå "Bruk forrige Ib = 20,0 A".
 */

export type LastResult = {
  value: number;
  formulaId: string;
  formulaTitle: string;
  /** Tidsstempel — vises som "for 2 minutter siden". */
  t: number;
};

type LastResults = Record<string, LastResult>;

const KEY = 'elektro-kalk-last-results-v1';

function readStore(): LastResults {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object') {
      return parsed as LastResults;
    }
    return {};
  } catch (err) {
    console.error('Kunne ikke lese forrige resultat:', err);
    return {};
  }
}

function writeStore(store: LastResults): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent('elektro-last-results-changed'));
  } catch (err) {
    console.error('Kunne ikke lagre forrige resultat:', err);
  }
}

export function saveLastResult(
  symbol: string,
  value: number,
  formulaId: string,
  formulaTitle: string,
): void {
  if (!Number.isFinite(value)) return;
  const store = readStore();
  store[symbol] = {
    value,
    formulaId,
    formulaTitle,
    t: Date.now(),
  };
  writeStore(store);
}

/**
 * Hook for å lese siste resultat for et input-symbol.
 * Returnerer null hvis det er fra samme formel (unngå sirkulær foreslag).
 */
export function useLastResult(
  inputSymbol: string,
  currentFormulaId: string,
): LastResult | null {
  const [store, setStore] = useState<LastResults>(() => readStore());

  useEffect(() => {
    function onChange() {
      setStore(readStore());
    }
    window.addEventListener('elektro-last-results-changed', onChange);
    return () => {
      window.removeEventListener('elektro-last-results-changed', onChange);
    };
  }, []);

  const entry = store[inputSymbol];
  if (!entry || entry.formulaId === currentFormulaId) return null;
  return entry;
}

/** Mapping av output-symbol → kompatible input-symbol. */
const SYMBOL_ALIASES: Record<string, string[]> = {
  I_b: ['Ib', 'I'],
  I_n: ['In'],
  I_z: ['Iz'],
  I_k: ['Ik'],
  'I_k,min': ['Ik', 'I'],
  'I_k,maks': ['Ik'],
  U_b: ['Ub'],
  'Z_s,maks': ['Zs', 'Zsmin'],
  'I_ov,beregnet': ['I_beregnet', 'Iberegnet'],
};

/**
 * Returnerer kanonisk lagrings-nøkkel for et output-symbol. Bruker
 * eksakt symbol som default, men aliasser kan tilordnes.
 */
export function canonicalSymbol(s: string): string {
  return s.replace(/[\s_]/g, '');
}

export function findCompatibleResult(
  inputSymbol: string,
  store: LastResults = readStore(),
): { entry: LastResult; sourceSymbol: string } | null {
  const target = canonicalSymbol(inputSymbol);
  for (const [storedSym, entry] of Object.entries(store)) {
    if (canonicalSymbol(storedSym) === target) {
      return { entry, sourceSymbol: storedSym };
    }
    const aliases = SYMBOL_ALIASES[storedSym] ?? [];
    if (aliases.map(canonicalSymbol).includes(target)) {
      return { entry, sourceSymbol: storedSym };
    }
  }
  return null;
}

export function useCompatibleLastResult(
  inputSymbol: string,
  currentFormulaId: string,
): { entry: LastResult; sourceSymbol: string } | null {
  const [store, setStore] = useState<LastResults>(() => readStore());

  useEffect(() => {
    function onChange() {
      setStore(readStore());
    }
    window.addEventListener('elektro-last-results-changed', onChange);
    return () => {
      window.removeEventListener('elektro-last-results-changed', onChange);
    };
  }, []);

  const found = findCompatibleResult(inputSymbol, store);
  if (!found) return null;
  if (found.entry.formulaId === currentFormulaId) return null;
  return found;
}
