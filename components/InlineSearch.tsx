'use client';

export function InlineSearch() {
  function open() {
    window.dispatchEvent(new CustomEvent('elektro-open-search'));
  }
  return (
    <button
      type="button"
      onClick={open}
      className="glass glass-hover group w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all"
      aria-label="Søk i hele appen — formler, tabeller, paragrafer"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-copper-300 shrink-0"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="flex-1 min-w-0">
        <span className="block text-base text-ink-50 truncate">
          Søk i alt
        </span>
        <span className="block text-xs text-ink-500 truncate mt-0.5">
          formler · tabeller · paragrafer — prøv «Ik min», «701», «FEL 14», «samsvar»
        </span>
      </span>
      <span className="hidden sm:flex items-center gap-1.5 shrink-0">
        <kbd className="inline-flex items-center justify-center min-w-[24px] h-[22px] rounded-md bg-ink-800/60 border border-ink-700/60 px-1.5 font-mono text-[10px] text-ink-300">
          ⌘K
        </kbd>
        <span className="font-mono text-[10px] text-ink-700">eller</span>
        <kbd className="inline-flex items-center justify-center min-w-[24px] h-[22px] rounded-md bg-ink-800/60 border border-ink-700/60 px-1.5 font-mono text-[12px] text-ink-300">
          /
        </kbd>
      </span>
    </button>
  );
}
