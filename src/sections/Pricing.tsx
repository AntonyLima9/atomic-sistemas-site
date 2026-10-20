import { useEffect, useRef } from 'react'
import { SplitText } from '../components/SplitText'
import { Magnetic } from '../components/Magnetic'
import { IconArrow, IconCard, IconCheck, IconStar } from '../components/Icons'
import { custosNoAr, planos } from '../data/planos'
import { linkWhatsApp } from '../data/contato'

const fmt = (n: number) => n.toLocaleString('pt-BR')

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current!
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / 1400)
          el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 4))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{fmt(to)}</span>
}

export function Pricing() {
  return (
    <section id="precos" className="relative z-10 bg-paper px-5 py-32 text-ink md:px-10">
      <div className="mx-auto max-w-6xl">
        <span className="label !text-[#8a6d0f]">// 05 — PREÇOS</span>
        <SplitText as="h2" text="Preço justo. *Sem surpresa.*" accent="text-[#b8920f]" className="h-display mt-5 max-w-3xl text-5xl md:text-7xl" />
        <p data-reveal className="mt-5 max-w-xl text-lg text-black/60">
          Valores fechados, sem mensalidade escondida. O preço depende do modelo e do que o seu negócio precisa.
        </p>

        <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-3">
          {planos.map((p, i) => (
            <div
              key={p.id}
              data-reveal
              style={{ ['--d' as string]: `${i * 120}ms` }}
              className={`relative flex flex-col rounded-[28px] p-8 ${p.destaque ? 'border-spin bg-ink text-paper shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)] lg:-my-4 lg:py-12' : 'border border-black/10 bg-white/60'}`}
            >
              {p.destaque && <span className="absolute -top-3 left-8 flex items-center gap-1.5 rounded-full bg-sun px-3 py-1 font-mono text-[11px] font-semibold text-ink"><IconStar className="h-3 w-3" /> MAIS ESCOLHIDO</span>}
              <p className={`font-mono text-xs uppercase tracking-widest ${p.destaque ? 'text-gold' : 'text-[#8a6d0f]'}`}>{p.subtitulo}</p>
              <h3 className="h-display mt-2 text-4xl">{p.nome}</h3>
              <p className={`mt-2 text-sm ${p.destaque ? 'text-white/60' : 'text-black/55'}`}>{p.paraQuem}</p>
              <p className="mt-8 flex items-baseline gap-2 font-mono">
                <span className={`text-lg ${p.destaque ? 'text-white/60' : 'text-black/50'}`}>R$</span>
                <span className={`text-6xl font-semibold tracking-tight ${p.destaque ? 'text-sun' : ''}`}>
                  <Count to={p.preco} />
                </span>
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {p.inclui.map((t) => (
                  <li key={t} className="flex gap-3 text-[0.95rem]">
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.destaque ? 'bg-sun text-ink' : 'bg-ink text-sun'}`}>
                      <IconCheck className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Magnetic className="mt-10">
                <a
                  href={linkWhatsApp(`Olá! Tenho interesse no plano ${p.nome} (${p.subtitulo}) de R$ ${fmt(p.preco)}.`)}
                  target="_blank"
                  rel="noopener"
                  data-cursor="falar"
                  className={`btn w-full justify-center ${p.destaque ? 'btn-gold' : 'bg-ink text-paper hover:bg-black'}`}
                >
                  Quero esse <IconArrow className="arrow h-4 w-4" />
                </a>
              </Magnetic>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-16 overflow-hidden rounded-[28px] bg-ink p-8 text-paper shadow-[0_40px_80px_-40px_rgba(0,0,0,.5)] md:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="label">// E PARA COLOCAR NO AR?</span>
              <h3 className="h-display mt-4 text-4xl md:text-5xl">Quanto custa manter o site?</h3>
              <p className="mt-4 text-white/60">Transparência total: você sabe de cada custo antes de começar.</p>
            </div>
            <ul className="divide-y divide-white/10">
              {custosNoAr.map((c) => (
                <li key={c.item} className="flex items-start justify-between gap-6 py-5">
                  <div>
                    <p className="font-semibold">{c.item}</p>
                    <p className="mt-1 text-sm text-white/55">{c.obs}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xl text-sun">{c.valor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="flex items-center gap-2.5 rounded-full border border-black/10 px-5 py-3 font-mono text-sm"><IconCard className="h-5 w-5 text-[#8a6d0f]" /> Pagamento: 50% para começar, 50% na entrega.</p>
          <a href={linkWhatsApp('Olá! Quero um orçamento para um aplicativo/sistema maior.')} target="_blank" rel="noopener" className="group flex items-center gap-3 text-lg font-semibold" data-cursor="falar">
            Aplicativo ou sistema maior? <span className="underline decoration-gold decoration-2 underline-offset-4">Orçamento sob medida</span>
            <IconArrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
