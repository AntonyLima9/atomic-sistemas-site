import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { darkMetal, planeFromShape, roundedRectShape } from './textures'
import { logoShapes } from './logoShapes'

export const MAC = { w: 3.2, d: 2.2, baseH: 0.11, lidH: 0.055, screenW: 3.0, screenH: 1.875 }

type Props = { screen: THREE.Texture | null; lidRef: React.RefObject<THREE.Group>; screenMat: React.RefObject<THREE.MeshBasicMaterial> }

// MacBook modelado em código: base, teclado em instancing, trackpad, dobradiça e tampa com tela.
export const Macbook = forwardRef<THREE.Group, Props>(function Macbook({ screen, lidRef, screenMat }, ref) {
  const metal = useMemo(darkMetal, [])
  const keyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0c0c0d', roughness: 0.7, metalness: 0.2 }), [])
  const keys = useRef<THREE.InstancedMesh>(null)
  const cols = 14
  const rows = 5
  const kw = 0.165
  const gap = 0.022

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    let i = 0
    const startX = -((cols - 1) * (kw + gap)) / 2
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        m.makeTranslation(startX + c * (kw + gap), 0, -0.82 + r * (kw + gap))
        keys.current!.setMatrixAt(i++, m)
      }
    }
    // barra de espaço
    m.compose(new THREE.Vector3(0, 0, -0.82 + rows * (kw + gap)), new THREE.Quaternion(), new THREE.Vector3(5.6, 1, 1))
    keys.current!.setMatrixAt(i++, m)
    keys.current!.count = i
    keys.current!.instanceMatrix.needsUpdate = true
  }, [])

  const screenGeo = useMemo(() => planeFromShape(roundedRectShape(MAC.screenW, MAC.screenH, 0.04)), [])
  const logo = useMemo(() => logoShapes(0.0028), [])

  return (
    <group ref={ref}>
      {/* base */}
      <RoundedBox args={[MAC.w, MAC.baseH, MAC.d]} radius={0.05} smoothness={4} material={metal} />
      <mesh position={[0, MAC.baseH / 2 + 0.0005, -0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.85, 1.12]} />
        <meshStandardMaterial color="#09090a" roughness={0.9} />
      </mesh>
      <instancedMesh ref={keys} args={[undefined, undefined, cols * rows + 1]} position={[0, MAC.baseH / 2 + 0.008, 0]} material={keyMat}>
        <boxGeometry args={[kw, 0.014, kw]} />
      </instancedMesh>
      <mesh position={[0, MAC.baseH / 2 + 0.0008, 0.64]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.25, 0.72]} />
        <meshPhysicalMaterial color="#232326" roughness={0.25} metalness={0.6} clearcoat={0.6} />
      </mesh>
      {/* dobradiça */}
      <mesh position={[0, MAC.baseH / 2, -MAC.d / 2 + 0.03]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 2.6, 20]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* tampa: pivô na dobradiça */}
      <group ref={lidRef} position={[0, MAC.baseH / 2, -MAC.d / 2 + 0.03]}>
        <group position={[0, MAC.lidH / 2 + 0.004, MAC.d / 2 - 0.03]}>
          <RoundedBox args={[MAC.w, MAC.lidH, MAC.d]} radius={0.025} smoothness={4} material={metal} />
          {/* moldura preta */}
          <mesh position={[0, -MAC.lidH / 2 - 0.0008, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[MAC.w - 0.06, MAC.d - 0.06]} />
            <meshStandardMaterial color="#050505" roughness={0.4} />
          </mesh>
          {/* tela */}
          <mesh geometry={screenGeo} position={[0, -MAC.lidH / 2 - 0.002, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial key={screen ? "on" : "off"} ref={screenMat} map={screen} toneMapped={false} color="#000" />
          </mesh>
          {/* logo Atomic na parte de trás */}
          <group position={[0, MAC.lidH / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, Math.PI]}>
            {logo.map((s, i) => (
              <mesh key={i}>
                <shapeGeometry args={[s]} />
                <meshStandardMaterial color="#E2B82C" emissive="#E2B82C" emissiveIntensity={0.35} metalness={0.8} roughness={0.25} toneMapped={false} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  )
})
