import { forwardRef, useMemo } from 'react'
import * as THREE from 'three'
import { darkMetal, planeFromShape, roundedRectShape } from './textures'

export const PHONE = { w: 0.92, h: 1.9, r: 0.15, depth: 0.05 }

// iPhone modelado em código: corpo extrudado com bevel, tela arredondada, Dynamic Island e câmeras.
export const Iphone = forwardRef<THREE.Group, { screen: THREE.Texture | null; screenMat: React.RefObject<THREE.MeshBasicMaterial> }>(
  function Iphone({ screen, screenMat }, ref) {
    const body = useMemo(() => {
      const g = new THREE.ExtrudeGeometry(roundedRectShape(PHONE.w, PHONE.h, PHONE.r), {
        depth: PHONE.depth,
        bevelEnabled: true,
        bevelThickness: 0.018,
        bevelSize: 0.018,
        bevelSegments: 5,
        curveSegments: 24,
      })
      g.center()
      return g
    }, [])
    const metal = useMemo(() => {
      const m = darkMetal()
      m.color.set('#2a2a2e')
      return m
    }, [])
    const front = PHONE.depth / 2 + 0.019
    const glassGeo = useMemo(() => planeFromShape(roundedRectShape(PHONE.w + 0.02, PHONE.h + 0.02, PHONE.r + 0.01), 24), [])
    const screenGeo = useMemo(() => planeFromShape(roundedRectShape(PHONE.w - 0.07, PHONE.h - 0.07, PHONE.r - 0.035), 24), [])
    const islandGeo = useMemo(() => planeFromShape(roundedRectShape(0.26, 0.075, 0.0375), 12), [])

    return (
      <group ref={ref}>
        <mesh geometry={body} material={metal} />
        <mesh geometry={glassGeo} position={[0, 0, front]}>
          <meshStandardMaterial color="#030303" roughness={0.2} />
        </mesh>
        <mesh geometry={screenGeo} position={[0, 0, front + 0.001]}>
          <meshBasicMaterial key={screen ? "on" : "off"} ref={screenMat} map={screen} toneMapped={false} color="#000" />
        </mesh>
        <mesh geometry={islandGeo} position={[0, PHONE.h / 2 - 0.1, front + 0.002]}>
          <meshBasicMaterial color="#000" />
        </mesh>
        <mesh geometry={glassGeo} position={[0, 0, front + 0.003]}>
          <meshPhysicalMaterial transparent opacity={0.1} roughness={0.04} metalness={1} depthWrite={false} />
        </mesh>
        {/* botões laterais */}
        {[0.42, 0.22, 0.05].map((y, i) => (
          <mesh key={i} position={[-PHONE.w / 2 - 0.022, y, 0]}>
            <boxGeometry args={[0.012, i === 0 ? 0.06 : 0.13, 0.03]} />
            <meshStandardMaterial color="#2a2a2e" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[PHONE.w / 2 + 0.022, 0.25, 0]}>
          <boxGeometry args={[0.012, 0.2, 0.03]} />
          <meshStandardMaterial color="#2a2a2e" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* módulo de câmeras */}
        <group position={[0.2, PHONE.h / 2 - 0.27, -PHONE.depth / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
          <mesh>
            <boxGeometry args={[0.38, 0.38, 0.02]} />
            <meshPhysicalMaterial color="#202024" metalness={0.6} roughness={0.2} clearcoat={1} />
          </mesh>
          {[
            [-0.08, 0.08],
            [-0.08, -0.08],
            [0.09, 0],
          ].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.062, 0.066, 0.03, 32]} />
              <meshPhysicalMaterial color="#050508" metalness={0.5} roughness={0.05} clearcoat={1} />
            </mesh>
          ))}
        </group>
      </group>
    )
  },
)
