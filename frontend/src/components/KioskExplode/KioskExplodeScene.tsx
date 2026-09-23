import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { NeutralToneMapping, Vector3, type PerspectiveCamera } from 'three'
import type { ExplodeVariant } from './explodeVariants.ts'
import KioskExplodeModel from './KioskExplodeModel.tsx'
import { damp, easeInOut, lerp, mapRange, STUDIO_CLEAR, kioskStage } from './kioskExplodeStage.ts'

type KioskExplodeSceneProps = {
  active: boolean
  variant: ExplodeVariant
}

const LOOK_AT = new Vector3()

/**
 * Yakın karede ürün dolu; patlatmada Showcase gibi uzaklaşır.
 * compact: kamera muhafaza gibi alçak ürün — kiosk kadar yakın ve dolu kadraj.
 */
function productCameraShot(
  progress: number,
  width: number,
  height: number,
  framing: 'tall' | 'compact',
) {
  const approach = easeInOut(mapRange(progress, 0.02, 0.48))
  const explode = easeInOut(mapRange(progress, 0.5, 0.92))
  const aspect = width / Math.max(height, 1)
  const portraitBoost = aspect < 0.95 ? 16 : aspect < 1.35 ? 8 : 0

  if (framing === 'compact') {
    return {
      radius: 3.35 - approach * 0.25 + explode * 2.4,
      height: 1.05 - approach * 0.04 + explode * 0.35,
      lookY: 0.72 + explode * 0.08,
      azimuth: lerp(0.28, 0.32, explode),
      fov: 38 - approach * 2 + explode * 8 + portraitBoost,
    }
  }

  return {
    radius: 5.2 - approach * 0.4 + explode * 5.7,
    height: 1.65 - approach * 0.08 + explode * 0.73,
    lookY: 1.32 + explode * 0.1,
    azimuth: lerp(0.22, 0.24, explode),
    fov: 40 - approach * 2 + explode * 9 + portraitBoost,
  }
}

function CameraRig({ framing }: { framing: 'tall' | 'compact' }) {
  const { size } = useThree()
  const pan = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const frameDelta = Math.min(delta, 0.05)
    const { camera } = state
    const shot = productCameraShot(kioskStage.progress, size.width, size.height, framing)
    pan.current.x = damp(pan.current.x, kioskStage.pointer.x, 3.2, frameDelta)
    pan.current.y = damp(pan.current.y, kioskStage.pointer.y, 3.2, frameDelta)
    const perspectiveCamera = camera as PerspectiveCamera
    const yaw = shot.azimuth + pan.current.x * 0.12
    camera.position.set(
      damp(camera.position.x, Math.sin(yaw) * shot.radius, 3.4, frameDelta),
      damp(camera.position.y, shot.height + pan.current.y * 0.35, 3.4, frameDelta),
      damp(camera.position.z, Math.cos(yaw) * shot.radius, 3.4, frameDelta),
    )
    LOOK_AT.set(0, shot.lookY, 0)
    camera.lookAt(LOOK_AT)

    if (typeof perspectiveCamera.fov === 'number') {
      perspectiveCamera.fov = shot.fov
      perspectiveCamera.clearViewOffset()
      perspectiveCamera.updateProjectionMatrix()
    }
  })

  return null
}

function Studio() {
  return (
    <>
      <color attach="background" args={[STUDIO_CLEAR]} />
      <fog attach="fog" args={[STUDIO_CLEAR, 16, 36]} />
      <ambientLight intensity={0.22} color="#eef1f6" />
      <hemisphereLight args={['#e8eef6', '#b9c2cf', 0.28]} />
      <directionalLight position={[7, 13, 9]} intensity={1.08} color="#fff7ee" />
      <directionalLight position={[-8, 5, -6]} intensity={0.12} color="#d5deea" />
      <spotLight
        position={[1.4, 5.4, 3.6]}
        angle={0.62}
        penumbra={0.85}
        intensity={18}
        distance={18}
        decay={2}
        color="#fff4ea"
      />
      <Environment resolution={256} frames={1} background={false} environmentIntensity={0.95}>
        <Lightformer intensity={1.1} form="rect" position={[0, 5, -9]} scale={[16, 9, 1]} color="#e7eef7" />
        <Lightformer intensity={0.5} form="rect" position={[-8, 2.5, 5]} rotation={[0, Math.PI / 2.2, 0]} scale={[10, 7, 1]} color="#cfd9e6" />
        <Lightformer intensity={0.9} form="rect" position={[8, 3, 4]} rotation={[0, -Math.PI / 2.2, 0]} scale={[10, 7, 1]} color="#dfeaf6" />
        <Lightformer intensity={2} form="circle" position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 12, 1]} color="#ffffff" />
        <Lightformer intensity={0.5} form="rect" position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[14, 14, 1]} color="#c8d0da" />
      </Environment>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial color="#8b919c" roughness={0.92} metalness={0.04} envMapIntensity={0.45} />
      </mesh>
      <ContactShadows
        frames={Infinity}
        position={[0, 0.003, 0]}
        opacity={0.48}
        scale={12}
        blur={2.8}
        far={5}
        resolution={512}
        color="#16202e"
      />
    </>
  )
}

/** İzole WebGL tuvali: yalnızca patlatma bölümünde yaşar. */
export default function KioskExplodeScene({ active, variant }: KioskExplodeSceneProps) {
  const framing = variant.framing ?? 'tall'
  const start =
    framing === 'compact'
      ? { fov: 38, position: [1.05, 1.05, 3.2] as [number, number, number] }
      : { fov: 40, position: [1.13, 1.65, 5.07] as [number, number, number] }

  return (
    <Canvas
      frameloop="always"
      dpr={active ? [1, 2] : 1}
      resize={{ debounce: 0, scroll: false }}
      style={{ width: '100%', height: '100%', display: 'block' }}
      camera={{ fov: start.fov, position: start.position, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: false, powerPreference: active ? 'high-performance' : 'low-power' }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping
        gl.toneMappingExposure = 1.08
        gl.setClearColor(STUDIO_CLEAR, 1)
      }}
    >
      <CameraRig framing={framing} />
      <Studio />
      <Suspense fallback={null}>
        <KioskExplodeModel variant={variant} />
      </Suspense>
    </Canvas>
  )
}
