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
