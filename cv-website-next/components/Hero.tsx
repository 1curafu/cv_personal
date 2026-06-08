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
      {/* Text */}
      <div ref={innerRef} className="reveal">
        <p className="inline-flex items-center gap-2 font-bold text-[13px] tracking-[.04em]
                      uppercase text-ink-2 mb-[22px]">
          <span className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
          {t('heroEyebrow')}
        </p>

        <h1 className="font-display font-bold leading-[1.02] tracking-[-0.04em]
                       text-[clamp(56px,12vw,138px)]">
          <span className="block overflow-hidden">Mykhailo</span>
          <span className="block overflow-hidden">
            <span className="text-accent">Khimich</span>
          </span>
        </h1>

        <p className="text-[clamp(17px,2.1vw,22px)] text-ink-2 max-w-[30ch] mt-[26px] mb-[30px]">
          {t('heroTagline')}
        </p>

        <div className="flex flex-wrap gap-3 mb-[26px] justify-center md:justify-start">
          <a
            href="#work"
            className="inline-flex items-center justify-center font-body font-bold text-[15px]
                       px-[26px] py-[14px] rounded-full bg-accent text-on-accent
                       accent-shadow hover:-translate-y-0.5 hover:accent-shadow-lg
                       active:translate-y-0 active:scale-[.97] transition-all duration-200"
          >
            {t('heroCtaWork')}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center font-body font-bold text-[15px]
                       px-[26px] py-[14px] rounded-full bg-transparent text-ink border border-line
                       hover:border-accent hover:text-accent hover:-translate-y-0.5
                       active:translate-y-0 active:scale-[.97] transition-all duration-200"
          >
            {t('heroCtaContact')}
          </a>
        </div>

        <div className="flex gap-2.5 justify-center md:justify-start">
          {[
            {
              href: 'https://github.com/1curafu',
              label: 'GitHub',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>,
            },
            {
              href: 'https://www.linkedin.com/',
              label: 'LinkedIn',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z"/></svg>,
            },
            {
              href: '#contact',
              label: 'Email',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="M3 6.5l9 6 9-6"/></svg>,
            },
          ].map(s => (
            <a
              key={s.href}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={s.label}
              className="grid place-items-center w-11 h-11 rounded-full border border-line text-ink
                         hover:bg-ink hover:text-bg hover:-translate-y-[3px] transition-all duration-200"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Portrait */}
      <div
        ref={portraitRef}
        className="reveal relative justify-self-center w-[min(340px,80vw)] aspect-square
                   order-first md:order-none"
      >
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent animate-spin-slow" />
        <div className="absolute inset-[8%] rounded-full overflow-hidden border-4 border-bg-soft
                        shadow-[0_30px_60px_-24px_rgba(0,0,0,.5)]">
          <Image
            src="/assets/IMG_7178.webp"
            alt="Mykhailo Khimich"
            fill
            className="object-cover object-[center_22%]"
            priority
            sizes="(max-width: 768px) 80vw, 340px"
          />
        </div>
        <span className="absolute top-[4%] -left-[6%] animate-bob-1 font-display font-semibold
                         text-[13px] px-3.5 py-2 rounded-full bg-bg-soft border border-line
                         shadow-[0_10px_24px_-12px_rgba(0,0,0,.4)]">
          {t('chipFullstack')}
        </span>
        <span className="absolute top-[42%] -right-[10%] animate-bob-2 font-display font-semibold
                         text-[13px] px-3.5 py-2 rounded-full bg-bg-soft border border-line
                         shadow-[0_10px_24px_-12px_rgba(0,0,0,.4)]">
          {t('chipYears')}
        </span>
        <span className="absolute bottom-[4%] left-[4%] animate-bob-3 font-display font-semibold
                         text-[13px] px-3.5 py-2 rounded-full bg-bg-soft border border-line
                         shadow-[0_10px_24px_-12px_rgba(0,0,0,.4)]">
          React · TS
        </span>
      </div>

      <a
        href="#about"
        aria-hidden="true"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden md:flex flex-col
                   items-center gap-1 text-[11px] tracking-[.12em] uppercase text-ink-2"
      >
        <span>{t('scrollHint')}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
             className="animate-bob-1">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </a>
    </section>
  )
}
