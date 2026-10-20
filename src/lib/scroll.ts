import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isTouch, reducedMotion } from './env'
import { scrollState } from './store'

gsap.registerPlugin(ScrollTrigger)

export let lenis: Lenis | null = null

export function initScroll() {
  if (reducedMotion || isTouch || lenis) return
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  lenis.on('scroll', (l: Lenis) => {
    scrollState.velocity = l.velocity
    ScrollTrigger.update()
  })
  gsap.ticker.add((t) => lenis?.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

export function scrollTo(target: string | number) {
  if (lenis) lenis.scrollTo(target as string, { offset: 0, duration: 1.6 })
  else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  else window.scrollTo({ top: target, behavior: 'smooth' })
}

export { gsap, ScrollTrigger }
