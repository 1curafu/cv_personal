# CV Website Redesign — Part 2: Sections + API + Assembly

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all remaining sections (Marquee through Footer), wire the contact form to a real Vercel Serverless Function, assemble the final page, and prepare for Vercel deployment.

**Tech Stack:** Next.js 16.2, React 19.2, TypeScript, Tailwind CSS v4.3, next-themes 0.4.6, Nodemailer 8.x

**Prerequisite:** Part 1 complete — project runs, Nav and Hero visible at http://localhost:3000.

**Part 1:** `docs/superpowers/plans/2026-06-03-cv-redesign-part1.md`

---

## Task 13 — Marquee

**Files:**
- Create: `cv-website-next/components/Marquee.tsx`

- [ ] **Create `components/Marquee.tsx`**

```tsx
const ITEMS = ['React','TypeScript','JavaScript','Tailwind','Python','HTML','CSS','REST APIs']

export default function Marquee() {
  // Duplicate items so the seamless loop works (CSS translates -50%)
  const all = [...ITEMS, ...ITEMS]

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-line py-[18px]
                 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    >
      <div className="inline-flex items-center gap-[26px] whitespace-nowrap animate-marquee">
        {all.map((item, i) => (
          <span key={i} className="font-display font-bold text-[clamp(22px,3.4vw,38px)]">
            {item}
            {i < all.length - 1 && (
              <i className="not-italic text-accent text-[20px] ml-[26px]">✳</i>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add cv-website-next/components/Marquee.tsx
git commit -m "feat: add Marquee component"
```

---

## Task 14 — About

**Files:**
- Create: `cv-website-next/components/About.tsx`

- [ ] **Create `components/About.tsx`**

```tsx
'use client'

import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'

export default function About() {
  const { t } = useLang()
  const headRef = useReveal()
  const leadRef = useReveal()
  const bodyRef = useReveal()

  const facts = [
    { k: t('factLocationK'), v: 'Rapperswil-Jona, CH' },
    { k: t('factExpK'),      v: t('factExpV') },
    { k: t('factFocusK'),    v: t('factFocusV') },
    { k: t('factLangK'),     v: 'EN · DE · RU · UA' },
  ]

  return (
    <section id="about" className="py-[clamp(60px,9vw,130px)]">
      <div ref={headRef} className="reveal flex items-baseline gap-[18px] mb-12">
        <span className="font-display font-bold text-[15px] text-accent tracking-[.1em]">01</span>
        <h2 className="font-display font-bold text-[clamp(34px,6vw,64px)] tracking-tight">
          {t('aboutHeading')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[clamp(28px,5vw,70px)]">
        <p
          ref={leadRef}
          className="reveal font-display font-medium text-[clamp(24px,3.4vw,40px)]
                     leading-[1.18] tracking-tight"
        >
          {t('aboutLead')}
        </p>

        <div ref={bodyRef} className="reveal">
          <p className="text-ink-2 text-[17px]">{t('aboutText')}</p>
          <ul className="mt-7 border-t border-line">
            {facts.map(f => (
              <li
                key={f.k}
                className="flex justify-between gap-[18px] py-3.5 border-b border-line"
              >
                <span className="text-ink-2 text-[14px]">{f.k}</span>
                <span className="font-display font-semibold text-[15px] text-right">{f.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add cv-website-next/components/About.tsx
git commit -m "feat: add About section"
```

---

## Task 15 — Work + WorkRow

**Files:**
- Create: `cv-website-next/components/WorkRow.tsx`
- Create: `cv-website-next/components/Work.tsx`

- [ ] **Create `components/WorkRow.tsx`**

```tsx
'use client'

import { useReveal } from '@/hooks/useReveal'

interface WorkRowProps {
  index: string
  name: string
  description: string
  tags: string[]
  href: string
}

export default function WorkRow({ index, name, description, tags, href }: WorkRowProps) {
  const ref = useReveal<HTMLLIElement>()

  return (
    <li ref={ref} className="reveal border-b border-line group">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto]
                   items-center gap-[clamp(16px,3vw,40px)] px-2
                   py-[clamp(20px,3vw,34px)] relative
                   hover:pl-7 hover:pr-5 transition-[padding,color] duration-300"
      >
        {/* Flood background */}
        <span
          className="absolute left-0 top-0 bottom-0 w-0 bg-accent -z-10
                     rounded-r-[18px] group-hover:w-full transition-[width] duration-[400ms]
                     ease-[cubic-bezier(.2,.7,.2,1)]"
        />

        {/* Index */}
        <span className="font-display font-semibold text-[14px] text-ink-2
                         group-hover:text-on-accent/75 transition-colors duration-300">
          {index}
        </span>

        {/* Name + desc */}
        <span>
          <span className="block font-display font-bold tracking-tight
                           text-[clamp(24px,3.6vw,40px)]
                           group-hover:text-on-accent transition-colors duration-300">
            {name}
          </span>
          <span className="block text-ink-2 text-[15px] max-w-[52ch] mt-1.5
                           group-hover:text-on-accent/90 transition-colors duration-300">
            {description}
          </span>
        </span>

        {/* Tags — hidden on mobile */}
        <span className="hidden md:flex gap-1.5 flex-wrap justify-end max-w-[220px]">
          {tags.map(tag => (
            <b
              key={tag}
              className="font-display font-semibold text-[12px] px-[11px] py-[5px]
                         rounded-full border border-line text-ink-2 whitespace-nowrap
                         group-hover:border-on-accent/50 group-hover:text-on-accent
                         transition-colors duration-300"
            >
              {tag}
            </b>
          ))}
        </span>

        {/* Arrow */}
        <span className="text-ink-2 group-hover:text-on-accent
                         group-hover:translate-x-1 group-hover:-translate-y-1
                         transition-all duration-300">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M7 7h10v10"/>
          </svg>
        </span>
      </a>
    </li>
  )
}
```

- [ ] **Create `components/Work.tsx`**

```tsx
'use client'

import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'
import WorkRow from './WorkRow'

export default function Work() {
  const { t } = useLang()
  const headRef = useReveal()

  const projects = [
    {
      index: '01',
      nameKey:  'projectFirstName'  as const,
      descKey:  'projectFirstDescription' as const,
      tags: ['Python', 'Django', 'APIs'],
      href: 'https://github.com/1curafu/currency',
    },
    {
      index: '02',
      nameKey:  'projectSecondName' as const,
      descKey:  'projectSecondDescription' as const,
      tags: ['HTML', 'CSS', 'JavaScript'],
      href: 'https://github.com/1curafu/Musik-Webstore',
    },
    {
      index: '03',
      nameKey:  'projectThirdName'  as const,
      descKey:  'projectThirdDescription' as const,
      tags: ['JavaScript', 'APIs'],
      href: 'https://github.com/1curafu/SkyLi-Weathercast',
    },
    {
      index: '04',
      nameKey:  'projectFourthName' as const,
      descKey:  'projectFourthDescription' as const,
      tags: ['Fullstack', 'Teamwork'],
      href: 'https://github.com/1curafu/Task-Manager',
    },
  ]

  return (
    <section id="work" className="py-[clamp(60px,9vw,130px)]">
      <div ref={headRef} className="reveal flex items-baseline gap-[18px] mb-12">
        <span className="font-display font-bold text-[15px] text-accent tracking-[.1em]">02</span>
        <h2 className="font-display font-bold text-[clamp(34px,6vw,64px)] tracking-tight">
          {t('projectsHeading')}
        </h2>
      </div>

      <ul className="border-t border-line">
        {projects.map(p => (
          <WorkRow
            key={p.index}
            index={p.index}
            name={t(p.nameKey)}
            description={t(p.descKey)}
            tags={p.tags}
            href={p.href}
          />
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add cv-website-next/components/WorkRow.tsx cv-website-next/components/Work.tsx
git commit -m "feat: add Work section with color-flood hover rows"
```

---

## Task 16 — Timeline + TimelineItem

**Files:**
- Create: `cv-website-next/components/TimelineItem.tsx`
- Create: `cv-website-next/components/Timeline.tsx`

- [ ] **Create `components/TimelineItem.tsx`**

```tsx
'use client'

import { useReveal } from '@/hooks/useReveal'

interface TimelineItemProps {
  date: string
  title: string
  description: string
  isOpen?: boolean
}

export default function TimelineItem({ date, title, description, isOpen }: TimelineItemProps) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className="reveal relative grid grid-cols-[150px_1fr] max-sm:grid-cols-1
                 items-start gap-[22px] py-[18px] max-sm:pl-[34px]"
    >
      {/* Date */}
      <span className="font-display font-semibold text-[14px] text-accent text-right
                       pr-[26px] pt-1 max-sm:text-left max-sm:pr-0 max-sm:pb-0">
        {date}
      </span>

      {/* Node */}
      <div
        className={`absolute left-[11px] top-2 w-4 h-4 rounded-full border-[3px] border-bg
                    shadow-[0_0_0_3px_var(--accent)] max-sm:left-0
                    ${isOpen ? 'bg-bg' : 'bg-accent'}`}
      />

      {/* Card */}
      <div className="pl-3.5 max-sm:pl-0">
        <h3 className="font-display font-bold text-[clamp(19px,2.4vw,26px)] mb-1.5">{title}</h3>
        <p className="text-ink-2 text-[15px] max-w-[56ch]">{description}</p>
      </div>
    </div>
  )
}
```

- [ ] **Create `components/Timeline.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'
import TimelineItem from './TimelineItem'

export default function Timeline() {
  const { t } = useLang()
  const headRef = useReveal()
  const lineRef  = useRef<HTMLDivElement>(null)
  const fillRef  = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function update() {
      const line = lineRef.current
      const fill = fillRef.current
      if (!line || !fill) return
      const r = line.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.7
      const end   = vh * 0.2
      const pct = Math.max(0, Math.min(1, (start - r.top) / (r.height + (start - end))))
      fill.style.height = `${pct * 100}%`
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const items = [
    { date: t('timelineFirstDate'),  title: t('timelineFirstName'),  desc: t('timelineFirstDescription'),  open: false },
    { date: t('timelineSecondDate'), title: t('timelineSecondName'), desc: t('timelineSecondDescription'), open: false },
    { date: t('timelineThirdDate'),  title: t('timelineThirdName'),  desc: t('timelineThirdDescription'),  open: false },
    { date: t('timelineFourthDate'), title: t('timelineFourthName'), desc: t('timelineFourthDescription'), open: true  },
  ]

  return (
    <section id="timeline" className="py-[clamp(60px,9vw,130px)]">
      <div ref={headRef} className="reveal flex items-baseline gap-[18px] mb-12">
        <span className="font-display font-bold text-[15px] text-accent tracking-[.1em]">03</span>
        <h2 className="font-display font-bold text-[clamp(34px,6vw,64px)] tracking-tight">
          {t('timelineHeading')}
        </h2>
      </div>

      <div className="relative grid gap-1.5">
        {/* Vertical line */}
        <div
          ref={lineRef}
          className="absolute left-[11px] top-1.5 bottom-1.5 w-[2px] bg-line"
        >
          <span
            ref={fillRef}
            className="absolute inset-x-0 top-0 h-0 w-full"
            style={{
              background: 'linear-gradient(var(--accent), color-mix(in srgb, var(--accent) 50%, transparent))',
              transition: 'height .1s linear',
            }}
          />
        </div>

        {items.map((item, i) => (
          <TimelineItem
            key={i}
            date={item.date}
            title={item.title}
            description={item.desc}
            isOpen={item.open}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add cv-website-next/components/TimelineItem.tsx cv-website-next/components/Timeline.tsx
git commit -m "feat: add Timeline section with animated fill"
```

---

## Task 17 — Skills Console (SkillCard + SkillTabs + Skills)

**Files:**
- Create: `cv-website-next/components/SkillCard.tsx`
- Create: `cv-website-next/components/SkillTabs.tsx`
- Create: `cv-website-next/components/Skills.tsx`

- [ ] **Create `components/SkillCard.tsx`**

```tsx
import { LEVEL_LABELS, type Skill } from '@/lib/skills'

interface SkillCardProps {
  skill: Skill
  dim: boolean
}

export default function SkillCard({ skill, dim }: SkillCardProps) {
  return (
    <div
      className={`border border-c-line rounded-[13px] p-[15px] bg-white/[.025]
                  transition-all duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)]
                  hover:border-accent hover:accent-glow-lg hover:-translate-y-[3px]
                  ${dim ? 'opacity-[.22] grayscale scale-[.985]' : ''}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-display font-semibold text-[16px] text-c-fg">{skill.name}</span>
        <span className="font-mono text-[10px] uppercase tracking-[.08em] text-c-dim
                         border border-c-line rounded-[5px] px-1.5 py-0.5">
          {skill.category}
        </span>
      </div>

      {/* Meter — 5 segments */}
      <div className="flex gap-1 mb-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`flex-1 h-[7px] rounded-[3px] transition-[background] duration-300
                        ${i < skill.level
                          ? 'bg-accent [box-shadow:0_0_9px_-2px_var(--accent)]'
                          : 'bg-white/10'
                        }`}
            style={{
              transform: 'scaleX(1)',
              transformOrigin: 'left',
              transitionDelay: `${0.05 + i * 0.05}s`,
            }}
          />
        ))}
      </div>

      <div className="font-mono text-[11px] text-c-dim tracking-[.04em]">
        {LEVEL_LABELS[skill.level]} · {skill.level}/5
      </div>
    </div>
  )
}
```

- [ ] **Create `components/SkillTabs.tsx`**

```tsx
import { SKILL_TABS, SKILLS, type SkillCategory } from '@/lib/skills'

interface SkillTabsProps {
  active: string
  onSelect: (cat: string) => void
}

export default function SkillTabs({ active, onSelect }: SkillTabsProps) {
  function count(key: string) {
    return key === 'all' ? SKILLS.length : SKILLS.filter(s => s.category === key).length
  }

  return (
    <div role="tablist" aria-label="Filter skills" className="flex flex-wrap gap-2 px-[22px] pb-5">
      {SKILL_TABS.map(tab => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.key)}
            className={`font-mono text-[12.5px] px-[13px] py-2 rounded-[9px] border
                        inline-flex items-center gap-[7px] transition-all duration-[220ms]
                        ${isActive
                          ? 'text-on-accent bg-accent border-accent accent-glow'
                          : 'text-c-dim bg-white/[.04] border-c-line hover:text-c-fg hover:border-accent/45'
                        }`}
          >
            {tab.label}
            <span
              className={`text-[10px] px-1.5 py-px rounded-full
                          ${isActive ? 'bg-on-accent/25 text-on-accent' : 'bg-white/10 text-c-dim'}`}
            >
              {count(tab.key)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Create `components/Skills.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'
import { SKILLS } from '@/lib/skills'
import SkillCard from './SkillCard'
import SkillTabs from './SkillTabs'

/**
 * Safely renders a translation string that may contain <b>…</b> tags.
 * Only handles <b> — no other HTML is processed, so there is no XSS risk.
 * Content comes from our own translations.ts, never from user input.
 */
function renderWithBold(str: string): ReactNode {
  const parts = str.split(/(<b>.*?<\/b>)/g)
  return parts.map((part, i) => {
    const match = part.match(/^<b>(.*?)<\/b>$/)
    if (match) return <b key={i} className="text-accent font-bold">{match[1]}</b>
    return part
  })
}

export default function Skills() {
  const { t } = useLang()
  const headRef    = useReveal()
  const consoleRef = useReveal()
  const noteRef    = useReveal()
  const [activeTab, setActiveTab] = useState('all')

  return (
    <section id="skills" className="py-[clamp(60px,9vw,130px)]">
      <div ref={headRef} className="reveal flex items-baseline gap-[18px] mb-12">
        <span className="font-display font-bold text-[15px] text-accent tracking-[.1em]">04</span>
        <h2 className="font-display font-bold text-[clamp(34px,6vw,64px)] tracking-tight">
          {t('skillsHeading')}
        </h2>
      </div>

      {/* Console panel */}
      <div
        ref={consoleRef}
        className="reveal relative rounded-site overflow-hidden pb-[26px]
                   border border-c-line
                   shadow-[0_40px_90px_-50px_#000,inset_0_0_0_1px_rgba(255,255,255,.02)]"
        style={{
          background: 'radial-gradient(120% 80% at 85% -10%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 60%), linear-gradient(var(--c-bg), var(--c-bg))',
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: 'linear-gradient(var(--c-line) 1px, transparent 1px), linear-gradient(90deg, var(--c-line) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            WebkitMaskImage: 'radial-gradient(120% 100% at 50% 0%, #000 30%, transparent 75%)',
            maskImage: 'radial-gradient(120% 100% at 50% 0%, #000 30%, transparent 75%)',
          }}
        />

        {/* Corner brackets */}
        {(['tl','tr','bl','br'] as const).map(pos => (
          <span
            key={pos}
            className="absolute w-4 h-4 z-10"
            style={{
              top:    pos.startsWith('t') ? 10 : undefined,
              bottom: pos.startsWith('b') ? 10 : undefined,
              left:   pos.endsWith('l')  ? 10 : undefined,
              right:  pos.endsWith('r')  ? 10 : undefined,
              borderTop:    pos.startsWith('t') ? '2px solid' : 'none',
              borderBottom: pos.startsWith('b') ? '2px solid' : 'none',
              borderLeft:   pos.endsWith('l')  ? '2px solid' : 'none',
              borderRight:  pos.endsWith('r')  ? '2px solid' : 'none',
              borderColor:  'color-mix(in srgb, var(--accent) 70%, transparent)',
            }}
          />
        ))}

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 top-0 h-[18%] z-[2] pointer-events-none animate-scan"
          style={{
            background: 'linear-gradient(180deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent)',
          }}
        />

        {/* Title bar */}
        <div className="relative z-10 flex items-center gap-3 px-[18px] py-3.5 border-b border-c-line">
          <span className="flex gap-1.5">
            <i className="not-italic w-[11px] h-[11px] rounded-full bg-accent/80" />
            <i className="not-italic w-[11px] h-[11px] rounded-full bg-white/20" />
            <i className="not-italic w-[11px] h-[11px] rounded-full bg-white/20" />
          </span>
          <span className="font-mono text-[13px] text-c-dim tracking-[.02em]">skills.sh</span>
          <span className="ml-auto flex items-center gap-[7px] font-mono text-[12px] text-c-dim uppercase tracking-[.08em]">
            <span className="w-2 h-2 rounded-full bg-accent animate-glow-pulse shadow-[0_0_10px_var(--accent)]" />
            online
          </span>
        </div>

        {/* Command line */}
        <div className="relative z-10 flex items-center flex-wrap gap-[7px] font-mono text-[14px]
                        px-[22px] py-[18px] pb-3.5 text-c-fg">
          <span className="text-accent">misha@dev</span>
          <span className="text-c-dim">:</span>
          <span className="text-c-dim">~</span>
          <span style={{ color: 'color-mix(in srgb, var(--accent) 80%, #fff)' }}>$</span>
          <span className="ml-1">skills --filter {activeTab}</span>
          <span className="w-[9px] h-4 bg-accent inline-block animate-blink" />
        </div>

        {/* Tabs */}
        <div className="relative z-10">
          <SkillTabs active={activeTab} onSelect={setActiveTab} />
        </div>

        {/* Cards grid */}
        <div className="relative z-10 grid grid-cols-[repeat(auto-fill,minmax(176px,1fr))] gap-3 px-[22px]">
          {SKILLS.map(skill => (
            <SkillCard
              key={skill.name}
              skill={skill}
              dim={activeTab !== 'all' && skill.category !== activeTab}
            />
          ))}
        </div>
      </div>

      {/* Note */}
      <p
        ref={noteRef}
        className="reveal mt-[22px] flex items-center gap-2.5 text-ink-2 text-[15px]"
      >
        <span className="w-[9px] h-[9px] rounded-full bg-accent flex-none animate-glow-pulse" />
        <span>{renderWithBold(t('skillsNote'))}</span>
      </p>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add cv-website-next/components/SkillCard.tsx \
        cv-website-next/components/SkillTabs.tsx \
        cv-website-next/components/Skills.tsx
git commit -m "feat: add Skills console with tabs and meter cards"
```

---

## Task 18 — Contact Component

**Files:**
- Create: `cv-website-next/components/Contact.tsx`

- [ ] **Create `components/Contact.tsx`**

```tsx
'use client'

import { FormEvent, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'

export default function Contact() {
  const { t } = useLang()
  const headRef  = useReveal()
  const asideRef = useReveal()
  const formRef  = useReveal()

  const [status,  setStatus]  = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) { form.reportValidity(); return }

    setStatus('sending')
    setMessage('')

    const body = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setStatus('ok')
        setMessage('✓ Thanks! Your message is on its way.')
        form.reset()
        setTimeout(() => { setStatus('idle'); setMessage('') }, 5000)
      } else {
        const data = await res.json()
        setStatus('err')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('err')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <section id="contact" className="py-[clamp(60px,9vw,130px)]">
      <div ref={headRef} className="reveal flex items-baseline gap-[18px] mb-12">
        <span className="font-display font-bold text-[15px] text-accent tracking-[.1em]">05</span>
        <h2 className="font-display font-bold text-[clamp(34px,6vw,64px)] tracking-tight">
          {t('contactHeading')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[.9fr_1.1fr] gap-[clamp(30px,5vw,70px)]">
        {/* Aside */}
        <div ref={asideRef} className="reveal">
          <p className="font-display font-medium text-[clamp(20px,2.6vw,28px)] leading-[1.25] mb-[26px]">
            {t('contactLead')}
          </p>
          <a
            href="mailto:mykhailo.khimich@icloud.com"
            className="inline-block font-display font-semibold text-[clamp(16px,2vw,20px)]
                       text-accent border-b-2 border-transparent hover:border-accent transition-colors"
          >
            mykhailo.khimich@icloud.com
          </a>
          <div className="flex gap-[18px] mt-[22px]">
            <a href="https://github.com/1curafu" target="_blank" rel="noopener noreferrer"
               className="font-bold text-ink-2 hover:text-accent transition-colors">
              GitHub ↗
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"
               className="font-bold text-ink-2 hover:text-accent transition-colors">
              LinkedIn ↗
            </a>
          </div>
        </div>

        {/* Form */}
        <form
          ref={formRef as React.RefObject<HTMLFormElement>}
          onSubmit={handleSubmit}
          noValidate
          className="reveal grid gap-[18px]"
        >
          <div className="field">
            <input type="text"    id="c-name"    name="name"    required placeholder=" " />
            <label htmlFor="c-name">{t('contactNameLabel')}</label>
          </div>
          <div className="field">
            <input type="email"   id="c-email"   name="email"   required placeholder=" " />
            <label htmlFor="c-email">{t('contactEmailLabel')}</label>
          </div>
          <div className="field">
            <input type="text"    id="c-subject" name="subject" required placeholder=" " />
            <label htmlFor="c-subject">{t('contactSubjectLabel')}</label>
          </div>
          <div className="field">
            <textarea id="c-message" name="message" rows={4} required placeholder=" " />
            <label htmlFor="c-message">{t('contactMessageLabel')}</label>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="justify-self-start inline-flex items-center justify-center gap-2
                       font-body font-bold text-[15px] px-[26px] py-[14px] rounded-full
                       bg-accent text-on-accent accent-shadow
                       hover:-translate-y-0.5 hover:accent-shadow-lg
                       disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0
                       transition-all duration-200"
          >
            {status === 'sending' ? t('contactSending') : t('contactSubmitBtn')}
          </button>

          {message && (
            <p
              role="status"
              className={`font-semibold text-[14px] ${status === 'ok' ? 'text-emerald-500' : 'text-red-400'}`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add cv-website-next/components/Contact.tsx
git commit -m "feat: add Contact section with floating-label form"
```

---

## Task 19 — Contact API Route

**Files:**
- Create: `cv-website-next/app/api/contact/route.ts`
- Create: `cv-website-next/.env.local.example`
- Create: `cv-website-next/__tests__/api/contact.test.ts`

- [ ] **Write the failing test**

```bash
mkdir -p cv-website-next/__tests__/api
```

Create `cv-website-next/__tests__/api/contact.test.ts`:

```ts
import { POST } from '@/app/api/contact/route'
import { NextRequest } from 'next/server'

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  }),
}))

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makeRequest({ name: 'Alice' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBeTruthy()
  })

  it('returns 200 for a valid request', async () => {
    const res = await POST(makeRequest({
      name: 'Alice', email: 'alice@example.com',
      subject: 'Hello', message: 'Test message',
    }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
  })
})
```

- [ ] **Run test — verify it fails**

```bash
cd cv-website-next && npm test -- --testPathPattern=contact
```

Expected: FAIL — `Cannot find module '@/app/api/contact/route'`

- [ ] **Create `app/api/contact/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactBody {
  name: string
  email: string
  subject: string
  message: string
}

function isValidBody(b: unknown): b is ContactBody {
  if (!b || typeof b !== 'object') return false
  const { name, email, subject, message } = b as Record<string, unknown>
  return (
    typeof name === 'string' && name.trim().length > 0 &&
    typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    typeof subject === 'string' && subject.trim().length > 0 &&
    typeof message === 'string' && message.trim().length > 0
  )
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!isValidBody(body)) {
    return NextResponse.json(
      { error: 'All fields (name, email, subject, message) are required.' },
      { status: 400 }
    )
  }

  const { name, email, subject, message } = body

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `[CV Contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br>')}</p>`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Mail error:', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}
```

- [ ] **Run test — verify it passes**

```bash
npm test -- --testPathPattern=contact
```

Expected: PASS (2 tests)

- [ ] **Create `.env.local.example`**

```bash
cat > cv-website-next/.env.local.example << 'EOF'
# Copy this file to .env.local and fill in your values.
# Set these same values in your Vercel project → Settings → Environment Variables.

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-password
MAIL_TO=mykhailo.khimich@icloud.com
EOF
```

- [ ] **Create `.env.local` for local dev** (do NOT commit this file)

```bash
cp cv-website-next/.env.local.example cv-website-next/.env.local
# Then edit .env.local with your real SMTP credentials
```

Verify `.env.local` is in `.gitignore` (create-next-app adds it automatically).

- [ ] **Commit**

```bash
git add cv-website-next/app/api/contact/route.ts \
        cv-website-next/.env.local.example \
        cv-website-next/__tests__/api/contact.test.ts
git commit -m "feat: add contact API route with Nodemailer and validation"
```

---

## Task 20 — Footer

**Files:**
- Create: `cv-website-next/components/Footer.tsx`

- [ ] **Create `components/Footer.tsx`**

```tsx
'use client'

import { useLang } from '@/hooks/useLang'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="w-[min(1180px,calc(100%-32px))] mx-auto pt-[50px] pb-10 border-t border-line">
      <div className="flex items-center gap-5 flex-wrap">
        <span
          className="grid place-items-center w-[34px] h-[34px] rounded-[11px]
                     bg-accent text-on-accent text-[14px] font-display font-bold tracking-wide
                     accent-shadow"
        >
          MK
        </span>
        <p className="font-display font-semibold text-[clamp(18px,2.4vw,26px)]">
          {t('footerCta')}
        </p>
        <a
          href="#top"
          className="ml-auto font-bold text-ink-2 hover:text-accent transition-colors"
        >
          ↑ {t('footerTop')}
        </a>
      </div>

      <div className="flex justify-between flex-wrap gap-2 mt-7 text-ink-2 text-[13px]">
        <p>© 2026 Mykhailo Khimich</p>
        <p>Rapperswil-Jona, Switzerland · mykhailo.khimich@icloud.com</p>
      </div>
    </footer>
  )
}
```

- [ ] **Commit**

```bash
git add cv-website-next/components/Footer.tsx
git commit -m "feat: add Footer component"
```

---

## Task 21 — Final `page.tsx` Assembly

**Files:**
- Modify: `cv-website-next/app/page.tsx`

- [ ] **Replace `app/page.tsx` with final assembly**

```tsx
import BgField        from '@/components/BgField'
import Cursor         from '@/components/Cursor'
import ScrollProgress from '@/components/ScrollProgress'
import Nav            from '@/components/Nav'
import Hero           from '@/components/Hero'
import Marquee        from '@/components/Marquee'
import About          from '@/components/About'
import Work           from '@/components/Work'
import Timeline       from '@/components/Timeline'
import Skills         from '@/components/Skills'
import Contact        from '@/components/Contact'
import Footer         from '@/components/Footer'

export default function Page() {
  return (
    <>
      <BgField />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main className="w-[min(1180px,calc(100%-32px))] mx-auto">
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Timeline />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Run full dev verification**

```bash
npm run dev
```

Open http://localhost:3000. Walk through every section:

| Section | What to verify |
|---|---|
| Nav | Floating pill, lang dropdown works, palette swatches switch colours, dark toggle works, mobile hamburger opens sheet |
| Hero | Title renders, portrait with spinning ring and chips, CTAs link to sections, social icons |
| Marquee | Infinite scroll, no gap at loop point |
| About | Lead text left, facts grid right, reveals on scroll |
| Work | 4 rows, hover floods row with accent colour, arrow moves diagonally |
| Timeline | Nodes visible, fill line grows as you scroll |
| Skills | Console dark panel, tabs filter cards, meter bars filled |
| Contact | Floating labels animate up on focus, submit button clickable |
| Footer | MK mark, back-to-top link |

- [ ] **Run full build — verify no TypeScript errors**

```bash
npm run build
```

Expected: Build completes successfully. Zero TypeScript errors.

- [ ] **Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Commit**

```bash
git add cv-website-next/app/page.tsx
git commit -m "feat: assemble final page with all sections"
```

---

## Task 22 — Vercel Deployment Setup

> **Versions in this project:** Next.js 16.2 · React 19.2 · Tailwind v4.3 · next-themes 0.4.6 · Nodemailer 8.x

**Files:**
- Create: `cv-website-next/vercel.json`
- Update: `cv-website-next/next.config.ts`

- [ ] **Create `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

- [ ] **Verify `next.config.ts` is minimal and correct**

Open `cv-website-next/next.config.ts`. It should be:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default nextConfig
```

No changes needed if create-next-app generated a clean config.

- [ ] **Deploy to Vercel**

Option A — via CLI:
```bash
cd cv-website-next
npx vercel
```
Follow the prompts: link to your Vercel account, create a new project named `cv-website`.

Option B — via Vercel dashboard:
1. Go to https://vercel.com/new
2. Import the GitHub repo
3. Set **Root Directory** to `cv-website-next`
4. Click Deploy

- [ ] **Set environment variables in Vercel**

In Vercel dashboard → project → Settings → Environment Variables, add:

| Key | Value |
|---|---|
| `SMTP_HOST` | your SMTP server |
| `SMTP_PORT` | `587` (or `465` for SSL) |
| `SMTP_USER` | your SMTP username/email |
| `SMTP_PASS` | your SMTP password |
| `MAIL_TO` | `mykhailo.khimich@icloud.com` |

Then **redeploy** (Deployments → Redeploy) so the function picks up the vars.

- [ ] **Verify contact form works on production**

Open the deployed URL. Fill in the contact form with valid data, click Send. Verify email arrives at `MAIL_TO` address.

- [ ] **Final commit**

```bash
git add cv-website-next/vercel.json cv-website-next/next.config.ts
git commit -m "feat: add Vercel deployment config"
```

---

## Done ✓

All tasks complete. The new site lives at `cv-website-next/`, the original `my-cv-website/` is untouched. The redesign is pixel-perfect from the Claude Design prototype with real email delivery via Vercel Serverless Function.
