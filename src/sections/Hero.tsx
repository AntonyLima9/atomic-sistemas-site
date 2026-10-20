import { SplitText } from '../components/SplitText'
import { Scramble } from '../components/Scramble'
import { Magnetic } from '../components/Magnetic'
import { IconArrow, IconBolt, IconDevices, IconDown, IconMessage } from '../components/Icons'
import { linkWhatsApp } from '../data/contato'
import { scrollTo } from '../lib/scroll'

export function Hero() {
  return (
    <section id="topo" className="relative flex min-h-[100svh] flex-col justify-start px-5 pb-16 pt-32 md:px-10 md:pt-36">
      <div className="mx-auto w-full max-w-7xl">
        <Scramble text="// ATOMIC SISTEMAS — DESENVOLVIMENTO WEB" />
        <h1 className="h-display mt-6 max-w-[14ch] text-[clamp(3rem,8.6vw,9.5rem)]">
          <SplitText text="Seu negócio online *em dias*, não em meses." />
        </h1>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p data-reveal className="max-w-md text-lg text-white/70 md:text-xl" style={{ ['--d' as string]: '500ms' }}>
            Sites, painéis e aplicativos sob medida. Rápido, bonito e com preço justo, <strong className="text-sun">a partir de R$ 500</strong>.
          </p>
          <div data-reveal className="flex flex-wrap gap-3" style={{ ['--d' as string]: '650ms' }}>
            <Magnetic>
              <a href={linkWhatsApp()} target="_blank" rel="noopener" className="btn btn-gold">
                Quero meu site <IconArrow className="arrow h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#showcase" onClick={(e) => (e.preventDefault(), scrollTo('#showcase'))} className="btn btn-ghost">
                Ver como funciona <IconDown />
              </a>
            </Magnetic>
          </div>
        </div>
        <ul data-reveal className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-white/55" style={{ ['--d' as string]: '800ms' }}>
          {[
            [IconBolt, 'Landing page em até 7 dias'],
            [IconDevices, 'Funciona em qualquer tela'],
            [IconMessage, 'Suporte direto com a equipe'],
          ].map(([Icon, t]) => {
            const I = Icon as typeof IconBolt
            return (
              <li key={t as string} className="flex items-center gap-2">
                <I className="h-4 w-4 text-gold" />
                {t as string}
              </li>
            )
          })}
        </ul>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-white/40">
        ROLE
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_1.8s_cubic-bezier(.16,1,.3,1)_infinite] bg-sun" />
        </span>
      </div>
    </section>
  )
}
