import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bakgrunn/tekst-skala — bruker CSS-variabler så light/dark veksles
        // via [data-theme] på <html>. I dark mode: 950 = mørkest bg, 50 = lysest tekst.
        // I light mode er verdiene byttet om.
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          200: 'rgb(var(--ink-200) / <alpha-value>)',
          50: 'rgb(var(--ink-50) / <alpha-value>)',
        },
        // Aksent — kobber/oransje. Lett justert i light for kontrast.
        copper: {
          50: 'rgb(var(--copper-50) / <alpha-value>)',
          100: 'rgb(var(--copper-100) / <alpha-value>)',
          200: 'rgb(var(--copper-200) / <alpha-value>)',
          300: 'rgb(var(--copper-300) / <alpha-value>)',
          400: 'rgb(var(--copper-400) / <alpha-value>)',
          500: 'rgb(var(--copper-500) / <alpha-value>)',
          600: 'rgb(var(--copper-600) / <alpha-value>)',
          700: 'rgb(var(--copper-700) / <alpha-value>)',
        },
        // Resultat-fremheving (grønn). Mørkere i light for kontrast.
        live: {
          400: 'rgb(var(--live-400) / <alpha-value>)',
          500: 'rgb(var(--live-500) / <alpha-value>)',
        },
        // Feil/kritisk status (rød/burgunder). Holdes dempet for å unngå
        // "alarmestetikk" og matche resten av paletten.
        danger: {
          300: 'rgb(var(--danger-300) / <alpha-value>)',
          400: 'rgb(var(--danger-400) / <alpha-value>)',
          500: 'rgb(var(--danger-500) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-display)', 'serif'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
