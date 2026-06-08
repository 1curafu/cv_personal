'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { TRANSLATIONS, type Lang, type TranslationKey } from '@/lib/translations'

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LangContext = createContext<LangContextValue | null>(null)

function getSavedLang(): Lang {
  try {
    const saved = localStorage.getItem('mk-lang') as Lang | null
    if (saved && saved in TRANSLATIONS) return saved
  } catch {}
  return 'en'
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Always start at 'en' so server and first client render match (no
  // hydration mismatch); the saved preference is applied right after mount.
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = getSavedLang()
    if (saved !== 'en') setLangState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'ua' ? 'uk' : lang
  }, [lang])

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    try {
      localStorage.setItem('mk-lang', newLang)
    } catch {}
  }, [])

  const t = useCallback(
    (key: TranslationKey): string =>
      TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key,
    [lang],
  )

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) {
    throw new Error('useLang must be used within a LangProvider')
  }
  return ctx
}
