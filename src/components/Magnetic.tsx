import { useEffect, useRef, type ReactNode } from 'react'
import { isTouch, reducedMotion } from '../lib/env'

// Puxa o filho em direção ao cursor quando ele se aproxima (botões magnéticos).
export function Magnetic({ children, strength = 12, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || isTouch || reducedMotion) return
    const inner = el.firstElementChild as HTMLElement | null
    if (!inner) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      const reach = Math.max(r.width, r.height) * 0.9
      if (dist < reach) {
        const f = (1 - dist / reach) * strength
        inner.style.transform = `translate(${(dx / reach) * f * 1.6}px, ${(dy / reach) * f * 1.6}px)`
      } else inner.style.transform = ''
    }
    const leave = () => (inner.style.transform = '')
    inner.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)'
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  )
}
