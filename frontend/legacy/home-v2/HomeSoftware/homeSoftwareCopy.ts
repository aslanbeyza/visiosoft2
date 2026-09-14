export type SoftwareTab = {
  id: 'map' | 'sessions' | 'panel'
  label: string
  title: string
  description: string
  bullets: string[]
  image: {
    src: string
    avif: string
    width: number
    height: number
    /** Ekran okuyucu için ekran görüntüsünün kısa tarifi. */
    description: string
    /** Çerçeveye yerleşim: geniş panel görüntüsü kırpılmadan sığdırılır. */
    fit: 'cover' | 'contain'
    background: string
  }
}

/** Sekmelerin otomatik ilerleme süresi (ms). */
export const AUTO_ADVANCE_MS = 6000

const shot = (name: string) => ({ src: `/img/software/${name}.webp`, avif: `/img/software/${name}.avif` })

export const homeSoftwareCopy = {
  eyebrow: 'Yazılım',
  title: 'Zone ile tüm sahalar tek panelde',
  lead: 'Oturumlar, tahsilat, abonelik ve cihazlar merkezi panelden yönetilir; sahadaki durum anlık izlenir.',
  tablistLabel: 'Zone ekranları',
  frameLabel: 'Zone',
  pause: 'Otomatik geçişi duraklat',
  play: 'Otomatik geçişi başlat',
  pauseShort: 'Duraklat',
  playShort: 'Oynat',
  screenshotPrefix: 'Ekran görüntüsü:',
  note: 'Görseller Zone arayüzünden alınmış ekran görüntüleridir; kayıtlar demo veridir.',
  cta: 'Yazılım ürünlerini inceleyin',
  tabs: [
    {
      id: 'map',
      label: 'Canlı harita',
      title: 'Sahayı kuş bakışı izleyin',
      description:
        'Park alanları, kameralar ve dolu yerler sahanın planı üzerinde görünür. Operasyon ekibi tüm sahayı tek ekrandan uzaktan izler.',
      bullets: ['Kuş bakışı canlı harita', 'Uzaktan 7/24 takip', 'Sesli yönlendirme ile sürücü desteği'],
      image: {
        ...shot('live-map'),
        width: 1600,
        height: 922,
        description: 'Otoparkın kuş bakışı planı; park yerleri, plakalar ve kamera konumları.',
        fit: 'cover',
        background: '#ffffff',
      },
    },
    {
      id: 'sessions',
      label: 'Oturumlar',
      title: 'Her araç bir oturum',
      description:
        'Giriş ve çıkış saati, süre, ücret ve ödeme durumu aynı tabloda tutulur. Plakayla arayın, ödenen ve ödenmeyen oturumları ayırın.',
      bullets: ['Oturum ve ödeme takibi', 'HGS + POS + QR tahsilat', 'Beyaz ve kara liste'],
      image: {
        ...shot('zone-sessions'),
        width: 1024,
        height: 576,
        description: 'Oturumlar tablosu; plaka, giriş-çıkış saati, süre, ücret ve ödeme durumu sütunları.',
        fit: 'cover',
        background: '#1b2033',
      },
    },
    {
      id: 'panel',
      label: 'Yönetim paneli',
      title: 'Tek yönetim paneli',
      description:
        'Park işlemleri, finans, abonelik ve teknik ayarlar aynı panelden yönetilir. Raporlar ve resmi entegrasyonlar merkezi olarak yürür.',
      bullets: ['Raporlar, e-fatura ve e-arşiv', 'EPDK ve GİB entegrasyonu', 'Mobil uygulama ile abonelik ve borç ödeme'],
      image: {
        ...shot('zone-panel'),
        width: 1600,
        height: 540,
        description: 'Koyu temalı yönetim paneli; temel otopark, finansal, abonelik ve teknik menüleri.',
        fit: 'contain',
        background: '#0b0b0c',
      },
    },
  ] satisfies SoftwareTab[],
}
