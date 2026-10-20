import { useEffect, useRef } from 'react'
import { SplitText } from '../components/SplitText'
import { Scramble } from '../components/Scramble'
import { IconArrow } from '../components/Icons'
import { projetos, type Projeto } from '../data/projetos'
import { linkWhatsApp } from '../data/contato'
import { ScrollTrigger } from '../lib/scroll'
import { useMockImages } from '../lib/useMockImages'
import { reducedMotion } from '../lib/env'

function Shot({ p, img }: { p: Projeto; img: string | undefined }) {
  if (p.modelo === 'mobile') {
    return (
      <div className="mx-auto h-full w-[46%] rounded-[1.8rem] border border-white/15 bg-[#111] p-1.5 shadow-2xl">
        <div className="relative h-full overflow-hidden rounded-[1.5rem] bg-black">
          {img && <img src={img} alt={`Print do projeto ${p.nome}`} className="shot w-full" loading="lazy" />}
        </div>
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#141414] shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2.5">
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-3 flex-1 truncate rounded-md bg-white/5 px-3 py-1 font-mono text-[10px] text-white/40">{p.link ?? `${p.nome.toLowerCase().replace(/\s/g, '')}.web.app`}</span>
      </div>
      <div className="relative flex-1 overflow-hidden">{img && <img src={img} alt={`Print do projeto ${p.nome}`} className="shot w-full" loading="lazy" />}</div>
    </div>
  )
}

export function Projects() {
  const sec = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const imgs = useMockImages()

  useEffect(() => {
    if (reducedMotion) return
    const st = ScrollTrigger.create({
      trigger: sec.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => {
        const max = track.current!.scrollWidth - innerWidth
        track.current!.style.transform = `translate3d(${-s.progress * max}px,0,0)`
      },
    })
    return () => st.kill()
  }, [])

  const items = projetos.length + 2
  return (
    <section id="projetos" ref={sec} className="relative" style={{ height: reducedMotion ? 'auto' : `${items * 75}vh` }}>
      <div className={`${reducedMotion ? '' : 'sticky top-0 h-[100svh]'} flex items-center overflow-hidden`}>
        <div ref={track} className={`flex items-stretch gap-6 px-5 will-change-transform md:gap-10 md:px-10 ${reducedMotion ? 'flex-wrap' : ''}`}>
          <div className="flex w-[82vw] shrink-0 flex-col justify-center md:w-[34vw]">
            <Scramble text="// 04 — PROJETOS" />
            <SplitText as="h2" text="Trabalho que *aparece*." className="h-display mt-5 text-5xl md:text-7xl" />
            <p className="mt-5 max-w-sm text-white/60">Passe o mouse (ou toque) nos projetos para ver o site rolando por dentro.</p>
            <span className="mt-8 font-mono text-xs text-gold">ROLE PARA O LADO →</span>
          </div>
          {projetos.map((p) => {
            const img = p.imagem ?? (p.modelo && imgs ? imgs[p.modelo] : undefined)
            return (
              <article key={p.nome} className="glass group flex h-[68svh] w-[82vw] shrink-0 flex-col rounded-[28px] p-4 md:w-[46vw] md:p-5">
                <div className="min-h-0 flex-1">
                  <Shot p={p} img={img} />
                </div>
                <div className="flex items-end justify-between gap-4 px-2 pt-5">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-gold">
                      {p.tipo}
                      {p.demonstracao && <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-white/60">modelo de demonstração</span>}
                    </p>
                    <h3 className="h-display mt-2 text-3xl md:text-4xl">{p.nome}</h3>
                    <p className="mt-1 max-w-md text-sm text-white/60">{p.descricao}</p>
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener" className="btn btn-ghost shrink-0 !px-4 !py-2.5 text-sm">
                      Abrir site ↗
                    </a>
                  )}
                </div>
              </article>
            )
          })}
          <a
            href={linkWhatsApp('Olá! Quero ser o próximo projeto da Atomic.')}
            target="_blank"
            rel="noopener"
           
            className="group relative flex h-[68svh] w-[82vw] shrink-0 flex-col justify-between overflow-hidden rounded-[28px] bg-sun p-8 text-ink md:w-[34vw] md:p-10"
          >
            <span className="font-mono text-xs font-semibold tracking-widest">// SEU PROJETO AQUI</span>
            <span className="h-display text-6xl md:text-7xl">
              Seja o<br />próximo.
            </span>
            <span className="flex items-center gap-3 text-lg font-semibold">
              Começar agora <IconArrow className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" />
            </span>
            <svg viewBox="0 0 292 320" className="absolute -bottom-10 -right-10 h-72 w-auto opacity-15 transition-transform duration-1000 ease-expo group-hover:rotate-12 group-hover:scale-110" fill="#070707" aria-hidden>
              <path d="M144 6 179 70 137 168 256 235 286 307 277 314 63 206 52 196Z" />
              <path d="M48 208 122 248 8 312 5 307Z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
