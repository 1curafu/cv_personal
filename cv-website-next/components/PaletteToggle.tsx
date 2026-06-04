'use client'

import { useRef, useState, useEffect } from 'react'
import { usePalette, type Palette } from '@/context/PaletteContext'

const PALETTES: { key: Palette; label: string; color: string }[] = [
  { key: 'teal',  label: 'Teal',       color: '#164E63' },
  { key: 'peri',  label: 'Periwinkle', color: '#405173' },
  { key: 'green', label: 'Green',      color: '#1F8A5B' },
]

export default function PaletteToggle() {
  const { palette, setPalette } = usePalette()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Switch colour palette"
        className="flex items-center gap-1.5 border border-line rounded-full px-3 py-2 text-ink
                   hover:border-accent transition-colors duration-200"
      >
        {PALETTES.map(p => (
          <span
            key={p.key}
            className="w-3 h-3 rounded-full border border-line/50 transition-transform"
            style={{
              background: p.color,
              transform: palette === p.key ? 'scale(1.35)' : 'scale(1)',
              outline: palette === p.key ? '2px solid var(--accent)' : 'none',
              outlineOffset: '1px',
            }}
          />
        ))}
      </button>

      {open && (
        <ul className="absolute right-0 top-[calc(100%+8px)] bg-bg-soft border border-line
                       rounded-2xl p-1.5 min-w-[140px] z-50
                       shadow-[0_18px_40px_-18px_rgba(0,0,0,.45)]">
          {PALETTES.map(p => (
            <li key={p.key}>
              <button
                onClick={() => { setPalette(p.key); setOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm
                           font-semibold text-ink hover:accent-bg-12 transition-colors text-left"
              >
                <span
                  className="w-4 h-4 rounded-full flex-none border border-line"
                  style={{ background: p.color }}
                />
                {p.label}
                {palette === p.key && (
                  <span className="ml-auto text-accent text-xs">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
