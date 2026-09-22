import { useEffect, useMemo, useRef, useState } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Vector3,
  type Object3D,
  type Texture,
} from 'three'
import { kioskExplodeCopy } from './kioskExplodeCopy.ts'
import { damp, easeInOut, kioskStage } from './kioskExplodeStage.ts'
import { createKioskScreenTexture } from './kioskScreenTexture.ts'
import styles from './KioskExplode.module.css'

const MODEL_SRC = '/models/kiosk.glb'
const DRACO_PATH = '/draco/'
const MODEL_HEIGHT = 2.6
const ENV_PRODUCT = 0.95
const SCREEN_EMISSIVE = 0.9
const LEADER_COLOR = '#566783'
const LEADER_OPACITY = 0.72
const COLUMN_X = 2.5
const SLOT_Y = [3.05, 1.25, -0.55]
const LABEL_Z = 0.6
const CARD_MAX_PX = 182.4
const CARD_VW = 0.3
const EDGE_PAD = 24
const END_RADIUS = 10.5
const END_AZIM = 0.24
const END_HEIGHT = 2.3
const END_LOOK_Y = 1.42
const END_FOV = 47

/**
 * Showcase ile aynı ayrılma yönleri. Değerler model yüksekliğinin oranıdır.
 */
const EXPLODE: Record<string, [number, number, number]> = {
  tabletsc: [0, 0.1, 0.55],
  Cube: [0, 0.55, 0.2],
  PC_fan: [0, 0.05, -0.58],
  pos: [-0.62, 0.02, 0.34],
  possc: [-0.7, 0.02, 0.38],
  printer1: [0.62, -0.1, 0.34],
  printer2: [0.62, -0.1, 0.34],
  pleksi1: [0.72, 0.05, 0.1],
  plesi2: [-0.72, 0.05, 0.1],
  kiosk: [0, 0, -0.14],
}

const SCREENS = new Set(['tabletsc', 'possc'])

type TrackedPart = {
  node: Object3D
  home: Vector3
  dir: Vector3
  center: Vector3
}

type SlottedLabel = (typeof kioskExplodeCopy.parts)[number] & {
  anchor: [number, number, number]
}

function paintScreen(mesh: Mesh, screenTexture: Texture) {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
  for (const material of materials) {
    const next = material as MeshStandardMaterial
    next.map = screenTexture
    next.emissiveMap = screenTexture
    next.emissive = new Color('#ffffff')
    next.emissiveIntensity = mesh.name === 'tabletsc' ? SCREEN_EMISSIVE : SCREEN_EMISSIVE * (2 / 3)
    next.color.set('#ffffff')
    next.metalness = 0
    next.roughness = 0.35
    next.transparent = false
    next.opacity = 1
    next.toneMapped = true
    next.needsUpdate = true
  }
}

function fitColumn(width: number, height: number) {
  const aspect = width / Math.max(height, 1)
  const fov = END_FOV + (aspect < 0.95 ? 16 : aspect < 1.35 ? 8 : 0)
  const cardPx = Math.min(CARD_MAX_PX, width * CARD_VW)
  const camera = new PerspectiveCamera(fov, aspect, 0.1, 400)
  camera.position.set(Math.sin(END_AZIM) * END_RADIUS, END_HEIGHT, Math.cos(END_AZIM) * END_RADIUS)
  camera.lookAt(0, END_LOOK_Y, 0)
  camera.updateMatrixWorld()

  const target = 1 - (2 * (cardPx + EDGE_PAD)) / width
  const projected = new Vector3()
  const ndcAt = (x: number) =>
    Math.max(...SLOT_Y.map((y) => projected.set(x, y, LABEL_Z).project(camera).x))

  if (ndcAt(COLUMN_X) <= target) return COLUMN_X

  let lo = 0
  let hi = COLUMN_X
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (ndcAt(mid) > target) hi = mid
    else lo = mid
  }
  return hi
}

function anchorFor(side: 'left' | 'right', order: number, columnX: number): [number, number, number] {
  return [side === 'left' ? -columnX : columnX, SLOT_Y[Math.min(order, SLOT_Y.length - 1)], LABEL_Z]
}

function createLeaderLine() {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(9), 3))
  const line = new Line(
    geometry,
    new LineBasicMaterial({
      color: LEADER_COLOR,
      transparent: true,
      opacity: 0,
      toneMapped: true,
      depthTest: false,
      depthWrite: false,
    }),
  )
  line.renderOrder = 12
  return line
}

function prepareKiosk(scene: Object3D, screenTexture: Texture) {
  const model = skeletonClone(scene)
  const box = new Box3().setFromObject(model)
  const extent = new Vector3()
  const center = new Vector3()
  box.getSize(extent)
  box.getCenter(center)
  const scale = MODEL_HEIGHT / (extent.y || 1)
  const parts: Record<string, TrackedPart> = {}

  model.traverse((node) => {
    const mesh = node as Mesh
    if (!mesh.isMesh && !EXPLODE[node.name]) return

    if (mesh.isMesh && mesh.material) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const cloned = materials.map((material) => {
        const next = material.clone() as MeshStandardMaterial
        next.envMapIntensity = ENV_PRODUCT
        return next
      })
      mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0]
      if (SCREENS.has(node.name)) paintScreen(mesh, screenTexture)
      mesh.castShadow = node.name !== 'kiosk' && !SCREENS.has(node.name)
      mesh.receiveShadow = true
    }

    const dirRaw = EXPLODE[node.name]
    if (!dirRaw) return

    const partBox = new Box3().setFromObject(node)
    const partCenter = new Vector3()
    partBox.getCenter(partCenter)
    parts[node.name] = {
      node,
      home: node.position.clone(),
      dir: new Vector3(...dirRaw).multiplyScalar(extent.y),
      center: partCenter.clone().sub(new Vector3(center.x, box.min.y, center.z)).multiplyScalar(scale),
    }
  })

  return {
    root: model,
    parts,
    scale,
    offset: new Vector3(-center.x, -box.min.y, -center.z),
  }
}

export default function KioskExplodeModel() {
  const { scene } = useGLTF(MODEL_SRC, DRACO_PATH)
  const explodeAmount = useRef(0)
  const revealCount = useRef(0)
  const labelRefs = useRef<(Group | null)[]>([])
  const [areLabelsVisible, setAreLabelsVisible] = useState(false)
  const [revealedCount, setRevealedCount] = useState(0)
  const { size } = useThree()

  const screenTexture = useMemo(() => createKioskScreenTexture(), [])
  useEffect(() => () => screenTexture.dispose(), [screenTexture])

  const { root, parts, scale, offset } = useMemo(
    () => prepareKiosk(scene, screenTexture),
    [scene, screenTexture],
  )

  const layout = useMemo(() => {
    const columnX = fitColumn(size.width, size.height)
    return { columnX, hasTwoColumns: columnX >= 1.6 && size.height >= 620 }
  }, [size.width, size.height])

  const slottedLabels = useMemo(() => {
    const available = kioskExplodeCopy.parts.filter((part) => parts[part.partId])
    const counters = { left: 0, right: 0 }
    return [...available]
      .sort((a, b) => parts[b.partId].center.y - parts[a.partId].center.y)
      .map((part) => {
        const slotted: SlottedLabel = {
          ...part,
          anchor: anchorFor(part.side, counters[part.side]++, layout.columnX),
        }
        return slotted
      })
  }, [parts, layout.columnX])

  const leaders = useMemo(() => slottedLabels.map(() => createLeaderLine()), [slottedLabels])
  useEffect(
    () => () =>
      leaders.forEach((line) => {
        line.geometry.dispose()
        ;(line.material as LineBasicMaterial).dispose()
      }),
    [leaders],
  )

  useFrame((_, delta) => {
    const frameDelta = Math.min(delta, 0.05)
    explodeAmount.current = damp(explodeAmount.current, kioskStage.explode, 4.5, frameDelta)
    const explodeEase = easeInOut(explodeAmount.current)

    for (const key of Object.keys(parts)) {
      const part = parts[key]
      part.node.position.set(
        part.home.x + part.dir.x * explodeEase,
        part.home.y + part.dir.y * explodeEase,
        part.home.z + part.dir.z * explodeEase,
      )
    }

    slottedLabels.forEach((label, index) => {
      const group = labelRefs.current[index]
      const part = parts[label.partId]
      if (!part) return

      const liveX = part.center.x + part.dir.x * explodeEase * scale
      const liveY = part.center.y + part.dir.y * explodeEase * scale
      const liveZ = part.center.z + part.dir.z * explodeEase * scale
      const [anchorX, anchorY, anchorZ] = label.anchor
      if (group) {
        group.position.set(
          liveX + (anchorX - liveX) * explodeEase,
          liveY + (anchorY - liveY) * explodeEase,
          liveZ + (anchorZ - liveZ) * explodeEase,
        )
      }

      const line = leaders[index]
      const positions = line.geometry.getAttribute('position') as BufferAttribute
      const cardX = group ? group.position.x : anchorX
      const cardY = group ? group.position.y : anchorY
      const cardZ = group ? group.position.z : anchorZ
      const midX = cardX + (liveX - cardX) * 0.35
      positions.setXYZ(0, cardX, cardY, cardZ)
      positions.setXYZ(1, midX, cardY, cardZ + (liveZ - cardZ) * 0.35)
      positions.setXYZ(2, liveX, liveY, liveZ)
      positions.needsUpdate = true
      line.geometry.computeBoundingSphere()
      const leaderMaterial = line.material as LineBasicMaterial
      leaderMaterial.opacity = Math.max(0, (explodeEase - 0.4) / 0.6) * LEADER_OPACITY
      line.visible = explodeEase > 0.42
    })

    const shouldShowLabels = explodeAmount.current > 0.34
    if (shouldShowLabels !== areLabelsVisible) setAreLabelsVisible(shouldShowLabels)
    const reveal = Math.floor(Math.max(0, (explodeAmount.current - 0.34) / 0.09))
    if (reveal !== revealCount.current) {
      revealCount.current = reveal
      setRevealedCount(Math.min(reveal, slottedLabels.length))
    }
  })

  return (
    <group>
      <group scale={scale} position={[offset.x * scale, offset.y * scale, offset.z * scale]}>
        <primitive object={root} />
      </group>

      {layout.hasTwoColumns
        ? leaders.map((line, index) => (
            <primitive key={`leader-${slottedLabels[index].partId}`} object={line} />
          ))
        : null}
      {layout.hasTwoColumns
        ? slottedLabels.map((label, index) => (
            <group
              key={label.partId}
              ref={(node: Group | null) => {
                labelRefs.current[index] = node
              }}
            >
              {areLabelsVisible && index < revealedCount ? (
                <Html pointerEvents="none" zIndexRange={[24, 0]} wrapperClass={styles.holoWrap}>
                  <div className={styles.label} data-side={label.side}>
                    <span className={styles.labelPin} aria-hidden="true" />
                    <span className={styles.labelHead}>
                      <span className={styles.labelCode}>{label.code}</span>
                      <span className={styles.labelRule} aria-hidden="true" />
                    </span>
                    <span className={styles.labelTitle}>{label.title}</span>
                    <span className={styles.labelDesc}>{label.desc}</span>
                  </div>
                </Html>
              ) : null}
            </group>
          ))
        : null}
    </group>
  )
}

useGLTF.preload(MODEL_SRC, DRACO_PATH)
