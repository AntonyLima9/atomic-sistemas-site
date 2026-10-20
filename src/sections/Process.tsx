import { useEffect, useRef } from 'react'
import { SplitText } from '../components/SplitText'
import { Scramble } from '../components/Scramble'
import { ScrollTrigger } from '../lib/scroll'
import { IconCode, IconLayout, IconMessage, IconRocket, IconTile } from '../components/Icons'

const steps = [
  { n: '01', when: 'Dia 1', title: 'Conversa', text: 'Você me chama no WhatsApp e conta a ideia. Sem formulário chato, sem reunião de 2 horas.', icon: IconMessage },
  { n: '02', when: 'Até 2 dias', title: 'Layout', text: 'Você vê o visual do site antes de eu programar e pede os ajustes que quiser.', icon: IconLayout },
  { n: '03', when: '3 a 7 dias', title: 'Desenvolvimento', text: 'Site rápido, responsivo e já preparado para aparecer no Google.', icon: IconCode },
  { n: '04', when: 'Entrega', title: 'No ar + suporte', text: 'Publico com SSL e domínio, te ensino a usar e os ajustes iniciais estão inclusos.', icon: IconRocket },
]

export function Process() {
  const line = useRef<HTMLDivElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top 65%',
      end: 'bottom 65%',
      onUpdate: (s) => {
        line.current!.style.transform = `scaleY(${s.progress})`
        wrap.current!.querySelectorAll<HTMLElement>('[data-step]').forEach((el, i) => {
          el.classList.toggle('is-active', s.progress >= i / steps.length + 0.02)
        })
      },
    })
    return () => st.kill()
  }, [])

  return (
    <section id="processo" className="relative px-5 py-32 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Scramble text="// 02 — COMO EU TRABALHO" />
        <SplitText as="h2" text="Do *oi* ao site no ar em poucos dias." className="h-display mt-5 max-w-3xl text-5xl md:text-7xl" />

        <div ref={wrap} className="relative mt-20">
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-white/10 md:left-1/2" />
          <div
            ref={line}
            className="absolute bottom-0 left-[19px] top-0 w-px origin-top bg-gradient-to-b from-gold via-sun to-gold shadow-[0_0_14px_rgba(255,210,63,.8)] md:left-1/2"
            style={{ transform: 'scaleY(0)' }}
          />
          <ol className="space-y-14 md:space-y-24">
            {steps.map((s, i) => (
              <li key={s.n} data-step className={`step relative pl-14 md:w-1/2 md:pl-0 ${i % 2 ? 'md:ml-auto md:pl-16' : 'md:pr-16'}`}>
                <span className={`step-dot absolute left-[11px] top-8 h-[17px] w-[17px] rounded-full border-2 border-white/20 bg-ink transition-all duration-500 ${i % 2 ? 'md:-left-[8.5px]' : 'md:-right-[8.5px] md:left-auto'}`} />
                <div data-reveal className="glass relative overflow-hidden rounded-3xl p-7 md:p-9">
                  <span className="pointer-events-none absolute -right-2 -top-6 font-display text-[7rem] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(226,184,44,.25)]">
                    {s.n}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="animate-[float_4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.4}s` }}>
                      <IconTile icon={s.icon} size="lg" />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-gold">{s.when}</span>
                  </div>
                  <h3 className="h-display mt-5 text-3xl md:text-4xl">{s.title}</h3>
                  <p className="mt-3 max-w-sm text-white/65">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p data-reveal className="mx-auto mt-24 max-w-2xl text-center font-display text-2xl text-white/80 md:text-3xl">
          “Sem agência, sem intermediário: <span className="text-sun">você fala direto com quem faz.</span>”
        </p>
      </div>
    </section>
  )
}
