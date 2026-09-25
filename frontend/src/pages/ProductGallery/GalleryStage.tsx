import { Html } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { ACESFilmicToneMapping, MathUtils, PMREMGenerator, Quaternion, Vector3, type PerspectiveCamera } from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import WebGlGate from '../../components/KioskExplode/WebGlGate.tsx'
import GalleryModel, { preloadGallery } from './GalleryModel.tsx'
import { galleryModels } from './galleryModels.ts'
import { productGalleryCopy as copy, type GalleryPoint, type GalleryProductId } from './productGalleryCopy.ts'
import styles from './ProductGallery.module.css'

// Directions come from the LENS page's measured poses. Distances are ours: there the model sat
// small inside a disc, here it fills the stage column, so both shots stand further back.
const OVERVIEW = { dir: new Vector3(3.1, 2.1, 3.9).normalize(), radius: 3.2, target: new Vector3(0, 0.02, 0), fov: 30 }
const FOCUS_RADIUS = 3.7
const FOCUS_FOV = 23
// a portrait canvas is narrow: pull back and widen so the part keeps its surroundings
const PORTRAIT_PULL = 1.25
const PORTRAIT_FOV = 6
// two poses more than this far apart turn over the top instead of through the model
const OPPOSITE = 2.9
const UP = new Vector3(0, 1, 0)

type Shot = { dir: Vector3; radius: number; target: Vector3; fov: number }

function shotFor(productId: GalleryProductId, pointId: string | null, isPortrait: boolean): Shot {
  const focus = pointId ? galleryModels[productId].focus[pointId] : undefined
  if (!focus) return OVERVIEW
  return {
    dir: new Vector3(...focus.dir).normalize(),
    radius: FOCUS_RADIUS * (focus.r ?? 1) * (isPortrait ? PORTRAIT_PULL : 1),
    target: new Vector3(...focus.tgt),
    fov: FOCUS_FOV + (isPortrait ? PORTRAIT_FOV : 0),
  }
}

const turn = new Quaternion()
const identity = new Quaternion()
const waypoint = new Vector3()

/** Eases the camera around the model on a sphere toward the active point's pose, never cutting. */
function CameraRig({ productId, pointId, reduceMotion }: { productId: GalleryProductId; pointId: string | null; reduceMotion: boolean }) {
  const { size } = useThree()
  const shot = shotFor(productId, pointId, size.width < size.height)
  const current = useRef<Shot | null>(null)

  useFrame(({ camera }, delta) => {
    const now = (current.current ??= { dir: shot.dir.clone(), radius: shot.radius, target: shot.target.clone(), fov: shot.fov })
    const ease = reduceMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 2.6)

    const goal = now.dir.angleTo(shot.dir) > OPPOSITE ? waypoint.copy(UP) : shot.dir
    turn.setFromUnitVectors(now.dir, goal)
    now.dir.applyQuaternion(identity.clone().slerp(turn, ease)).normalize()
    now.radius = MathUtils.lerp(now.radius, shot.radius, ease)
    now.target.lerp(shot.target, ease)
    now.fov = MathUtils.lerp(now.fov, shot.fov, ease)

    const perspective = camera as PerspectiveCamera
    perspective.position.copy(now.dir).multiplyScalar(now.radius).add(now.target)
    perspective.fov = now.fov
    perspective.updateProjectionMatrix()
    perspective.lookAt(now.target)
  })

  return null
}

/** The LENS page's light: a room environment for reflections, a warm key, a cool rim and a soft fill. */
function StudioLight() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    scene.environment = environment
    scene.environmentIntensity = 0.85
    return () => {
      scene.environment = null
      environment.dispose()
    }
  }, [gl, scene])

  return (
    <>
      <directionalLight position={[1.6, 2.4, 1.8]} intensity={2.4} color="#ffdcae" />
      <directionalLight position={[-1.8, 1.2, -2]} intensity={1.5} color="#bfd3ff" />
      <directionalLight position={[-1, 0.4, 1.5]} intensity={0.6} color="#fff1d6" />
    </>
  )
}

/** The other models are fetched one by one when the browser is idle, so a switch rarely waits. */
function usePrefetchOthers(productId: GalleryProductId) {
  const firstProduct = useRef(productId)

  useEffect(() => {
    const others = Object.entries(galleryModels).filter(([id]) => id !== firstProduct.current)
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 400))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    let handle = 0
    const next = (index: number) => {
      const entry = others[index]
      if (!entry) return
      handle = idle(() => {
        preloadGallery(entry[1].src)
        next(index + 1)
      })
    }
    next(0)
    return () => cancel(handle)
  }, [])
}

type GalleryStageProps = {
  productId: GalleryProductId
  points: GalleryPoint[]
  activePointId: string | null
  reduceMotion: boolean
}

export default function GalleryStage({ productId, points, activePointId, reduceMotion }: GalleryStageProps) {
  usePrefetchOthers(productId)

  return (
    <WebGlGate fallback={<p className={styles.stageNote}>{copy.fallback}</p>}>
      <Canvas
        className={styles.canvas}
        dpr={[1, 1.75]}
        camera={{ fov: OVERVIEW.fov, near: 0.05, far: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          gl.setClearColor(0x000000, 0)
        }}
      >
        <CameraRig productId={productId} pointId={activePointId} reduceMotion={reduceMotion} />
        <StudioLight />
        <Suspense
          fallback={
            <Html center>
              <p className={styles.stageNote}>{copy.loading}</p>
            </Html>
          }
        >
          <GalleryModel productId={productId} points={points} activePointId={activePointId} reduceMotion={reduceMotion} />
        </Suspense>
      </Canvas>
    </WebGlGate>
  )
}
