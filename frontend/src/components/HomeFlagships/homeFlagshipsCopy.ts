/** Ana sayfa donanım vitrini metinleri. */
export const homeFlagshipsCopy = {
  eyebrow: 'Donanım çözümleri',
  title: 'Sahada çalışan, yazılımımızla birlikte geliştirilen ürünler.',
  lead: 'Otoparkınız için gereken donanımları tek sistem üzerinden yönetin.',
  tablistLabel: 'Ana donanım ürünleri',
  carouselLabel: 'Donanım ürün vitrini',
  previous: 'Önceki ürün',
  next: 'Sonraki ürün',
  counterLabel: (current: number, total: number) => `Ürün ${current} / ${total}`,
  featuresLabel: 'Öne çıkanlar',
  more: 'Ürünü İncele',
  all: 'Tüm donanımları görün (7 ürün)',
  swipeHint: 'Ürünler arasında geçmek için sağa ya da sola kaydırın.',
}

export type FlagshipShowcase = {
  category: string
  name: string
  summary: string
  tags: readonly [string, string, string]
}

/** Vitrin kartı: kısa B2B özet ve üç etiket. Rota flagships.ts üzerinden gelir. */
export const flagshipShowcase: Record<'kiosk' | 'kamera-muhafaza' | 'visiobox' | 'ledli-reklam-paneli', FlagshipShowcase> = {
  kiosk: {
    category: 'Çıkışta ödeme',
    name: 'Ödeme Kiosku',
    summary: 'Plakayı otomatik tanır, ücreti hesaplar ve temassız ödeme ile çıkış sürecini hızlandırır.',
    tags: ['Temassız ödeme', 'Plaka eşleştirme', 'Merkezi yönetim'],
  },
  'kamera-muhafaza': {
    category: 'Plaka algılama',
    name: 'Visio Kamera',
    summary: 'Plaka tanıma kamerasını dış koşullara karşı korur; giriş ve çıkış noktalarında sağlam, servis edilebilir bir muhafaza sağlar.',
    tags: ['Dış ortam koruması', 'Ayarlanabilir montaj', 'Servis erişimi'],
  },
  visiobox: {
    category: 'Şerit kontrolü',
    name: 'Visiobox',
    summary: 'Bariyer ve saha cihazlarını tek kutuda toplar; otopark kontrolünü sade, düzenli ve 7/24 çalışır hale getirir.',
    tags: ['Bariyer kontrolü', 'Modüler yapı', 'Kolay servis'],
  },
  'ledli-reklam-paneli': {
    category: 'Sürücü bilgisi',
    name: 'LED Bilgilendirme Paneli',
    summary: 'Girişlerde ücret, yönlendirme ve duyuru mesajlarını yüksek görünürlükle sürücüye ulaştırır.',
    tags: ['Yüksek görünürlük', 'Dinamik mesaj', 'İç ve dış ortam'],
  },
}
