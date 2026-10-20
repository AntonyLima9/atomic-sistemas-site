import { useEffect, useState } from 'react'
import { LOGO_PIECES } from './Logo'
import { reducedMotion } from '../lib/env'

// As 3 peças da logo voam e se encaixam, o contador vai a 100 e a tela abre em diagonal.
export function Loader({ onDone }: { onDone: () => void }) {
  const seen = (() => {
    try {
      return sessionStorage.getItem('atomic-loader') === '1'
    } catch {
      return false
    }
  })()
  const skip = seen || reducedMotion
  const [n, setN] = useState(0)
  const [open, setOpen] = useState(false)
  const [gone, setGone] = useState(skip)

  useEffect(() => {
    if (skip) {
      onDone()
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200)
      setN(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setOpen(true)
        onDone()
        try {
          sessionStorage.setItem('atomic-loader', '1')
        } catch {
          /* sem storage, sem problema */
        }
        setTimeout(() => setGone(true), 900)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-ink"
      style={{
        clipPath: open ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        transition: 'clip-path .9s cubic-bezier(.76,0,.24,1)',
      }}
      aria-hidden
    >
      <div className="flex flex-col items-center gap-8">
        <svg viewBox="0 0 292 320" className="h-28 w-auto overflow-visible" fill="#E2B82C" style={{ filter: n === 100 ? 'drop-shadow(0 0 28px rgba(255,210,63,.8))' : 'none', transition: 'filter .3s' }}>
          <path className="loader-piece" d={LOGO_PIECES.a} stroke="#E2B82C" strokeWidth="0.8" style={{ ['--fx' as string]: '-120px', ['--fy' as string]: '-160px', ['--fr' as string]: '-90deg' }} />
          <path className="loader-piece" d={LOGO_PIECES.b} stroke="#E2B82C" strokeWidth="0.8" style={{ ['--fx' as string]: '180px', ['--fy' as string]: '60px', ['--fr' as string]: '70deg', animationDelay: '.12s' }} />
          <path className="loader-piece" d={LOGO_PIECES.c} style={{ ['--fx' as string]: '-140px', ['--fy' as string]: '160px', ['--fr' as string]: '120deg', animationDelay: '.24s' }} />
        </svg>
        <div className="font-mono text-sm tracking-[0.3em] text-mute">
          <span className="text-sun">{String(n).padStart(3, '0')}</span> / 100
        </div>
      </div>
    </div>
  )
}
