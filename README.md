# Elektroberegning — ELE2 & ELE3 eksamenshjelpemiddel

Offline-kalkulator for elektrofaget. 58 kjerneformler + 10 referansetabeller fra NEK 400. Bygget i Next.js 15 + TypeScript + Tailwind, statisk eksport — fungerer 100 % uten internett.

> **Hjelpemiddel, ikke autoritet.** Verifiser alle tabell-verdier mot Eltabellen eller gjeldende NEK 400 før samsvarserklæring. Hver tabell har en banner som viser verifikasjons-status.

---

## Eksamens-bruk (rask oppstart)

```bash
cd ~/Sky/elektro-kalkulator
pnpm build               # bygger statisk i out/
pnpm exec serve out -p 4747
```

Åpne **http://localhost:4747** i Chrome eller Safari.

Kommandoen kan tas i bruk-direkte hvis appen allerede er bygget — `pnpm build` trenger du bare å kjøre når koden endrer seg.

### Tastatursnarveier
- `⌘K` / `Ctrl+K` — åpne søk over formler og tabeller
- `↑` `↓` — navigér resultater
- `Enter` — åpne valgt
- `Esc` — lukk søk

### Fysikk-toggle
Bryteren "Fysikk" i topbaren viser 7 formler som er fysikk-bakgrunn (resonans, RC/RL, kondensator-energi osv.) — sjelden i praktisk eksamen, men kan slås på hvis du vil ha bredere referanse.

---

## Installere som PWA (Mac)

For å få ikon på dock og åpne uten terminal:

1. Start serveren én gang: `pnpm exec serve out -p 4747`
2. Åpne http://localhost:4747 i **Chrome**
3. Klikk install-ikonet i adresselinjen (eller `View → Install Elektro…`)
4. App-en åpnes nå som standalone vindu med eget ikon

Når den er installert: **du må fortsatt ha serveren kjørende** for at lokal URL skal svare. Service worker cacher innholdet, så hvis du har vært på alle sidene én gang, fungerer den offline også uten serveren — men da må Safari/Chrome være åpen.

**For garantert offline-tilgang under eksamen:**
```bash
pnpm exec serve out -p 4747 &
```
Kjør serveren i bakgrunnen før eksamen starter. Den henger der til du eksplisitt stopper den.

### iPhone backup

Hvis MacBook feiler:
1. Telefonen må være på samme WiFi som MacBook (eller bruk hot­spot)
2. Finn MacBook sin IP: `ipconfig getifaddr en0`
3. På telefon: åpne `http://[mac-ip]:4747`
4. Safari → del-knappen → "Legg til på hjemskjerm"

---

## Backup-plan hvis ALT feiler

1. Åpne `out/index.html` direkte i nettleser (dobbeltklikk) — fungerer for forsiden, men routing kan svikte
2. Print formelsiden som PDF før eksamen — bruk `⌘P` i nettleseren. Print-CSS er optimalisert for A4 (sort/hvit, ingen interaktive elementer)
3. Som siste utvei: hold Eltabellen og denne kjørte appen åpen som referanse, regn ut for hånd

---

## Innhold

**14 kategorier, 65 formler totalt (58 kjerne + 7 fysikk-bakgrunn):**
- Likestrøm (12) · Vekselstrøm enfase (13) · Trefase (5) · Spenningsfall (4)
- Kortslutning (5) · Vern (3) · Kabel (2) · Belastningsberegning (3)
- Nettsystemer (2) · Transformator (3) · Motor (5) · Belysning (2)
- Energi/varme (2) · Elektromagnetisme (4)

**10 referansetabeller:**
- Samtidighet · Vern-standardrekke · Sluttkontroll · Spenningsfall-krav
- RCD · Kabel-belastning (NEK 400 B.52) · Resistans Ω/km · Korreksjonsfaktorer
- Kabeltyper · Sone-krav (bad)

Hver formel: KaTeX-rendret matte, norsk forklaring, når den brukes, interaktive input­felter, 1–2 ferdig regnede eksempler.

---

## Stack

- Next.js 15 App Router · TypeScript strict · Tailwind CSS
- KaTeX (selvhostet) · Fuse.js (lokalt søk)
- Service worker for offline (manuell, ikke next-pwa)
- Static export — ingen API, ingen runtime

## Kvalitet

- TypeScript strict (`ingen any`)
- Lighthouse: Performance 92, Accessibility 100, Best Practices 100
- ARIA-live på resultater, keyboard-nav, `prefers-reduced-motion` respektert
- Norsk komma som desimaltegn i UI, eksempler verifisert mot eksamens­oppgaver

## Lisens

Privat — Sander Martinsen / Efffekt AS.
