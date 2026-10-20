// Estado mutável compartilhado entre o DOM (ScrollTrigger) e a cena 3D, sem re-render do React.
export const scrollState = {
  hero: 0, // 0..1 enquanto o hero sai da tela
  show: 0, // 0..1 progresso da seção showcase (pinned)
  cta: 0, // 0..1 seção de contato entrando
  velocity: 0,
  mouse: { x: 0, y: 0 }, // -1..1
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

if (import.meta.env.DEV) (window as unknown as { __s: typeof scrollState }).__s = scrollState
