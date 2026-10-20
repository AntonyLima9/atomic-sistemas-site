import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Grid, Lightformer, PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Macbook } from './Macbook'
import { Iphone } from './Iphone'
import { Atoms } from './Atoms'
import { LogoAssembly } from './LogoAssembly'
import { setScroll, useScreenTextures } from './textures'
import { easeInOut, easeOut, lerp, scrollState, seg } from '../lib/store'

const TAU = Math.PI * 2
const LID_OPEN = -1.83 // ~105°

// Coreografia completa do showcase, guiada por scrollState.show (0..1).
function Devices({ mobile }: { mobile: boolean }) {
  const gl = useThree((s) => s.gl)
  const tex = useScreenTextures(gl.capabilities.getMaxAnisotropy())
  const rig = useRef<THREE.Group>(null)
  const mac = useRef<THREE.Group>(null)
  const lid = useRef<THREE.Group>(null)
  const macScreen = useRef<THREE.MeshBasicMaterial>(null)
  const phone = useRef<THREE.Group>(null)
  const phoneScreen = useRef<THREE.MeshBasicMaterial>(null)
  const tilt = useRef({ x: 0, y: 0 })

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const p = scrollState.show
    const s1 = easeInOut(seg(p, 0, 0.12))
    const s2 = easeInOut(seg(p, 0.12, 0.3))
    const s3a = easeInOut(seg(p, 0.3, 0.42))
    const s3b = easeInOut(seg(p, 0.42, 0.55))
    const s4 = easeInOut(seg(p, 0.45, 0.62))
    const s5 = seg(p, 0.62, 0.85)
    const s6 = easeInOut(seg(p, 0.85, 1))
    const idle = 1 - s1

    // inclinação pelo mouse (suavizada)
    tilt.current.x += (scrollState.mouse.y * 0.09 - tilt.current.x) * 0.05
    tilt.current.y += (scrollState.mouse.x * 0.1 - tilt.current.y) * 0.05

    const r = rig.current!
    r.visible = s6 < 0.999
    r.rotation.set(-tilt.current.x, tilt.current.y + Math.sin(s5 * Math.PI) * 0.32 + (s5 > 0 ? (s5 - 0.5) * 0.12 : 0), 0)
    r.position.set(0, lerp(0, 1.6, s6), lerp(0, -4.5, s6))

    // MacBook
    const m = mac.current!
    const heroY = mobile ? -2.3 : -1.25
    const openY = mobile ? lerp(-0.5, 0.75, s4) : -0.55
    m.position.set(
      mobile ? 0 : lerp(2.5, 0, s1) + lerp(0, -1.5, s4),
      lerp(heroY, openY, s1) + Math.sin(t * 1.3) * 0.06 * idle,
      0,
    )
    m.rotation.set(
      lerp(0.55, 0.16, s1) + lerp(0, -0.06, s3b) + Math.sin(t * 0.9) * 0.04 * idle,
      lerp(0.6, TAU, s1) + lerp(0, -0.55, s3a) + lerp(0, 0.95, s3b) - lerp(0, 0.35, s4),
      lerp(-0.35, 0, s1) + Math.sin(t * 0.7) * 0.03 * idle,
    )
    const ms = (mobile ? 0.72 : lerp(0.82, 1, s1) * lerp(1, 0.86, s4)) * lerp(1, 0.75, s6)
    m.scale.setScalar(ms)
    lid.current!.rotation.x = lerp(0, LID_OPEN, s2) + lerp(0, 0.75, s6)

    // tela acende com flash dourado
    if (macScreen.current) {
      const on = seg(p, 0.16, 0.3)
      const flash = Math.max(0, 1 - Math.abs(p - 0.2) / 0.05)
      macScreen.current.color.setRGB(0.9 * on + flash * 0.9, 0.9 * on + flash * 0.75, 0.9 * on + flash * 0.1)
    }
    if (tex) setScroll(tex.desktop, easeInOut(seg(p, 0.3, 0.64)))

    // iPhone entra girando no sentido oposto
    const ph = phone.current!
    ph.visible = s4 > 0.001
    if (mobile) {
      ph.position.set(lerp(3.5, 0, s4), lerp(-3.5, -0.85, s4), 0.6)
    } else {
      ph.position.set(lerp(6, 2.05, s4), lerp(1.5, -0.05, s4) + Math.sin(t * 1.1) * 0.03, 0.5)
    }
    ph.rotation.set(lerp(0.4, 0.04, s4), lerp(Math.PI + 1.2, -0.32, s4) + lerp(0, 0.5, s5) - lerp(0, 0.2, s6), lerp(0.9, 0, s4))
    ph.scale.setScalar((mobile ? 0.82 : 1.3) * lerp(1, 0.75, s6))
    if (phoneScreen.current) {
      const on = easeOut(seg(p, 0.52, 0.62))
      phoneScreen.current.color.setScalar(0.92 * on)
    }
    if (tex) setScroll(tex.mobile, easeInOut(seg(p, 0.55, 0.9)))
  })

  return (
    <group ref={rig}>
      <Macbook ref={mac} lidRef={lid} screenMat={macScreen} screen={tex?.desktop ?? null} />
      <Iphone ref={phone} screenMat={phoneScreen} screen={tex?.mobile ?? null} />
    </group>
  )
}

// Câmera: recua no fim do showcase e volta ao centro no contato.
function CameraRig({ mobile }: { mobile: boolean }) {
  const look = useRef(new THREE.Vector3())
  useFrame(({ camera, size }) => {
    const p = scrollState.show
    const aspect = size.width / size.height
    const baseZ = mobile ? Math.max(9, 1.8 / (0.315 * aspect)) : Math.max(8.2, 4.2 / (0.315 * aspect))
    const s2 = easeInOut(seg(p, 0.12, 0.3))
    const s6 = easeInOut(seg(p, 0.85, 1))
    const c = easeInOut(scrollState.cta)
    const z = lerp(lerp(baseZ, baseZ * 0.86, s2) + lerp(0, 2, s6), baseZ, c)
    const y = lerp(lerp(1.2, 0.9, s2) + lerp(0, 2.2, s6), 1, c)
    camera.position.x += (scrollState.mouse.x * 0.25 - camera.position.x) * 0.04
    camera.position.y += (y + scrollState.mouse.y * 0.15 - camera.position.y) * 0.08
    camera.position.z += (z - camera.position.z) * 0.08
    look.current.set(0, lerp(lerp(0, 0.1, s2) + lerp(0, 1.4, s6), mobile ? 1 : 0.6, c), 0)
    camera.lookAt(look.current)
  })
  return null
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 6]} intensity={1.6} />
      {/* rim light dourada por trás */}
      <spotLight position={[-2, 3.5, -5]} angle={0.7} penumbra={1} intensity={9} color="#E2B82C" distance={20} />
      <spotLight position={[4, 2, -4]} angle={0.6} penumbra={1} intensity={4} color="#FFD23F" distance={18} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 5, -2]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, 1]} scale={[3, 8, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} position={[5, 1, 1]} scale={[3, 8, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" color="#E2B82C" intensity={1.2} position={[0, 1, -6]} scale={3} />
      </Environment>
    </>
  )
}

export default function Scene() {
  const mobile = window.innerWidth < 768
  const [fx, setFx] = useState(!mobile)
  const [dpr, setDpr] = useState(mobile ? 1.5 : 2)

  return (
    <Canvas
      className="!fixed inset-0"
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      dpr={[1, dpr]}
      camera={{ fov: 35, position: [0, 1.2, 9], near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
      aria-hidden
    >
      <PerformanceMonitor
        onDecline={() => {
          setFx(false)
          setDpr(1)
        }}
      />
      <color attach="background" args={['#070707']} />
      <fog attach="fog" args={['#070707', 12, 34]} />
      <Lights />
      <CameraRig mobile={mobile} />
      <Devices mobile={mobile} />
      <LogoAssembly mobile={mobile} />
      <Atoms count={mobile ? 22 : 60} />
      <Grid
        position={[0, -2.1, 0]}
        args={[40, 40]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#1f1f1f"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#4d3f12"
        fadeDistance={30}
        fadeStrength={1.5}
        infiniteGrid
      />
      {!mobile && <ContactShadows position={[0, -2.08, 0]} opacity={0.55} scale={14} blur={2.6} far={4} resolution={512} color="#000" />}
      {fx && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={0.95} luminanceSmoothing={0.2} intensity={0.9} />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
