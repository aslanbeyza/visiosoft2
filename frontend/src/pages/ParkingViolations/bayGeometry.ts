import type { ViolationId } from './violationsCopy.ts'

// Park alanı planının geometrisi (viewBox 696×440): üst sıra 24–152, manevra alanı 152–288, alt sıra 288–416.
export const VIEW = { w: 696, h: 440 }
export const SLOT = { x0: 36, w: 78, topY: 24, bottomY: 288, depth: 128 }

const sx = (k: number) => SLOT.x0 + k * SLOT.w

type Zone = { x: number; y: number; w: number; h: number }
export type CarPose = { cx: number; cy: number; rot: number }

/** `pin`: rozetin varsayılan yeri (dış hattın ortası) uymayan bölgeler için açık konum. */
export type Scenario = { id: ViolationId; zone: Zone; car: CarPose; pin?: { x: number; y: number } }

export const scenarios: Scenario[] = [
  { id: 'evDouble', zone: { x: sx(0), y: 24, w: 156, h: 128 }, car: { cx: sx(1), cy: 90, rot: 180 } },
  { id: 'doubleSlot', zone: { x: sx(2), y: 24, w: 156, h: 128 }, car: { cx: sx(3), cy: 88, rot: 90 } },
  { id: 'lineCross', zone: { x: sx(4), y: 24, w: 156, h: 128 }, car: { cx: sx(5) - 12, cy: 90, rot: 192 } },
  { id: 'disabled', zone: { x: sx(6), y: 24, w: 78, h: 128 }, car: { cx: sx(6) + 39, cy: 90, rot: 180 } },
  { id: 'marked', zone: { x: sx(7), y: 24, w: 78, h: 128 }, car: { cx: sx(7) + 39, cy: 90, rot: 180 } },
  // Koridordaki tek bölge: dış hat yok, üstü ve altı araca dar geliyor; rozet aracın sağındaki boşluğa oturur.
  { id: 'outside', zone: { x: sx(6) - 20, y: 190, w: 176, h: 84 }, car: { cx: sx(7) - 18, cy: 232, rot: 90 }, pin: { x: 630, y: 232 } },
  { id: 'fossil', zone: { x: sx(0), y: 288, w: 78, h: 128 }, car: { cx: sx(0) + 39, cy: 350, rot: 0 } },
  { id: 'rented', zone: { x: sx(2), y: 288, w: 78, h: 128 }, car: { cx: sx(2) + 39, cy: 350, rot: 0 } },
]

/** Kurala uygun park etmiş, vurgulanmayan araçlar (plana gerçekçilik katar). */
export const parkedCars: CarPose[] = [
  { cx: sx(4) + 39, cy: 350, rot: 0 },
  { cx: sx(6) + 39, cy: 352, rot: 0 },
]

/** Slot çizgileri: sıra arka çizgileri ve ayraçlar. */
export function slotLines(): string[] {
  const lines = [`M${sx(0)} ${SLOT.topY}H${sx(8)}`, `M${sx(0)} ${SLOT.bottomY + SLOT.depth}H${sx(8)}`]
  for (let k = 0; k <= 8; k += 1) {
    lines.push(`M${sx(k)} ${SLOT.topY}v${SLOT.depth}`)
    lines.push(`M${sx(k)} ${SLOT.bottomY}v${SLOT.depth}`)
  }
  return lines
}

/** Manevra koridorunun orta hattı; rozetin sıranın hangi kenarına oturacağını belirler. */
export const AISLE_Y = 220

/**
 * Numara rozetinin merkezi: bölgenin yatay ortasında, koridordan uzak dış hat üzerinde. Araçlar slotların
 * ortasında durduğu için rozet dış hatta kalınca üstlerine binmez; köşelerden uzak durduğu için de seçili
 * bölgenin köşe parantezlerini ezmez. Listedeki rozetle aynı numarayı taşır;
 * planla listeyi bağlayan tek ipucu bu olduğu için konumu tek yerden gelir.
 */
export function pinPoint({ zone, pin }: Scenario) {
  if (pin) return pin
  const { x, y, w, h } = zone
  const midY = y + h / 2
  // Üst sıra: rozet slotun koridora bakan alt kenarında; alt sıra: üst kenarında (y=24 dışarı taşmaz).
  if (midY < AISLE_Y) return { x: x + w / 2, y: y + h }
  if (midY > AISLE_Y) return { x: x + w / 2, y: y }
  return { x: x + w / 2, y: midY }
}

/** Köşe parantezleri: vurgulanan bölgenin dört köşesi ayrı yol (her biri kendi uzunluğunda çizilir). */
export function bracketPaths({ x, y, w, h }: Zone, inset = -6, arm = 16): string[] {
  const l = x + inset
  const t = y + inset
  const r = x + w - inset
  const b = y + h - inset
  return [
    `M${l} ${t + arm}V${t}H${l + arm}`,
    `M${r - arm} ${t}H${r}V${t + arm}`,
    `M${r} ${b - arm}V${b}H${r - arm}`,
    `M${l + arm} ${b}H${l}V${b - arm}`,
  ]
}

/** İşaretli slot taraması: bölgeyi aşan çapraz çizgiler; çizim clipPath ile bölgeye kırpılır. */
export function hatchLines({ x, y, w, h }: Zone, step = 14): string {
  let d = ''
  for (let o = -h; o < w; o += step) d += `M${x + o} ${y + h}l${h} ${-h}`
  return d
}

export type { Zone }
