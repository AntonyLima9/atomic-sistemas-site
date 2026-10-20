import { useEffect, useState } from 'react'
import { LogoMark } from './Logo'
import { reducedMotion } from '../lib/env'

// Pré-carregamento discreto: a logo aparece suave e a tela some num fade curto.
export function Loader({ onDone }: { onDone: () => void }) {
  const seen = (() => {
    try {
      return sessionStorage.getItem('atomic-loader') === '1'
    } catch {
      return false
    }
  })()
  const skip = seen || reducedMotion
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(skip)

  useEffect(() => {
    if (skip) {
      onDone()
      return
    }
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const minTime = new Promise((r) => setTimeout(r, 700))
    let alive = true
    Promise.all([fontsReady, minTime]).then(() => {
      if (!alive) return
      setFading(true)
      onDone()
      try {
        sessionStorage.setItem('atomic-loader', '1')
      } catch {
        /* sem storage, sem problema */
      }
      setTimeout(() => alive && setGone(true), 600)
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-ink transition-opacity duration-500 ease-out"
      style={{ opacity: fading ? 0 : 1 }}
      aria-hidden
    >
      <LogoMark className="loader-mark h-12 w-auto text-gold" />
    </div>
  )
}
