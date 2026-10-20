import { useRef } from 'react'
import { SplitText } from '../components/SplitText'
import { Scramble } from '../components/Scramble'
import { IconApp, IconPanel, IconSite } from '../components/Icons'
import { isTouch } from '../lib/env'

const services = [
  { icon: IconSite, title: 'Sites e landing pages', text: 'Institucional, catálogo, página de vendas. Seu cartão de visitas aberto 24h.', tags: ['Institucional', 'Catálogo', 'Vendas'] },
  { icon: IconPanel, title: 'Painéis administrativos', text: 'Pedidos, estoque, clientes e relatórios em um só lugar, do jeito que sua empresa funciona.', tags: ['Pedidos', 'Estoque', 'Relatórios'] },
  { icon: IconApp, title: 'Aplicativos web', text: 'Cardápio digital, agendamento, área do cliente. Instala no celular como app.', tags: ['PWA', 'Agendamento', 'Cardápio'] },
]

function TiltCard({ s, i }: { s: (typeof services)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: React.PointerEvent) => {
    if (isTouch) return
    const r = ref.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current!.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 14}deg) translateZ(0)`
  }
  const leave = () => (ref.current!.style.transform = '')
  const Icon = s.icon
  return (
    <div data-reveal style={{ ['--d' as string]: `${i * 120}ms` }}>
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        className="glass group h-full rounded-[28px] p-8 transition-transform duration-500 ease-expo [transform-style:preserve-3d]"
        data-cursor="ver"
      >
        <div className="[transform:translateZ(50px)]">
          <div className="cube-wrap h-16 w-16">
            <div className="cube">
              {[0, 1, 2, 3].map((f) => (
                <span key={f} className="cube-face" style={{ transform: `rotateY(${f * 90}deg) translateZ(32px)` }}>
                  <Icon className="h-7 w-7" />
                </span>
              ))}
            </div>
          </div>
          <h3 className="h-display mt-8 text-3xl">{s.title}</h3>
          <p className="mt-3 text-white/65">{s.text}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {s.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/60 transition-colors group-hover:border-gold/40 group-hover:text-gold">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Services() {
  return (
    <section id="servicos" className="relative px-5 py-32 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Scramble text="// 03 — SERVIÇOS" />
        <SplitText as="h2" text="O que eu *construo* para você." className="h-display mt-5 max-w-3xl text-5xl md:text-7xl" />
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {services.map((s, i) => (
            <TiltCard key={s.title} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
