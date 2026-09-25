import { Html, PresentationControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { AnimationMixer, Box3, type AnimationClip, LoopOnce, MathUtils, Vector3, type Group, type Mesh, type Object3D } from 'three'
import { galleryModels, type GalleryModel as GalleryModelDef } from './galleryModels.ts'
import type { GalleryPoint, GalleryProductId } from './productGalleryCopy.ts'
import styles from './GalleryModel.module.css'

/** Meshopt only: the models carry no Draco streams, so drei's CDN decoder is never fetched. */
export const useGalleryGltf = (src: string) => useGLTF(src, false, true)
export const preloadGallery = (src: string) => useGLTF.preload(src, false, true)

type ResolvedAnchor = { id: string; mesh: Mesh; local: Vector3; dir: Vector3 }

type PreparedModel = { scale: number; offset: Vector3; anchors: ResolvedAnchor[] }

// A glTF scene is cached by drei and shared between mounts, so it is prepared once, while it has no parent.
const prepared = new WeakMap<Object3D, PreparedModel>()

function prepareModel(root: Object3D, def: GalleryModelDef): PreparedModel {
  const cached = prepared.get(root)
  if (cached) return cached

  root.updateMatrixWorld(true)
  const box = new Box3()
  const parts = new Map<string, Mesh>()
  root.traverse((object) => {
    const mesh = object as Mesh
    if (!mesh.isMesh) return
    const geometry = mesh.geometry
    const triangles = (geometry.index ? geometry.index.count : geometry.attributes.position.count) / 3
    // stray ground and shadow planes are not the product: left in, they stretch the box
    if (!def.keepPlanes && triangles <= 4) {
      mesh.visible = false
      return
    }
    box.expandByObject(mesh)
    geometry.computeBoundingBox()
    const materialName = Array.isArray(mesh.material) ? mesh.material[0]?.name : mesh.material.name
    if (materialName && !parts.has(materialName)) parts.set(materialName, mesh)
  })
  // then by mesh name, for parts that share a material; a material name keeps its mesh
  root.traverse((object) => {
    const mesh = object as Mesh
    if (mesh.isMesh && mesh.name && !parts.has(mesh.name)) parts.set(mesh.name, mesh)
  })

  const size = box.getSize(new Vector3())
  const scale = def.fit / Math.max(size.x, size.y, size.z)
  const offset = box.getCenter(new Vector3()).multiplyScalar(-scale)

  const anchors: ResolvedAnchor[] = []
  for (const anchor of def.anchors) {
    const mesh = parts.get(anchor.part)
    const bounds = mesh?.geometry.boundingBox
    if (!mesh || !bounds) continue
    anchors.push({
      id: anchor.id,
      mesh,
      local: new Vector3(
        MathUtils.lerp(bounds.min.x, bounds.max.x, anchor.at[0]),
        MathUtils.lerp(bounds.min.y, bounds.max.y, anchor.at[1]),
        MathUtils.lerp(bounds.min.z, bounds.max.z, anchor.at[2]),
      ),
      dir: new Vector3(...anchor.dir).normalize(),
    })
  }

  const result = { scale, offset, anchors }
  prepared.set(root, result)
  return result
}

const smooth = (t: number) => t * t * (3 - 2 * t)

/** Scrubs the model's own hinge clip toward open or shut; the door is always met shut. */
function useDoor(root: Object3D, clips: AnimationClip[], def: GalleryModelDef, points: GalleryPoint[], activePointId: string | null, reduceMotion: boolean) {
  const door = useMemo(() => {
    const clip = def.door && clips.find((candidate) => candidate.name === def.door?.clip)
    if (!def.door || !clip) return null
    const mixer = new AnimationMixer(root)
    const action = mixer.clipAction(clip)
    // the default loop wraps a scrub to the clip's end back to frame one: shut
    action.setLoop(LoopOnce, 1)
    action.clampWhenFinished = true
    return { mixer, action, end: clip.duration - 1e-3, openFrom: points.findIndex((point) => point.id === def.door?.openFrom) }
  }, [root, clips, def, points])

  const amount = useRef(0)

  // the scene is cached and shared: leave it shut, so the next visit meets the door closed
  useEffect(() => {
    if (!door) return
    door.action.play()
    return () => {
      door.mixer.setTime(0)
      door.action.stop()
      amount.current = 0
    }
  }, [door])

  const activeIndex = points.findIndex((point) => point.id === activePointId)
  const isOpen = door !== null && activeIndex >= door.openFrom

  useFrame((_, delta) => {
    if (!door) return
    const aim = isOpen ? 1 : 0
    amount.current = reduceMotion ? aim : MathUtils.damp(amount.current, aim, 3.2, Math.min(delta, 0.05))
    door.mixer.setTime(smooth(amount.current) * door.end)
  })
}

type PointMarkerProps = { anchor: ResolvedAnchor; title: string }

const markerWorld = new Vector3()
const markerNormal = new Vector3()
const markerView = new Vector3()

/** Rides the active part in world space and dims when that part turns away from the camera. */
function PointMarker({ anchor, title }: PointMarkerProps) {
  const group = useRef<Group>(null)
  const label = useRef<HTMLDivElement>(null)

  useFrame(({ camera }) => {
    if (!group.current) return
    anchor.mesh.localToWorld(markerWorld.copy(anchor.local))
    group.current.position.copy(markerWorld)
    markerNormal.copy(anchor.dir).transformDirection(anchor.mesh.matrixWorld)
    markerView.copy(camera.position).sub(markerWorld).normalize()
    const facing = MathUtils.clamp((markerNormal.dot(markerView) + 0.1) / 0.3, 0, 1)
    if (label.current) label.current.style.opacity = facing.toFixed(3)
  })

  return (
    <group ref={group}>
      <Html zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={label} className={styles.marker} aria-hidden="true">
          <span className={styles.ring} />
          <span className={styles.tag}>{title}</span>
        </div>
      </Html>
    </group>
  )
}

type GalleryModelProps = {
  productId: GalleryProductId
  points: GalleryPoint[]
  activePointId: string | null
  reduceMotion: boolean
}

export default function GalleryModel({ productId, points, activePointId, reduceMotion }: GalleryModelProps) {
  const def = galleryModels[productId]
  const { scene, animations } = useGalleryGltf(def.src)
  const model = useMemo(() => prepareModel(scene, def), [scene, def])

  useDoor(scene, animations, def, points, activePointId, reduceMotion)

  const activeAnchor = model.anchors.find((anchor) => anchor.id === activePointId)
  const activeTitle = points.find((point) => point.id === activePointId)?.title

  return (
    <>
      {/* drag turns the model; it springs back so every authored camera pose still lines up */}
      <PresentationControls global={false} cursor snap speed={1.4} polar={[-0.35, 0.35]} azimuth={[-Math.PI / 2, Math.PI / 2]}>
        <group position={model.offset} scale={model.scale}>
          <primitive object={scene} />
        </group>
      </PresentationControls>
      {activeAnchor && activeTitle ? <PointMarker anchor={activeAnchor} title={activeTitle} /> : null}
    </>
  )
}
