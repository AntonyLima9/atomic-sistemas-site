import { useEffect, useState } from 'react'
import { Wordmark, LogoMark } from './Logo'
import { Magnetic } from './Magnetic'
import { linkWhatsApp } from '../data/contato'
import { scrollTo } from '../lib/scroll'

const links = [
  ['Como trabalho', '#processo'],
  ['Serviços', '#servicos'],
  ['Projetos', '#projetos'],
  ['Preços', '#precos'],
  ['Contato', '#contato'],
] as const

export function Menu() {
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      setSolid(y > 40)
      setHidden(y > last && y > 300)
      last = y
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    scrollTo(href)
  }

  return (
    <>
      <header
        className="fixed inset-x-0 top-3 z-[80] flex justify-center px-3 transition-transform duration-700 ease-expo"
        style={{ transform: hidden && !open ? 'translateY(-140%)' : 'none' }}
      >
        <nav
          className={`glass flex w-full max-w-6xl items-center justify-between rounded-full py-2 pl-5 pr-2 transition-colors duration-500 ${solid ? 'glass-dark' : ''}`}
          aria-label="Principal"
        >
          <a href="#topo" onClick={(e) => (e.preventDefault(), go('#topo'))} aria-label="Atomic Sistemas, início">
            <Wordmark />
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map(([t, h]) => (
              <li key={h}>
                <a
                  href={h}
                  data-cursor="ir"
                  onClick={(e) => (e.preventDefault(), go(h))}
                  className="rounded-full px-4 py-2 text-sm text-white/70 transition-colors hover:text-sun"
                >
                  {t}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Magnetic className="hidden sm:inline-block">
              <a href={linkWhatsApp()} target="_blank" rel="noopener" className="btn btn-gold !py-2.5 !text-sm" data-cursor="falar">
                Orçamento grátis
              </a>
            </Magnetic>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 top-0 h-0.5 w-5 bg-white transition-transform duration-500 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-white transition-transform duration-500 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div
        className="fixed inset-0 z-[70] flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-xl transition-[clip-path] duration-700 ease-expo lg:hidden"
        style={{ clipPath: open ? 'circle(150% at 90% 5%)' : 'circle(0% at 90% 5%)' }}
        aria-hidden={!open}
      >
        <LogoMark className="pointer-events-none absolute -right-16 bottom-10 h-80 w-auto animate-[spin_30s_linear_infinite] text-gold/10" />
        <ul className="space-y-3">
          {links.map(([t, h], i) => (
            <li
              key={h}
              className="transition-all duration-700 ease-expo"
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms', opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(30px)' }}
            >
              <a href={h} tabIndex={open ? 0 : -1} onClick={(e) => (e.preventDefault(), go(h))} className="h-display text-5xl">
                <span className="mr-3 font-mono text-sm text-gold">0{i + 1}</span>
                {t}
              </a>
            </li>
          ))}
        </ul>
        <a href={linkWhatsApp()} tabIndex={open ? 0 : -1} target="_blank" rel="noopener" className="btn btn-gold mt-12 self-start">
          Orçamento grátis no WhatsApp
        </a>
      </div>
    </>
  )
}
