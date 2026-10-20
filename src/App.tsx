import { lazy, Suspense, useEffect, useState } from 'react'
import { Loader } from './components/Loader'
import { Cursor } from './components/Cursor'
import { Menu } from './components/Menu'
import { Grain, Marquee, Progress, WhatsAppFloat } from './components/Chrome'
import { Hero } from './sections/Hero'
import { Showcase } from './sections/Showcase'
import { Process } from './sections/Process'
import { Services } from './sections/Services'
import { Projects } from './sections/Projects'
import { Pricing } from './sections/Pricing'
import { Faq } from './sections/Faq'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { hasWebGL, reducedMotion } from './lib/env'
import { initScroll, ScrollTrigger } from './lib/scroll'
import { initReveals } from './lib/reveal'

const Scene = lazy(() => import('./three/Scene'))
const use3d = hasWebGL && !reducedMotion

export default function App() {
  const [ready, setReady] = useState(false)
  const [scene, setScene] = useState(false)

  useEffect(() => {
    initScroll()
    // a cena carrega depois do primeiro paint, para o texto do hero aparecer na hora
    if (use3d) {
      const id = (window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200)))(() => setScene(true))
      return () => (window.cancelIdleCallback ?? clearTimeout)(id as number)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const stop = initReveals()
    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => {
      stop()
      clearTimeout(t)
    }
  }, [ready])

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Progress />
      <Grain />
      {scene && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}
      <Menu />
      <main className="relative z-10">
        <Hero />
        <Showcase enabled3d={use3d} />
        <Marquee />
        <Process />
        <Services />
        <Marquee items={['RÁPIDO', 'BONITO', 'BARATO', 'NO AR EM DIAS']} />
        <Projects />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
