import * as THREE from 'three'

// Pontos da logo (viewBox 292x320). A e B formam o "λ", C é o triângulo.
export const LOGO_POINTS: Record<'a' | 'b' | 'c', [number, number][]> = {
  a: [[144, 6], [179, 70], [137, 168], [115, 232], [63, 206], [52, 196]],
  b: [[137, 168], [256, 235], [286, 307], [277, 314], [115, 232]],
  c: [[48, 208], [122, 248], [8, 312], [5, 307]],
}
export const LOGO_FULL_POINTS: [number, number][] = [[144, 6], [179, 70], [137, 168], [256, 235], [286, 307], [277, 314], [63, 206], [52, 196]]

const CX = 146
const CY = 160

export function shapeFrom(points: [number, number][], scale: number) {
  const s = new THREE.Shape()
  points.forEach(([x, y], i) => {
    const px = (x - CX) * scale
    const py = -(y - CY) * scale
    if (i === 0) s.moveTo(px, py)
    else s.lineTo(px, py)
  })
  s.closePath()
  return s
}

// Logo inteira (2 formas) para uso estático.
export const logoShapes = (scale: number) => [shapeFrom(LOGO_FULL_POINTS, scale), shapeFrom(LOGO_POINTS.c, scale)]
