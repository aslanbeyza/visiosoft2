/** /yazilim-urunleri sayfasının Türkçe metinleri ve görsel künyeleri (mevcut site metinlerinden derlenmiştir). */
export type HubImage = {
  src: string
  avif?: string
  width: number
  height: number
  alt: string
}

const sw = (name: string, width: number, height: number, alt: string): HubImage => ({
  src: `/img/software/${name}.webp`,
  avif: `/img/software/${name}.avif`,
  width,
  height,
  alt,
})

export const hubImages = {
  liveMap: sw('live-map', 1600, 922, 'Zone canlı harita: otoparkın kuş bakışı planı, park yerleri, plakalar ve kamera konumları'),
  sessions: sw('zone-sessions', 1024, 576, 'Zone oturumlar tablosu: plaka, giriş ve çıkış saati, süre, ücret ve ödeme durumu'),
  sessionsTable: sw('sessions-table', 996, 436, 'Zone oturumlar tablosu: plaka, giriş ve çıkış saati, süre, ücret ve ödeme durumu'),
  panelMenus: sw('panel-menus', 960, 440, 'Zone yönetim paneli: HGS onayı, oturumlar, plaka fotoğrafları, beyaz ve kara liste menüleri'),
  panelWide: sw('zone-panel', 1600, 540, 'Zone yönetim paneli: temel otopark, finansal, abonelik ve teknik modüller'),
  mapDetail: sw('map-detail', 900, 560, 'Zone canlı haritadan yakın görünüm: park yerleri ve kamera ikonları'),
  phoneFrame: { src: '/assets/images/phone-img.png', webp: '/img/software/phone-frame.webp', avif: '/img/software/phone-frame.avif', width: 726, height: 1444 },
}

export const hubSeo = {
  title: 'Yazılım Ürünleri - Visiosoft',
  description:
    'Bulut tabanlı otopark yönetim yazılımı. Plaka Tanıma Sistemi, uzaktan izleme, gelir yönetimi ve mobil uygulama çözümleri.',
}

export const heroCopy = {
  eyebrow: 'Park Yazılım',
  title: ['Otoparkınızı', 'telefondan yönetin.'],
  lead: 'Güvenli, hızlı ve anlık takip hep elinizde. Oturumlar, tahsilat, abonelik ve cihazlar Zone panelinde; ödeme ve abonelik müşterilerinizin cebinde.',
  primary: { label: 'Teklif Al', route: 'quote.index' },
  secondary: { label: 'Geliştiriciler', route: 'developers' },
  lineupLabel: 'ParkBiz mobil uygulaması: alt sekmelerle gezilebilir demo',
  tablistLabel: 'ParkBiz alt sekmeleri',
}

export const subNavItems = [
  { id: 'zone', label: 'Zone paneli' },
  { id: 'canli-izleme', label: 'Canlı izleme' },
]

export const zoneCopy = {
  eyebrow: 'Zone',
  title: 'Zone, üç karede.',
  lead: 'Oturumlar, tahsilat, abonelik ve cihazlar merkezi panelden yönetilir; sahadaki durum anlık izlenir.',
  listLabel: 'Zone ekranları',
  items: [
    {
      id: 'harita',
      eyebrow: 'Canlı harita',
      title: 'Sahayı kuş bakışı izleyin',
      description:
        'Park alanları, kameralar ve plakalar sahanın planı üzerinde görünür. Operasyon ekibi tüm sahayı tek ekrandan uzaktan izler.',
      bullets: ['Kuş bakışı canlı harita', 'Uzaktan 7/24 takip', 'Sesli yönlendirme ile sürücü desteği'],
      image: hubImages.liveMap,
      caption: 'Zone canlı harita ekranı (demo verisi)',
    },
    {
      id: 'oturumlar',
      eyebrow: 'Oturumlar',
      title: 'Her araç bir oturum',
      description:
        'Giriş ve çıkış saati, süre, ücret ve ödeme durumu aynı tabloda tutulur. Plakayla arayın; ödenen ve ödenmeyen oturumları ayırın.',
      bullets: ['Oturum ve ödeme takibi', 'HGS + POS + QR tahsilat', 'Beyaz ve kara liste'],
      image: hubImages.sessionsTable,
      caption: 'Zone oturumlar ekranı (demo verisi)',
    },
    {
      id: 'panel',
      eyebrow: 'Yönetim paneli',
      title: 'Tek panel, dört modül',
      description:
        'Temel otopark işlemleri, finans, abonelik ve teknik ayarlar aynı panelden yönetilir. Raporlar ve resmî entegrasyonlar merkezi olarak yürür.',
      bullets: ['Gelir, oturum ve abonelik raporları', 'e-fatura ve e-arşiv (GİB)', 'Kamera, bariyer ve cihaz ayarları'],
      image: hubImages.panelMenus,
      caption: 'Zone yönetim paneli menüleri',
    },
  ],
}

/**
 * Gerçek ParkBiz uygulama ekranları (public/img/app/screens.json). Çerçeveli sürüm 780 × 1692; çentik ve ana ekran
 * çizgisi için üst/alt beyaz bantlar içerir ve telefon çerçevesinin ekran alanına (623 × 1351) birebir oturur.
 */
const appScreen = (id: string, alt: string): HubImage => ({
  src: `/img/app/${id}.webp`,
  avif: `/img/app/${id}.avif`,
  width: 780,
  height: 1692,
  alt,
})

/**
 * Hero telefon demosu: parkbiz-port alt sekmeleri (Otoparklar, Abonelik, Borçlar, Profil).
 * Ekranlar screens.json'daki tabBar: 4 kareleriyle eşleşir.
 */
export const heroTabs = [
  {
    id: 'otoparklar',
    label: 'Otoparklar',
    image: appScreen('otoparklar', 'ParkBiz, Otoparklar sekmesi: yakındaki otopark listesi'),
  },
  {
    id: 'abonelik',
    label: 'Abonelik',
    image: appScreen('abonelik', 'ParkBiz, Abonelik sekmesi: otopark seçimi'),
  },
  {
    id: 'borclar',
    label: 'Borçlar',
    image: appScreen('borclar', 'ParkBiz, Borçlar sekmesi: borç sorgulama'),
  },
  {
    id: 'profil',
    label: 'Profil',
    image: appScreen('profil', 'ParkBiz, Profil sekmesi: hesap menüsü'),
  },
] as const

export const monitorCopy = {
  eyebrow: 'Canlı izleme',
  title: 'Sistemi anlık izleyin.',
  lead: 'Performans, cihaz durumu ve gecikmeleri tek ekranda görün. Grafana & Prometheus destekli anlık sistem metrikleri.',
  flowLabel: 'İzleme akışı',
  flow: [
    { title: 'Saha cihazları', text: 'Kamera, bariyer ve kiosk' },
    { title: 'Zone', text: 'Oturum, tahsilat ve cihaz kayıtları' },
    { title: 'Grafana & Prometheus', text: 'Anlık sistem metrikleri' },
    { title: 'Operasyon ekibi', text: 'Uzaktan 7/24 takip' },
  ],
  checks: [
    'Sahadaki hareketi anlık takip edin.',
    'Cihaz ve servis durumunu görün.',
    'Kritik performans değerlerini izleyin.',
    'PMSP loglarını ve kamera kayıtlarını inceleyin.',
  ],
  checksLabel: 'Canlı izleme ile',
  caption: 'Zone paneli: temel otopark, finansal, abonelik ve teknik modüller (demo verisi)',
}

export const ctaCopy = {
  eyebrow: 'Park Yazılım',
  title: 'Otoparkınız için doğru kurguyu birlikte planlayalım.',
  description: 'Sahanızı dinleyelim; yazılım, donanım ve tahsilat kurgusunu sizinle birlikte netleştirelim.',
  primary: { label: 'Teklif Al', route: 'quote.index' },
  secondary: { label: 'Ücretsiz Keşif', route: 'discovery.show' },
}
