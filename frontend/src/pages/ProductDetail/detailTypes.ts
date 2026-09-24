import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'
import type { ParkingFlowDevice } from '../../components/ParkingFlow/index.ts'
import type { ProductZoomDetail } from '../../components/ProductZoom/index.ts'
import type { HardwareSlug, ProductCopy } from '../HardwareProduct/products.ts'

export type DetailImage = {
  src: string
  avif?: string
  width: number
  height: number
  alt: string
}

export type DimensionSpan = { from: number; to: number }

export type HeroDimension = { label: string; span: DimensionSpan; edges: [number, number] }

export type HeroDimensions = {
  height: HeroDimension
  width?: HeroDimension
}

export type KeyFigure = {
  id: string
  label: string

  value?: number
  decimals?: number
  unit?: string

  text?: string
  srText?: string
}

export type DetailHero =
  | {
      kind: 'image'
      image: DetailImage
      dimensions?: HeroDimensions
      note?: string

      baseGap?: number
    }

  | { kind: 'ledPanel'; alt: string; note?: string }

export type ZoomCallout = {
  id: string
  title: string
  description: string

  x: number
  y: number
}

export type DetailZoom =
  | { kind: 'kiosk' }
  | {
      kind: 'drawing'
      eyebrow: string
      title: string
      overview: { title: string; description: string }
      image: DetailImage
      details: ProductZoomDetail[]
    }
  | {
      kind: 'gallery'
      eyebrow: string
      title: string
      lead: string
      items: { id: string; image: DetailImage; caption: string; fit: 'contain' | 'cover' }[]
    }
  | {
      kind: 'callouts'
      eyebrow: string
      title: string
      lead: string
      image: DetailImage
      callouts: ZoomCallout[]
    }

export type ProcessStep = {
  id: string
  icon: FeatureIconName
  title: string
  description: string
}

export type DetailProcess = {
  eyebrow: string
  title: string
  lead: string
  steps: ProcessStep[]
  media?: { image: DetailImage & { avifSet: string; webpSet: string }; caption: string }
}

export type DetailPlacement = {
  eyebrow: string
  title: string
  lead: string
  device: ParkingFlowDevice
  deviceLabel: string
}

export type DetailDrawing = {
  image: DetailImage
  text: string
  note?: string
  dimensions: { label: string; value: string }[]
}

export type ProductDetailData = {
  slug: HardwareSlug
  route: string
  navLabel: string
  copy: ProductCopy
  seo: { title: string; description: string }
  hero: DetailHero
  figures: { label: string; items: KeyFigure[] }

  heroMeta: boolean
  zoom?: DetailZoom

  explode?: boolean
  process?: DetailProcess
  placement?: DetailPlacement
  drawing?: DetailDrawing
}
