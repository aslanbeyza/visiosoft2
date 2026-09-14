import type { ProductZoomDetail, ProductZoomImage } from '../../components/ProductZoom/ProductZoom.tsx'

export const kusBakisiZoom = {
  eyebrow: 'Canlı harita',
  title: 'Sahanın tamamı, tek ekranda.',
  overview: {
    title: 'Kuş bakışı plan',
    description: 'Otoparkınızın planı; park yerleri, kameralar ve doluluk bilgisi aynı ekranda.',
  },
  caption: 'Zone canlı harita ekranı · demo verisi',
}

// Kaynak: gercek_otopark_isvev_kus_bakisi başlıksız kırpımı (2400 × 1142)
export const kusBakisiImage: ProductZoomImage = {
  src: '/img/pages/canli-harita-crop.webp',
  avif: '/img/pages/canli-harita-crop.avif',
  width: 2400,
  height: 1142,
  alt: 'Zone canlı harita ekranı: park yerleri, kameralar ve doluluk paneli',
}

export const kusBakisiDetails: ProductZoomDetail[] = [
  {
    id: 'park-alani',
    title: 'Park alanı',
    description: 'Her park yeri haritada ayrı çizilir; dolu yerlerde aracın plakası görünür.',
    box: { x: 22.5, y: 7, w: 29, h: 25 },
  },
  {
    id: 'kamera',
    title: 'Kamera ikonu',
    description: 'Kameralar sahadaki konumlarıyla haritada işaretlidir; kameralar ve oturumlar alt panellerden açılır.',
    box: { x: 51, y: 17, w: 17.5, h: 15 },
  },
  {
    id: 'doluluk',
    title: 'Doluluk paneli',
    description: 'Boş, dolu, kullanım dışı ve engelli park yerlerinin sayısı ile doluluk oranı anlık izlenir.',
    // Kutu görselin içinde kalır: kenara (y:0) dayanınca yakınlaşma sahnenin üstünde boş şerit bırakıyordu.
    box: { x: 82, y: 4, w: 17, h: 44 },
  },
]

export const kusBakisiStory = {
  id: 'kus-bakisi-tek-ekran',
  eyebrow: 'Tek ekrandan yönetim',
  title: 'Operasyonunuz, kuş bakışı.',
  paragraphs: [
    'Tüm otopark operasyonlarınızı tek bir ekrandan, kuş bakışı yönetin. Anlık doluluk, gelir ve arıza takibi.',
    'Canlı harita, oturumlar ve raporlar aynı yazılımda buluşur; sahanızı uzaktan 7/24 takip edebilirsiniz.',
  ],
  image: {
    src: '/img/pages/kus_bakisi_otopark_yonetimi.webp',
    width: 1052,
    height: 592,
    alt: 'Kuş bakışı otopark yönetimi çizimi: bina, park yerleri ve kamera direği',
  },
  caption: 'Kuş bakışı otopark yönetimi — temsilî görsel',
}

export const kusBakisiFeatures = {
  id: 'kus-bakisi-ozellikler',
  eyebrow: 'Parmaklarınızın ucunda',
  title: 'Anlık veri, canlı kamera, detaylı rapor.',
  items: [
    { key: 'veri', title: 'Anlık veriler', description: 'Doluluk, gelir ve arıza bilgisi anlık olarak aynı ekrana gelir.' },
    { key: 'kamera', title: 'Canlı kameralar', description: 'Sahadaki kameraları haritadaki konumlarından takip edin.' },
    {
      key: 'rapor',
      title: 'Detaylı raporlar',
      description: 'Operasyonel ve finansal raporlarla sahanızın performansını izleyin.',
      route: 'parking-reports',
    },
  ],
}
