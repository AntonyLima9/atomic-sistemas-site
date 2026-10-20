import { useEffect, useRef, useState } from 'react'
import { IconChat } from './Icons'
import { linkWhatsApp } from '../data/contato'
import { scrollState } from '../lib/store'

// Barra de progresso no topo + grain + botão flutuante de WhatsApp.
export function Progress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-[95] h-0.5">
      <div ref={ref} className="h-full origin-left bg-gradient-to-r from-gold to-sun shadow-[0_0_12px_rgba(255,210,63,.7)]" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}

export function Grain() {
  return <div className="grain" aria-hidden />
}

export function WhatsAppFloat() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(scrollY > innerHeight * 0.8 && scrollState.cta < 0.5)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <a
      href={linkWhatsApp()}
      target="_blank"
      rel="noopener"
      aria-label="Falar no WhatsApp"
     
      className="pulse fixed bottom-5 right-5 z-[85] grid h-14 w-14 place-items-center rounded-full bg-sun text-ink shadow-[0_10px_40px_-5px_rgba(255,210,63,.6)] transition-all duration-500 ease-expo"
      style={{ transform: show ? 'none' : 'translateY(120px) scale(.6)', opacity: show ? 1 : 0 }}
      tabIndex={show ? 0 : -1}
    >
      <IconChat className="relative h-7 w-7" />
    </a>
  )
}

export function Marquee({ items = ['SITES', 'PAINÉIS', 'APLICATIVOS', 'RÁPIDO', 'BONITO', 'ACESSÍVEL'] }: { items?: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const v = Math.max(-12, Math.min(12, scrollState.velocity * 0.35))
      ref.current?.style.setProperty('--skew', `${-v}deg`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  const row = [...items, ...items]
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/10 bg-ink py-6" aria-hidden>
      <div ref={ref} className="marquee">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {row.map((t, i) => (
                <span key={i} className="h-display flex items-center px-6 text-5xl md:text-7xl">
                  <span className={i % 2 ? 'text-transparent [-webkit-text-stroke:1px_rgba(247,245,239,.5)]' : ''}>{t}</span>
                  <span className="ml-12 text-3xl text-gold">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
