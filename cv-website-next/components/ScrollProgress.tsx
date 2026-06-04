'use client'

import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function update() {
      const h = document.documentElement.scrollHeight - window.innerHeight
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0
      if (barRef.current) barRef.current.style.width = `${pct}%`
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[1000] bg-transparent"
    >
      <span
        ref={barRef}
        className="block h-full w-0"
        style={{
          background: 'linear-gradient(90deg, color-mix(in srgb, var(--accent) 45%, transparent), var(--accent))',
        }}
      />
    </div>
  )
}
