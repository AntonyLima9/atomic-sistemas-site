import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '../lib/scroll'
import { scrollState, seg } from '../lib/store'
import { useMockImages } from '../lib/useMockImages'
import { IconBag, IconBolt, IconDevices, IconTile } from '../components/Icons'

// Faixas de progresso [entra, sai] de cada texto sobreposto à cena 3D.
const overlays = [
  { range: [0.02, 0.12], label: '// 01 — O PRODUTO', title: 'Gira. Abre. Acende.', text: 'Role devagar e veja um site da Atomic ganhar vida.' },
  { range: [0.3, 0.47], label: '// DESKTOP', title: 'Design que vende.', text: 'Layout pensado para transformar visita em pedido.' },
  { range: [0.5, 0.64], label: '// MOBILE', title: 'Perfeito no celular também.', text: 'A maioria dos seus clientes chega pelo celular. O site é feito pensando nele.' },
]
const cards = [
  { icon: IconBolt, title: 'Carregamento rápido', text: 'Hospedado na rede global do Google.' },
  { icon: IconDevices, title: '100% responsivo', text: 'Do celular à TV da recepção.' },
  { icon: IconBag, title: 'Pronto para vender', text: 'Pedidos direto no seu WhatsApp.' },
]

export function Showcase({ enabled3d }: { enabled3d: boolean }) {
  const root = useRef<HTMLElement>(null)
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled3d) return
    const els = Array.from(layer.current!.querySelectorAll<HTMLElement>('[data-range]'))
    const ranges = els.map((el) => el.dataset.range!.split(',').map(Number))
    const apply = (p: number) => {
      els.forEach((el, i) => {
        const [a, b] = ranges[i]
        const fade = 0.04
        const t = Math.min(seg(p, a - fade, a), 1 - seg(p, b - fade, b))
        el.style.opacity = String(t)
        el.style.transform = `translate3d(0, ${(1 - t) * 30}px, 0)`
        el.style.filter = `blur(${(1 - t) * 8}px)`
        el.style.visibility = t <= 0.01 ? 'hidden' : 'visible'
      })
    }
    apply(0)
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollState.show = self.progress
        apply(self.progress)
      },
    })
    const hero = ScrollTrigger.create({
      trigger: '#topo',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => (scrollState.hero = self.progress),
    })
    return () => {
      st.kill()
      hero.kill()
    }
  }, [enabled3d])

  if (!enabled3d) return <StaticShowcase />

  return (
    <section id="showcase" ref={root} className="relative h-[420vh] md:h-[520vh]" aria-label="Demonstração: notebook e celular com sites de exemplo">
      <div ref={layer} className="sticky top-0 h-[100svh] overflow-hidden">
        {overlays.map((o, i) => (
          <div
            key={o.title}
            data-range={o.range.join(',')}
            className={`pointer-events-none absolute max-w-sm px-5 [text-shadow:0_4px_30px_rgba(0,0,0,.85)] md:px-10 ${i === 0 ? 'left-0 right-0 top-24 mx-auto text-center md:top-28' : i === 1 ? 'left-0 top-24 md:top-1/2 md:-translate-y-1/2' : 'left-0 top-24 md:top-auto md:bottom-10'}`}
            style={{ opacity: 0 }}
          >
            <span className="label">{o.label}</span>
            <h2 className="h-display mt-3 text-4xl md:text-5xl">{o.title}</h2>
            <p className="mt-3 text-white/65">{o.text}</p>
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-4 mx-auto grid max-w-5xl grid-cols-3 gap-2 px-3 md:bottom-10 md:gap-3 md:px-5">
          {cards.map((c, i) => (
            <div key={c.title} data-range={`${0.64 + i * 0.03},0.86`} className="glass glass-dark rounded-2xl p-3 md:p-5" style={{ opacity: 0 }}>
              <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-3">
                <IconTile icon={c.icon} />
                <div>
                  <p className="font-display text-sm font-semibold leading-tight md:text-lg">{c.title}</p>
                  <p className="hidden text-sm text-white/55 md:block">{c.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Sem WebGL ou com "reduzir movimento": composição estática com os mesmos sites.
function StaticShowcase() {
  const img = useMockImages()
  return (
    <section id="showcase" className="relative px-5 py-28 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-end md:justify-center">
        <div className="w-full max-w-3xl">
          <div className="rounded-t-2xl border border-white/10 bg-[#111] p-3">
            <div className="aspect-[16/10] overflow-hidden rounded-lg bg-black">
              {img && <img src={img.desktop} alt="Site-modelo Doce Ateliê no notebook" className="w-full" />}
            </div>
          </div>
          <div className="mx-auto h-4 w-[110%] -translate-x-[4.5%] rounded-b-2xl bg-gradient-to-b from-[#2a2a2e] to-[#111]" />
        </div>
        <div className="w-48 shrink-0 rounded-[2rem] border border-white/10 bg-[#111] p-2">
          <div className="aspect-[390/844] overflow-hidden rounded-[1.6rem] bg-black">
            {img && <img src={img.mobile} alt="Cardápio digital Brasa Burger no celular" className="w-full" />}
          </div>
        </div>
      </div>
      <h2 className="h-display mt-14 text-center text-4xl md:text-6xl">
        Design que vende. <span className="text-gold">No PC e no celular.</span>
      </h2>
    </section>
  )
}
