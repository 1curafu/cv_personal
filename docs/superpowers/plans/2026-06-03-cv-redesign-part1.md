# CV Website Redesign — Part 1: Foundation + Infrastructure + Hero

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Next.js 16 project, wire up theming + i18n + data, and build through the Hero section — leaving a visible, running page with Nav and Hero complete.

**Architecture:** `cv-website-next/` lives alongside the untouched `my-cv-website/`. CSS custom properties handle 3 palettes × 2 modes. `next-themes` owns dark/light. `PaletteContext` owns palette. `useLang` owns i18n. All typed.

**Tech Stack:** Next.js 16.2 (App Router), React 19.2, TypeScript, Tailwind CSS v4.3, next-themes 0.4.6

**Continued in:** `2026-06-03-cv-redesign-part2.md` (Marquee → Footer → page.tsx → API → deploy)

---

## File Map (Part 1)

| File | Responsibility |
|---|---|
| `cv-website-next/` | New project root — existing `my-cv-website/` untouched |
| `app/globals.css` | CSS variable color tokens + custom utilities + animation keyframes |
| `tailwind.config.ts` | Color tokens, fonts, keyframes, darkMode: 'class' |
| `lib/translations.ts` | Typed i18n strings EN / DE / RU / UA |
| `lib/skills.ts` | Skills data array with types |
| `context/PaletteContext.tsx` | Palette state, localStorage, `data-palette` on `<html>` |
| `hooks/useLang.ts` | Active lang, `t(key)` helper, localStorage |
| `hooks/useReveal.ts` | IntersectionObserver scroll-reveal ref |
| `app/layout.tsx` | Root layout: fonts, metadata, ThemeProvider, PaletteProvider |
| `components/BgField.tsx` | Animated colour blobs + grain |
| `components/ScrollProgress.tsx` | Fixed top progress bar |
| `components/Cursor.tsx` | Custom dot + ring cursor (desktop only) |
| `components/PaletteToggle.tsx` | 3-swatch popover button |
| `components/Nav.tsx` | Floating pill nav |
| `components/Hero.tsx` | Title, portrait, chips, social links |

---

## Task 1 — Scaffold Project

**Files:**
- Create: `cv-website-next/` (via create-next-app)

- [ ] **Run create-next-app**

```bash
cd "/Users/1curafu/Library/Mobile Documents/com~apple~CloudDocs/Informatik/cv_personal"
npx create-next-app@latest cv-website-next \
  --typescript \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

When prompted "Would you like to use Tailwind CSS?" select **No** — we install v4 manually below.
When prompted for any remaining questions, accept defaults.

- [ ] **Install Tailwind v4 + PostCSS plugin**

```bash
cd "/Users/1curafu/Library/Mobile Documents/com~apple~CloudDocs/Informatik/cv_personal/cv-website-next"
npm install tailwindcss@latest @tailwindcss/postcss postcss
```

- [ ] **Create `postcss.config.mjs`**

```js
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

- [ ] **Install runtime dependencies**

```bash
npm install next-themes nodemailer
npm install --save-dev @types/nodemailer
```

- [ ] **Install test dependencies**

```bash
npm install --save-dev jest jest-environment-jsdom \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event @types/jest ts-jest
```

- [ ] **Create `jest.config.ts`**

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

- [ ] **Create `jest.setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Add test script to `package.json`**

Open `package.json` and add to `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Verify project boots**

```bash
npm run dev
```

Expected: Next.js dev server starts on http://localhost:3000. Default Next.js page loads.

- [ ] **Commit**

```bash
git add cv-website-next
git commit -m "feat: scaffold Next.js 14 project for CV redesign"
```

---

## Task 2 — Color Token System (`globals.css`)

**Files:**
- Modify: `cv-website-next/app/globals.css`

> **Tailwind v4 note:** No `tailwind.config.ts` needed. All theme customisation lives in `globals.css` using `@theme` (generates CSS variables + utilities) and `@theme inline` (maps existing CSS variables to utilities without duplicating them).

- [ ] **Replace the entire contents of `globals.css`**

```css
@import "tailwindcss";

/* ── Dark mode: activate when .dark class is on <html> (set by next-themes) ── */
@custom-variant dark (&:where(.dark, .dark *));

/* ── Raw CSS color tokens — 3 palettes × 2 modes ── */
/* These cascade normally; @theme inline below maps them to Tailwind utilities. */
:root {
  /* Teal (default) — light */
  --accent:    #164E63;
  --on-accent: #FFFFFF;
  --bg:        #EEF9FB;
  --bg-soft:   #FFFFFF;
  --ink:       #102A32;
  --ink-2:     #436670;
  --line:      #D2E7EB;
  --card:      #FFFFFF;

  /* Console panel — always dark, never changes with mode/palette */
  --c-bg:   #0B0A12;
  --c-line: rgba(255,255,255,.10);
  --c-dim:  rgba(255,255,255,.45);
  --c-fg:   #ECEAF6;
}

html.dark {
  --accent:    #CCFBFE;
  --on-accent: #06262E;
  --bg:        #061419;
  --bg-soft:   #0B1E25;
  --ink:       #E9F8FB;
  --ink-2:     #7FA8B3;
  --line:      #143038;
  --card:      #0B1E25;
}

/* Periwinkle palette */
html[data-palette="peri"] {
  --accent:    #405173; --on-accent: #FFFFFF;
  --bg:        #F1F4FC; --bg-soft:   #FFFFFF;
  --ink:       #1B2236; --ink-2:     #4A5573;
  --line:      #DCE3F3; --card:      #FFFFFF;
}
html[data-palette="peri"].dark {
  --accent:    #D9E5FF; --on-accent: #1B2236;
  --bg:        #0B0E17; --bg-soft:   #121726;
  --ink:       #EEF2FC; --ink-2:     #9AA6C4;
  --line:      #232B40; --card:      #121726;
}

/* Green palette */
html[data-palette="green"] {
  --accent:    #1F8A5B; --on-accent: #FFFFFF;
  --bg:        #EFFBF4; --bg-soft:   #FFFFFF;
  --ink:       #0F2A1E; --ink-2:     #43705B;
  --line:      #D3EBDE; --card:      #FFFFFF;
}
html[data-palette="green"].dark {
  --accent:    #BBF7D0; --on-accent: #06291A;
  --bg:        #07150F; --bg-soft:   #0C1F17;
  --ink:       #E9FBF1; --ink-2:     #7FB39A;
  --line:      #143028; --card:      #0C1F17;
}

/* ── Map raw vars to Tailwind v4 utilities via @theme inline ── */
/* inline = no duplicate CSS variables emitted; just creates the utility classes */
@theme inline {
  --color-accent:    var(--accent);
  --color-on-accent: var(--on-accent);
  --color-bg:        var(--bg);
  --color-bg-soft:   var(--bg-soft);
  --color-ink:       var(--ink);
  --color-ink-2:     var(--ink-2);
  --color-line:      var(--line);
  --color-card:      var(--card);

  /* Font families (populated by next/font CSS variables from layout.tsx) */
  --font-display: var(--font-space-grotesk), system-ui, sans-serif;
  --font-body:    var(--font-plus-jakarta),  system-ui, sans-serif;
  --font-mono:    var(--font-jetbrains),     ui-monospace, monospace;

  /* Max width / radius tokens */
  --width-site:   1180px;
  --radius-site:  22px;

  /* ── Animations ── */
  --animate-float-1:    float 30s ease-in-out infinite;
  --animate-float-2:    float 30s ease-in-out infinite -8s;
  --animate-float-3:    float 30s ease-in-out infinite -14s;
  --animate-marquee:    marqueeScroll 28s linear infinite;
  --animate-bob-1:      bob 5s ease-in-out infinite;
  --animate-bob-2:      bob 5s ease-in-out infinite -1.5s;
  --animate-bob-3:      bob 5s ease-in-out infinite -3s;
  --animate-spin-slow:  spinSlow 28s linear infinite;
  --animate-scan:       scanY 7s linear infinite;
  --animate-blink:      blink 1.1s step-end infinite;
  --animate-glow-pulse: glowPulse 2.4s ease-in-out infinite;

  @keyframes float {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(8vmax,4vmax) scale(1.12); }
    66%      { transform: translate(-6vmax,8vmax) scale(.92); }
  }
  @keyframes marqueeScroll {
    to { transform: translateX(-50%); }
  }
  @keyframes bob {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-9px); }
  }
  @keyframes spinSlow {
    to { transform: rotate(360deg); }
  }
  @keyframes scanY {
    0%   { transform: translateY(-20%); opacity: 0; }
    12%  { opacity: 1; }
    88%  { opacity: 1; }
    100% { transform: translateY(560%); opacity: 0; }
  }
  @keyframes blink {
    0%,49%   { opacity: 1; }
    50%,100% { opacity: 0; }
  }
  @keyframes glowPulse {
    0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 60%, transparent); }
    70%  { box-shadow: 0 0 0 9px transparent; }
    100% { box-shadow: 0 0 0 0 transparent; }
  }
}

/* ── Base ── */
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body {
  font-family: var(--font-body, system-ui, sans-serif);
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  transition: background .5s ease, color .5s ease;
}

::selection { background: var(--accent); color: var(--on-accent); }
h1, h2, h3 { font-family: var(--font-display, system-ui, sans-serif); }
a { color: inherit; text-decoration: none; }

/* ── Reveal animation ── */
.reveal {
  opacity: 0;
  transform: translateY(34px);
  transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1);
}
.reveal.in {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; } }

/* ── Floating label inputs ── */
.field { position: relative; }
.field input, .field textarea {
  width: 100%;
  font-size: 16px;
  color: var(--ink);
  background: var(--bg-soft);
  border: 1.5px solid var(--line);
  border-radius: 14px;
  padding: 20px 16px 8px;
  transition: border-color .25s, box-shadow .25s;
  resize: vertical;
  font-family: inherit;
}
.field textarea { min-height: 120px; }
.field label {
  position: absolute;
  left: 16px;
  top: 15px;
  font-size: 15px;
  color: var(--ink-2);
  pointer-events: none;
  transition: .2s cubic-bezier(.2,.7,.2,1);
}
.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 16%, transparent);
}
.field input:focus + label,
.field textarea:focus + label,
.field input:not(:placeholder-shown) + label,
.field textarea:not(:placeholder-shown) + label {
  top: 7px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .03em;
  color: var(--accent);
  text-transform: uppercase;
}

/* ── Custom utilities ── */
@layer utilities {
  .accent-bg-10  { background-color: color-mix(in srgb, var(--accent) 10%, transparent); }
  .accent-bg-12  { background-color: color-mix(in srgb, var(--accent) 12%, transparent); }
  .accent-bg-14  { background-color: color-mix(in srgb, var(--accent) 14%, transparent); }
  .accent-shadow { box-shadow: 0 12px 30px -12px var(--accent); }
  .accent-shadow-lg { box-shadow: 0 18px 38px -12px var(--accent); }
  .accent-ring   { box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 16%, transparent); }
  .accent-glow   { box-shadow: 0 0 22px -6px var(--accent); }
  .accent-glow-lg { box-shadow: 0 0 26px -10px var(--accent); }
  .text-on-accent { color: var(--on-accent); }
  .bg-c-bg    { background-color: var(--c-bg); }
  .text-c-fg  { color: var(--c-fg); }
  .text-c-dim { color: var(--c-dim); }
  .border-c-line { border-color: var(--c-line); }
}
```

- [ ] **Commit**

```bash
git add cv-website-next/app/globals.css
git commit -m "feat: add CSS color token system and custom utilities"
```

---

## Task 3 — Verify Tailwind v4 Build

> **Tailwind v4 note:** There is no `tailwind.config.ts`. All configuration (colors, fonts, keyframes, dark mode variant) was written directly into `globals.css` in Task 2. This task just confirms the build is healthy.

**Files:** none to create

- [ ] **Delete the scaffolded `tailwind.config.ts` if it exists**

```bash
rm -f cv-website-next/tailwind.config.ts cv-website-next/tailwind.config.js
```

- [ ] **Verify Tailwind builds without errors**

```bash
cd cv-website-next && npm run build
```

Expected: Build completes. Zero errors. (Warnings about missing page content are fine.)

- [ ] **Commit**

```bash
git add -A cv-website-next
git commit -m "feat: configure Tailwind v4 via globals.css — no tailwind.config.ts needed"
```

---

## Task 4 — Translations (`lib/translations.ts`)

**Files:**
- Create: `cv-website-next/lib/translations.ts`

- [ ] **Create `lib/` directory and write `translations.ts`**

```ts
export type Lang = 'en' | 'de' | 'ru' | 'ua'

export type TranslationKey =
  | 'titleText' | 'brandText'
  | 'navAbout' | 'navProjects' | 'navTimeline' | 'navSkills' | 'navContact'
  | 'heroEyebrow' | 'heroTagline' | 'heroCtaWork' | 'heroCtaContact'
  | 'chipFullstack' | 'chipYears' | 'scrollHint'
  | 'aboutHeading' | 'aboutLead' | 'aboutText'
  | 'factLocationK' | 'factExpK' | 'factExpV' | 'factFocusK' | 'factFocusV' | 'factLangK'
  | 'projectsHeading'
  | 'projectFirstName'  | 'projectFirstDescription'
  | 'projectSecondName' | 'projectSecondDescription'
  | 'projectThirdName'  | 'projectThirdDescription'
  | 'projectFourthName' | 'projectFourthDescription'
  | 'timelineHeading'
  | 'timelineFirstDate'  | 'timelineFirstName'  | 'timelineFirstDescription'
  | 'timelineSecondDate' | 'timelineSecondName' | 'timelineSecondDescription'
  | 'timelineThirdDate'  | 'timelineThirdName'  | 'timelineThirdDescription'
  | 'timelineFourthDate' | 'timelineFourthName' | 'timelineFourthDescription'
  | 'skillsHeading' | 'skillsNote'
  | 'contactHeading' | 'contactLead'
  | 'contactNameLabel' | 'contactEmailLabel' | 'contactSubjectLabel' | 'contactMessageLabel'
  | 'contactSubmitBtn' | 'contactSending'
  | 'footerCta' | 'footerTop'

export type Translations = Record<TranslationKey, string>

export const TRANSLATIONS: Record<Lang, Translations> = {
  en: {
    titleText: 'Mykhailo Khimich — Dev Spot',
    brandText: "Misha's Dev Spot",
    navAbout: 'About', navProjects: 'Work', navTimeline: 'Timeline',
    navSkills: 'Skills', navContact: 'Contact',
    heroEyebrow: 'Available for work · Rapperswil-Jona, CH',
    heroTagline: 'Passionate web developer. Simple, focused, effective — building things that are genuinely useful.',
    heroCtaWork: 'See my work', heroCtaContact: 'Get in touch',
    chipFullstack: 'Fullstack', chipYears: '2+ yrs', scrollHint: 'Scroll',
    aboutHeading: 'About me',
    aboutLead: "I believe coding doesn't have to be boring — it can be creative, engaging, and even fun.",
    aboutText: "I'm a passionate fullstack developer with 2+ years of experience across frontend and backend. I've mostly worked independently, and I'm eager to grow within a team where collaboration and shared problem-solving can thrive. I enjoy building functional, well-structured web applications that deliver real value to the people who use them.",
    factLocationK: 'Based in', factExpK: 'Experience', factExpV: '2+ years, fullstack',
    factFocusK: 'Focus', factFocusV: 'Web apps, APIs', factLangK: 'Languages',
    projectsHeading: 'Selected work',
    projectFirstName: 'Currency',
    projectFirstDescription: 'A Django fullstack app pulling real-time exchange rates from major banks via APIs, letting users place currency orders online.',
    projectSecondName: 'Music Webstore',
    projectSecondDescription: 'A themed music store inspired by Apple Music — discover and play animal-inspired tracks, build a profile and place orders through a responsive UI.',
    projectThirdName: 'SkyLi-Weathercast',
    projectThirdDescription: 'A weather forecast app combining two separate APIs into one clean, responsive interface for accurate, location-based conditions.',
    projectFourthName: 'Task-Manager',
    projectFourthDescription: 'A team collaboration environment for organising, assigning and tracking tasks together in one shared workspace.',
    timelineHeading: 'The journey',
    timelineFirstDate: '2022 — 2023', timelineFirstName: 'Completed full Python course',
    timelineFirstDescription: 'Finished an intensive Python course built around Django, then started a real project to apply the new skills.',
    timelineSecondDate: '2023 — now', timelineSecondName: 'Developers School — IMS Rapperswil-Jona',
    timelineSecondDescription: 'Started the BM school on a software-developer track, deepening both theory and hands-on practice.',
    timelineThirdDate: '2023 — now', timelineThirdName: 'Dived into web development',
    timelineThirdDescription: 'Studied HTML, CSS, JavaScript and Python, building responsive interfaces and fullstack projects.',
    timelineFourthDate: '2025 — next', timelineFourthName: "What's next",
    timelineFourthDescription: "Looking to join a team where I can keep learning, ship real products and grow as an engineer.",
    skillsHeading: 'What I work with',
    skillsNote: 'Currently building with <b>React</b>, <b>TypeScript</b> and <b>Tailwind</b>.',
    contactHeading: "Let's build something",
    contactLead: 'Have a project, a role, or just a question? Drop me a line — I usually reply within a day.',
    contactNameLabel: 'Your name', contactEmailLabel: 'Email',
    contactSubjectLabel: 'Subject', contactMessageLabel: 'Message',
    contactSubmitBtn: 'Send message', contactSending: 'Sending…',
    footerCta: 'Thanks for scrolling all the way down.', footerTop: 'Back to top',
  },
  de: {
    titleText: 'Mykhailo Khimich — Dev Spot',
    brandText: 'Mishas Dev Spot',
    navAbout: 'Über mich', navProjects: 'Projekte', navTimeline: 'Zeitachse',
    navSkills: 'Fähigkeiten', navContact: 'Kontakt',
    heroEyebrow: 'Offen für Jobs · Rapperswil-Jona, CH',
    heroTagline: 'Leidenschaftlicher Web-Entwickler. Einfach, fokussiert, effektiv — ich baue Dinge, die wirklich nützlich sind.',
    heroCtaWork: 'Meine Arbeit', heroCtaContact: 'Kontakt aufnehmen',
    chipFullstack: 'Fullstack', chipYears: '2+ Jahre', scrollHint: 'Scrollen',
    aboutHeading: 'Über mich',
    aboutLead: 'Programmieren muss nicht langweilig sein — es kann kreativ, spannend und sogar unterhaltsam sein.',
    aboutText: 'Ich bin ein leidenschaftlicher Fullstack-Entwickler mit über zwei Jahren Erfahrung in Frontend und Backend. Bisher habe ich meist eigenständig gearbeitet und möchte mich nun in einem Team weiterentwickeln, in dem Zusammenarbeit und gemeinsames Problemlösen gedeihen. Ich baue gern funktionale, gut strukturierte Webanwendungen, die den Nutzern echten Mehrwert bieten.',
    factLocationK: 'Wohnort', factExpK: 'Erfahrung', factExpV: '2+ Jahre, Fullstack',
    factFocusK: 'Fokus', factFocusV: 'Web-Apps, APIs', factLangK: 'Sprachen',
    projectsHeading: 'Ausgewählte Projekte',
    projectFirstName: 'Currency',
    projectFirstDescription: 'Eine Django-Fullstack-App, die Echtzeit-Wechselkurse grosser Banken über APIs abruft und Devisenaufträge online ermöglicht.',
    projectSecondName: 'Music Webstore',
    projectSecondDescription: 'Ein thematischer Musikshop, inspiriert von Apple Music — tierisch inspirierte Tracks entdecken, Profil anlegen und über eine responsive Oberfläche bestellen.',
    projectThirdName: 'SkyLi-Weathercast',
    projectThirdDescription: 'Eine Wetter-App, die zwei separate APIs in einer sauberen, responsiven Oberfläche für präzise, ortsbezogene Vorhersagen vereint.',
    projectFourthName: 'Task-Manager',
    projectFourthDescription: 'Eine Umgebung für Teamarbeit, um Aufgaben gemeinsam in einem geteilten Workspace zu organisieren, zuzuweisen und zu verfolgen.',
    timelineHeading: 'Der Weg',
    timelineFirstDate: '2022 — 2023', timelineFirstName: 'Python-Vollkurs abgeschlossen',
    timelineFirstDescription: 'Einen intensiven Python-Kurs rund um Django abgeschlossen und anschliessend ein echtes Projekt gestartet, um das Gelernte anzuwenden.',
    timelineSecondDate: '2023 — jetzt', timelineSecondName: 'Entwicklerschule — IMS Rapperswil-Jona',
    timelineSecondDescription: 'Die BM-Schule mit Richtung Software-Entwicklung begonnen und Theorie wie Praxis vertieft.',
    timelineThirdDate: '2023 — jetzt', timelineThirdName: 'In die Web-Entwicklung eingetaucht',
    timelineThirdDescription: 'HTML, CSS, JavaScript und Python gelernt und responsive Interfaces sowie Fullstack-Projekte gebaut.',
    timelineFourthDate: '2025 — weiter', timelineFourthName: 'Was kommt',
    timelineFourthDescription: 'Auf der Suche nach einem Team, in dem ich weiterlernen, echte Produkte liefern und als Entwickler wachsen kann.',
    skillsHeading: 'Womit ich arbeite',
    skillsNote: 'Aktuell baue ich mit <b>React</b>, <b>TypeScript</b> und <b>Tailwind</b>.',
    contactHeading: 'Lass uns etwas bauen',
    contactLead: 'Ein Projekt, eine Stelle oder einfach eine Frage? Schreib mir — meist antworte ich innerhalb eines Tages.',
    contactNameLabel: 'Dein Name', contactEmailLabel: 'E-Mail',
    contactSubjectLabel: 'Betreff', contactMessageLabel: 'Nachricht',
    contactSubmitBtn: 'Nachricht senden', contactSending: 'Wird gesendet…',
    footerCta: 'Danke fürs Scrollen bis ganz nach unten.', footerTop: 'Nach oben',
  },
  ru: {
    titleText: 'Mykhailo Khimich — Dev Spot',
    brandText: 'Dev Spot Миши',
    navAbout: 'Обо мне', navProjects: 'Проекты', navTimeline: 'Хронология',
    navSkills: 'Навыки', navContact: 'Контакты',
    heroEyebrow: 'Открыт к работе · Рапперсвиль-Йона, CH',
    heroTagline: 'Увлечённый веб-разработчик. Просто, сфокусированно, эффективно — создаю по-настоящему полезные вещи.',
    heroCtaWork: 'Мои работы', heroCtaContact: 'Связаться',
    chipFullstack: 'Fullstack', chipYears: '2+ года', scrollHint: 'Листай',
    aboutHeading: 'Обо мне',
    aboutLead: 'Код не обязан быть скучным — он может быть творческим, увлекательным и даже весёлым.',
    aboutText: 'Я увлечённый fullstack-разработчик с более чем двухлетним опытом во фронтенде и бэкенде. В основном работал самостоятельно и теперь хочу развиваться в команде, где ценят сотрудничество и совместное решение задач. Люблю создавать функциональные, хорошо структурированные веб-приложения, приносящие реальную пользу людям.',
    factLocationK: 'Город', factExpK: 'Опыт', factExpV: '2+ года, fullstack',
    factFocusK: 'Фокус', factFocusV: 'Веб-приложения, API', factLangK: 'Языки',
    projectsHeading: 'Избранные работы',
    projectFirstName: 'Currency',
    projectFirstDescription: 'Fullstack-приложение на Django, которое получает курсы валют крупных банков через API и позволяет оформлять валютные заявки онлайн.',
    projectSecondName: 'Music Webstore',
    projectSecondDescription: 'Тематический музыкальный магазин в духе Apple Music — слушайте треки, создавайте профиль и оформляйте заказы в адаптивном интерфейсе.',
    projectThirdName: 'SkyLi-Weathercast',
    projectThirdDescription: 'Приложение прогноза погоды, объединяющее два разных API в одном чистом адаптивном интерфейсе для точных данных по локации.',
    projectFourthName: 'Task-Manager',
    projectFourthDescription: 'Среда для командной работы: организация, распределение и отслеживание задач в общем рабочем пространстве.',
    timelineHeading: 'Путь',
    timelineFirstDate: '2022 — 2023', timelineFirstName: 'Завершил полный курс Python',
    timelineFirstDescription: 'Прошёл интенсивный курс Python вокруг Django, затем начал реальный проект, чтобы применить навыки.',
    timelineSecondDate: '2023 — сейчас', timelineSecondName: 'Школа разработчиков — IMS Рапперсвиль-Йона',
    timelineSecondDescription: 'Начал учёбу по направлению разработки ПО, углубляя и теорию, и практику.',
    timelineThirdDate: '2023 — сейчас', timelineThirdName: 'Погрузился в веб-разработку',
    timelineThirdDescription: 'Изучал HTML, CSS, JavaScript и Python, создавая адаптивные интерфейсы и fullstack-проекты.',
    timelineFourthDate: '2025 — дальше', timelineFourthName: 'Что дальше',
    timelineFourthDescription: 'Ищу команду, где смогу продолжать учиться, выпускать реальные продукты и расти как инженер.',
    skillsHeading: 'С чем я работаю',
    skillsNote: 'Сейчас работаю с <b>React</b>, <b>TypeScript</b> и <b>Tailwind</b>.',
    contactHeading: 'Давай что-нибудь создадим',
    contactLead: 'Есть проект, вакансия или просто вопрос? Напишите мне — обычно отвечаю в течение дня.',
    contactNameLabel: 'Ваше имя', contactEmailLabel: 'Email',
    contactSubjectLabel: 'Тема', contactMessageLabel: 'Сообщение',
    contactSubmitBtn: 'Отправить', contactSending: 'Отправка…',
    footerCta: 'Спасибо, что долистали до конца.', footerTop: 'Наверх',
  },
  ua: {
    titleText: 'Mykhailo Khimich — Dev Spot',
    brandText: 'Dev Spot Міші',
    navAbout: 'Про мене', navProjects: 'Проєкти', navTimeline: 'Хронологія',
    navSkills: 'Навички', navContact: 'Контакти',
    heroEyebrow: 'Відкритий до роботи · Рапперсвіль-Йона, CH',
    heroTagline: 'Захоплений веброзробник. Просто, сфокусовано, ефективно — створюю по-справжньому корисні речі.',
    heroCtaWork: 'Мої роботи', heroCtaContact: 'Звʼязатися',
    chipFullstack: 'Fullstack', chipYears: '2+ роки', scrollHint: 'Гортай',
    aboutHeading: 'Про мене',
    aboutLead: 'Код не мусить бути нудним — він може бути творчим, захопливим і навіть веселим.',
    aboutText: 'Я захоплений fullstack-розробник із понад дворічним досвідом у фронтенді та бекенді. Здебільшого працював самостійно й тепер хочу розвиватися в команді, де цінують співпрацю та спільне розвʼязання задач. Люблю створювати функціональні, добре структуровані вебзастосунки, що приносять реальну користь людям.',
    factLocationK: 'Місто', factExpK: 'Досвід', factExpV: '2+ роки, fullstack',
    factFocusK: 'Фокус', factFocusV: 'Вебзастосунки, API', factLangK: 'Мови',
    projectsHeading: 'Вибрані роботи',
    projectFirstName: 'Currency',
    projectFirstDescription: 'Fullstack-застосунок на Django, що отримує курси валют великих банків через API та дозволяє оформлювати валютні заявки онлайн.',
    projectSecondName: 'Music Webstore',
    projectSecondDescription: 'Тематичний музичний магазин у дусі Apple Music — слухайте треки, створюйте профіль і оформлюйте замовлення в адаптивному інтерфейсі.',
    projectThirdName: 'SkyLi-Weathercast',
    projectThirdDescription: 'Застосунок прогнозу погоди, що поєднує два різні API в одному чистому адаптивному інтерфейсі для точних даних за локацією.',
    projectFourthName: 'Task-Manager',
    projectFourthDescription: 'Середовище для командної роботи: організація, розподіл і відстеження задач у спільному робочому просторі.',
    timelineHeading: 'Шлях',
    timelineFirstDate: '2022 — 2023', timelineFirstName: 'Завершив повний курс Python',
    timelineFirstDescription: 'Пройшов інтенсивний курс Python навколо Django, а потім розпочав реальний проєкт, щоб застосувати навички.',
    timelineSecondDate: '2023 — зараз', timelineSecondName: 'Школа розробників — IMS Рапперсвіль-Йона',
    timelineSecondDescription: 'Розпочав навчання за напрямом розробки ПЗ, поглиблюючи і теорію, і практику.',
    timelineThirdDate: '2023 — зараз', timelineThirdName: 'Занурився у веброзробку',
    timelineThirdDescription: 'Вивчав HTML, CSS, JavaScript і Python, створюючи адаптивні інтерфейси та fullstack-проєкти.',
    timelineFourthDate: '2025 — далі', timelineFourthName: 'Що далі',
    timelineFourthDescription: 'Шукаю команду, де зможу продовжувати вчитися, випускати реальні продукти й зростати як інженер.',
    skillsHeading: 'З чим я працюю',
    skillsNote: 'Зараз працюю з <b>React</b>, <b>TypeScript</b> і <b>Tailwind</b>.',
    contactHeading: 'Створімо щось разом',
    contactLead: 'Маєте проєкт, вакансію чи просто питання? Напишіть мені — зазвичай відповідаю протягом дня.',
    contactNameLabel: 'Ваше імʼя', contactEmailLabel: 'Email',
    contactSubjectLabel: 'Тема', contactMessageLabel: 'Повідомлення',
    contactSubmitBtn: 'Надіслати', contactSending: 'Надсилання…',
    footerCta: 'Дякую, що догортали до кінця.', footerTop: 'Нагору',
  },
}
```

- [ ] **Commit**

```bash
git add cv-website-next/lib/translations.ts
git commit -m "feat: add typed i18n translations for EN/DE/RU/UA"
```

---

## Task 5 — Skills Data (`lib/skills.ts`)

**Files:**
- Create: `cv-website-next/lib/skills.ts`

- [ ] **Create `lib/skills.ts`**

```ts
export type SkillCategory = 'lang' | 'front' | 'back' | 'tools'

export interface Skill {
  name: string
  category: SkillCategory
  level: 1 | 2 | 3 | 4 | 5
}

export const LEVEL_LABELS: Record<number, string> = {
  1: 'basic',
  2: 'working',
  3: 'proficient',
  4: 'advanced',
  5: 'expert',
}

export const SKILLS: Skill[] = [
  { name: 'React',        category: 'front', level: 5 },
  { name: 'TypeScript',   category: 'lang',  level: 5 },
  { name: 'JavaScript',   category: 'lang',  level: 5 },
  { name: 'Tailwind',     category: 'front', level: 4 },
  { name: 'HTML',         category: 'front', level: 5 },
  { name: 'CSS',          category: 'front', level: 5 },
  { name: 'Responsive UI',category: 'front', level: 4 },
  { name: 'Python',       category: 'lang',  level: 3 },
  { name: 'C#',           category: 'lang',  level: 3 },
  { name: 'SQL',          category: 'lang',  level: 3 },
  { name: 'REST APIs',    category: 'back',  level: 4 },
  { name: 'Auth & Data',  category: 'back',  level: 3 },
  { name: 'Git',          category: 'tools', level: 4 },
  { name: 'Bash',         category: 'tools', level: 3 },
]

export const SKILL_TABS = [
  { key: 'all',   label: 'all' },
  { key: 'lang',  label: 'languages' },
  { key: 'front', label: 'frontend' },
  { key: 'back',  label: 'backend' },
  { key: 'tools', label: 'tools' },
] as const
```

- [ ] **Commit**

```bash
git add cv-website-next/lib/skills.ts
git commit -m "feat: add typed skills data"
```

---

## Task 6 — PaletteContext

**Files:**
- Create: `cv-website-next/context/PaletteContext.tsx`
- Create: `cv-website-next/__tests__/PaletteContext.test.tsx`

- [ ] **Write the failing test first**

```bash
mkdir -p cv-website-next/__tests__
```

Create `cv-website-next/__tests__/PaletteContext.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PaletteProvider, usePalette } from '@/context/PaletteContext'

function TestConsumer() {
  const { palette, setPalette } = usePalette()
  return (
    <div>
      <span data-testid="palette">{palette}</span>
      <button onClick={() => setPalette('green')}>set green</button>
    </div>
  )
}

describe('PaletteContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-palette')
  })

  it('defaults to teal', () => {
    render(<PaletteProvider><TestConsumer /></PaletteProvider>)
    expect(screen.getByTestId('palette').textContent).toBe('teal')
  })

  it('sets data-palette attribute on html when changed', async () => {
    render(<PaletteProvider><TestConsumer /></PaletteProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'set green' }))
    expect(document.documentElement.getAttribute('data-palette')).toBe('green')
  })

  it('does not set data-palette attribute for default teal', () => {
    render(<PaletteProvider><TestConsumer /></PaletteProvider>)
    expect(document.documentElement.getAttribute('data-palette')).toBeNull()
  })

  it('persists palette to localStorage', async () => {
    render(<PaletteProvider><TestConsumer /></PaletteProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'set green' }))
    expect(localStorage.getItem('mk-palette')).toBe('green')
  })
})
```

- [ ] **Run test — verify it fails**

```bash
cd cv-website-next && npm test -- --testPathPattern=PaletteContext
```

Expected: FAIL — `Cannot find module '@/context/PaletteContext'`

- [ ] **Create `context/PaletteContext.tsx`**

```tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Palette = 'teal' | 'peri' | 'green'

interface PaletteContextValue {
  palette: Palette
  setPalette: (p: Palette) => void
}

const PaletteContext = createContext<PaletteContextValue>({
  palette: 'teal',
  setPalette: () => {},
})

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<Palette>('teal')

  useEffect(() => {
    const saved = localStorage.getItem('mk-palette') as Palette | null
    if (saved && (saved === 'teal' || saved === 'peri' || saved === 'green')) {
      applyPalette(saved)
      setPaletteState(saved)
    }
  }, [])

  function applyPalette(p: Palette) {
    const html = document.documentElement
    if (p === 'teal') {
      html.removeAttribute('data-palette')
    } else {
      html.setAttribute('data-palette', p)
    }
  }

  function setPalette(p: Palette) {
    applyPalette(p)
    setPaletteState(p)
    try { localStorage.setItem('mk-palette', p) } catch {}
  }

  return (
    <PaletteContext.Provider value={{ palette, setPalette }}>
      {children}
    </PaletteContext.Provider>
  )
}

export function usePalette() {
  return useContext(PaletteContext)
}
```

- [ ] **Run test — verify it passes**

```bash
npm test -- --testPathPattern=PaletteContext
```

Expected: PASS (4 tests)

- [ ] **Commit**

```bash
git add cv-website-next/context/PaletteContext.tsx cv-website-next/__tests__/PaletteContext.test.tsx
git commit -m "feat: add PaletteContext with localStorage persistence"
```

---

## Task 7 — useLang Hook

**Files:**
- Create: `cv-website-next/hooks/useLang.ts`
- Create: `cv-website-next/__tests__/useLang.test.ts`

- [ ] **Write the failing test**

Create `cv-website-next/__tests__/useLang.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useLang } from '@/hooks/useLang'

describe('useLang', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to en', () => {
    const { result } = renderHook(() => useLang())
    expect(result.current.lang).toBe('en')
  })

  it('t() returns correct English string', () => {
    const { result } = renderHook(() => useLang())
    expect(result.current.t('navAbout')).toBe('About')
  })

  it('setLang changes the active language', () => {
    const { result } = renderHook(() => useLang())
    act(() => result.current.setLang('de'))
    expect(result.current.lang).toBe('de')
    expect(result.current.t('navAbout')).toBe('Über mich')
  })

  it('persists lang to localStorage', () => {
    const { result } = renderHook(() => useLang())
    act(() => result.current.setLang('ru'))
    expect(localStorage.getItem('mk-lang')).toBe('ru')
  })

  it('reads saved lang from localStorage on mount', () => {
    localStorage.setItem('mk-lang', 'ua')
    const { result } = renderHook(() => useLang())
    expect(result.current.lang).toBe('ua')
  })
})
```

- [ ] **Run test — verify it fails**

```bash
npm test -- --testPathPattern=useLang
```

Expected: FAIL — `Cannot find module '@/hooks/useLang'`

- [ ] **Create `hooks/useLang.ts`**

```ts
'use client'

import { useState } from 'react'
import { TRANSLATIONS, type Lang, type TranslationKey } from '@/lib/translations'

function getSavedLang(): Lang {
  try {
    const saved = localStorage.getItem('mk-lang') as Lang | null
    if (saved && saved in TRANSLATIONS) return saved
  } catch {}
  return 'en'
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en'
    return getSavedLang()
  })

  function setLang(newLang: Lang) {
    setLangState(newLang)
    try { localStorage.setItem('mk-lang', newLang) } catch {}
  }

  function t(key: TranslationKey): string {
    return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key
  }

  return { lang, setLang, t }
}
```

- [ ] **Run test — verify it passes**

```bash
npm test -- --testPathPattern=useLang
```

Expected: PASS (5 tests)

- [ ] **Commit**

```bash
git add cv-website-next/hooks/useLang.ts cv-website-next/__tests__/useLang.test.ts
git commit -m "feat: add useLang hook with t() helper and localStorage persistence"
```

---

## Task 8 — useReveal Hook

**Files:**
- Create: `cv-website-next/hooks/useReveal.ts`

- [ ] **Create `hooks/useReveal.ts`**

```ts
'use client'

import { useEffect, useRef } from 'react'

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already visible (e.g. reduced motion applied via CSS)
    if (el.classList.contains('in')) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in')
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px', ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
```

- [ ] **Commit**

```bash
git add cv-website-next/hooks/useReveal.ts
git commit -m "feat: add useReveal IntersectionObserver hook"
```

---

## Task 9 — Root Layout (`app/layout.tsx`)

**Files:**
- Modify: `cv-website-next/app/layout.tsx`

- [ ] **Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { PaletteProvider } from '@/context/PaletteContext'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mykhailo Khimich — Dev Spot',
  description: 'Mykhailo Khimich — Fullstack Web Developer. Projects, timeline, skills and contact.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PaletteProvider>
            {children}
          </PaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Verify fonts resolve**

```bash
npm run dev
```

Open http://localhost:3000. Open browser DevTools → Network tab. Verify Google Fonts requests for Space Grotesk, Plus Jakarta Sans, JetBrains Mono appear (or are served from Next.js font cache).

- [ ] **Commit**

```bash
git add cv-website-next/app/layout.tsx
git commit -m "feat: add root layout with fonts, ThemeProvider, PaletteProvider"
```

---

## Task 10 — Infrastructure Components (BgField, ScrollProgress, Cursor)

**Files:**
- Create: `cv-website-next/components/BgField.tsx`
- Create: `cv-website-next/components/ScrollProgress.tsx`
- Create: `cv-website-next/components/Cursor.tsx`

- [ ] **Create `components/BgField.tsx`**

```tsx
export default function BgField() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Blob 1 */}
      <span
        className="absolute w-[46vmax] h-[46vmax] rounded-full bg-accent
                   opacity-[0.26] blur-[70px] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.22]
                   -top-[12vmax] -left-[8vmax] animate-float-1"
      />
      {/* Blob 2 */}
      <span
        className="absolute w-[46vmax] h-[46vmax] rounded-full bg-accent
                   opacity-[0.26] blur-[70px] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.22]
                   -bottom-[16vmax] -right-[8vmax] animate-float-2"
      />
      {/* Blob 3 — smaller, mixed color */}
      <span
        className="absolute w-[32vmax] h-[32vmax] rounded-full
                   opacity-[0.26] blur-[70px] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.22]
                   top-[32%] right-[6%] animate-float-3 bg-accent"
        style={{ background: 'color-mix(in srgb, var(--accent) 45%, #8a8a96)' }}
      />
      {/* Grain overlay */}
      <span
        className="absolute inset-[-50%] opacity-[0.045] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
```

- [ ] **Create `components/ScrollProgress.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function update() {
      const h = document.documentElement.scrollHeight - window.innerHeight
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0
      if (barRef.current) barRef.current.style.width = `${pct}%`
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[1000] bg-transparent"
    >
      <span
        ref={barRef}
        className="block h-full w-0"
        style={{
          background: 'linear-gradient(90deg, color-mix(in srgb, var(--accent) 45%, transparent), var(--accent))',
        }}
      />
    </div>
  )
}
```

- [ ] **Create `components/Cursor.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let rafId: number

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX; my = e.clientY
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
    }

    function loop() {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(loop)

    const hotEls = document.querySelectorAll('a, button, input, textarea')
    hotEls.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hot'))
      el.addEventListener('mouseleave', () => ring.classList.remove('hot'))
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[7px] h-[7px] rounded-full bg-accent pointer-events-none z-[9999]
                   [transform:translate(-50%,-50%)] md:block hidden"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[34px] h-[34px] rounded-full border border-accent
                   opacity-50 pointer-events-none z-[9999] transition-[width,height,opacity,background]
                   duration-200 [transform:translate(-50%,-50%)] md:block hidden
                   [&.hot]:w-[54px] [&.hot]:h-[54px] [&.hot]:opacity-90 [&.hot]:accent-bg-14"
      />
    </>
  )
}
```

- [ ] **Commit**

```bash
git add cv-website-next/components/BgField.tsx \
        cv-website-next/components/ScrollProgress.tsx \
        cv-website-next/components/Cursor.tsx
git commit -m "feat: add BgField, ScrollProgress, and Cursor components"
```

---

## Task 11 — PaletteToggle + Nav

**Files:**
- Create: `cv-website-next/components/PaletteToggle.tsx`
- Create: `cv-website-next/components/Nav.tsx`

- [ ] **Create `components/PaletteToggle.tsx`**

```tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import { usePalette, type Palette } from '@/context/PaletteContext'

const PALETTES: { key: Palette; label: string; light: string; dark: string }[] = [
  { key: 'teal',  label: 'Teal',       light: '#EEF9FB', dark: '#164E63' },
  { key: 'peri',  label: 'Periwinkle', light: '#D9E5FF', dark: '#405173' },
  { key: 'green', label: 'Green',      light: '#BBF7D0', dark: '#1F8A5B' },
]

export default function PaletteToggle() {
  const { palette, setPalette } = usePalette()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Switch colour palette"
        className="flex items-center gap-1.5 border border-line rounded-full px-3 py-2 text-ink
                   hover:border-accent transition-colors duration-200"
      >
        {PALETTES.map(p => (
          <span
            key={p.key}
            className="w-3 h-3 rounded-full border border-line transition-transform"
            style={{
              background: p.dark,
              transform: palette === p.key ? 'scale(1.35)' : 'scale(1)',
              outline: palette === p.key ? '2px solid var(--accent)' : 'none',
              outlineOffset: '1px',
            }}
          />
        ))}
      </button>

      {open && (
        <ul className="absolute right-0 top-[calc(100%+8px)] bg-bg-soft border border-line
                       rounded-2xl p-1.5 min-w-[140px] z-50
                       shadow-[0_18px_40px_-18px_rgba(0,0,0,.45)]">
          {PALETTES.map(p => (
            <li key={p.key}>
              <button
                onClick={() => { setPalette(p.key); setOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold
                           text-ink hover:accent-bg-12 transition-colors text-left"
              >
                <span
                  className="w-4 h-4 rounded-full flex-none border border-line"
                  style={{ background: p.dark }}
                />
                {p.label}
                {palette === p.key && (
                  <span className="ml-auto text-accent text-xs">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Create `components/Nav.tsx`**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useLang } from '@/hooks/useLang'
import PaletteToggle from './PaletteToggle'
import type { Lang } from '@/lib/translations'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ru', label: 'Русский' },
  { code: 'ua', label: 'Українська' },
]

export default function Nav() {
  const { t, lang, setLang } = useLang()
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen]   = useState(false)
  const [langOpen, setLangOpen]   = useState(false)
  const [mounted,  setMounted]    = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // Close mobile sheet on nav link click
  function closeMenu() { setMenuOpen(false) }

  const navLinks = [
    { href: '#about',    label: t('navAbout')    },
    { href: '#work',     label: t('navProjects') },
    { href: '#timeline', label: t('navTimeline') },
    { href: '#skills',   label: t('navSkills')   },
    { href: '#contact',  label: t('navContact')  },
  ]

  return (
    <>
      <header
        className="sticky top-[14px] z-[900] w-[min(1180px,calc(100%-32px))] mx-auto mt-[14px]
                   flex items-center justify-between gap-4 px-3 pl-[18px] py-[10px]
                   rounded-full border border-line
                   backdrop-blur-[14px] saturate-150
                   shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]"
        style={{ background: 'color-mix(in srgb, var(--bg-soft) 72%, transparent)' }}
      >
        {/* Brand */}
        <a href="#top" aria-label="Home" className="flex items-center gap-2.5 font-display font-bold">
          <span
            className="grid place-items-center w-[34px] h-[34px] rounded-[11px] bg-accent text-on-accent
                       text-[14px] tracking-wide accent-shadow"
          >
            MK
          </span>
          <span className="text-[15px] hidden sm:block">{t('brandText')}</span>
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex gap-1" aria-label="Primary">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="font-semibold text-[14px] px-[14px] py-2 rounded-full text-ink-2
                         hover:text-ink hover:accent-bg-10 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Tools */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div ref={langRef} className="relative">
            <button
              onClick={e => { e.stopPropagation(); setLangOpen(v => !v) }}
              className="flex items-center gap-1.5 font-bold text-[13px] text-ink border border-line
                         px-3 py-2 rounded-full hover:border-accent transition-colors duration-200"
            >
              {lang.toUpperCase()}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {langOpen && (
              <ul className="absolute right-0 top-[calc(100%+8px)] bg-bg-soft border border-line
                             rounded-2xl p-1.5 min-w-[150px] z-50
                             shadow-[0_18px_40px_-18px_rgba(0,0,0,.45)]">
                {LANGS.map(l => (
                  <li key={l.code}>
                    <button
                      onClick={() => { setLang(l.code); setLangOpen(false) }}
                      className="w-full text-left font-semibold text-[14px] text-ink px-3 py-2.5
                                 rounded-[10px] hover:accent-bg-12 transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Palette */}
          <PaletteToggle />

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
              className="grid place-items-center w-10 h-10 rounded-full border border-line text-ink
                         hover:border-accent hover:rotate-[-12deg] transition-all duration-200"
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
                </svg>
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className={`md:hidden flex flex-col gap-[5px] w-10 h-10 border border-line rounded-xl
                        bg-transparent items-center justify-center transition-colors hover:border-accent
                        ${menuOpen ? 'border-accent' : ''}`}
          >
            <span
              className={`w-[18px] h-[2px] bg-ink rounded transition-transform duration-300
                          ${menuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`}
            />
            <span
              className={`w-[18px] h-[2px] bg-ink rounded transition-transform duration-300
                          ${menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={`md:hidden fixed inset-x-4 top-[78px] z-[850] bg-bg-soft border border-line
                    rounded-[20px] p-3.5 grid gap-1
                    shadow-[0_24px_50px_-20px_rgba(0,0,0,.5)]
                    transition-all duration-[260ms] ease-[cubic-bezier(.2,.7,.2,1)]
                    origin-top
                    ${menuOpen
                      ? 'opacity-100 visible translate-y-0 scale-100'
                      : 'opacity-0 invisible -translate-y-3 scale-[.98]'
                    }`}
      >
        {navLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            onClick={closeMenu}
            className="font-display font-semibold text-[18px] px-3.5 py-3 rounded-xl
                       hover:accent-bg-12 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
```

- [ ] **Verify nav renders**

```bash
npm run dev
```

Add `<Nav />` to `app/page.tsx` temporarily (replace the default content with `<Nav />`), open http://localhost:3000. Verify: floating pill nav, language dropdown, palette swatches, theme toggle button, hamburger on mobile.

- [ ] **Commit**

```bash
git add cv-website-next/components/PaletteToggle.tsx cv-website-next/components/Nav.tsx
git commit -m "feat: add Nav with language, palette, theme, and mobile sheet"
```

---

## Task 12 — Hero Component

**Files:**
- Create: `cv-website-next/components/Hero.tsx`
- Create: `cv-website-next/public/assets/` (copy avatar)

- [ ] **Copy avatar from existing project**

```bash
mkdir -p cv-website-next/public/assets
cp "my-cv-website/assets/avatar.webp" cv-website-next/public/assets/avatar.webp
cp "my-cv-website/assets/favicon.ico"  cv-website-next/public/
```

- [ ] **Create `components/Hero.tsx`**

```tsx
'use client'

import Image from 'next/image'
import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'

export default function Hero() {
  const { t } = useLang()
  const innerRef   = useReveal()
  const portraitRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="hero"
      className="grid grid-cols-1 md:grid-cols-[1.25fr_.9fr] gap-10 items-center
                 min-h-[88vh] relative pt-[clamp(40px,7vw,90px)]"
    >
      {/* Left — text */}
      <div ref={innerRef} className="reveal">
        {/* Eyebrow */}
        <p className="inline-flex items-center gap-2 font-bold text-[13px] tracking-[.04em]
                      uppercase text-ink-2 mb-[22px]">
          <span className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
          {t('heroEyebrow')}
        </p>

        {/* Title */}
        <h1 className="font-display font-bold leading-[1.02] tracking-[-0.04em]
                       text-[clamp(56px,12vw,138px)]">
          <span className="block overflow-hidden">Mykhailo</span>
          <span className="block overflow-hidden">
            <span className="text-accent">Khimich</span>
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-[clamp(17px,2.1vw,22px)] text-ink-2 max-w-[30ch] mt-[26px] mb-[30px]">
          {t('heroTagline')}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-[26px] justify-center md:justify-start">
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2 font-body font-bold text-[15px]
                       px-[26px] py-[14px] rounded-full bg-accent text-on-accent
                       accent-shadow hover:-translate-y-0.5 hover:accent-shadow-lg
                       active:translate-y-0 active:scale-[.97] transition-all duration-200"
          >
            {t('heroCtaWork')}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 font-body font-bold text-[15px]
                       px-[26px] py-[14px] rounded-full bg-transparent text-ink border border-line
                       hover:border-accent hover:text-accent hover:-translate-y-0.5
                       active:translate-y-0 active:scale-[.97] transition-all duration-200"
          >
            {t('heroCtaContact')}
          </a>
        </div>

        {/* Socials */}
        <div className="flex gap-2.5 justify-center md:justify-start">
          {[
            {
              href: 'https://github.com/1curafu',
              label: 'GitHub',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>
                </svg>
              ),
            },
            {
              href: 'https://www.linkedin.com/',
              label: 'LinkedIn',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z"/>
                </svg>
              ),
            },
            {
              href: 'mailto:mykhailo.khimich@icloud.com',
              label: 'Email',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2.5"/>
                  <path d="M3 6.5l9 6 9-6"/>
                </svg>
              ),
            },
          ].map(s => (
            <a
              key={s.href}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={s.label}
              className="grid place-items-center w-11 h-11 rounded-full border border-line text-ink
                         hover:bg-ink hover:text-bg hover:-translate-y-[3px]
                         transition-all duration-200"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Right — portrait */}
      <div
        ref={portraitRef}
        className="reveal relative justify-self-center w-[min(340px,80vw)] aspect-square
                   order-first md:order-none"
      >
        {/* Spinning dashed ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent animate-spin-slow" />

        {/* Photo frame */}
        <div className="absolute inset-[8%] rounded-full overflow-hidden border-4 border-bg-soft
                        shadow-[0_30px_60px_-24px_rgba(0,0,0,.5)]">
          <Image
            src="/assets/avatar.webp"
            alt="Mykhailo Khimich"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 80vw, 340px"
          />
        </div>

        {/* Chips */}
        <span className="chip absolute top-[4%] -left-[6%] animate-bob-1
                         font-display font-semibold text-[13px] px-3.5 py-2 rounded-full
                         bg-bg-soft border border-line shadow-[0_10px_24px_-12px_rgba(0,0,0,.4)]">
          {t('chipFullstack')}
        </span>
        <span className="chip absolute top-[42%] -right-[10%] animate-bob-2
                         font-display font-semibold text-[13px] px-3.5 py-2 rounded-full
                         bg-bg-soft border border-line shadow-[0_10px_24px_-12px_rgba(0,0,0,.4)]">
          {t('chipYears')}
        </span>
        <span className="chip absolute bottom-[4%] left-[4%] animate-bob-3
                         font-display font-semibold text-[13px] px-3.5 py-2 rounded-full
                         bg-bg-soft border border-line shadow-[0_10px_24px_-12px_rgba(0,0,0,.4)]">
          React · TS
        </span>
      </div>

      {/* Scroll hint */}
      <a
        href="#about"
        aria-hidden="true"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden md:flex flex-col
                   items-center gap-1 text-[11px] tracking-[.12em] uppercase text-ink-2"
      >
        <span>{t('scrollHint')}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className="animate-bob-1"
        >
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </a>
    </section>
  )
}
```

- [ ] **Verify Hero renders**

Update `app/page.tsx`:

```tsx
import BgField from '@/components/BgField'
import ScrollProgress from '@/components/ScrollProgress'
import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'

export default function Page() {
  return (
    <>
      <BgField />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main className="w-[min(1180px,calc(100%-32px))] mx-auto">
        <Hero />
      </main>
    </>
  )
}
```

```bash
npm run dev
```

Open http://localhost:3000. Verify:
- Nav pill floats with backdrop blur
- Hero title renders with accent-colored "Khimich"
- Portrait visible with spinning dashed ring and three chips
- Dark mode toggle switches theme
- Palette toggle changes colour scheme
- Language dropdown changes button labels

- [ ] **Commit**

```bash
git add cv-website-next/components/Hero.tsx \
        cv-website-next/app/page.tsx \
        cv-website-next/public/assets/
git commit -m "feat: add Hero section, wire up page scaffold"
```

---

## End of Part 1

**What's done:** Project scaffolded, color system, Tailwind config, all data (translations + skills), PaletteContext, useLang, useReveal, root layout, BgField, ScrollProgress, Cursor, Nav, Hero. The site loads and the top half is visible.

**Part 2 covers:** Marquee → About → Work → Timeline → Skills → Contact → Footer → page.tsx final assembly → Contact API route → assets copy → Vercel deployment config.

Continue with: `docs/superpowers/plans/2026-06-03-cv-redesign-part2.md`
