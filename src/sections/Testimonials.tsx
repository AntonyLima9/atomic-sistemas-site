import { SplitText } from '../components/SplitText'
import { Scramble } from '../components/Scramble'
import { depoimentos } from '../data/depoimentos'

export function Testimonials() {
  if (!depoimentos.length) return null
  return (
    <section id="depoimentos" className="relative px-5 py-32 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Scramble text="// DEPOIMENTOS" />
        <SplitText as="h2" text="Quem já está *no ar*." className="h-display mt-5 text-5xl md:text-6xl" />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {depoimentos.map((d, i) => (
            <li key={d.nome} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }} className="glass flex flex-col justify-between gap-8 rounded-3xl p-7">
              <p className="text-lg leading-relaxed text-white/80">“{d.texto}”</p>
              <div className="flex items-center gap-4">
                {d.foto ? (
                  <img src={d.foto} alt="" loading="lazy" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-sun font-display text-lg font-bold text-ink">{d.nome[0]}</span>
                )}
                <span>
                  <span className="block font-semibold">{d.nome}</span>
                  <span className="block text-sm text-white/50">{d.empresa}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
