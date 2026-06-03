# CV Website Redesign — React + TypeScript + Tailwind

_Date: 2026-06-03_

## Overview

Rebuild the existing `my-cv-website/` (vanilla HTML/Bootstrap/CSS) as a new Next.js 14 App Router project in `cv-website-next/`. The visual design is taken from a completed prototype (Anthropic Design export). The original folder stays untouched during development.

Deploy to Vercel. Real email sending via a Vercel Serverless Function (Nodemailer).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + CSS custom properties (color tokens only) |
| Theming | `next-themes` (dark/light) + custom `PaletteProvider` context (Teal/Periwinkle/Green) |
| Fonts | Space Grotesk (display) · Plus Jakarta Sans (body) · JetBrains Mono (mono) via `next/font/google` |
| Email | Nodemailer via Vercel Serverless Function |
| Deployment | Vercel |

---

## Project Structure

```
cv-website-next/
├── app/
│   ├── layout.tsx              ← root layout: fonts, metadata, ThemeProvider, PaletteProvider
│   ├── page.tsx                ← single page, renders all section components
│   ├── globals.css             ← CSS variable color tokens only (~40 lines)
│   └── api/
│       └── contact/
│           └── route.ts        ← POST handler, Nodemailer
├── components/
│   ├── Nav.tsx                 ← floating pill nav, lang dropdown, theme toggle, mobile sheet
│   ├── Hero.tsx                ← title, portrait, chips, social links, scroll hint
│   ├── Marquee.tsx             ← tech marquee strip
│   ├── About.tsx               ← lead text, facts grid
│   ├── Work.tsx                ← editorial list rows with color-flood hover
│   ├── Timeline.tsx            ← animated fill line, tl-items
│   ├── Skills.tsx              ← futuristic console, tabs, meter cards
│   ├── Contact.tsx             ← floating-label form, aside with email/socials
│   ├── Footer.tsx
│   ├── BgField.tsx             ← animated colour blobs
│   ├── ScrollProgress.tsx      ← fixed top progress bar
│   └── Cursor.tsx              ← custom cursor dot + ring (desktop only)
├── context/
│   └── PaletteContext.tsx      ← data-palette attribute on <html>, localStorage
├── hooks/
│   ├── useLang.ts              ← active language, t(key), localStorage
│   └── useReveal.ts            ← IntersectionObserver scroll-reveal helper
├── lib/
│   ├── translations.ts         ← typed i18n strings (EN/DE/RU/UA)
│   └── skills.ts               ← SKILLS array with name, category, level
├── public/
│   └── assets/
│       └── avatar.webp         ← copied from my-cv-website/assets/
├── .env.local                  ← SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Theming

### Color Tokens (`globals.css`)

```css
:root {
  --accent: #164E63; --on-accent: #FFFFFF;
  --bg: #EEF9FB; --bg-soft: #FFFFFF;
  --ink: #102A32; --ink-2: #436670;
  --line: #D2E7EB; --card: #FFFFFF;
}
html.dark { --accent: #CCFBFE; --on-accent: #06262E; --bg: #061419; ... }
html[data-palette="peri"] { --accent: #405173; --bg: #F1F4FC; ... }
html[data-palette="peri"].dark { --accent: #D9E5FF; --bg: #0B0E17; ... }
html[data-palette="green"] { --accent: #1F8A5B; --bg: #EFFBF4; ... }
html[data-palette="green"].dark { --accent: #BBF7D0; --bg: #07150F; ... }
```

### Tailwind Config

Tokens map to Tailwind utilities:

```ts
colors: {
  accent: 'var(--accent)', 'on-accent': 'var(--on-accent)',
  bg: 'var(--bg)', 'bg-soft': 'var(--bg-soft)',
  ink: 'var(--ink)', 'ink-2': 'var(--ink-2)',
  line: 'var(--line)', card: 'var(--card)'
}
```

Usage in components: `bg-accent`, `text-ink`, `border-line`, `text-ink-2`, etc.

### Dark Mode

`next-themes` with `attribute="class"` — sets `html.dark`. Default: system preference.

### Palette

`PaletteContext` stores active palette (`"teal" | "peri" | "green"`), persists to `localStorage`, sets `document.documentElement.setAttribute("data-palette", palette)`. Teal is default (no attribute needed — `:root` covers it).

---

## Components

### Nav
- Floating pill, `position: sticky`, backdrop blur via Tailwind `backdrop-blur-md`
- Brand mark (MK), brand text, nav links (hidden on mobile)
- Right side: language dropdown, palette toggle (3 swatches popover — Teal/Periwinkle/Green), `next-themes` theme toggle button, hamburger (mobile)
- Mobile sheet: absolute positioned overlay, slides down on open

### Hero
- Two-column grid (text left, portrait right), collapses to single column on mobile
- Eyebrow with pulsing dot, large title with `--accent` colored last name
- CTA buttons (solid + ghost), social icon links (GitHub, LinkedIn, Email)
- Portrait: circular frame, dashed spinning ring, three floating chips
- Scroll hint arrow at bottom center

### Marquee
- CSS `animation: scroll` infinite linear, masked edges
- Tech names: React · TypeScript · JavaScript · Tailwind · Python · HTML · CSS · REST APIs

### About
- Two-column grid: large lead quote left, body text + facts table right
- Facts: Based in / Experience / Focus / Languages

### Work
- `<ul>` border-top list, each row is an `<a>` with CSS grid
- Hover: accent color floods the row background, text switches to `--on-accent`
- Columns: index number · name+description · tech tags · arrow icon

### Timeline
- Vertical line with animated fill (`height` driven by scroll position via `useScroll`)
- Each item: date left, node circle, card right
- Last node is open/hollow (future)

### Skills
- Dark "console" panel with corner brackets, scan-line animation, blinking caret
- Tabs: all / languages / frontend / backend / tools
- Cards: skill name, category badge, 5-segment meter bar, level label
- Active tab filters via `data-cat` — dimmed cards use `opacity-20 grayscale`

### Contact
- Two-column: aside (lead text, email link, GitHub/LinkedIn) + form
- Floating label inputs (label animates up on focus/fill via CSS `:not(:placeholder-shown)`)
- Submit → `fetch('/api/contact')` → success/error status message

### Footer
- Brand mark, tagline, back-to-top link
- Bottom row: copyright, address + email

---

## Contact API (`app/api/contact/route.ts`)

```ts
// POST /api/contact
// Body: { name, email, subject, message }
// Sends email via Nodemailer using env vars
// Returns: 200 { ok: true } | 400 { error } | 500 { error }
```

Environment variables (`.env.local`, also set in Vercel dashboard):
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`

---

## i18n

`lib/translations.ts` exports:

```ts
type Lang = 'en' | 'de' | 'ru' | 'ua'
type Translations = { [key: string]: string }
const TRANSLATIONS: Record<Lang, Translations> = { ... }
```

`useLang` hook: stores active lang in `localStorage` under `mk-lang`, exposes `lang`, `setLang`, `t(key: string)` helper. No external library.

---

## Animations

All implemented with Tailwind + small CSS keyframes in `globals.css`:

| Effect | Approach |
|---|---|
| Scroll reveal | `useReveal` hook (IntersectionObserver), adds `in` class → Tailwind `transition-all opacity-0 translate-y-8` → `opacity-100 translate-y-0` |
| Blob float | CSS keyframe `float`, driven by `--motion` CSS variable |
| Portrait ring spin | CSS keyframe `spin` |
| Marquee scroll | CSS keyframe `scroll` |
| Skill meter fill | CSS `scaleX(0→1)` on parent `.in` class |
| Custom cursor | `mousemove` listener in `Cursor.tsx`, RAF loop for ring lag |
| Timeline fill | scroll listener sets `height` on `.tl-fill` span |

---

## Deployment

- `cv-website-next/` is a standalone Next.js project
- Deploy via Vercel dashboard or `vercel` CLI from that folder
- Set env vars in Vercel project settings: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`
- Vercel auto-detects Next.js, API routes become serverless functions

---

## Out of Scope

- The existing `my-cv-website/` folder — left unchanged
- Server folder / Firebase — replaced by Vercel Function
- Video backgrounds — replaced by animated colour blobs (per design)
- Bootstrap — removed entirely
