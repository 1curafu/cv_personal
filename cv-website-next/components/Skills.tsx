'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'
import { SKILLS } from '@/lib/skills'
import SkillCard from './SkillCard'
import SkillTabs from './SkillTabs'

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
        <span className="font-display font-bold text-[15px] text-accent tracking-[.1em]">05</span>
        <h2 className="font-display font-bold text-[clamp(34px,6vw,64px)] tracking-tight">
          {t('skillsHeading')}
        </h2>
      </div>

      <div
        ref={consoleRef}
        className="reveal relative rounded-site overflow-hidden pb-[26px] border border-c-line
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
          <span key={pos} className="absolute w-4 h-4 z-10" style={{
            top:    pos.startsWith('t') ? 10 : undefined,
            bottom: pos.startsWith('b') ? 10 : undefined,
            left:   pos.endsWith('l')   ? 10 : undefined,
            right:  pos.endsWith('r')   ? 10 : undefined,
            borderTop:    pos.startsWith('t') ? '2px solid' : 'none',
            borderBottom: pos.startsWith('b') ? '2px solid' : 'none',
            borderLeft:   pos.endsWith('l')   ? '2px solid' : 'none',
            borderRight:  pos.endsWith('r')   ? '2px solid' : 'none',
            borderColor: 'color-mix(in srgb, var(--accent) 70%, transparent)',
          }} />
        ))}

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 top-0 h-[18%] z-[2] pointer-events-none animate-scan"
          style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent)' }}
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
        <div className="relative z-10 flex items-center flex-wrap gap-[7px] font-mono text-[14px] px-[22px] py-[18px] pb-3.5 text-c-fg">
          <span className="text-accent">misha@dev</span>
          <span className="text-c-dim">:</span>
          <span className="text-c-dim">~</span>
          <span style={{ color: 'color-mix(in srgb, var(--accent) 80%, #fff)' }}>$</span>
          <span className="ml-1">skills --filter {activeTab}</span>
          <span className="w-[9px] h-4 bg-accent inline-block animate-blink" />
        </div>

        <div className="relative z-10">
          <SkillTabs active={activeTab} onSelect={setActiveTab} />
        </div>

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

      <p ref={noteRef} className="reveal mt-[22px] flex items-center gap-2.5 text-ink-2 text-[15px]">
        <span className="w-[9px] h-[9px] rounded-full bg-accent flex-none animate-glow-pulse" />
        <span>{renderWithBold(t('skillsNote'))}</span>
      </p>
    </section>
  )
}
