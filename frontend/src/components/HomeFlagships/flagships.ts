import type { CSSProperties } from 'react'
import { hardwareMenu } from '../../data/siteNav.ts'
import { products } from '../../pages/HardwareProduct/products.ts'
import type { HardwareSlug } from '../../pages/HardwareProduct/products.ts'
import { flagshipShowcase } from './homeFlagshipsCopy.ts'

/**
 * Tek ürün adı: sekme etiketi mega menüdeki standart addır (siteNav.ts hardwareMenu);
 * menüde bulunmazsa products.ts'e düşer.
 */
const navName = (slug: HardwareSlug) => {
  const { route, copy } = products[slug]
  const entry = hardwareMenu.find((link) => link.route === route)
  return { name: entry?.label ?? copy.name, category: entry?.description ?? copy.eyebrow }
}

/**
 * Dört ana ürün ve sahne ölçüleri. Görsel verisi public/img/home altındadır.
 * Birim cqh = sahne yüksekliğinin %1'i. Ürünler zemine oturur (lift yok); vitrin ölçeği önceki
 * sekmeli sahneden ≈%25 daha büyüktür.
 */
export const STAGE = {
  floor: 16,
  kioskHeight: 90,
  ledHeight: 80,
  smallWidth: 90,
  shadow: { factor: 0.92, min: 28, max: 72 },
} as const

type Bbox = readonly [x0: number, y0: number, x1: number, y1: number]

export type FlagshipImage = {
  src: string
  avif: string
  width: number
  height: number
  bbox: Bbox
  alt: string
}

export type Flagship = {
  slug: keyof typeof flagshipShowcase
  tab: string
  image: FlagshipImage
  thumb?: string
  fit: { height: number } | { width: number }
}

/** Ürünün alfa kutusu sahnede ölçeklenir; görsel kutunun içine şeffaf kenarları taşacak şekilde yerleşir. */
export function flagshipGeometry(item: Flagship) {
  const [x0, y0, x1, y1] = item.image.bbox
  const pw = x1 - x0
  const ph = y1 - y0
  const boxH = 'height' in item.fit ? item.fit.height : (item.fit.width * ph) / pw
  const boxW = 'height' in item.fit ? (item.fit.height * pw) / ph : item.fit.width
  const { factor, min, max } = STAGE.shadow
  return {
    style: {
      '--box-w': `${boxW}cqh`,
      '--box-h': `${boxH}cqh`,
      '--img-w': `${(item.image.width / pw) * 100}%`,
      '--img-l': `${(-x0 / pw) * 100}%`,
      '--img-t': `${(-y0 / ph) * 100}%`,
    } as CSSProperties,
    shadow: Math.min(max, Math.max(min, boxW * factor)) / max,
  }
}

export const flagships: Flagship[] = [
  {
    slug: 'kiosk',
    tab: navName('kiosk').name,
    image: {
      src: '/img/home/kiosk/kiosk-2064.webp',
      avif: '/img/home/kiosk/kiosk-2064.avif',
      width: 545,
      height: 2064,
      bbox: [9, 9, 538, 2055],
      alt: 'Visiosoft insansız çıkış ödeme kiosku: kırmızı ön panel, ekran, temassız kart okuyucu ve beyaz kolon',
    },
    thumb: '/img/home/kiosk/kiosk-620.webp',
    fit: { height: STAGE.kioskHeight },
  },
  {
    slug: 'kamera-muhafaza',
    tab: navName('kamera-muhafaza').name,
    image: {
      src: '/img/home/products/kamera-muhafaza.webp',
      avif: '/img/home/products/kamera-muhafaza.avif',
      width: 900,
      height: 450,
      bbox: [10, 10, 890, 440],
      alt: 'Visio Kamera: ParkBiz markalı dış ortam muhafazası, yandan görünüm',
    },
    fit: { width: STAGE.smallWidth },
  },
  {
    slug: 'visiobox',
    tab: navName('visiobox').name,
    image: {
      src: '/img/home/products/visiobox.webp',
      avif: '/img/home/products/visiobox.avif',
      width: 900,
      height: 507,
      bbox: [10, 10, 890, 497],
      alt: 'Visiobox kontrol kutusu, ParkBiz markalı üst yüzey',
    },
    fit: { width: STAGE.smallWidth },
  },
  {
    slug: 'ledli-reklam-paneli',
    tab: navName('ledli-reklam-paneli').name,
    image: {
      src: '/img/home/products/led-panel.webp',
      avif: '/img/home/products/led-panel.avif',
      width: 266,
      height: 621,
      bbox: [10, 10, 256, 611],
      alt: 'LED Bilgilendirme Paneli: LED ekranlı, ayaklı ücret ve yönlendirme paneli',
    },
    fit: { height: STAGE.ledHeight },
  },
]

/** Vitrin kartı + ürün sayfası rotası. */
export const flagshipInfo = (slug: Flagship['slug']) => {
  const { route } = products[slug]
  return { ...flagshipShowcase[slug], route }
}
