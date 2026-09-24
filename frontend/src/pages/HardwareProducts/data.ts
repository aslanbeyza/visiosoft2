
import { products } from '../HardwareProduct/products.ts'
import type { HardwareSlug } from '../HardwareProduct/products.ts'
import kioskCardAvif from './img/kiosk-card.avif'
import kioskCardWebp from './img/kiosk-card.webp'
import rackCardAvif from './img/rack-card.avif'
import rackCardWebp from './img/rack-card.webp'

export type CategoryKey = 'kiosk' | 'control' | 'cabinet' | 'camera' | 'panel'

export type HardwareImage = {
  src: string
  avif?: string
  width: number
  height: number
  fit: 'contain' | 'cover'
}

export type HardwareItem = {
  slug: HardwareSlug
  route: string
  name: string
  navLabel: string
  eyebrow: string
  lead: string
  category: CategoryKey
  meta: { label: string; value: string }[]
  dimensions?: string
  features: { title: string; desc: string }[]
  image: HardwareImage
}

export const categories: { key: CategoryKey; label: string; description: string }[] = [
  { key: 'kiosk', label: 'Kiosk sistemleri', description: 'Çıkışta plaka girişi olmadan temassız ödeme alan kiosklar.' },
  { key: 'control', label: 'Kontrol kutusu', description: 'Bariyer ve sensörleri tek noktadan yöneten kompakt kutu.' },
  { key: 'cabinet', label: 'Kabin', description: 'Saha ekipmanlarını güvenli ve düzenli barındıran kabin.' },
  { key: 'camera', label: 'Kamera', description: 'Kameraları koruyan muhafaza ve yüksekten konumlandıran kule.' },
  { key: 'panel', label: 'Panel', description: 'Giriş ve yönlendirme için yüksek görünürlüklü LED panel.' },
]

const card = (name: string, width: number, height: number): HardwareImage => ({
  src: `/img/products/cards/${name}.webp`,
  avif: `/img/products/cards/${name}.avif`,
  width,
  height,
  fit: 'contain',
})

const entries: { slug: HardwareSlug; category: CategoryKey; image: HardwareImage }[] = [

  { slug: 'kiosk', category: 'kiosk', image: { ...card('kiosk', 672, 900), src: kioskCardWebp, avif: kioskCardAvif } },
  { slug: 'tir-kiosk', category: 'kiosk', image: card('tir-kiosk', 675, 900) },
  { slug: 'visiobox', category: 'control', image: card('visiobox', 900, 507) },
  { slug: 'rack-kabin', category: 'cabinet', image: { ...card('rack-kabin', 833, 900), src: rackCardWebp, avif: rackCardAvif } },
  { slug: 'kamera-muhafaza', category: 'camera', image: card('kamera-muhafaza', 900, 450) },
  { slug: 'kamera-montaj-kulesi', category: 'camera', image: card('kamera-montaj-kulesi', 675, 900) },
  {
    slug: 'ledli-reklam-paneli',
    category: 'panel',

    image: {
      src: '/img/products/lineup/led-panel.webp',
      avif: '/img/products/lineup/led-panel.avif',
      width: 620,
      height: 350,
      fit: 'contain',
    },
  },
]

export const hardwareItems: HardwareItem[] = entries.map(({ slug, category, image }) => {
  const { route, navLabel, copy } = products[slug]
  return {
    slug,
    route,
    navLabel,
    category,
    image,
    name: copy.name,
    eyebrow: copy.eyebrow,
    lead: copy.lead,
    meta: copy.meta,
    dimensions: copy.dimensions,
    features: copy.features,
  }
})

export const categoryLabel = (key: CategoryKey) => categories.find((item) => item.key === key)?.label ?? ''

export const formatDimensions = (value?: string) =>
  value ? `${value.replace(/mm/g, '').replace(/\s*×\s*/g, ' × ').trim()} mm` : undefined
