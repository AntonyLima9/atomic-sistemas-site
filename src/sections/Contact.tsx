import { useEffect, useRef, useState } from 'react'
import { SplitText } from '../components/SplitText'
import { Scramble } from '../components/Scramble'
import { Magnetic } from '../components/Magnetic'
import { IconArrow, IconChat, IconInsta } from '../components/Icons'
import { contato, linkInstagram, linkWhatsApp } from '../data/contato'
import { ScrollTrigger } from '../lib/scroll'
import { scrollState } from '../lib/store'

export function Contact() {
  const sec = useRef<HTMLElement>(null)
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('Site')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sec.current,
      start: 'top 90%',
      end: 'top 15%',
      onUpdate: (s) => (scrollState.cta = s.progress),
    })
    return () => st.kill()
  }, [])

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    const texto = `Olá! Sou ${nome || '(sem nome)'} e vim pelo site da Atomic.\nTipo de projeto: ${tipo}\n${msg ? `Mensagem: ${msg}` : ''}`.trim()
    window.open(linkWhatsApp(texto), '_blank', 'noopener')
  }

  const field = 'w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3.5 text-paper placeholder:text-white/35 outline-none transition-colors focus:border-gold'

  return (
    <section id="contato" ref={sec} className="relative px-5 pb-24 pt-40 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="min-h-[60svh] text-center">
          <Scramble text="// 07 — CONTATO" />
          <SplitText as="h2" text="Bora tirar sua ideia *do papel?*" className="h-display mx-auto mt-6 max-w-5xl text-[clamp(3rem,9vw,8.5rem)] [text-shadow:0_10px_60px_rgba(0,0,0,.7)]" />
          <p data-reveal className="mx-auto mt-6 max-w-lg text-lg text-white/70">Chama a gente no WhatsApp ou no Instagram. Respondemos rápido e o orçamento é grátis.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Magnetic strength={8} className="block">
            <a href={linkWhatsApp()} target="_blank" rel="noopener" className="glass glass-dark group flex items-center justify-between gap-4 rounded-[28px] p-7 md:p-9">
              <span className="flex items-center gap-5">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-sun text-ink">
                  <IconChat className="h-8 w-8" />
                </span>
                <span>
                  <span className="block font-mono text-xs tracking-widest text-gold">WHATSAPP</span>
                  <span className="h-display mt-1 block text-2xl md:text-4xl">{contato.whatsappExibicao}</span>
                </span>
              </span>
              <IconArrow className="h-6 w-6 shrink-0 text-white/50 transition-all duration-500 group-hover:translate-x-1 group-hover:text-sun" />
            </a>
          </Magnetic>
          <Magnetic strength={8} className="block">
            <a href={linkInstagram} target="_blank" rel="noopener" className="glass glass-dark group flex items-center justify-between gap-4 rounded-[28px] p-7 md:p-9">
              <span className="flex items-center gap-5">
                <span className="grid h-16 w-16 place-items-center rounded-2xl border border-gold/50 text-sun">
                  <IconInsta className="h-8 w-8" />
                </span>
                <span>
                  <span className="block font-mono text-xs tracking-widest text-gold">INSTAGRAM</span>
                  <span className="h-display mt-1 block text-2xl md:text-4xl">@{contato.instagram}</span>
                </span>
              </span>
              <IconArrow className="h-6 w-6 shrink-0 text-white/50 transition-all duration-500 group-hover:translate-x-1 group-hover:text-sun" />
            </a>
          </Magnetic>
        </div>

        <form onSubmit={enviar} data-reveal className="glass glass-dark mt-5 grid gap-4 rounded-[28px] p-7 md:grid-cols-[1fr_1fr_2fr_auto] md:items-end md:p-9">
          <label className="block">
            <span className="mb-2 block font-mono text-xs text-white/50">Seu nome</span>
            <input className={field} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como podemos te chamar?" autoComplete="name" />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs text-white/50">Tipo de projeto</span>
            <select className={`${field} appearance-none`} value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {['Site', 'Painel', 'Aplicativo', 'Ainda não sei'].map((t) => (
                <option key={t} className="bg-ink">
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs text-white/50">Mensagem</span>
            <input className={field} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Conte rapidinho sua ideia" />
          </label>
          <button type="submit" className="btn btn-gold h-[52px] justify-center">
            Enviar no WhatsApp <IconArrow className="arrow h-4 w-4" />
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-white/45">
          O formulário só abre o seu WhatsApp com a mensagem pronta; não guardamos os dados digitados.{' '}
          <a href="/privacidade" className="underline underline-offset-4 hover:text-sun">Política de Privacidade</a>
        </p>
      </div>
    </section>
  )
}
