import type { ZoneShot, ZoneTourItem } from './zoneTour.ts'

/**
 * Kamera pozu: görsel katmanı `transform-origin: 0 0` ile `translate(x%, y%) scale(s)` alır.
 * x katman genişliğinin, y katman yüksekliğinin yüzdesidir; böylece poz çerçeve pikselinden bağımsızdır.
 */
export type CameraPose = { x: number; y: number; s: number }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** Kameranın gördüğü görsel alanı: kırpım varsa kırpım, yoksa görselin tamamı (kaynak pikseli). */
export const shotSize = ({ crop, width, height }: ZoneShot) => (crop ? { width: crop.w, height: crop.h } : { width, height })

type PoseOptions = {
  /** Çerçeve en-boy oranı (genişlik / yükseklik). */
  aspect: number
  /** Ölçek; 1 = görsel genişliği çerçeve genişliği. */
  scale: number
  cx: number
  cy: number
}

/**
 * Poz her zaman çerçeveyi doldurur: ölçek, görselin çerçeveyi hem yatayda hem dikeyde kapladığı değerin altına inmez.
 * Böylece hiçbir öğede, kamera hareketinin başında da sonunda da boş bant kalmaz; fazlası kenarlardan kırpılır.
 */
function poseAt(shot: ZoneShot, { aspect, scale, cx, cy }: PoseOptions): CameraPose {
  const { width, height } = shotSize(shot)
  // Çerçeve yüksekliği, s = 1 iken katman yüksekliği cinsinden
  const ratio = width / (height * aspect)
  const s = Math.max(1, ratio, scale)
  const tx = clamp(0.5 - s * cx, 1 - s, 0)
  const ty = clamp(ratio / 2 - s * cy, ratio - s, 0)
  return { x: tx * 100, y: ty * 100, s }
}

const PAD = 0.9
const MAX_SCALE = 2.6
/** Bu orandan dar çerçeve telefon kırpımıdır (4:3). */
const MOBILE_ASPECT = 1.5
const MOBILE_MAX_SCALE = 4

/** Telefon kırpımı: öğenin `mobile` ayarı ölçülen çerçeve genişliğine göre ölçeğe çevrilir; boş bant kalmaz. */
function mobilePose(item: ZoneTourItem, aspect: number, frameWidth: number): CameraPose | null {
  if (aspect >= MOBILE_ASPECT || !item.mobile || frameWidth <= 0) return null
  const { px, cx, cy } = item.mobile
  const scale = clamp((px * shotSize(item.shot).width) / frameWidth, 1, MOBILE_MAX_SCALE)
  return poseAt(item.shot, { aspect, scale, cx, cy })
}

/** Telefon kırpımı kullanılıyor mu (odak halkası bu durumda gösterilmez). */
export const usesMobileCrop = (item: ZoneTourItem, aspect: number, frameWidth: number) => mobilePose(item, aspect, frameWidth) !== null

/** Masaüstü odağı: bölgeyi çerçeveye sığdıran ölçek ve merkez. */
function desktopFocus({ shot, region, focus }: ZoneTourItem, aspect: number) {
  const { width, height } = shotSize(shot)
  const ratio = width / (height * aspect)
  const fit = Math.min(PAD / region.w, (PAD * ratio) / region.h)
  return {
    scale: clamp(fit * (focus?.scale ?? 1), 1, MAX_SCALE),
    cx: focus?.cx ?? region.x + region.w / 2,
    cy: focus?.cy ?? region.y + region.h / 2,
  }
}

/** Öğenin odak bölgesini çerçeveye sığdıran hedef poz. */
export function targetPose(item: ZoneTourItem, aspect: number, frameWidth = 0): CameraPose {
  return mobilePose(item, aspect, frameWidth) ?? poseAt(item.shot, { aspect, ...desktopFocus(item, aspect) })
}

/** Kamera hareketinin başladığı daha geniş poz: biraz uzakta ve görsel merkezine yakın (yine de çerçeveyi doldurur). */
export function startPose(item: ZoneTourItem, aspect: number, frameWidth = 0): CameraPose {
  const mobile = mobilePose(item, aspect, frameWidth)
  if (mobile) return mobile
  const { scale, cx, cy } = desktopFocus(item, aspect)
  return poseAt(item.shot, {
    aspect,
    scale: scale * 0.84,
    cx: cx + (0.5 - cx) * 0.3,
    cy: cy + (0.5 - cy) * 0.3,
  })
}
