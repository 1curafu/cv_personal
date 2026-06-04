'use client'

import { useEffect, useRef } from 'react'
import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'
import TimelineItem from './TimelineItem'

export default function Timeline() {
  const { t } = useLang()
  const headRef = useReveal()
  const lineRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function update() {
      const line = lineRef.current
      const fill = fillRef.current
      if (!line || !fill) return
      const r   = line.getBoundingClientRect()
      const vh  = window.innerHeight
      const pct = Math.max(0, Math.min(1, (vh * 0.7 - r.top) / (r.height + vh * 0.5)))
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
        <div ref={lineRef} className="absolute left-[11px] top-1.5 bottom-1.5 w-[2px] bg-line">
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
