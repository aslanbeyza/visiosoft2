
export type SectorIconId = 'street' | 'mall' | 'hospital' | 'campus' | 'residence' | 'truck'

export type SectorImage = {
  src: string
  width: number
  height: number
}

export type SectorItem = {
  icon: SectorIconId
  title: string
  description: string
  refs?: string
  route: string

  destination: string
  image: SectorImage
}

export const homeSectorsCopy = {
  eyebrow: 'Kullanım alanları',
  title: 'Aynı altyapı, farklı işletmeler.',
  refsLabel: 'Referanslar',
  more: 'İncele',

  destinationSuffix: 'sayfası',
  items: [
    {
      icon: 'street',
      title: 'Belediye ve yol üstü',
      description: 'Yol üstü parklanma, işgaliye ve park cezası; kamera ve HGS ile personelsiz tahsilat.',
      refs: 'Bakırköy, Başakşehir, Sarıyer ve 6 belediye daha',
      route: 'on-street',
      destination: 'Yol Üstü Parklandırma',
      image: { src: '/img/home/sectors/street.webp', width: 1400, height: 934 },
    },
    {
      icon: 'mall',
      title: 'AVM, otel ve sosyal tesisler',
      description: 'Yoğun saatlerde kuyruksuz plaka geçişi, kioskta ya da HGS ile ödeme.',
      refs: 'Metropark AVM, Crowne Plaza, İstanbul Akvaryum',
      route: 'end-to-end',
      destination: 'Uçtan Uca Sistem',
      image: { src: '/img/home/sectors/mall.webp', width: 1400, height: 934 },
    },
    {
      icon: 'hospital',
      title: 'Hastane ve kampüsler',
      description: 'Ziyaretçi, personel ve abone araçlar ayrı kurallarla yönetilir.',
      route: 'hgs',
      destination: 'HGS Ödeme Sistemi',
      image: { src: '/img/home/sectors/hospital.webp', width: 1400, height: 934 },
    },
    {
      icon: 'campus',
      title: 'Üniversite ve teknoparklar',
      description: 'Personel abonelikleri ve misafir geçişleri tek panelde.',
      refs: 'YTÜ, Yıldız Teknopark, Marmara Teknokent',
      route: 'alpr.index',
      destination: 'Plaka Tanıma',
      image: { src: '/img/home/sectors/campus.webp', width: 1400, height: 1050 },
    },
    {
      icon: 'residence',
      title: 'Site ve rezidanslar',
      description: 'Sakin, misafir ve personel araçları plakadan ayrılır; yönetim her yerden izler.',
      route: 'website-pricing',
      destination: 'Site Otopark Yönetimi',
      image: { src: '/img/home/sectors/residence.webp', width: 1400, height: 934 },
    },
    {
      icon: 'truck',
      title: 'TIR ve lojistik alanları',
      description: 'Liman, gümrük ve depo alanlarında çekici ile dorseyi ayıran yüksek kiosk.',
      route: 'hardware-products.tir-kiosk',
      destination: 'TIR Ödeme Kiosku',
      image: { src: '/img/home/sectors/truck.webp', width: 1400, height: 1400 },
    },
  ] satisfies SectorItem[],
} as const
