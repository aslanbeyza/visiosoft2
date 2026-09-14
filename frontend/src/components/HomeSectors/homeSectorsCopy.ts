/** Ana sayfa 4.5 — Kullanım alanları metinleri (HOME3.md §4.5, değiştirmeden). */
export type SectorIconId = 'street' | 'mall' | 'hospital' | 'campus' | 'residence' | 'truck'

export type SectorItem = {
  icon: SectorIconId
  title: string
  description: string
  refs?: string
  route: string
  /** Hedef sayfanın menüdeki adı; bağlantının erişilebilir adına eklenir (başlık ile hedef farklı olabilir). */
  destination: string
}

export const homeSectorsCopy = {
  eyebrow: 'Kullanım alanları',
  title: 'Aynı altyapı, farklı işletmeler.',
  refsLabel: 'Referanslar',
  more: 'İncele',
  /** Ekran okuyucuda "Başlık — Hedef sayfası" biçimi. */
  destinationSuffix: 'sayfası',
  items: [
    {
      icon: 'street',
      title: 'Belediye ve yol üstü',
      description: 'Yol üstü parklanma, işgaliye ve park cezası; kamera ve HGS ile personelsiz tahsilat.',
      refs: 'Bakırköy, Başakşehir, Sarıyer ve 6 belediye daha',
      route: 'on-street',
      destination: 'Yol Üstü Parklandırma',
    },
    {
      icon: 'mall',
      title: 'AVM, otel ve sosyal tesisler',
      description: 'Yoğun saatlerde kuyruksuz plaka geçişi, kioskta ya da HGS ile ödeme.',
      refs: 'Metropark AVM, Crowne Plaza, İstanbul Akvaryum',
      route: 'end-to-end',
      destination: 'Uçtan Uca Sistem',
    },
    {
      icon: 'hospital',
      title: 'Hastane ve kampüsler',
      description: 'Ziyaretçi, personel ve abone araçlar ayrı kurallarla yönetilir.',
      route: 'hgs',
      destination: 'HGS Ödeme Sistemi',
    },
    {
      icon: 'campus',
      title: 'Üniversite ve teknoparklar',
      description: 'Personel abonelikleri ve misafir geçişleri tek panelde.',
      refs: 'YTÜ, Yıldız Teknopark, Marmara Teknokent',
      route: 'alpr.index',
      destination: 'Plaka Tanıma',
    },
    {
      icon: 'residence',
      title: 'Site ve rezidanslar',
      description: 'Sakin, misafir ve personel araçları plakadan ayrılır; yönetim her yerden izler.',
      route: 'website-pricing',
      destination: 'Site Otopark Yönetimi',
    },
    {
      icon: 'truck',
      title: 'TIR ve lojistik alanları',
      description: 'Liman, gümrük ve depo alanlarında çekici ile dorseyi ayıran yüksek kiosk.',
      route: 'hardware-products.tir-kiosk',
      destination: 'TIR Ödeme Kiosku',
    },
  ] satisfies SectorItem[],
} as const
