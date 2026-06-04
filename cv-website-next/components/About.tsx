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
        <p ref={leadRef} className="reveal font-display font-medium
                                    text-[clamp(24px,3.4vw,40px)] leading-[1.18] tracking-tight">
          {t('aboutLead')}
        </p>

        <div ref={bodyRef} className="reveal">
          <p className="text-ink-2 text-[17px]">{t('aboutText')}</p>
          <ul className="mt-7 border-t border-line">
            {facts.map(f => (
              <li key={f.k} className="flex justify-between gap-[18px] py-3.5 border-b border-line">
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
