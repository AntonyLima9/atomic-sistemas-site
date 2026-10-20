import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/store'

// Partículas "atômicas": núcleos dourados com 2 elétrons orbitando, com parallax de mouse e scroll.
export function Atoms({ count = 60 }: { count?: number }) {
  const nuclei = useRef<THREE.InstancedMesh>(null)
  const electrons = useRef<THREE.InstancedMesh>(null)
  const group = useRef<THREE.Group>(null)
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const rnd = (a: number, b: number) => a + Math.random() * (b - a)
        return {
          pos: new THREE.Vector3(rnd(-11, 11), rnd(-5, 7), rnd(-12, 1.5)),
          size: rnd(0.5, 1.4),
          speed: rnd(1.2, 3.2) * (i % 2 ? 1 : -1),
          radius: rnd(0.12, 0.24),
          tilt: new THREE.Euler(rnd(0, Math.PI), rnd(0, Math.PI), 0),
          phase: rnd(0, Math.PI * 2),
          drift: rnd(0.2, 0.6),
        }
      }),
    [count],
  )
  const m = useMemo(() => new THREE.Matrix4(), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  const v = useMemo(() => new THREE.Vector3(), [])
  const s = useMemo(() => new THREE.Vector3(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useLayoutEffect(() => {
    nuclei.current!.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    electrons.current!.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    data.forEach((d, i) => {
      const y = d.pos.y + Math.sin(t * d.drift + d.phase) * 0.25
      v.set(d.pos.x, y, d.pos.z)
      s.setScalar(d.size)
      m.compose(v, q.identity(), s)
      nuclei.current!.setMatrixAt(i, m)
      for (let k = 0; k < 2; k++) {
        const a = t * d.speed + d.phase + k * Math.PI
        tmp.set(Math.cos(a) * d.radius * d.size, Math.sin(a) * d.radius * d.size, 0).applyEuler(d.tilt).add(v)
        m.compose(tmp, q, s.setScalar(d.size * 0.9))
        electrons.current!.setMatrixAt(i * 2 + k, m)
      }
    })
    nuclei.current!.instanceMatrix.needsUpdate = true
    electrons.current!.instanceMatrix.needsUpdate = true
    const g = group.current!
    const page = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)
    g.position.x += (scrollState.mouse.x * 0.6 - g.position.x) * 0.04
    g.position.y += (scrollState.mouse.y * 0.4 + page * 6 - g.position.y) * 0.05
  })

  return (
    <group ref={group}>
      <instancedMesh ref={nuclei} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={[2.2, 1.7, 0.4]} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={electrons} args={[undefined, undefined, count * 2]} frustumCulled={false}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#fff6d0" transparent opacity={0.8} />
      </instancedMesh>
    </group>
  )
}
