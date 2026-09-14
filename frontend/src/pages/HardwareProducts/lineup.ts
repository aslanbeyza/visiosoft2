/**
 * Hero ürün dizisi. Görseller kartlardaki kesimlerin saydam kenarları kırpılmış kopyalarıdır.
 * Çoğu public/img/products/lineup altındadır; kiosk ve rack-kabin ise marka izleri temizlenmiş,
 * ./img altından içe aktarılan kopyaları (kiosk-lineup.*, rack-lineup.*) kullanır.
 * Yükseklikler milimetre; `measured` yalnızca products.ts'te ölçüsü olanlarda true.
 */
import { products } from '../HardwareProduct/products.ts'
import type { HardwareSlug } from '../HardwareProduct/products.ts'
import kioskLineupAvif from './img/kiosk-lineup.avif'
import kioskLineupWebp from './img/kiosk-lineup.webp'
import rackLineupAvif from './img/rack-lineup.avif'
import rackLineupWebp from './img/rack-lineup.webp'

export type LineupItem = {
  slug: HardwareSlug
  route: string
  label: string
  src: string
  avif: string
  width: number
  height: number
  heightMm: number
  measured: boolean
}

/** En uzun ürün (TIR kiosk, 2455 mm) sahne yüksekliğinin tamamıdır. */
export const TALLEST_MM = 2455
/** Çok küçük ürünlerin sahnede okunabilir kalması için alt sınır (temsilî ölçek). */
export const MIN_RATIO = 0.12

type LineupSlug = 'visiobox' | 'kiosk' | 'tir-kiosk' | 'kamera-montaj-kulesi' | 'rack-kabin' | 'kamera-muhafaza'

const publicLineup = (name: string) => ({ src: `/img/products/lineup/${name}.webp`, avif: `/img/products/lineup/${name}.avif` })

/**
 * Her ürünün görseli açıkça tanımlıdır; slug'dan türetilen varsayılan yol yoktur.
 * Kiosk ve rack kabin: müşteri logosu temizlenmiş kopyalar (./img, aynı piksel ölçüsü).
 */
const lineupFiles: Record<LineupSlug, { src: string; avif: string }> = {
  visiobox: publicLineup('visiobox'),
  kiosk: { src: kioskLineupWebp, avif: kioskLineupAvif },
  'tir-kiosk': publicLineup('tir-kiosk'),
  'kamera-montaj-kulesi': publicLineup('kamera-montaj-kulesi'),
  'rack-kabin': { src: rackLineupWebp, avif: rackLineupAvif },
  'kamera-muhafaza': publicLineup('kamera-muhafaza'),
}

const item = (slug: LineupSlug & HardwareSlug, width: number, height: number, heightMm: number, measured = false): LineupItem => ({
  slug,
  route: products[slug].route,
  label: products[slug].navLabel,
  src: lineupFiles[slug].src,
  avif: lineupFiles[slug].avif,
  width,
  height,
  heightMm,
  measured,
})

// Sıra: uzun ürünler ortada, alçak ve geniş ürünler kenarlarda.
export const lineupItems: LineupItem[] = [
  item('visiobox', 704, 508, 260),
  item('kiosk', 194, 888, 1800, true),
  item('tir-kiosk', 92, 540, 2455, true),
  item('kamera-montaj-kulesi', 80, 440, 2000),
  item('rack-kabin', 654, 752, 620),
  item('kamera-muhafaza', 776, 316, 200),
]

export const lineupRatio = (entry: LineupItem) => Math.max(entry.heightMm / TALLEST_MM, MIN_RATIO)
