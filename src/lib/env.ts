export const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches
export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isMobileWidth = () => window.innerWidth < 768
// celulares/tablets: qualidade reduzida da cena 3D e efeitos CSS mais leves
export const lowPower = typeof window !== 'undefined' && (isTouch || window.innerWidth < 768)

export const hasWebGL = (() => {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
})()
