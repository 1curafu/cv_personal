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
