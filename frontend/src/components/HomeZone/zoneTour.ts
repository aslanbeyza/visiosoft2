import type { FeatureIconName } from '../FeatureGrid/icons.tsx'

/**
 * Zone turu verisi. Kaynak: public/img/home/zone/tour.json (derleme anında kopyalandı; çalışma anında fetch yok).
 * Başlık ve açıklamalar HOME3 §4.4 metnidir; `caption` tour.json açıklamasıdır (yalnızca kısaltıldı).
 * `region` görselin 0-1 aralığındaki odak bölgesi; `focus` masaüstü kamerasını, `mobile` dar telefon kırpımını ayarlar.
 */
export type ZoneRegion = { x: number; y: number; w: number; h: number }

export type ZoneShotKey = 'zone2' | 'zone3' | 'sessions' | 'finans'

export type ZoneShot = {
  /** Görsele ait ad değiştirme katmanlarının anahtarı (ZoneRedactions.tsx). */
  key: ZoneShotKey
  src: string
  srcSet: string
  avifSrcSet: string
  width: number
  height: number
  /** Katman zemini: görsel yüklenirken ve silme geçişinde görünür. Kamera pozu çerçeveyi her zaman doldurur. */
  ground: string
  /**
   * Kameranın kullanabileceği kaynak dikdörtgeni (piksel). Verilirse kırpım dışı hiçbir poz ve geçişte görünmez;
   * `region`, `focus` ve `mobile` değerleri bu kırpıma göre 0-1 aralığındadır.
   */
  crop?: { x: number; y: number; w: number; h: number }
}

export type ZoneTourItem = {
  id: string
  title: string
  description: string
  icon: FeatureIconName
  shot: ZoneShot
  region: ZoneRegion
  /** Masaüstü kamera ayarı: ölçek çarpanı ve (varsa) sabit merkez. Poz çerçeveyi her zaman doldurur. */
  focus?: { scale?: number; cx?: number; cy?: number }
  /** Dar telefon kırpımı (çerçeve oranı < 1,5): kaynak piksel başına hedef CSS pikseli ve merkez; görsel çerçeveyi doldurur. */
  mobile?: { px: number; cx: number; cy: number }
  caption: string
  alt: string
}

const dir = '/img/home/zone'
const pair = (name: string, ext: string) => `${dir}/${name}-1200.${ext} 1200w, ${dir}/${name}-1896.${ext} 1896w`

const zone2: ZoneShot = { key: 'zone2', src: `${dir}/zone2-1896.webp`, srcSet: pair('zone2', 'webp'), avifSrcSet: pair('zone2', 'avif'), width: 1896, height: 703, ground: '#09090b' }
const zone3: ZoneShot = { key: 'zone3', src: `${dir}/zone3-1896.webp`, srcSet: pair('zone3', 'webp'), avifSrcSet: pair('zone3', 'avif'), width: 1896, height: 862, ground: '#09090b' }
const sessions: ZoneShot = { key: 'sessions', src: `${dir}/sessions.webp`, srcSet: `${dir}/sessions.webp 996w`, avifSrcSet: `${dir}/sessions.avif 996w`, width: 996, height: 436, ground: '#f9f9f9' }
/**
 * Finansal Rapor sayfasının tamamı (1024 × 551). Eski 668 × 251 kesit çerçeveyi ancak iki kat büyütülerek doldurabiliyordu.
 * Kırpım kartları ve Ödeme Yöntemi Analizi tablosunun başlık satırına kadar iner (y 438); ödeme yöntemi adlarının
 * bulunduğu satırlar (y ≥ 444) hiçbir pozda görünmez. 700 × 438 = 16:10, çerçeveyle aynı oran.
 */
const finans: ZoneShot = {
  key: 'finans',
  src: '/img/software/finansal-rapor.webp',
  srcSet: '/img/software/finansal-rapor.webp 1024w',
  avifSrcSet: '/img/software/finansal-rapor.avif 1024w',
  width: 1024,
  height: 551,
  ground: '#0a0a0b',
  crop: { x: 227, y: 0, w: 700, h: 438 },
}

export const zoneTour: ZoneTourItem[] = [
  {
    id: 'giris-cikis',
    title: 'Anlık giriş-çıkış',
    description: 'İçerideki araçlar, giriş-çıkış saatleri ve oturum ücretleri canlı listelenir.',
    icon: 'plate',
    shot: sessions,
    region: { x: 0.0743, y: 0.4083, w: 0.9116, h: 0.4358 },
    // Görsel çerçeveden geniş (996 × 436): yükseklik doldurulur, sağdaki oturum durumu ve araç sınıfı sütunları kırpılır.
    // Pencere tablo kartının solundan (x 62) Ödeme durumu sütununun hemen sağına (x 759) uzanır; kaynak ≈1:1 kalır.
    focus: { cx: 0.412 },
    mobile: { px: 0.8, cx: 0.29, cy: 0.62 },
    caption: 'Oturumlar ekranı: her satırda plaka, giriş ve çıkış saati, süre, ücret, ödeme ve oturum durumu; üstte Tümü, İçeride/Çıkış ve Ödendi/Ödenmedi filtreleri.',
    alt: 'Zone Oturumlar ekranı: plaka, giriş ve çıkış saati, süre, ücret ve ödeme durumu sütunlarından oluşan tablo',
  },
  {
    id: 'doluluk-gelir',
    title: 'Doluluk ve gelir',
    description: 'Günlük, aylık ve yıllık ciro; nakit, kart, QR ve abonelik tahsilatları ayrı izlenir.',
    icon: 'chart',
    shot: finans,
    // Kırpım koordinatı: dört geçiş kartı, ciro kartı, trend grafiği ve üç tahsilat kartı.
    region: { x: 0.024, y: 0.068, w: 0.953, h: 0.776 },
    focus: { scale: 1.12, cy: 0 },
    mobile: { px: 0.95, cx: 0.27, cy: 0.52 },
    caption: 'Finansal Rapor (Günlük): toplam, ücretli, abone ve ücretsiz/beyaz liste geçiş sayıları, toplam ciro ve Ciro Trend Analizi grafiği.',
    alt: 'Zone Finansal Rapor ekranı: geçiş sayısı kartları, toplam ciro kartı ve ciro trend grafiği',
  },
  {
    id: 'cihaz-durumu',
    title: 'Bariyer ve kamera durumu',
    description: 'Giriş-çıkış kameraları canlı izlenir, bariyer gerektiğinde uzaktan açılır, sistem sağlığı tek bakışta görülür.',
    icon: 'camera',
    shot: zone3,
    region: { x: 0.2321, y: 0.5684, w: 0.7489, h: 0.3852 },
    focus: { scale: 1.06 },
    mobile: { px: 0.75, cx: 0.352, cy: 0.752 },
    caption: 'Kamera & Bariyer: iki giriş ve iki çıkış kamerasının son karesi, her kartta BARİYERİ AÇ düğmesi; üstte otomatik yenileme seçenekleri.',
    alt: 'Zone Kamera ve Bariyer ekranı: giriş ve çıkış kameralarının son kareleri ve her kartta bariyeri açma düğmesi',
  },
  {
    id: 'abonelik-ihlal',
    title: 'Abonelik ve ihlal yönetimi',
    description: 'Abone paketleri, beyaz/kara listeler ve ihlal kayıtları aynı panelde; sürücüler aboneliğini mobil uygulamadan alır.',
    icon: 'users',
    shot: zone2,
    region: { x: 0.6139, y: 0.064, w: 0.1756, h: 0.6629 },
    focus: { scale: 0.76, cx: 0.7 },
    mobile: { px: 0.57, cx: 0.7017, cy: 0.395 },
    caption: 'Panelde Abonelik kartı: Abone Paketleri ve Aboneler.',
    alt: 'Zone paneli: Temel Otopark, Finansal, Abonelik ve Teknik modül kartları',
  },
  {
    id: 'merkezi-raporlama',
    title: 'Merkezi raporlama',
    description: 'Finansal ve operasyonel raporlar PDF, Excel ve CSV olarak dışa aktarılır.',
    icon: 'report',
    shot: zone2,
    region: { x: 0.4225, y: 0.064, w: 0.1772, h: 0.6629 },
    focus: { scale: 0.76, cx: 0.515 },
    mobile: { px: 0.57, cx: 0.5111, cy: 0.395 },
    caption: 'Panelde Finansal kartı: Ödemeler, Borç Sorgulama, Fiyat Tarifeleri, Ödeme Ayarları, Finansal Rapor.',
    alt: 'Zone paneli: Finansal kartında ödemeler, borç sorgulama, fiyat tarifeleri ve finansal rapor bağlantıları',
  },
  {
    id: 'coklu-otopark',
    title: 'Çoklu otopark yönetimi',
    // HOME3 §4.4 metni (değiştirmeden). Dayanak: backend/data/faqs/parking-software/tr.json ("simülasyon ve yük testleri").
    description: 'Tüm sahalar tek hesaptan, saha seçiciyle yönetilir; merkezi mimari 10.000 otopark ölçeğinde yük testinden geçti.',
    icon: 'map',
    shot: zone3,
    region: { x: 0.0074, y: 0.1067, w: 0.193, h: 0.0673 },
    focus: { scale: 0.41 },
    mobile: { px: 0.8, cx: 0.125, cy: 0.276 },
    caption: 'Kenar çubuğunda otopark seçici (açılır menü).',
    alt: 'Zone kenar çubuğu: üstte otopark seçici açılır menüsü ve park yönetimi menüsü',
  },
]

/** Otomatik geçiş süresi (ms). */
export const TOUR_INTERVAL = 7000

/** Sekme kimliği: sekme listesi ve panel aynı kimliği paylaşır. */
export const tabId = (base: string, id: string) => `${base}-tab-${id}`
