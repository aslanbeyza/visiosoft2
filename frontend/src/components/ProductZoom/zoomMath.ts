/** Görsel üzerindeki detay alanı; değerler görselin genişlik/yüksekliğine göre yüzde. */
export type ZoomBox = { x: number; y: number; w: number; h: number }

/** Dönüştürülen tuval ve içindeki görselin ("contain") ölçüleri (px). */
export type StageGeometry = {
  width: number
  height: number
  imageWidth: number
  imageHeight: number
  offsetX: number
  offsetY: number
}

/** Kamera karesi: ölçek ve tuval koordinatında bakılan merkez. */
export type ZoomFrame = { scale: number; cx: number; cy: number; boxWidth: number; boxHeight: number }

/** Her karenin kaydırma payının ne kadarı sabit bekler; kalanı sonraki kareye geçiştir. */
export const HOLD = 0.5

export function measureStage(width: number, height: number, naturalWidth: number, naturalHeight: number): StageGeometry {
  const ratio = naturalWidth / naturalHeight
  const wide = width / height > ratio
  const imageWidth = wide ? height * ratio : width
  const imageHeight = wide ? height : width / ratio
  return { width, height, imageWidth, imageHeight, offsetX: (width - imageWidth) / 2, offsetY: (height - imageHeight) / 2 }
}

/** maxScale 3: kaynak görsellerin çözünürlüğü daha fazlasında yumuşak görünür. */
export function frameForBox(box: ZoomBox | null, g: StageGeometry, fill = 0.72, maxScale = 3): ZoomFrame {
  if (!box) return { scale: 1, cx: g.width / 2, cy: g.height / 2, boxWidth: 0, boxHeight: 0 }

  const boxWidth = (box.w / 100) * g.imageWidth
  const boxHeight = (box.h / 100) * g.imageHeight
  const scale = Math.min(maxScale, Math.max(1, Math.min((g.width * fill) / boxWidth, (g.height * fill) / boxHeight)))

  return {
    scale,
    cx: g.offsetX + ((box.x + box.w / 2) / 100) * g.imageWidth,
    cy: g.offsetY + ((box.y + box.h / 2) / 100) * g.imageHeight,
    boxWidth,
    boxHeight,
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Ölçek logaritmik, merkez doğrusal karışır; yakınlaşma hızı göze eşit görünür. */
export function mixFrames(a: ZoomFrame, b: ZoomFrame, t: number): ZoomFrame {
  return {
    scale: Math.exp(lerp(Math.log(a.scale), Math.log(b.scale), t)),
    cx: lerp(a.cx, b.cx, t),
    cy: lerp(a.cy, b.cy, t),
    boxWidth: t < 0.5 ? a.boxWidth : b.boxWidth,
    boxHeight: t < 0.5 ? a.boxHeight : b.boxHeight,
  }
}

/** Kareyi, tuval merkezine göre uygulanacak translate/scale değerine çevirir. */
export function toTransform(frame: ZoomFrame, g: StageGeometry) {
  return {
    scale: frame.scale,
    x: -frame.scale * (frame.cx - g.width / 2),
    y: -frame.scale * (frame.cy - g.height / 2),
  }
}

export type TimelinePoint = {
  from: number
  to: number
  /** Geçiş ilerlemesi (yumuşatılmış, 0–1). */
  t: number
  /** Metin olarak gösterilecek kare. */
  active: number
}

export function timelineAt(progress: number, frameCount: number, hold = HOLD): TimelinePoint {
  const p = Math.min(1, Math.max(0, progress))
  const segment = 1 / frameCount
  const index = Math.min(frameCount - 1, Math.floor(p / segment))
  const local = (p - index * segment) / segment

  if (index === frameCount - 1 || local <= hold) return { from: index, to: index, t: 0, active: index }

  const raw = (local - hold) / (1 - hold)
  return { from: index, to: index + 1, t: easeInOutCubic(raw), active: raw < 0.5 ? index : index + 1 }
}

/** Karenin sabit bekleme aralığının ortasına denk gelen kaydırma ilerlemesi. */
export function progressForFrame(index: number, frameCount: number, hold = HOLD) {
  return Math.min(1, (index + hold / 2) / frameCount)
}
