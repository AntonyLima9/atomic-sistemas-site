import { useState } from 'react'
import { SplitText } from '../components/SplitText'
import { Scramble } from '../components/Scramble'
import { faq } from '../data/faq'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="relative px-5 py-32 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.5fr]">
        <div>
          <Scramble text="// 06 — DÚVIDAS" />
          <SplitText as="h2" text="Perguntas *frequentes*." className="h-display mt-5 text-5xl md:text-6xl" />
        </div>
        <ul className="space-y-3">
          {faq.map((f, i) => (
            <li key={f.q} data-reveal style={{ ['--d' as string]: `${i * 60}ms` }} className="acc glass rounded-2xl" data-open={open === i}>
              <button
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
               
              >
                <span className="font-display text-lg font-semibold md:text-xl">{f.q}</span>
                <span className="plus grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-xl text-sun">+</span>
              </button>
              <div className="acc-body">
                <div>
                  <p className="px-6 pb-6 text-white/65">{f.a}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
