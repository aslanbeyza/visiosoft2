import { hardwareMenu } from '../../data/siteNav.ts'
import { isHardwareSlug, productNav, products } from '../HardwareProduct/products.ts'
import type { HardwareSlug } from '../HardwareProduct/products.ts'
import type { DetailImage } from './detailTypes.ts'

export const detailCopy = {
  breadcrumb: { home: 'Ana sayfa', category: 'Donanım', categoryRoute: 'hardware-products' },
  figures: {
    dimensions: 'Temel ölçüler',
    profile: 'Ürün künyesi',
    drawingLink: 'Teknik çizimi inceleyin',
  },
  zoomEyebrow: 'Yakından inceleyin',
  drawing: {
    id: 'teknik-cizim',
    eyebrow: 'Ölçüler',
    title: 'Teknik çizim',
    openLabel: 'Çizimi büyüt',
    zoomHint: 'Yakınlaştırmak için çizimin istediğiniz noktasına tıklayın.',
    keyboardHint: 'Klavyede Enter ile yakınlaştırın, ok tuşlarıyla çizimde gezinin.',
    zoomIn: 'Çizimi 2 kat yakınlaştır',
    zoomOut: 'Yakınlaştırmayı kapat',
  },
  placement: {
    eyebrow: 'Sistemdeki yeri',
    caption: 'Temsilî akış çizimi: vurgulanan cihaz, geçiş şeridindeki yerini gösterir.',
  },
  specs: { summaryLabel: 'Teknik özet maddeleri', useCasesLabel: 'Kullanım alanı maddeleri' },
  related: {
    eyebrow: 'Donanım ailesi',
    title: 'Diğer donanım ürünleri',
    lead: 'Kiosk, kontrol kutusu, kabin ve kamera ekipmanları aynı sistem dilinde birlikte çalışır.',
    allLabel: 'Tüm donanımlar',
    allRoute: 'hardware-products',
    prevLabel: 'Önceki ürünler',
    nextLabel: 'Sonraki ürünler',
    cardAction: 'İncele',
  },
}

export const cardSizes: Partial<Record<HardwareSlug, { width: number; height: number }>> = {
  kiosk: { width: 672, height: 900 },
  'tir-kiosk': { width: 675, height: 900 },
  visiobox: { width: 900, height: 507 },
  'rack-kabin': { width: 833, height: 900 },
  'kamera-muhafaza': { width: 900, height: 450 },
  'kamera-montaj-kulesi': { width: 675, height: 900 },
}

export function cardImage(slug: HardwareSlug, alt: string): DetailImage {
  const size = cardSizes[slug] ?? { width: 600, height: 600 }
  return { src: `/img/products/cards/${slug}.webp`, avif: `/img/products/cards/${slug}.avif`, alt, ...size }
}

export function drawingImage(name: string, width: number, height: number, alt: string): DetailImage {
  return { src: `/img/products/drawings/${name}.webp`, avif: `/img/products/drawings/${name}.avif`, width, height, alt }
}

export type RelatedProduct = {
  slug: HardwareSlug
  route: string
  label: string
  description: string
  tag: string
  image?: DetailImage
}

export function relatedProductsFor(current: HardwareSlug): RelatedProduct[] {
  return hardwareMenu.flatMap((item) => {
    const slug = item.route.replace('hardware-products.', '')
    if (!isHardwareSlug(slug) || slug === current) return []
    return [
      {
        slug,
        route: item.route,

        label: products[slug].navLabel,
        description: item.description,
        tag: products[slug].copy.eyebrow,
        image: cardSizes[slug] ? cardImage(slug, '') : undefined,
      },
    ]
  })
}

export const switcherItems = productNav.map((item) => ({ slug: item.slug, route: item.route, label: item.navLabel }))

export function switcherItemsFor(current: HardwareSlug) {
  if (switcherItems.some((item) => item.slug === current)) return switcherItems
  const product = products[current]
  const extra = { slug: product.slug, route: product.route, label: product.navLabel }
  const after = switcherItems.findIndex((item) => products[item.slug].copy.eyebrow === product.copy.eyebrow)
  const at = after === -1 ? switcherItems.length : after + 1
  return [...switcherItems.slice(0, at), extra, ...switcherItems.slice(at)]
}
