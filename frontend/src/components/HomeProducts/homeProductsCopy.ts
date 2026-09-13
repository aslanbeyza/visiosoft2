import type { HardwareSlug } from '../../pages/HardwareProduct/products.ts'

export type HomeProductCard = {
  slug: Exclude<HardwareSlug, 'ledli-reklam-paneli' | 'togerbox'>
  /** Izgaradaki alan adı (CSS grid-template-areas). */
  area: 'kiosk' | 'tir' | 'box' | 'rack' | 'housing' | 'tower'
  width: number
  height: number
  alt: string
  /** Yalnızca doğrulanmış ölçüler (mm). */
  dimensions?: string
}

const card = (slug: HomeProductCard['slug']) => ({
  src: `/img/products/cards/${slug}.webp`,
  avif: `/img/products/cards/${slug}.avif`,
})

export const productImage = card

export const homeProductsCopy = {
  eyebrow: 'Donanım',
  title: 'Sahada çalışan donanım ailesi',
  lead: 'Kiosk, kontrol kutusu, kabin ve kamera ekipmanları aynı sistem dilinde çalışır.',
  inspect: 'İncele',
  dimensionsLabel: 'Ölçüler (G × Y × D)',
  featuresLabel: 'Öne çıkanlar',
  more: {
    eyebrow: 'Donanım kataloğu',
    title: 'Ledli reklam paneli dahil tüm donanımlar',
    description: 'Her ürünün teknik özetini ve kullanım alanlarını kendi sayfasında inceleyin.',
    primary: 'Tüm donanımlar',
    led: 'Ledli Reklam Paneli',
  },
  cards: [
    {
      slug: 'kiosk',
      area: 'kiosk',
      width: 238,
      height: 900,
      alt: 'İnsansız çıkış ödeme kiosku; ön paneli kurumsal giydirmeli örnek',
      dimensions: '300 × 1800 × 297,5 mm',
    },
    {
      slug: 'tir-kiosk',
      area: 'tir',
      width: 433,
      height: 577,
      alt: 'İki ödeme paneli bulunan TIR kiosk',
      dimensions: '300 × 2455 × 430 mm',
    },
    { slug: 'visiobox', area: 'box', width: 736, height: 541, alt: 'Visiobox kontrol kutusu' },
    {
      slug: 'rack-kabin',
      area: 'rack',
      width: 682,
      height: 900,
      alt: 'Visio Rack Kabin; kapağı kurumsal giydirmeli örnek',
      dimensions: '485 × 385 × 350 mm',
    },
    { slug: 'kamera-muhafaza', area: 'housing', width: 794, height: 397, alt: 'Güneşlikli dış ortam kamera muhafazası' },
    { slug: 'kamera-montaj-kulesi', area: 'tower', width: 433, height: 577, alt: 'Visio kamera montaj kulesi' },
  ] satisfies HomeProductCard[],
}
