import * as THREE from 'three'

// Texturas procedurais (canvas) para os acabamentos reais dos aparelhos:
// alumínio jateado do MacBook, titânio escovado e vidro fosco do iPhone.

function noiseCanvas(size: number, draw: (img: ImageData) => void, blur = 0) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(size, size)
  draw(img)
  ctx.putImageData(img, 0, 0)
  if (blur) {
    // desfoca uma grade 3x3 da própria textura e recorta o centro: emenda sem costura ao repetir
    const tiled = document.createElement('canvas')
    tiled.width = tiled.height = size * 3
    const tg = tiled.getContext('2d')!
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) tg.drawImage(c, x * size, y * size)
    const soft = document.createElement('canvas')
    soft.width = soft.height = size * 3
    const sg = soft.getContext('2d')!
    sg.filter = `blur(${blur}px)`
    sg.drawImage(tiled, 0, 0)
    const out = document.createElement('canvas')
    out.width = out.height = size
    out.getContext('2d')!.drawImage(soft, size, size, size, size, 0, 0, size, size)
    return out
  }
  return c
}

function toTexture(c: HTMLCanvasElement, repeat: number) {
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  t.anisotropy = 8
  return t
}

// Grão fino (alumínio jateado / vidro fosco). Valores de lo..hi (0..1) no canal cinza.
function grain(size: number, lo: number, hi: number, blur: number, repeat: number) {
  const c = noiseCanvas(
    size,
    (img) => {
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (lo + Math.random() * (hi - lo)) * 255
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v
        img.data[i + 3] = 255
      }
    },
    blur,
  )
  return toTexture(c, repeat)
}

// Escovado: riscos horizontais longos (titânio).
function brushed(size: number, lo: number, hi: number, repeat: number) {
  const c = noiseCanvas(size, (img) => {
    for (let y = 0; y < size; y++) {
      let row = lo + Math.random() * (hi - lo)
      for (let x = 0; x < size; x++) {
        if (Math.random() < 0.02) row = lo + Math.random() * (hi - lo)
        const v = (row + (Math.random() - 0.5) * 0.03) * 255
        const i = (y * size + x) * 4
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v
        img.data[i + 3] = 255
      }
    }
  })
  return toTexture(c, repeat)
}

let cache: ReturnType<typeof build> | null = null
export const deviceMaterials = () => (cache ??= build())

function build() {
  const alRough = grain(512, 0.3, 0.46, 0.6, 6)
  const alBump = grain(512, 0.35, 0.65, 0.4, 10)
  const tiRough = brushed(512, 0.22, 0.4, 3)
  const tiBump = brushed(512, 0.3, 0.7, 3)
  const frost = grain(512, 0.42, 0.62, 0.8, 4)
  const keyRough = grain(256, 0.45, 0.62, 0.5, 14)

  return {
    // MacBook: alumínio anodizado "space gray", jateado (micro-grão)
    aluminum: new THREE.MeshPhysicalMaterial({
      color: '#5c5f66',
      metalness: 1,
      roughness: 1,
      roughnessMap: alRough,
      bumpMap: alBump,
      bumpScale: 0.35,
      envMapIntensity: 1.35,
    }),
    // chanfros polidos com ferramenta de diamante: mais brilhantes que a face
    aluminumEdge: new THREE.MeshPhysicalMaterial({ color: '#6a6d74', metalness: 1, roughness: 0.2, envMapIntensity: 1.6 }),
    keycap: new THREE.MeshPhysicalMaterial({ color: '#0c0c0e', roughness: 1, roughnessMap: keyRough, metalness: 0, clearcoat: 0.15, clearcoatRoughness: 0.7 }),
    // iPhone: moldura de titânio preto escovado
    titanium: new THREE.MeshPhysicalMaterial({
      color: '#46464a',
      metalness: 1,
      roughness: 1,
      roughnessMap: tiRough,
      bumpMap: tiBump,
      bumpScale: 0.25,
      anisotropy: 0.8,
      envMapIntensity: 1.5,
    }),
    // verso em vidro fosco texturizado
    backGlass: new THREE.MeshPhysicalMaterial({
      color: '#232428',
      metalness: 0,
      roughness: 1,
      roughnessMap: frost,
      clearcoat: 0.5,
      clearcoatRoughness: 0.45,
      envMapIntensity: 1.2,
    }),
    // platô das câmeras: vidro brilhante
    glossGlass: new THREE.MeshPhysicalMaterial({ color: '#1d1e22', metalness: 0.1, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05 }),
    lensRing: new THREE.MeshPhysicalMaterial({ color: '#55565b', metalness: 1, roughness: 0.18 }),
    // lente com revestimento antirreflexo (reflexo azul-arroxeado)
    lens: new THREE.MeshPhysicalMaterial({
      color: '#040406',
      metalness: 0.2,
      roughness: 0.02,
      clearcoat: 1,
      iridescence: 1,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [250, 600],
    }),
    blackGlass: new THREE.MeshPhysicalMaterial({ color: '#020203', roughness: 0.06, metalness: 0.1, clearcoat: 1 }),
  }
}
