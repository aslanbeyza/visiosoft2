import { hardwareMenu } from '../../data/siteNav.ts'
import { products } from '../../pages/HardwareProduct/products.ts'
import type { HardwareSlug } from '../../pages/HardwareProduct/products.ts'

/**
 * Tek ürün adı: sekme etiketi ve panel başlığı mega menüdeki standart addır (siteNav.ts hardwareMenu),
 * panel üst başlığı aynı kaydın kategori açıklamasıdır. Menüde bulunmazsa products.ts'e düşer.
 */
const navName = (slug: HardwareSlug) => {
  const { route, copy } = products[slug]
  const entry = hardwareMenu.find((link) => link.route === route)
  return { name: entry?.label ?? copy.name, category: entry?.description ?? copy.eyebrow }
}

/**
 * Dört ana ürün ve sahne ölçüleri. Görsel verisi public/img/home/products/flagships.json ile aynıdır;
 * kiosk kaydı kiosk-900 dosyasından (238x900, alfa>8 kutusu 4,4,235,896) doldurulmuştur.
 *
 * Sahne ölçek kuralı: sahnede aynı anda tek ürün görünür, bu yüzden ürünler gerçek ölçekle değil görsel ağırlıkla
 * eşitlenir (her biri sahne alanının ≈%9–18'i). Birim cqh = sahne yüksekliğinin %1'i; zemin 21 cqh'de olduğundan
 * 76 cqh üstü sahnenin tepesine değer.
 * - Kiosk 72 cqh (≈327 CSS px); kiosk-900 kaynağı CSS pikseli başına ≈2,75 piksel, 2x ekranda keskin.
 * - LED 64 cqh (≈300 CSS px); led-panel kaynağının keskin kaldığı sınır budur.
 * - Küçük çift (Visio Kamera, Visiobox) eşit genişlikte, 72 cqh (≈327 CSS px); kaynak CSS pikseli başına
 *   Visiobox ≈2,2, kamera muhafazası ≈2,4 piksel, 2x ekranda keskin.
 * Dikey yerleşim: ürün kutusunun ortası sahne altından `centre` cqh yukarıdadır, zemin `floor` altına inmez.
 * Uzun ürünler (kiosk, LED) tabandaki zeminde kalır; küçük çift sahnenin ortasına yükselir, zemin çizgisi ve
 * temas gölgesi ürünün altına birlikte kayar (yalnızca transform).
 */
export const STAGE = {
  /** Zemin çizgisinin sahne altından en düşük yüksekliği (cqh). */
  floor: 21,
  /** Ürün kutusu ortasının sahne altından yüksekliği (cqh). */
  centre: 53,
  kioskHeight: 72,
  ledHeight: 64,
  smallWidth: 72,
  /** Temas gölgesi: aynı kural her üründe; genişlik = ürün genişliği × 0,9, 22–60 cqh arası. */
  shadow: { factor: 0.9, min: 22, max: 60 },
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
  slug: HardwareSlug
  tab: string
  image: FlagshipImage
  /** Sekme küçük görseli; verilmezse sahne görseli kullanılır. */
  thumb?: string
  /** Ürünün sahnedeki yüksekliği ya da genişliği (cqh). */
  fit: { height: number } | { width: number }
  /** §4.3 akışında cihazın bulunduğu adımlar (1 tabanlı). */
  steps: number[]
}

export const flagships: Flagship[] = [
  {
    slug: 'kiosk',
    tab: navName('kiosk').name,
    image: {
      src: '/img/home/kiosk/kiosk-900.webp',
      avif: '/img/home/kiosk/kiosk-900.avif',
      width: 238,
      height: 900,
      bbox: [4, 4, 235, 896],
      alt: 'Visiosoft insansız çıkış ödeme kiosku: kırmızı ön panel, ekran, temassız kart okuyucu ve beyaz kolon',
    },
    thumb: '/img/home/kiosk/kiosk-620.webp',
    fit: { height: STAGE.kioskHeight },
    steps: [4],
  },
  {
    slug: 'kamera-muhafaza',
    // Ürün bir plaka tanıma kamerası değil, kamerayı koruyan dış ortam muhafazasıdır; üst başlık bunu söyler.
    tab: navName('kamera-muhafaza').name,
    image: {
      src: '/img/home/products/kamera-muhafaza.webp',
      avif: '/img/home/products/kamera-muhafaza.avif',
      width: 804,
      height: 352,
      bbox: [10, 10, 794, 342],
      alt: 'Visio Kamera: plaka tanıma kamerası için dış ortam muhafazası, yandan görünüm',
    },
    fit: { width: STAGE.smallWidth },
    steps: [1, 2],
  },
  {
    slug: 'visiobox',
    tab: navName('visiobox').name,
    image: {
      src: '/img/home/products/visiobox.webp',
      avif: '/img/home/products/visiobox.avif',
      width: 744,
      height: 549,
      bbox: [10, 10, 734, 539],
      alt: 'Visiobox kontrol kutusu, üstten açılı görünüm',
    },
    fit: { width: STAGE.smallWidth },
    steps: [3, 5],
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
    steps: [1],
  },
]

/**
 * Panel metni: üst başlık menü kategorisi, başlık sekmeyle aynı standart ad (siteNav.ts hardwareMenu);
 * açıklama, en fazla üç özellik ve yalnızca doğrulanmış ölçü products.ts'ten (salt okunur).
 */
export const flagshipInfo = (slug: HardwareSlug) => {
  const { copy, route } = products[slug]
  const { name, category } = navName(slug)
  return {
    eyebrow: category,
    name,
    lead: copy.lead,
    features: copy.features.slice(0, 3).map((feature) => feature.title),
    dimensions: copy.dimensions ? copy.dimensions.replace(/mm/g, '').split('×').map((part) => part.trim()).join(' × ') : null,
    route,
  }
}
