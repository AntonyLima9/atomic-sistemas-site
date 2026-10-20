import { useEffect, useRef } from 'react'
import { isTouch, reducedMotion } from '../lib/env'
import { scrollState } from '../lib/store'

// Brilho desfocado que acompanha o mouse (o cursor do sistema continua normal).
// Também alimenta a inclinação da cena 3D e o reflexo dos cards de vidro.
export function Cursor() {
  const glow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const cur = { ...pos }
    let visible = false

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      scrollState.mouse.x = (e.clientX / innerWidth) * 2 - 1
      scrollState.mouse.y = -((e.clientY / innerHeight) * 2 - 1)
      const g = (e.target as Element | null)?.closest?.('.glass') as HTMLElement | null
      if (g) {
        const r = g.getBoundingClientRect()
        g.style.setProperty('--mx', `${e.clientX - r.left}px`)
        g.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
      if (!visible && glow.current) {
        visible = true
        cur.x = pos.x
        cur.y = pos.y
        glow.current.style.opacity = '1'
      }
    }
    const hide = () => {
      visible = false
      if (glow.current) glow.current.style.opacity = '0'
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', hide)
    if (isTouch || reducedMotion) {
      return () => {
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerleave', hide)
      }
    }

    let raf = 0
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.12
      cur.y += (pos.y - cur.y) * 0.12
      if (glow.current) glow.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', hide)
    }
  }, [])

  if (isTouch || reducedMotion) return null
  return <div ref={glow} className="cursor-glow" aria-hidden />
}
