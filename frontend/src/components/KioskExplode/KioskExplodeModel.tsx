import { useEffect, useMemo, useRef, useState } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  type Object3D,
  type Texture,
} from 'three'
import type { ExplodeVariant } from './explodeVariants.ts'
import { damp, easeInOut, kioskStage } from './kioskExplodeStage.ts'
import { createKioskScreenTexture } from './kioskScreenTexture.ts'
import { createLedPanelFaceTexture } from './ledPanelFaceTexture.ts'
import styles from './KioskExplode.module.css'

const MODEL_HEIGHT = 2.6
const ENV_PRODUCT = 0.95
const SCREEN_EMISSIVE = 0.9
const LEADER_COLOR = '#566783'
const LEADER_OPACITY = 0.72
const LABEL_Z = 0.6
const CARD_MAX_PX = 182.4
const CARD_VW = 0.3
const EDGE_PAD = 24

type LabelFrame = {
  columnX: number
  slotY: number[]
  endRadius: number
  endAzim: number
  endHeight: number
  endLookY: number
  endFov: number
}

function labelFrameFor(framing: 'tall' | 'compact'): LabelFrame {
  if (framing === 'compact') {
    return {
      columnX: 2.15,
      slotY: [1.55, 0.85, 0.15],
      endRadius: 5.6,
      endAzim: 0.3,
      endHeight: 1.35,
      endLookY: 0.8,
      endFov: 42,
    }
  }
  return {
    columnX: 2.5,
    slotY: [3.05, 1.25, -0.55],
    endRadius: 10.5,
    endAzim: 0.24,
    endHeight: 2.3,
    endLookY: 1.42,
    endFov: 47,
  }
}

type TrackedPart = {
  node: Object3D
  home: Vector3
  dir: Vector3
  center: Vector3
}

type SlottedLabel = ExplodeVariant['copy']['parts'][number] & {
  anchor: [number, number, number]
}

type KioskExplodeModelProps = {
  variant: ExplodeVariant
}

function paintScreen(mesh: Mesh, screenTexture: Texture, intensity: number) {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
  for (const material of materials) {
    const next = material as MeshStandardMaterial
    next.map = screenTexture
    next.emissiveMap = screenTexture
    next.emissive = new Color('#ffffff')
    next.emissiveIntensity = intensity
    next.color.set('#ffffff')
    next.metalness = 0
    next.roughness = 0.35
    next.transparent = false
    next.opacity = 1
    next.toneMapped = true
    next.needsUpdate = true
  }
}

/**
 * CAD mesh UV’si güvenilmez olduğu için navbar fotoğrafını düzlem olarak öne yapıştırır.
 * faceGroups içindeki ilk bulunan düğüm boyut/konum referansıdır.
 */
function attachNavFaceDecal(model: Object3D, faceTexture: Texture, faceGroups: ReadonlySet<string>) {
  model.updateMatrixWorld(true)

  let anchor: Object3D | null = null
  for (const name of faceGroups) {
    model.traverse((node) => {
      if (!anchor && node.name === name) anchor = node
    })
    if (anchor) break
  }
  if (!anchor) return

  // Plexi camı fotoğrafı bozar; gizle.
  model.traverse((node) => {
    if (!node.name.startsWith('PLEXI')) return
    node.traverse((child) => {
      const mesh = child as Mesh
      if (mesh.isMesh) mesh.visible = false
    })
  })

  const box = new Box3().setFromObject(anchor)
  const size = new Vector3()
  const center = new Vector3()
  box.getSize(size)
  box.getCenter(center)

  const planeWidth = size.x * 0.9
  const planeHeight = size.y * 0.9
  const geometry = new PlaneGeometry(planeWidth, planeHeight)
  const material = new MeshStandardMaterial({
    map: faceTexture,
    metalness: 0.02,
    roughness: 0.42,
    envMapIntensity: ENV_PRODUCT,
    toneMapped: true,
  })
  const decal = new Mesh(geometry, material)
  decal.name = '__navFaceDecal'
  decal.position.set(center.x, center.y, box.max.z + Math.max(2, size.z * 0.04))
  decal.castShadow = false
  decal.receiveShadow = true
  model.add(decal)
}

/**
 * Siyah fondaki navbar ürün fotoğrafından panel yüzünü kırpar
 * (ayak ve boşluk dışarıda kalır).
 */
function cropNavProductFace(image: HTMLImageElement | ImageBitmap): Texture {
  const width = 'width' in image ? image.width : 0
  const height = 'height' in image ? image.height : 0
  const source = document.createElement('canvas')
  source.width = width
  source.height = height
  const sourceCtx = source.getContext('2d')
  if (!sourceCtx || width < 2 || height < 2) {
    const fallback = new CanvasTexture(image as CanvasImageSource)
    fallback.colorSpace = SRGBColorSpace
    return fallback
  }
  sourceCtx.drawImage(image as CanvasImageSource, 0, 0)
  const pixels = sourceCtx.getImageData(0, 0, width, height).data
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (pixels[i] + pixels[i + 1] + pixels[i + 2] < 24) continue
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }
  if (maxX <= minX || maxY <= minY) {
    const fallback = new CanvasTexture(image as CanvasImageSource)
    fallback.colorSpace = SRGBColorSpace
    return fallback
  }
  const contentW = maxX - minX + 1
  const contentH = maxY - minY + 1
  // Alt ~%24 kırmızı ayak; üstte LED + tarif yüzü kalsın.
  const faceH = Math.max(1, Math.floor(contentH * 0.76))
  // Yanlardan ince kırpım: beyaz çerçeve kenarı düzlemde dolsun.
  const insetX = Math.floor(contentW * 0.02)
  const cropW = Math.max(1, contentW - insetX * 2)
  const crop = document.createElement('canvas')
  crop.width = cropW
  crop.height = faceH
  const cropCtx = crop.getContext('2d')
  if (!cropCtx) {
    const fallback = new CanvasTexture(image as CanvasImageSource)
    fallback.colorSpace = SRGBColorSpace
    return fallback
  }
  cropCtx.drawImage(source, minX + insetX, minY, cropW, faceH, 0, 0, cropW, faceH)
  const texture = new CanvasTexture(crop)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function fitColumn(width: number, height: number, frame: LabelFrame) {
  const aspect = width / Math.max(height, 1)
  const fov = frame.endFov + (aspect < 0.95 ? 16 : aspect < 1.35 ? 8 : 0)
  const cardPx = Math.min(CARD_MAX_PX, width * CARD_VW)
  const camera = new PerspectiveCamera(fov, aspect, 0.1, 400)
  camera.position.set(
    Math.sin(frame.endAzim) * frame.endRadius,
    frame.endHeight,
    Math.cos(frame.endAzim) * frame.endRadius,
  )
  camera.lookAt(0, frame.endLookY, 0)
  camera.updateMatrixWorld()

  const target = 1 - (2 * (cardPx + EDGE_PAD)) / width
  const projected = new Vector3()
  const ndcAt = (x: number) =>
    Math.max(...frame.slotY.map((y) => projected.set(x, y, LABEL_Z).project(camera).x))

  if (ndcAt(frame.columnX) <= target) return frame.columnX

  let lo = 0
  let hi = frame.columnX
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (ndcAt(mid) > target) hi = mid
    else lo = mid
  }
  return hi
}

function anchorFor(
  side: 'left' | 'right',
  order: number,
  columnX: number,
  slotY: number[],
): [number, number, number] {
  return [side === 'left' ? -columnX : columnX, slotY[Math.min(order, slotY.length - 1)], LABEL_Z]
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

function prepareModel(
  scene: Object3D,
  screenTexture: Texture | null,
  faceTexture: Texture | null,
  variant: ExplodeVariant,
) {
  const model = skeletonClone(scene)
  const box = new Box3().setFromObject(model)
  const extent = new Vector3()
  const center = new Vector3()
  box.getSize(extent)
  box.getCenter(center)
  const target = variant.modelSize ?? MODEL_HEIGHT
  const fitSpan = variant.fit === 'max' ? Math.max(extent.x, extent.y, extent.z) : extent.y
  const scale = target / (fitSpan || 1)
  const parts: Record<string, TrackedPart> = {}

  model.traverse((node) => {
    const mesh = node as Mesh
    if (!mesh.isMesh && !variant.explode[node.name]) return

    if (mesh.isMesh && mesh.material) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const cloned = materials.map((material) => {
        const next = material.clone() as MeshStandardMaterial
        next.envMapIntensity = ENV_PRODUCT
        return next
      })
      mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0]
      if (screenTexture && variant.screens.has(node.name)) {
        const intensity = node.name.startsWith('tabletsc') ? SCREEN_EMISSIVE : SCREEN_EMISSIVE * (2 / 3)
        paintScreen(mesh, screenTexture, intensity)
      }
      mesh.castShadow = !variant.bodyNames.has(node.name) && !variant.screens.has(node.name)
      mesh.receiveShadow = true
    }

    const dirRaw = variant.explode[node.name]
    if (!dirRaw) return

    const partBox = new Box3().setFromObject(node)
    const partCenter = new Vector3()
    partBox.getCenter(partCenter)
    parts[node.name] = {
      node,
      home: node.position.clone(),
      dir: new Vector3(...dirRaw).multiplyScalar(fitSpan || extent.y),
      center: partCenter.clone().sub(new Vector3(center.x, box.min.y, center.z)).multiplyScalar(scale),
    }
  })

  if (faceTexture && variant.faceGroups && variant.faceGroups.size > 0) {
    attachNavFaceDecal(model, faceTexture, variant.faceGroups)
  }

  return {
    root: model,
    parts,
    scale,
    offset: new Vector3(-center.x, -box.min.y, -center.z),
  }
}

export default function KioskExplodeModel({ variant }: KioskExplodeModelProps) {
  const { scene } = useGLTF(variant.modelSrc, true, true)
  const explodeAmount = useRef(0)
  const revealCount = useRef(0)
  const labelRefs = useRef<(Group | null)[]>([])
  const [areLabelsVisible, setAreLabelsVisible] = useState(false)
  const [revealedCount, setRevealedCount] = useState(0)
  const [faceTexture, setFaceTexture] = useState<Texture | null>(null)
  const { size } = useThree()

  const screenTexture = useMemo(() => createKioskScreenTexture(), [])
  useEffect(() => () => screenTexture?.dispose(), [screenTexture])

  useEffect(() => {
    // LED: navbar fotoğrafı perspektifli; düz tarif yüzü çizilir. Fotoğraf yalnızca StaticExplode’da.
    if (variant.id === 'ledli-reklam-paneli') {
      const texture = createLedPanelFaceTexture()
      setFaceTexture(texture)
      return () => {
        texture?.dispose()
        setFaceTexture(null)
      }
    }

    if (!variant.faceMapSrc) {
      setFaceTexture(null)
      return
    }
    const loader = new TextureLoader()
    let disposed = false
    loader.load(variant.faceMapSrc, (texture) => {
      if (disposed) {
        texture.dispose()
        return
      }
      const image = texture.image as HTMLImageElement | ImageBitmap | undefined
      texture.dispose()
      if (!image) {
        setFaceTexture(null)
        return
      }
      setFaceTexture(cropNavProductFace(image))
    })
    return () => {
      disposed = true
      setFaceTexture((current) => {
        current?.dispose()
        return null
      })
    }
  }, [variant.id, variant.faceMapSrc])

  const { root, parts, scale, offset } = useMemo(
    () => prepareModel(scene, screenTexture, faceTexture, variant),
    [scene, screenTexture, faceTexture, variant],
  )

  const framing = variant.framing ?? 'tall'
  const labelFrame = useMemo(() => labelFrameFor(framing), [framing])

  const layout = useMemo(() => {
    const columnX = fitColumn(size.width, size.height, labelFrame)
    const showLabels = framing === 'compact' ? size.width >= 720 : columnX >= 1.6 && size.height >= 620
    return { columnX, slotY: labelFrame.slotY, showLabels }
  }, [size.width, size.height, labelFrame, framing])

  const slottedLabels = useMemo(() => {
    const available = variant.copy.parts.filter((part) => parts[part.partId])
    const counters = { left: 0, right: 0 }
    return [...available]
      .sort((a, b) => parts[b.partId].center.y - parts[a.partId].center.y)
      .map((part) => {
        const slotted: SlottedLabel = {
          ...part,
          anchor: anchorFor(part.side, counters[part.side]++, layout.columnX, layout.slotY),
        }
        return slotted
      })
  }, [parts, layout.columnX, layout.slotY, variant.copy.parts])

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

      {layout.showLabels
        ? leaders.map((line, index) => (
            <primitive key={`leader-${slottedLabels[index].partId}`} object={line} />
          ))
        : null}
      {layout.showLabels
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

export function preloadExplodeModel(src: string) {
  useGLTF.preload(src, true, true)
}
