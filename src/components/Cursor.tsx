import { useEffect, useRef } from 'react'
import { isTouch, reducedMotion } from '../lib/env'
import { scrollState } from '../lib/store'

// Cursor "átomo": núcleo + órbita com 2 elétrons, rastro dourado e onda no clique.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const orbit = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const trail = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scrollState.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      scrollState.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
      const g = (e.target as Element | null)?.closest?.('.glass') as HTMLElement | null
      if (g) {
        const r = g.getBoundingClientRect()
        g.style.setProperty('--mx', `${e.clientX - r.left}px`)
        g.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    if (isTouch || reducedMotion) return () => window.removeEventListener('pointermove', onMove)

    document.documentElement.classList.add('has-cursor')
    const cv = trail.current!
    const ctx = cv.getContext('2d')!
    const dpr = Math.min(2, window.devicePixelRatio)
    const resize = () => {
      cv.width = innerWidth * dpr
      cv.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const ringPos = { ...pos }
    let last = { ...pos }
    let angle = 0
    let size = 34
    let targetSize = 34
    let visible = false
    const parts: { x: number; y: number; t: number; vx: number; vy: number }[] = []

    const move = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!visible) {
        visible = true
        dot.current!.style.opacity = ring.current!.style.opacity = '1'
        ringPos.x = pos.x
        ringPos.y = pos.y
      }
      if (parts.length < 40 && Math.hypot(pos.x - last.x, pos.y - last.y) > 6) {
        parts.push({ x: pos.x, y: pos.y, t: performance.now(), vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 })
        last = { ...pos }
      }
    }
    const over = (e: PointerEvent) => {
      const t = e.target as Element
      const hit = t.closest?.('a, button, [data-cursor], summary, select, input, textarea') as HTMLElement | null
      const zone = t.closest?.('[data-cursor-zone]') as HTMLElement | null
      const text = hit?.dataset.cursor ?? (hit ? (hit.tagName === 'A' ? 'abrir' : hit.matches('input,textarea,select') ? '' : 'ver') : zone?.dataset.cursorZone ?? '')
      const big = !!hit && !hit.matches('input,textarea,select')
      targetSize = big ? 84 : zone ? 64 : 34
      ring.current!.classList.toggle('is-big', big)
      ring.current!.classList.toggle('is-zone', !big && !!zone)
      label.current!.textContent = text
    }
    const down = (e: PointerEvent) => {
      const r = document.createElement('span')
      r.className = 'cursor-ripple'
      r.style.left = `${e.clientX}px`
      r.style.top = `${e.clientY}px`
      document.body.appendChild(r)
      setTimeout(() => r.remove(), 700)
    }
    const hide = () => {
      visible = false
      dot.current!.style.opacity = ring.current!.style.opacity = '0'
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    document.addEventListener('pointerleave', hide)

    let raf = 0
    const loop = () => {
      const speed = Math.hypot(pos.x - ringPos.x, pos.y - ringPos.y)
      ringPos.x += (pos.x - ringPos.x) * 0.15
      ringPos.y += (pos.y - ringPos.y) * 0.15
      size += (targetSize - size) * 0.18
      angle += 2.2 + Math.min(speed, 120) * 0.25
      dot.current!.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
      ring.current!.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`
      ring.current!.style.width = ring.current!.style.height = `${size}px`
      orbit.current!.style.transform = `rotate(${angle}deg)`

      const now = performance.now()
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        const life = 1 - (now - p.t) / 450
        if (life <= 0) {
          parts.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.6 * life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,210,63,${0.55 * life})`
        ctx.shadowColor = 'rgba(255,210,63,.8)'
        ctx.shadowBlur = 8
        ctx.fill()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('resize', resize)
      document.removeEventListener('pointerleave', hide)
    }
  }, [])

  if (isTouch || reducedMotion) return null
  return (
    <>
      <canvas ref={trail} className="pointer-events-none fixed inset-0 z-[998] h-full w-full" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden>
        <div ref={orbit} className="cursor-orbit">
          <i />
          <i />
        </div>
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  )
}
