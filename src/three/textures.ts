import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { getMockSites, DESKTOP, MOBILE } from '../lib/mockSites'

export type ScreenTextures = { desktop: THREE.CanvasTexture; mobile: THREE.CanvasTexture }

// Converte os sites-modelo em texturas com "janela" de visualização (repeat) que rola via offset.
export function useScreenTextures(maxAniso: number) {
  const [tex, setTex] = useState<ScreenTextures | null>(null)
  useEffect(() => {
    let alive = true
    getMockSites().then(({ desktop, mobile }) => {
      if (!alive) return
      const make = (c: HTMLCanvasElement, ratio: number) => {
        const t = new THREE.CanvasTexture(c)
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = maxAniso
        t.generateMipmaps = true
        t.minFilter = THREE.LinearMipmapLinearFilter
        t.repeat.set(1, ratio)
        t.offset.set(0, 1 - ratio)
        return t
      }
      setTex({ desktop: make(desktop, DESKTOP.view / DESKTOP.h), mobile: make(mobile, MOBILE.view / MOBILE.h) })
    })
    return () => {
      alive = false
    }
  }, [maxAniso])
  return tex
}

export function setScroll(t: THREE.Texture, p: number) {
  t.offset.y = (1 - t.repeat.y) * (1 - p)
}

// Retângulo arredondado como Shape (usado no iPhone e nas telas).
export function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

// ShapeGeometry com UV normalizado 0..1 (o padrão usa as coordenadas do shape).
export function planeFromShape(shape: THREE.Shape, segments = 12) {
  const g = new THREE.ShapeGeometry(shape, segments)
  g.computeBoundingBox()
  const b = g.boundingBox!
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) - b.min.x) / (b.max.x - b.min.x), (pos.getY(i) - b.min.y) / (b.max.y - b.min.y))
  }
  uv.needsUpdate = true
  return g
}

export const darkMetal = () =>
  new THREE.MeshPhysicalMaterial({ color: '#1d1d20', metalness: 0.8, roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.4 })
