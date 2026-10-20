import { forwardRef, useMemo } from 'react'
import * as THREE from 'three'
import { planeFromShape, roundedRectShape } from './textures'
import { deviceMaterials } from './materials'
import { logoShapes } from './logoShapes'
import { lowPower } from '../lib/env'

export const PHONE = { w: 0.92, h: 1.9, r: 0.15, depth: 0.05 }
const BEVEL = 0.018
const FRONT = PHONE.depth / 2 + BEVEL
const BACK = -FRONT

// iPhone Pro modelado em código: moldura de titânio escovado, verso em vidro fosco,
// platô de câmeras em vidro com lentes de revestimento iridescente, Dynamic Island e botões.
export const Iphone = forwardRef<THREE.Group, { screen: THREE.Texture | null; screenMat: React.RefObject<THREE.MeshBasicMaterial> }>(
  function Iphone({ screen, screenMat }, ref) {
    const mats = deviceMaterials()
    const geo = useMemo(() => {
      const body = new THREE.ExtrudeGeometry(roundedRectShape(PHONE.w, PHONE.h, PHONE.r), {
        depth: PHONE.depth,
        bevelEnabled: true,
        bevelThickness: BEVEL,
        bevelSize: BEVEL,
        bevelSegments: 6,
        curveSegments: 32,
      })
      body.center()
      const plateau = new THREE.ExtrudeGeometry(roundedRectShape(0.4, 0.4, 0.1), {
        depth: 0.008,
        bevelEnabled: true,
        bevelThickness: 0.004,
        bevelSize: 0.004,
        bevelSegments: 3,
        curveSegments: 24,
      })
      return {
        body,
        plateau,
        glass: planeFromShape(roundedRectShape(PHONE.w + 0.03, PHONE.h + 0.03, PHONE.r + 0.015), 24),
        screen: planeFromShape(roundedRectShape(PHONE.w - 0.05, PHONE.h - 0.05, PHONE.r - 0.025), 24),
        island: planeFromShape(roundedRectShape(0.26, 0.075, 0.0375), 12),
        button: new THREE.CapsuleGeometry(0.008, 1, 4, 12),
      }
    }, [])
    const logo = useMemo(() => logoShapes(0.0011), [])

    return (
      <group ref={ref}>
        {/* grupo 0 = faces (verso em vidro fosco), grupo 1 = laterais (titânio) */}
        <mesh geometry={geo.body} material={[mats.backGlass, mats.titanium]} />

        {/* frente */}
        <mesh geometry={geo.glass} position={[0, 0, FRONT + 0.0005]} material={mats.blackGlass} />
        <mesh geometry={geo.screen} position={[0, 0, FRONT + 0.0012]}>
          <meshBasicMaterial key={screen ? 'on' : 'off'} ref={screenMat} map={screen} toneMapped={false} color="#000" />
        </mesh>
        <mesh geometry={geo.island} position={[0, PHONE.h / 2 - 0.085, FRONT + 0.0018]}>
          <meshBasicMaterial color="#000" />
        </mesh>
        {!lowPower && (
          <mesh geometry={geo.glass} position={[0, 0, FRONT + 0.0024]}>
            <meshPhysicalMaterial transparent opacity={0.08} roughness={0.03} metalness={1} depthWrite={false} />
          </mesh>
        )}

        {/* botões em titânio */}
        {[
          [-1, 0.5, 0.05],
          [-1, 0.32, 0.12],
          [-1, 0.16, 0.12],
          [1, 0.28, 0.2],
          [1, -0.22, 0.09],
        ].map(([side, y, len], i) => (
          <mesh key={i} geometry={geo.button} material={mats.titanium} position={[side * (PHONE.w / 2 + BEVEL + 0.002), y, 0]} scale={[1, len, 1.6]} />
        ))}

        {/* verso: logo polida e platô das câmeras (visto de trás, à esquerda no topo) */}
        <group position={[0, 0.05, BACK - 0.0006]} rotation={[0, Math.PI, 0]}>
          {logo.map((s, i) => (
            <mesh key={i}>
              <shapeGeometry args={[s]} />
              <meshPhysicalMaterial color="#E2B82C" metalness={1} roughness={0.1} clearcoat={1} />
            </mesh>
          ))}
        </group>
        <group position={[PHONE.w / 2 - 0.25, PHONE.h / 2 - 0.25, BACK]} rotation={[0, Math.PI, 0]}>
          <mesh geometry={geo.plateau} material={mats.glossGlass} />
          {[
            [-0.085, 0.085],
            [-0.085, -0.085],
            [0.09, 0],
          ].map(([x, y], i) => (
            <group key={i} position={[x, y, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh material={mats.lensRing}>
                <cylinderGeometry args={[0.07, 0.074, 0.03, 40]} />
              </mesh>
              <mesh position={[0, 0.0155, 0]} material={mats.lens}>
                <cylinderGeometry args={[0.056, 0.056, 0.002, 40]} />
              </mesh>
              <mesh position={[0, 0.0168, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 0.001, 24]} />
                <meshPhysicalMaterial color="#0b0b14" roughness={0.02} clearcoat={1} />
              </mesh>
            </group>
          ))}
          {/* flash e LiDAR */}
          <mesh position={[0.1, 0.12, 0.013]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.002, 24]} />
            <meshPhysicalMaterial color="#e9e3cf" roughness={0.3} />
          </mesh>
          <mesh position={[0.1, -0.12, 0.013]} rotation={[Math.PI / 2, 0, 0]} material={mats.blackGlass}>
            <cylinderGeometry args={[0.022, 0.022, 0.002, 24]} />
          </mesh>
        </group>
      </group>
    )
  },
)
