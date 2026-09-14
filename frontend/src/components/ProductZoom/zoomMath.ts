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

/**
 * maxScale 3: kaynak görsellerin çözünürlüğü daha fazlasında yumuşak görünür.
 * minScale (isteğe bağlı): detay karesinin alt ölçek sınırı (ör. görselin sahneyi kapladığı ölçek); maxScale her zaman önceliklidir.
 */
export function frameForBox(box: ZoomBox | null, g: StageGeometry, fill = 0.72, maxScale = 3, minScale = 1): ZoomFrame {
  if (!box) return { scale: 1, cx: g.width / 2, cy: g.height / 2, boxWidth: 0, boxHeight: 0 }

  const boxWidth = (box.w / 100) * g.imageWidth
  const boxHeight = (box.h / 100) * g.imageHeight
  const fitScale = Math.min((g.width * fill) / boxWidth, (g.height * fill) / boxHeight)
  const scale = Math.min(maxScale, Math.max(1, minScale, fitScale))

  return {
    scale,
    cx: g.offsetX + ((box.x + box.w / 2) / 100) * g.imageWidth,
    cy: g.offsetY + ((box.y + box.h / 2) / 100) * g.imageHeight,
    boxWidth,
    boxHeight,
  }
}

/** Bir görsel pikselinin ekranda en fazla kaç cihaz pikseline yayılabileceği; üstünde kaynak yumuşak görünür. */
export const SHARP_DEVICE_PX = 1.5

/**
 * Netlik sınırı: "contain" ile yerleşen görsel, ölçeklendiğinde her görsel pikseli en fazla SHARP_DEVICE_PX cihaz pikseline
 * yayılır. Kaynak zaten sahneden küçükse yakınlaşma olmaz (1).
 */
export function sharpScaleLimit(g: StageGeometry, naturalWidth: number, devicePixelRatio = 1, maxScale = Infinity) {
  if (g.imageWidth <= 0) return 1
  const limit = (SHARP_DEVICE_PX * naturalWidth) / (g.imageWidth * Math.max(1, devicePixelRatio))
  return Math.max(1, Math.min(maxScale, limit))
}

/** Statik karo oranı (genişlik / yükseklik); tüm detay karoları aynı kutuyu paylaşır. */
export const TILE_RATIO = 4 / 3

/**
 * Statik detay karosu için kırpma değerleri. Karo TILE_RATIO oranında kutudur; detay kutusu biraz pay bırakılarak sığdırılır,
 * görsel karoyu her zaman tamamen kaplar (cover). Değerler CSS değişkeni olarak verilir; netlik sınırı CSS'te cihaz piksel
 * oranına göre uygulanır.
 */
export function tileCrop(box: ZoomBox, naturalWidth: number, naturalHeight: number, padding = 1.12) {
  const boxWidth = (box.w / 100) * naturalWidth
  const boxHeight = (box.h / 100) * naturalHeight
  // Görseli kaplamaya devam eden en geniş pencere (görsel pikseli).
  const coverWindow = Math.min(naturalWidth, naturalHeight * TILE_RATIO)
  const fitWindow = Math.max(boxWidth, boxHeight * TILE_RATIO) * padding
  const span = Math.min(coverWindow, Math.max(fitWindow, 1))
  const cx = (box.x + box.w / 2) / 100
  const cy = (box.y + box.h / 2) / 100
  // Karonun gösterebileceği en geniş alan (yüzde); görünmeyen katmanları elemek için.
  const maxW = (coverWindow / naturalWidth) * 100
  const maxH = (coverWindow / TILE_RATIO / naturalHeight) * 100
  const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(max, 0))
  return {
    maxWindow: { x: clamp(cx * 100 - maxW / 2, 100 - maxW), y: clamp(cy * 100 - maxH / 2, 100 - maxH), w: maxW, h: maxH },
    /** Karo genişliğine göre görsel genişliği: yakınlaşma ve kaplama alt sınırı. */
    zoom: naturalWidth / span,
    cover: naturalWidth / coverWindow,
    /** Odak noktası (görsele göre 0–1). */
    cx,
    cy,
    /** Karonun netlik sınırında alabileceği en geniş hâl için pencere (görsel pikseli). */
    coverWindow,
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

/** Görünür sahne kutusu (px): kutunun iç ölçüleri ve tuvalin bu kutudaki sol/üst konumu (dönüşüm uygulanmadan). */
export type StageViewport = { width: number; height: number; canvasLeft: number; canvasTop: number }

/**
 * Detay karesinde görselin sahneyi dört yandan kaplayacağı en küçük ölçek. Detay kutusu sahneye tam sığmaya devam eder
 * (kutu sahneden büyükse sığdığı ölçekte kalınır); büyük detay kutularında yakınlaşma, kenarlarda nötr zemin bırakmaz.
 */
export function coverScaleFloor(box: ZoomBox | null, g: StageGeometry, view: StageViewport | null) {
  if (!box || !view || g.imageWidth <= 0 || g.imageHeight <= 0) return 1
  const boxWidth = Math.max((box.w / 100) * g.imageWidth, 1)
  const boxHeight = Math.max((box.h / 100) * g.imageHeight, 1)
  const cover = Math.max(view.width / g.imageWidth, view.height / g.imageHeight)
  return Math.max(1, Math.min(cover, view.width / boxWidth, view.height / boxHeight))
}

/**
 * Görseli sahnede boş bant bırakmayacak şekilde yerleştirir. Ölçekli görsel bir eksende sahneden büyükse kaydırma, görsel
 * kenarları sahnenin dışında kalacak kadar sınırlanır; küçükse görsel o eksende ortalanır (nötr zemin iki yana eşit düşer).
 * Sınır sürekli bir fonksiyondur; kareler arası geçişte sıçrama olmaz.
 */
export function coverTransform(t: { scale: number; x: number; y: number }, g: StageGeometry, view: StageViewport) {
  const axis = (value: number, canvasStart: number, canvasSize: number, imageOffset: number, imageSize: number, viewSize: number) => {
    // Kaydırma 0 iken ölçekli görselin sahnedeki başlangıç kenarı (ölçek tuval merkezine göre).
    const base = canvasStart + canvasSize / 2 + t.scale * (imageOffset - canvasSize / 2)
    const scaled = t.scale * imageSize
    if (scaled <= viewSize) return (viewSize - scaled) / 2 - base
    return Math.min(-base, Math.max(viewSize - scaled - base, value))
  }
  return {
    scale: t.scale,
    x: axis(t.x, view.canvasLeft, g.width, g.offsetX, g.imageWidth, view.width),
    y: axis(t.y, view.canvasTop, g.height, g.offsetY, g.imageHeight, view.height),
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
