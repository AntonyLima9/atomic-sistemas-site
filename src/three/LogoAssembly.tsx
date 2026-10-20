import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LOGO_POINTS, shapeFrom } from './logoShapes'
import { easeInOut, lerp, scrollState } from '../lib/store'

const SCALE = 0.012
// Onde cada peça flutua solta antes de se montar (espaço da cena).
const SCATTER: Record<'a' | 'b' | 'c', { p: [number, number, number]; r: [number, number, number] }> = {
  a: { p: [-8.5, 4.2, -10], r: [0.6, -0.8, 0.9] },
  b: { p: [9, 2.5, -12], r: [-0.5, 1.1, -0.6] },
  c: { p: [-6, -3, -9], r: [1.2, 0.4, -1.4] },
}

// As 3 peças da logo flutuam soltas pela página e se encaixam na seção de contato.
export function LogoAssembly({ mobile }: { mobile: boolean }) {
  const root = useRef<THREE.Group>(null)
  const pieces = useRef<Record<string, THREE.Mesh | null>>({})
  const geos = useMemo(
    () =>
      (['a', 'b', 'c'] as const).map((k) => {
        const g = new THREE.ExtrudeGeometry(shapeFrom(LOGO_POINTS[k], SCALE), {
          depth: 0.35,
          bevelEnabled: true,
          bevelThickness: 0.04,
          bevelSize: 0.03,
          bevelSegments: 3,
        })
        g.translate(0, 0, -0.175)
        return { k, g }
      }),
    [],
  )
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#E2B82C',
        metalness: 0.9,
        roughness: 0.22,
        clearcoat: 1,
        emissive: new THREE.Color('#E2B82C'),
        emissiveIntensity: 0.15,
      }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const c = easeInOut(scrollState.cta)
    root.current!.rotation.y = Math.sin(t * 0.4) * 0.35 * c + scrollState.mouse.x * 0.25 * c
    root.current!.rotation.x = -scrollState.mouse.y * 0.15 * c
    const target = mobile ? [0, 1.6, -3] : [0, 1.5, -4]
    root.current!.position.set(lerp(0, target[0], c), lerp(0, target[1], c), lerp(0, target[2], c))
    mat.emissiveIntensity = 0.12 + c * 0.3 + (c > 0.98 ? Math.sin(t * 2) * 0.08 : 0)
    for (const { k } of geos) {
      const m = pieces.current[k]
      if (!m) continue
      const sc = SCATTER[k]
      const ph = k.charCodeAt(0)
      const fx = sc.p[0] + Math.sin(t * 0.3 + ph) * 0.5
      const fy = sc.p[1] + Math.cos(t * 0.25 + ph) * 0.4
      m.position.set(lerp(fx, 0, c), lerp(fy, 0, c), lerp(sc.p[2], 0, c))
      m.rotation.set(
        lerp(sc.r[0] + t * 0.15, 0, c),
        lerp(sc.r[1] + t * 0.2, 0, c),
        lerp(sc.r[2] + t * 0.1, 0, c),
      )
      m.scale.setScalar(lerp(0.5, mobile ? 0.9 : 1.15, c))
    }
  })

  return (
    <group ref={root}>
      {geos.map(({ k, g }) => (
        <mesh key={k} ref={(m) => (pieces.current[k] = m)} geometry={g} material={mat} />
      ))}
    </group>
  )
}
