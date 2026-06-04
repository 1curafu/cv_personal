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
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [mounted, setMounted]   = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

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
        <a href="#top" aria-label="Home" className="flex items-center gap-2.5 font-display font-bold">
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[11px] bg-accent
                           text-on-accent text-[14px] tracking-wide accent-shadow">
            MK
          </span>
          <span className="text-[15px] hidden sm:block">{t('brandText')}</span>
        </a>

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

        <div className="flex items-center gap-2">
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

          <PaletteToggle />

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

          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className={`md:hidden flex flex-col gap-[5px] w-10 h-10 border border-line rounded-xl
                        bg-transparent items-center justify-center hover:border-accent transition-colors
                        ${menuOpen ? 'border-accent' : ''}`}
          >
            <span className={`w-[18px] h-[2px] bg-ink rounded transition-transform duration-300
                              ${menuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`w-[18px] h-[2px] bg-ink rounded transition-transform duration-300
                              ${menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      <div
        className={`md:hidden fixed inset-x-4 top-[78px] z-[850] bg-bg-soft border border-line
                    rounded-[20px] p-3.5 grid gap-1
                    shadow-[0_24px_50px_-20px_rgba(0,0,0,.5)]
                    transition-all duration-[260ms] ease-[cubic-bezier(.2,.7,.2,1)] origin-top
                    ${menuOpen
                      ? 'opacity-100 visible translate-y-0 scale-100'
                      : 'opacity-0 invisible -translate-y-3 scale-[.98]'}`}
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
