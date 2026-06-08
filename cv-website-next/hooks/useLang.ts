'use client'

// Language state is now shared through a single React context so that
// changing the language in the nav updates every section at once.
// See context/LangContext.tsx for the implementation.
export { useLang } from '@/context/LangContext'
