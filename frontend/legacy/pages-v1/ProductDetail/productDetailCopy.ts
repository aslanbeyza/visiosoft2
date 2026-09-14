import { hardwareMenu } from '../../data/siteNav.ts'
import { isHardwareSlug, productNav, products } from '../HardwareProduct/products.ts'
import type { HardwareSlug, ProductCopy } from '../HardwareProduct/products.ts'

/**
 * Ürün detay şablonunun verisi. Faz 1'de yalnızca kiosk tanımlı; diğer ürünler aynı yapıya
 * yeni bir kayıt eklenerek bu şablona taşınır.
 */

export type DetailImage = {
  src: string
  avif?: string
  width: number
  height: number
  alt: string
}

/** Görsel kutusu içindeki yüzde konum (0-100). */
export type DimensionSpan = { from: number; to: number }

/**
 * span: ölçü çizgisinin görsel kutusundaki başlangıç/bitişi (yüzde).
 * edges: uzatma çizgilerinin ürün kenarına değdiği nokta; yükseklikte x, genişlikte y (yüzde).
 */
export type HeroDimension = { label: string; span: DimensionSpan; edges: [number, number] }

export type HeroDimensions = {
  height: HeroDimension
  width: HeroDimension
}

export type KeyFigure = {
  id: string
  label: string
  /** Sayısal değer; sayaçla gösterilir. */
  value?: number
  decimals?: number
  unit?: string
  /** Sayısal olmayan statik değer. */
  text?: string
  srText?: string
}

export type ProcessStep = {
  id: string
  icon: 'camera' | 'screen' | 'card' | 'barrier'
  title: string
  description: string
}

export type RelatedProduct = {
  slug: HardwareSlug
  route: string
  label: string
  description: string
  tag: string
  image?: DetailImage
}

export type ProductDetailData = {
  slug: HardwareSlug
  route: string
  navLabel: string
  copy: ProductCopy
  seo: { title: string; description: string }
  breadcrumb: { home: string; category: string; categoryRoute: string }
  hero: {
    image: DetailImage
    dimensions?: HeroDimensions
    note?: string
  }
  figures: { label: string; items: KeyFigure[]; drawingLink?: string }
  /** Sabitlenmiş yakınlaşma bölümü; şimdilik yalnızca kiosk için hazır bileşen var. */
  zoom?: 'kiosk'
  features: { eyebrow: string; title: string }
  process?: {
    eyebrow: string
    title: string
    lead: string
    steps: ProcessStep[]
    image: DetailImage & { avifSet: string; webpSet: string }
    caption: string
  }
  drawing?: {
    id: string
    eyebrow: string
    title: string
    text: string
    image: DetailImage
    note: string
    openLabel: string
    dialogTitle: string
    zoomHint: string
    keyboardHint: string
    zoomInLabel: string
    zoomOutLabel: string
    closeLabel: string
    dimensions: { label: string; value: string }[]
  }
  specs: {
    summaryTitle: string
    useCasesTitle: string
  }
  related: {
    eyebrow: string
    title: string
    lead: string
    allLabel: string
    allRoute: string
    prevLabel: string
    nextLabel: string
    cardAction: string
  }
  cta: { title: string; description: string; primary: string; secondary: string }
  actions: { discovery: string; quote: string }
}

/** Arka planı ayrılmış ürün kartı görsellerinin gerçek ölçüleri. */
const cardSizes: Partial<Record<HardwareSlug, { width: number; height: number }>> = {
  kiosk: { width: 238, height: 900 },
  'tir-kiosk': { width: 433, height: 577 },
  visiobox: { width: 736, height: 541 },
  'rack-kabin': { width: 682, height: 900 },
  'kamera-muhafaza': { width: 794, height: 397 },
  'kamera-montaj-kulesi': { width: 433, height: 577 },
}

function slugFromRoute(route: string): HardwareSlug | null {
  const slug = route.replace('hardware-products.', '')
  return isHardwareSlug(slug) ? slug : null
}

/** Donanım menüsündeki sıra korunarak, mevcut ürün dışındaki kartlar. */
export function relatedProductsFor(current: HardwareSlug): RelatedProduct[] {
  return hardwareMenu.flatMap((item) => {
    const slug = slugFromRoute(item.route)
    if (!slug || slug === current) return []
    const size = cardSizes[slug]
    const product = products[slug]
    return [
      {
        slug,
        route: item.route,
        label: item.label,
        description: item.description,
        tag: product.copy.eyebrow,
        image: size
          ? {
              src: `/img/products/cards/${slug}.webp`,
              avif: `/img/products/cards/${slug}.avif`,
              width: size.width,
              height: size.height,
              alt: '',
            }
          : undefined,
      },
    ]
  })
}

export const switcherItems = productNav.map((item) => ({ slug: item.slug, route: item.route, label: item.navLabel }))

export const switcherCopy = {
  label: 'Donanım ürünleri',
  heading: 'Donanım',
  all: 'Tüm donanımlar',
}

const kioskProduct = products.kiosk
const kiosk = kioskProduct.copy

const kioskDetail: ProductDetailData = {
  slug: 'kiosk',
  route: kioskProduct.route,
  navLabel: kioskProduct.navLabel,
  copy: kiosk,
  seo: {
    title: 'İnsansız Çıkış Ödeme Kiosk | Visiosoft',
    description:
      'İnsansız çıkış ödeme kiosku: plaka girişi olmadan temassız ödeme, HGS + POS + QR tahsilat ve uzaktan 7/24 takip.',
  },
  breadcrumb: { home: 'Ana sayfa', category: 'Donanım', categoryRoute: 'hardware-products' },
  hero: {
    image: {
      src: '/img/products/kiosk-2064.webp',
      avif: '/img/products/kiosk-2064.avif',
      width: 545,
      height: 2064,
      alt: 'İnsansız çıkış ödeme kiosku: kırmızı ön panelde dokunmatik ekran ve temassız kart okuyucu, beyaz kolon ve havalandırmalı taban',
    },
    // Yüzdeler görselin kendi kutusuna göre: kafa üstü %0,5, taban altı %99,5; ön panel %23,7 ile %95,6 arası.
    dimensions: {
      height: { label: '1800 mm', span: { from: 0.5, to: 99.5 }, edges: [24, 1] },
      width: { label: '300 mm', span: { from: 23.7, to: 95.6 }, edges: [0.8, 1.6] },
    },
    note: 'Görseldeki ön panel, kurumsal giydirme örneğidir.',
  },
  figures: {
    label: 'Temel ölçüler ve ödeme kanalları',
    items: [
      { id: 'width', label: 'Genişlik', value: 300, unit: 'mm' },
      { id: 'height', label: 'Yükseklik', value: 1800, unit: 'mm' },
      { id: 'depth', label: 'Derinlik', value: 297.5, decimals: 1, unit: 'mm' },
      { id: 'channels', label: 'Ödeme kanalları', text: 'HGS · POS · QR', srText: 'HGS, POS ve QR' },
    ],
    drawingLink: 'Teknik çizimi inceleyin',
  },
  zoom: 'kiosk',
  features: { eyebrow: kiosk.highlights_title, title: kiosk.highlights_desc },
  process: {
    eyebrow: 'Sahada nasıl çalışır?',
    title: 'Plaka girişi olmadan çıkışta ödeme',
    lead: 'Sürücü çıkışa yaklaştığı andan bariyer açılana kadar tahsilat dört adımda tamamlanır.',
    steps: [
      { id: 'plate', icon: 'camera', title: 'Plaka okunur', description: 'Çıkışa yaklaşan aracın plakası kamera ile tanınır.' },
      { id: 'amount', icon: 'screen', title: 'Tutar ekranda görünür', description: 'Kiosk, araca ait ücreti sürücüye gösterir.' },
      { id: 'payment', icon: 'card', title: 'Ödeme alınır', description: 'HGS, banka kartı veya QR ile tahsilat tamamlanır.' },
      { id: 'barrier', icon: 'barrier', title: 'Bariyer açılır', description: 'Ödemesi tamamlanan araç için geçiş açılır.' },
    ],
    image: {
      src: '/img/showcase/field-exit-1280.webp',
      avif: '/img/showcase/field-exit-1280.avif',
      avifSet: '/img/showcase/field-exit-720.avif 720w, /img/showcase/field-exit-1280.avif 1280w',
      webpSet: '/img/showcase/field-exit-720.webp 720w, /img/showcase/field-exit-1280.webp 1280w',
      width: 1280,
      height: 1016,
      alt: 'Otopark çıkış şeridi: direkteki plaka tanıma kamerası, LED bilgi ekranı ve bariyer kolu',
    },
    caption: 'Çıkış şeridi: plaka tanıma kamerası, LED bilgi ekranı ve bariyer kolu.',
  },
  drawing: {
    id: 'teknik-cizim',
    eyebrow: 'Ölçüler',
    title: 'Teknik çizim',
    text: 'Yan, ön ve arka görünüşler ile izometrik görünümler tek paftada yer alır. Çizimi büyütüp ölçü detaylarını yakından inceleyebilirsiniz.',
    image: {
      src: kioskProduct.technicalImage ?? '/parking-product-3d/kiosk/kiosk.png',
      width: 1233,
      height: 860,
      alt: 'İnsansız çıkış ödeme kioskunun teknik çizimi: yan, ön ve arka görünüşler, 300 mm genişlik, 297,5 mm derinlik ve 1800 mm yükseklik ölçüleri',
    },
    note: 'Çizimdeki ön panel logosu kurumsal giydirme örneğidir.',
    openLabel: 'Çizimi büyüt',
    dialogTitle: 'Teknik çizim: İnsansız Çıkış Ödeme Kiosk',
    zoomHint: 'Yakınlaştırmak için çizimin istediğiniz noktasına tıklayın.',
    keyboardHint: 'Klavyede Enter ile yakınlaştırın, ok tuşlarıyla çizimde gezinin.',
    zoomInLabel: 'Çizimi 2 kat yakınlaştır',
    zoomOutLabel: 'Yakınlaştırmayı kapat',
    closeLabel: kiosk.close,
    dimensions: [
      { label: 'Genişlik', value: '300 mm' },
      { label: 'Yükseklik', value: '1800 mm' },
      { label: 'Derinlik', value: '297,5 mm' },
    ],
  },
  specs: { summaryTitle: kiosk.tech_summary_title, useCasesTitle: kiosk.use_cases_title },
  related: {
    eyebrow: 'Donanım ailesi',
    title: 'Diğer donanım ürünleri',
    lead: 'Kontrol kutusu, kabin ve kamera ekipmanları kiosk ile aynı sistem dilinde çalışır.',
    allLabel: 'Tüm donanımlar',
    allRoute: 'hardware-products',
    prevLabel: 'Önceki ürünler',
    nextLabel: 'Sonraki ürünler',
    cardAction: 'İncele',
  },
  cta: { title: kiosk.cta_title, description: kiosk.cta_desc, primary: kiosk.get_quote, secondary: kiosk.request_discovery },
  actions: { discovery: kiosk.request_discovery, quote: kiosk.get_quote },
}

export const productDetails = {
  kiosk: kioskDetail,
} satisfies Partial<Record<HardwareSlug, ProductDetailData>>

export type ProductDetailSlug = keyof typeof productDetails
