import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import {
  Box3,
  NeutralToneMapping,
  PMREMGenerator,
  Vector3,
  type Group,
  type PerspectiveCamera,
} from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

/** Canlı model-viewer: saniyede 18 derece. three.js birimi bunun altıda biridir. */
const TURN_SPEED = 18 / 6
const FOV = 34
const FIT = 0.82
const ZOOM_IN = 0.35
const ZOOM_OUT = 2.2
const REST = new Vector3(0.52, 0.42, 0.86).normalize()

type ProductViewerStageProps = {
  src: string
  playing: boolean
  reduceMotion: boolean
}

function fitDistance(fovDeg: number, aspect: number) {
  const vFov = (fovDeg * Math.PI) / 360
  const hFov = Math.atan(Math.tan(vFov) * aspect)
  return 1 / FIT / Math.sin(Math.min(vFov, hFov))
}

function RoomLight() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)

  useLayoutEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = env.texture
    return () => {
      env.texture.dispose()
      pmrem.dispose()
      scene.environment = null
    }
  }, [gl, scene])

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.4, 3.2, 2.8]} intensity={1.6} />
    </>
  )
}

function FittedModel({ src }: { src: string }) {
  const { scene } = useGLTF(src, false, true)
  const fitted = useMemo(() => {
    const model = skeletonClone(scene) as Group
    const box = new Box3().setFromObject(model)
    const size = new Vector3()
    const center = new Vector3()
    box.getSize(size)
    box.getCenter(center)
    const scale = 1 / (Math.max(size.x, size.y, size.z) * 0.5 || 1)
    model.scale.setScalar(scale)
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
    const floor = -(size.y * scale) / 2
    model.traverse((node) => {
      const mesh = node as { isMesh?: boolean; castShadow?: boolean; receiveShadow?: boolean }
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true
    })
    return { model, floor }
  }, [scene])

  return (
    <group>
      <primitive object={fitted.model} />
      <ContactShadows position={[0, fitted.floor, 0]} opacity={0.4} scale={6} blur={2.4} far={2.4} />
    </group>
  )
}

function FrameCamera({ reduceMotion }: { reduceMotion: boolean }) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null
  const size = useThree((state) => state.size)
  const framed = useRef(false)

  useLayoutEffect(() => {
    if (!controls) return
    const distance = fitDistance(camera.fov, size.width / Math.max(size.height, 1))
    controls.minDistance = distance * ZOOM_IN
    controls.maxDistance = distance * ZOOM_OUT
    if (reduceMotion) controls.autoRotate = false
    if (!framed.current) {
      camera.position.copy(REST).setLength(distance)
      controls.target.set(0, 0, 0)
      framed.current = true
    } else {
      camera.position.clampLength(controls.minDistance, controls.maxDistance)
    }
    controls.update()
  }, [camera, controls, reduceMotion, size.height, size.width])

  return null
}

/** Tek ürün, döner kaide. Sayfa dışındayken kare çizilmez. */
export default function ProductViewerStage({ src, playing, reduceMotion }: ProductViewerStageProps) {
  const controls = useRef<OrbitControlsImpl>(null)

  return (
    <Canvas
      frameloop={playing ? 'always' : 'never'}
      dpr={playing ? [1, 1.75] : 1}
      camera={{ fov: FOV, position: [0.52, 0.42, 0.86], near: 0.01, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: playing ? 'high-performance' : 'low-power' }}
      style={{ width: '100%', height: '100%', display: 'block', touchAction: 'pan-y', cursor: 'grab' }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping
        gl.toneMappingExposure = 1.15
        gl.setClearColor(0x000000, 0)
      }}
    >
      <RoomLight />
      <Suspense fallback={null}>
        <FittedModel src={src} />
      </Suspense>
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.9}
        autoRotate={!reduceMotion}
        autoRotateSpeed={TURN_SPEED}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI * 0.86}
        onStart={() => {
          if (controls.current) controls.current.autoRotate = false
        }}
      />
      <FrameCamera reduceMotion={reduceMotion} />
    </Canvas>
  )
}

export function preloadProductModel(src: string) {
  useGLTF.preload(src, false, true)
}
