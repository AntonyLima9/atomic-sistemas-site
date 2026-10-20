import { useEffect, useRef } from 'react'
import { reducedMotion } from '../lib/env'

const CHARS = '01ATOMIC#/<>_*+=%$'

// Rótulo técnico que "embaralha" até formar o texto quando entra na tela.
export function Scramble({ text, className = 'label' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const dur = 900
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur)
          const done = Math.floor(t * text.length)
          let out = text.slice(0, done)
          for (let i = done; i < text.length; i++) out += text[i] === ' ' ? ' ' : CHARS[(Math.random() * CHARS.length) | 0]
          el.textContent = out
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [text])
  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
