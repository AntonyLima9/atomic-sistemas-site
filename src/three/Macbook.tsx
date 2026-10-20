import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three-stdlib'
import { planeFromShape, roundedRectShape } from './textures'
import { logoShapes } from './logoShapes'

// Proporções de um MacBook Pro 14" (31,3 × 22,1 × 1,55 cm) em unidades da cena.
export const MAC = { w: 3.2, d: 2.24, baseH: 0.085, lidH: 0.032, corner: 0.13, screenW: 3.06, screenH: 1.9125 }
const T = MAC.baseH / 2 // topo da base

/* ---------- Layout do teclado (unidades "u" de tecla) ---------- */
type Key = { x: number; z: number; w: number; h: number; label?: string; small?: boolean; touch?: boolean }
const U = 0.1807
const GAP = 0.022
const KB_TOP = -0.95

function keyboardLayout(): Key[] {
  const L = (s: string) => s.split(' ')
  const rows: { h: number; keys: [number, string, boolean?][] }[] = [
    { h: 0.55, keys: [[1.5, 'esc', true], ...Array.from({ length: 12 }, (_, i) => [1, `F${i + 1}`, true] as [number, string, boolean]), [1, '']] },
    { h: 1, keys: [...L('` 1 2 3 4 5 6 7 8 9 0 - =').map((k) => [1, k] as [number, string]), [1.5, 'delete', true]] },
    { h: 1, keys: [[1.5, 'tab', true], ...L('Q W E R T Y U I O P [ ]').map((k) => [1, k] as [number, string]), [1, '\\']] },
    { h: 1, keys: [[1.8, 'caps lock', true], ...L("A S D F G H J K L ; '").map((k) => [1, k] as [number, string]), [1.7, 'return', true]] },
    { h: 1, keys: [[2.3, 'shift', true], ...L('Z X C V B N M , . /').map((k) => [1, k] as [number, string]), [2.2, 'shift', true]] },
    { h: 1, keys: [[1, 'fn', true], [1, 'control', true], [1, 'option', true], [1.25, 'command', true], [5, ''], [1.25, 'command', true], [1, 'option', true]] },
  ]
  const total = 14.5
  const keys: Key[] = []
  let z = KB_TOP
  rows.forEach((row, ri) => {
    const rh = row.h * U
    let x = (-total * U) / 2
    for (const [w, label, small] of row.keys) {
      keys.push({ x: x + (w * U) / 2, z: z + rh / 2, w: w * U - GAP, h: rh - GAP, label, small, touch: ri === 0 && label === '' })
      x += w * U
    }
    if (ri === 5) {
      // setas em "T invertido", meia altura
      const hh = rh / 2
      keys.push({ x: x + U / 2, z: z + hh * 1.5, w: U - GAP, h: hh - GAP / 2, label: '◀' })
      keys.push({ x: x + U * 1.5, z: z + hh * 0.5, w: U - GAP, h: hh - GAP / 2, label: '▲' })
      keys.push({ x: x + U * 1.5, z: z + hh * 1.5, w: U - GAP, h: hh - GAP / 2, label: '▼' })
      keys.push({ x: x + U * 2.5, z: z + hh * 1.5, w: U - GAP, h: hh - GAP / 2, label: '▶' })
    }
    z += rh
  })
  return keys
}

/* ---------- Texturas desenhadas em canvas ---------- */
const PX = 640 // pixels por unidade
const toCanvas = (x: number, z: number) => [(x + MAC.w / 2) * PX, (z + MAC.d / 2) * PX] as const

function canvasTex(draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas')
  c.width = Math.round(MAC.w * PX)
  c.height = Math.round(MAC.d * PX)
  const ctx = c.getContext('2d')!
  draw(ctx)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

// Tampo da base: poço do teclado, grades dos alto-falantes e contorno do trackpad (fundo transparente).
function deckTexture(keys: Key[]) {
  return canvasTex((ctx) => {
    const [wx, wz] = toCanvas(-14.5 * U * 0.5 - 0.03, KB_TOP - 0.03)
    const ww = (14.5 * U + 0.06) * PX
    const wh = (5.55 * U + 0.06) * PX
    rr(ctx, wx, wz, ww, wh, 14)
    ctx.fillStyle = '#08080a'
    ctx.fill()
    // grades dos alto-falantes
    ctx.fillStyle = 'rgba(0,0,0,.85)'
    for (const side of [-1, 1]) {
      const cx = side * (14.5 * U * 0.5 + 0.11)
      for (let iz = 0; iz < 46; iz++) {
        for (let ix = 0; ix < 6; ix++) {
          const [px, pz] = toCanvas(cx + (ix - 2.5) * 0.021, KB_TOP + 0.01 + iz * 0.0215)
          ctx.beginPath()
          ctx.arc(px, pz, 3.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    // trackpad
    const [tx, tz] = toCanvas(-0.76, 0.17)
    rr(ctx, tx, tz, 1.52 * PX, 0.92 * PX, 22)
    ctx.strokeStyle = 'rgba(0,0,0,.55)'
    ctx.lineWidth = 3
    ctx.stroke()
    // brilho sutil sob as teclas
    ctx.fillStyle = 'rgba(0,0,0,.35)'
    for (const k of keys) {
      const [kx, kz] = toCanvas(k.x - k.w / 2, k.z - k.h / 2)
      rr(ctx, kx - 2, kz - 2, k.w * PX + 4, k.h * PX + 4, 8)
      ctx.fill()
    }
  })
}

// Legendas das teclas, num plano transparente logo acima dos keycaps.
function legendTexture(keys: Key[]) {
  return canvasTex((ctx) => {
    ctx.fillStyle = 'rgba(235,235,240,.82)'
    ctx.textBaseline = 'middle'
    for (const k of keys) {
      if (!k.label) continue
      const [cx, cz] = toCanvas(k.x, k.z)
      if (k.small) {
        ctx.font = '500 13px Inter, system-ui, sans-serif'
        const left = k.label === 'delete' || k.label === 'return' || (k.label === 'shift' && k.x > 0) || (k.label === 'command' && k.x > 0) || (k.label === 'option' && k.x > 0)
        ctx.textAlign = left ? 'right' : 'left'
        const px = left ? cx + (k.w * PX) / 2 - 10 : cx - (k.w * PX) / 2 + 10
        ctx.fillText(k.label, px, cz + (k.h * PX) / 2 - 14)
      } else {
        ctx.font = `500 ${k.label.length > 1 ? 15 : 21}px Inter, system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(k.label, cx, cz)
      }
    }
  })
}

/* ---------- Geometrias ---------- */
// Placa com cantos arredondados em planta e borda levemente chanfrada, deitada no plano XZ.
function slab(w: number, d: number, h: number, r: number, bevel: number) {
  const g = new THREE.ExtrudeGeometry(roundedRectShape(w - bevel * 2, d - bevel * 2, r), {
    depth: h - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 5,
    curveSegments: 32,
  })
  g.center()
  g.rotateX(-Math.PI / 2)
  return g
}
const flatShape = (w: number, d: number, r: number) => {
  const g = planeFromShape(roundedRectShape(w, d, r), 24)
  g.rotateX(-Math.PI / 2)
  return g
}

type Props = { screen: THREE.Texture | null; lidRef: React.RefObject<THREE.Group>; screenMat: React.RefObject<THREE.MeshBasicMaterial> }

// MacBook Pro modelado em código: alumínio "space gray", teclado completo com legendas,
// alto-falantes, trackpad de vidro, notch, entradas laterais e pés de borracha.
export const Macbook = forwardRef<THREE.Group, Props>(function Macbook({ screen, lidRef, screenMat }, ref) {
  const keysRef = useRef<THREE.InstancedMesh>(null)
  const keys = useMemo(keyboardLayout, [])

  const m = useMemo(() => {
    const aluminum = new THREE.MeshPhysicalMaterial({
      color: '#55575d',
      metalness: 1,
      roughness: 0.34,
      clearcoat: 0.15,
      clearcoatRoughness: 0.5,
      envMapIntensity: 1.25,
    })
    return {
      aluminum,
      key: new THREE.MeshPhysicalMaterial({ color: '#0b0b0d', roughness: 0.5, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.6 }),
      touch: new THREE.MeshPhysicalMaterial({ color: '#151518', roughness: 0.15, metalness: 0.4, clearcoat: 1 }),
      black: new THREE.MeshStandardMaterial({ color: '#050506', roughness: 0.6 }),
      bezel: new THREE.MeshPhysicalMaterial({ color: '#020203', roughness: 0.08, metalness: 0.2, clearcoat: 1 }),
      trackpad: new THREE.MeshPhysicalMaterial({ color: '#4d4f55', metalness: 0.6, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15 }),
      rubber: new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.9 }),
      logo: new THREE.MeshPhysicalMaterial({ color: '#E2B82C', metalness: 1, roughness: 0.12, clearcoat: 1, emissive: '#5a4510', emissiveIntensity: 0.4 }),
    }
  }, [])

  const geo = useMemo(() => {
    const keyGeo = new RoundedBoxGeometry(1, 1, 1, 3, 0.18)
    return {
      base: slab(MAC.w, MAC.d, MAC.baseH, MAC.corner, 0.012),
      lid: slab(MAC.w, MAC.d, MAC.lidH, MAC.corner, 0.008),
      bezel: flatShape(MAC.w - 0.03, MAC.d - 0.03, MAC.corner - 0.015),
      screen: planeFromShape(roundedRectShape(MAC.screenW, MAC.screenH, 0.03), 12),
      notch: planeFromShape(roundedRectShape(0.25, 0.06, 0.018), 8),
      trackpad: flatShape(1.52, 0.92, 0.045),
      deckPlane: flatShape(MAC.w - 0.02, MAC.d - 0.02, MAC.corner - 0.01),
      key: keyGeo,
    }
  }, [])

  const tex = useMemo(() => ({ deck: deckTexture(keys), legends: legendTexture(keys) }), [keys])

  useLayoutEffect(() => {
    const mat = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const kh = 0.011
    keys.forEach((k, i) => {
      mat.compose(new THREE.Vector3(k.x, T + kh / 2, k.z), q, new THREE.Vector3(k.w, kh, k.h))
      keysRef.current!.setMatrixAt(i, mat)
    })
    keysRef.current!.instanceMatrix.needsUpdate = true
  }, [keys])

  const touchKey = keys.find((k) => k.touch)!
  const logo = useMemo(() => logoShapes(0.0026), [])

  // tela: posição dentro da tampa (z local: 0 = centro da tampa, + = borda livre)
  const screenTop = MAC.d / 2 - 0.015 - 0.07
  const screenZ = screenTop - MAC.screenH / 2

  return (
    <group ref={ref}>
      {/* base */}
      <mesh geometry={geo.base} material={m.aluminum} />
      <mesh geometry={geo.deckPlane} position={[0, T + 0.0009, 0]}>
        <meshStandardMaterial map={tex.deck} transparent roughness={0.6} depthWrite={false} />
      </mesh>
      <instancedMesh ref={keysRef} args={[geo.key, m.key, keys.length]} />
      <mesh position={[touchKey.x, T + 0.0115, touchKey.z]} rotation={[-Math.PI / 2, 0, 0]} material={m.touch}>
        <planeGeometry args={[touchKey.w * 0.9, touchKey.h * 0.85]} />
      </mesh>
      <mesh geometry={geo.deckPlane} position={[0, T + 0.0119, 0]}>
        <meshBasicMaterial map={tex.legends} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh geometry={geo.trackpad} position={[0, T + 0.0014, 0.63]} material={m.trackpad} />

      {/* entradas laterais */}
      {[
        [-1, -0.72, 0.16],
        [-1, -0.46, 0.09],
        [-1, -0.3, 0.09],
        [-1, 0.55, 0.035],
        [1, -0.6, 0.14],
        [1, -0.36, 0.09],
        [1, 0.42, 0.2],
      ].map(([side, z, len], i) => (
        <mesh key={i} position={[side * (MAC.w / 2 + 0.0005), -0.004, z]} material={m.black}>
          <boxGeometry args={[0.004, len < 0.05 ? 0.03 : 0.022, len]} />
        </mesh>
      ))}

      {/* pés de borracha */}
      {[
        [-1.35, -0.9],
        [1.35, -0.9],
        [-1.35, 0.9],
        [1.35, 0.9],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -MAC.baseH / 2 - 0.004, z]} material={m.rubber}>
          <cylinderGeometry args={[0.07, 0.075, 0.008, 24]} />
        </mesh>
      ))}

      {/* dobradiça */}
      <mesh position={[0, T - 0.005, -MAC.d / 2 + 0.035]} rotation={[0, 0, Math.PI / 2]} material={m.black}>
        <cylinderGeometry args={[0.028, 0.028, MAC.w - 0.62, 24]} />
      </mesh>

      {/* tampa: pivô na dobradiça */}
      <group ref={lidRef} position={[0, T, -MAC.d / 2 + 0.035]}>
        <group position={[0, MAC.lidH / 2 + 0.003, MAC.d / 2 - 0.035]}>
          <mesh geometry={geo.lid} material={m.aluminum} />
          {/* face interna: vidro preto de ponta a ponta */}
          <mesh geometry={geo.bezel} position={[0, -MAC.lidH / 2 - 0.0006, 0]} rotation={[Math.PI, 0, 0]} material={m.bezel} />
          {/* tela */}
          <mesh geometry={geo.screen} position={[0, -MAC.lidH / 2 - 0.0012, screenZ]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial key={screen ? 'on' : 'off'} ref={screenMat} map={screen} toneMapped={false} color="#000" />
          </mesh>
          {/* notch */}
          <mesh geometry={geo.notch} position={[0, -MAC.lidH / 2 - 0.0016, screenTop - 0.026]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#000" />
          </mesh>
          {/* reflexo do vidro */}
          <mesh geometry={geo.bezel} position={[0, -MAC.lidH / 2 - 0.002, 0]} rotation={[Math.PI, 0, 0]}>
            <meshPhysicalMaterial transparent opacity={0.07} roughness={0.03} metalness={1} depthWrite={false} />
          </mesh>
          {/* logo Atomic polida na parte de trás */}
          <group position={[0, MAC.lidH / 2 + 0.0008, 0.05]} rotation={[-Math.PI / 2, 0, Math.PI]}>
            {logo.map((s, i) => (
              <mesh key={i} material={m.logo}>
                <shapeGeometry args={[s]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  )
})
