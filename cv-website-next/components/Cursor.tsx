'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    if (!dotRef.current || !ringRef.current) return
    const dot  = dotRef.current as HTMLDivElement
    const ring = ringRef.current as HTMLDivElement

    let mx = 0, my = 0, rx = 0, ry = 0
    let rafId: number

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX; my = e.clientY
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
    }

    function loop() {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(loop)

    const hotEls = document.querySelectorAll('a, button, input, textarea')
    hotEls.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hot'))
      el.addEventListener('mouseleave', () => ring.classList.remove('hot'))
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[7px] h-[7px] rounded-full bg-accent
                   pointer-events-none z-[9999] [transform:translate(-50%,-50%)]
                   hidden md:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[34px] h-[34px] rounded-full border border-accent
                   opacity-50 pointer-events-none z-[9999]
                   transition-[width,height,opacity,background] duration-200
                   [transform:translate(-50%,-50%)] hidden md:block
                   [&.hot]:w-[54px] [&.hot]:h-[54px] [&.hot]:opacity-90 [&.hot]:accent-bg-14"
      />
    </>
  )
}
