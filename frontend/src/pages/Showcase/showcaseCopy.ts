// Vitrin sayfalarının ortak metinleri (yalnızca TR). EN/RU sürümleri legacy/pages-v1/Showcase altında.
export type ShowcaseRoute = 'kus-bakisi' | 'mobil-abonelik' | 'designer-tool' | 'low-confidence'

export type ShowcaseCopy = {
  eyebrow: string
  title: string
  lead: string
  paragraphs: string[]
  images: { src: string; alt: string }[]
  cta: string
  ctaRoute: string
  /** Hero'daki ikincil bağlantının hedef bölümü. */
  jump: { id: string; label: string }
  ctaBand: { eyebrow: string; title: string; description: string; secondary: { label: string; route: string } }
  seoTitle: string
  seoDescription: string
  ogImage: string
}

export const showcaseShared = {
  home: 'Ana sayfa',
  software: 'Park Yazılım',
  softwareCta: 'Yazılım ürünlerini inceleyin',
}

export const showcaseCopy: Record<ShowcaseRoute, ShowcaseCopy> = {
  'kus-bakisi': {
    eyebrow: 'Zone canlı harita',
    title: 'Kuş Bakışı Yönetim',
    lead: 'Tüm operasyonunuzu tek bir ekrandan izleyin. Anlık veriler, canlı kameralar ve detaylı raporlar parmaklarınızın ucunda.',
    paragraphs: ['Tüm otopark operasyonlarınızı tek bir ekrandan, kuş bakışı yönetin. Anlık doluluk, gelir ve arıza takibi.'],
    images: [{ src: '/img/pages/canli-harita-crop.webp', alt: 'Zone canlı harita ekranı' }],
    cta: 'Hemen Teklif Alın',
    ctaRoute: 'quote.index',
    jump: { id: 'canli-harita', label: 'Ekranı yakından görün' },
    ctaBand: {
      eyebrow: 'Kuş bakışı yönetim',
      title: 'Sahanızı tek ekrandan yönetmeye başlayın.',
      description: 'Otoparkınıza uygun kurulumu birlikte planlayalım ve teklifinizi hazırlayalım.',
      secondary: { label: showcaseShared.softwareCta, route: 'software-products' },
    },
    seoTitle: 'Kuş Bakışı Otopark Yönetimi - Visiosoft',
    seoDescription: 'Tüm otopark operasyonlarınızı tek bir ekrandan, kuş bakışı yönetin. Anlık doluluk, gelir ve arıza takibi.',
    ogImage: '/img/pages/canli-harita-crop.webp',
  },
  'mobil-abonelik': {
    eyebrow: 'ParkBiz mobil',
    title: 'Mobil Uygulama ile Park Aboneliği',
    lead: 'ParkBiz uygulamasıyla saniyeler içinde plaka ekleyin, paket seçin ve aboneliğinizi tamamlayın.',
    paragraphs: ['ParkBiz uygulamasıyla saniyeler içinde plaka ekleyin, paket seçin ve aboneliğinizi tamamlayın.'],
    images: [{ src: '/img/parkbiz/icon.png', alt: 'ParkBiz mobil uygulaması' }],
    cta: 'Hemen Teklif Alın',
    ctaRoute: 'quote.index',
    jump: { id: 'nasil-yapilir', label: 'Nasıl yapılır?' },
    ctaBand: {
      eyebrow: 'ParkBiz',
      title: 'Aboneliği ParkBiz’e taşıyın.',
      description: 'ParkBiz abonelik ve borç ödeme akışını otoparkınıza uyarlayalım.',
      secondary: { label: showcaseShared.softwareCta, route: 'software-products' },
    },
    seoTitle: 'Mobil Uygulama ile Park Aboneliği Nasıl Yapılır? - Visiosoft',
    seoDescription: 'ParkBiz mobil uygulaması üzerinden kolayca park aboneliği oluşturma rehberi.',
    ogImage: '/img/parkbiz/icon.png',
  },
  'designer-tool': {
    eyebrow: 'Saha kurulum aracı',
    title: 'Designer Kuş Bakışı Çizim Aracı',
    lead: 'Bu araç, kuş bakışı otopark yönetimi kurulumunu sağlamak ve otoparkınızı dijital ortamda en verimli şekilde tasarlamak için geliştirilmiştir.',
    paragraphs: [
      'Bu araç kuş bakışı araç takibi için gerekli saha kurulum ve yönetim yazılımıdır. Bu yazılım sayesinde araç slotları çizilir ve panelden kolayca yönetilir. Kamera açıları değiştiğinde kalibrasyon yapmak çok kolaydır.',
    ],
    images: [{ src: '/img/pages/designer-ekran-crop.webp', alt: 'Designer çizim aracı ekranı' }],
    cta: 'Bilgi Alın',
    ctaRoute: 'quote.index',
    jump: { id: 'cizim', label: 'Çizimi izleyin' },
    ctaBand: {
      eyebrow: 'Designer',
      title: 'Sahanızın dijital planını birlikte çizelim.',
      description: 'Slotlarınızı çizip kamera kalibrasyonunu tamamlayarak kuş bakışı takibi devreye alalım.',
      secondary: { label: showcaseShared.softwareCta, route: 'software-products' },
    },
    seoTitle: 'Designer Kuş Bakışı Çizim Aracı - Visiosoft',
    seoDescription: 'Kuş bakışı otopark yönetimi kurulumu için geliştirilmiş çizim aracı.',
    ogImage: '/img/pages/designer-ekran-crop.webp',
  },
  'low-confidence': {
    eyebrow: 'İnsan onaylı PTS',
    title: 'Şansa Bırakmayız',
    lead: 'Yapay zeka destekli PTS okuması herhangi bir nedenle düşük güven oyu (confidence) aldığında, geçiş gerçek bir insanın onayına düşer.',
    paragraphs: [
      "Geçişleri merkezden yönetiyor, işimizi şansa bırakmıyoruz: yapay zeka destekli PTS okumalarını sürekli kontrol ediyoruz. Sistem emin olamadığında kalan yaklaşık %1'lik düşük confidence geçişler, operatör onay sürecine düşer ve gerçek insan tarafından doğrulanır. Bu çift katmanlı yapı, hem otomasyon hızını korur hem de tahsilat ve güvenlik doğruluğunu en üst seviyede tutar.",
    ],
    images: [{ src: '/img/pages/onay-ekrani-crop.webp', alt: 'Düşük güvenli okuma için onay ekranı' }],
    cta: 'Hemen Teklif Alın',
    ctaRoute: 'quote.index',
    jump: { id: 'onay-akisi', label: 'Onay akışını görün' },
    ctaBand: {
      eyebrow: 'Şansa bırakmayız',
      title: 'Geçişleri şansa bırakmayın.',
      description: 'Yapay zeka destekli PTS okumasını insan onayıyla birleştiren yapıyı otoparkınız için kurgulayalım.',
      secondary: { label: 'Sistemi İnceleyin', route: 'alpr.index' },
    },
    seoTitle: 'Şansa Bırakmayız - Visiosoft',
    seoDescription: 'Yapay zeka destekli PTS okuması düşük güven oyu aldığında devreye giren insan onay mekanizması.',
    ogImage: '/img/pages/onay-ekrani-crop.webp',
  },
}

export const showcaseRelated = {
  eyebrow: 'Park Yazılım',
  title: 'Yazılımın diğer parçalarını keşfedin.',
  meta: 'Vitrin',
  items: {
    'kus-bakisi': { title: 'Kuş Bakışı Yönetim', description: 'Tüm sahayı tek ekrandan izleyin.' },
    'mobil-abonelik': { title: 'Mobil Abonelik', description: 'Park aboneliğini mobil uygulama üzerinden tamamlayın.' },
    'designer-tool': { title: 'Designer Çizim Aracı', description: 'Kuş bakışı takip için slot çizimi ve kolay kalibrasyon.' },
    'low-confidence': { title: 'Şansa Bırakmayız', description: 'Düşük güvenli PTS okumaları gerçek insan tarafından doğrulanır.' },
  } satisfies Record<ShowcaseRoute, { title: string; description: string }>,
}

export const isShowcaseRoute =(routeName: string): routeName is ShowcaseRoute => routeName in showcaseCopy

export function showcaseFor(routeName: string, _locale?: string): ShowcaseCopy | undefined {
  return isShowcaseRoute(routeName) ? showcaseCopy[routeName] : undefined
}
