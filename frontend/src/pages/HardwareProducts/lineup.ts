
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

export const TALLEST_MM = 2455

export const MIN_RATIO = 0.12

type LineupSlug = 'visiobox' | 'kiosk' | 'tir-kiosk' | 'kamera-montaj-kulesi' | 'rack-kabin' | 'kamera-muhafaza'

const publicLineup = (name: string) => ({ src: `/img/products/lineup/${name}.webp`, avif: `/img/products/lineup/${name}.avif` })

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

export const lineupItems: LineupItem[] = [
  item('visiobox', 900, 507, 260),
  item('kiosk', 672, 900, 1800, true),
  item('tir-kiosk', 675, 900, 2455, true),
  item('kamera-montaj-kulesi', 675, 900, 2000),
  item('rack-kabin', 833, 900, 620),
  item('kamera-muhafaza', 900, 450, 200),
]

export const lineupRatio = (entry: LineupItem) => Math.max(entry.heightMm / TALLEST_MM, MIN_RATIO)
