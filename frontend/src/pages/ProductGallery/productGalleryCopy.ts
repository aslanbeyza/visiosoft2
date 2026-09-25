export type GalleryProductId = 'rackkabin' | 'kiosk' | 'kamerastandi' | 'camera'

export type GalleryPoint = { id: string; title: string; text: string }

export type GalleryProduct = {
  id: GalleryProductId
  name: string
  role: string
  points: GalleryPoint[]
}

export const productGalleryCopy = {
  seoTitle: 'Ürün Galerisi | Visiosoft',
  seoDescription:
    'RackKabin, ödeme kioskü, kamera standı ve ANPR kamerayı 3D modelde inceleyin: kapı ve kilitten Jetson Orin Nano\'ya, lensten PoE bağlantısına her parça modelin üzerinde işaretli.',
  heading: 'Ürün Galerisi',
  pickerLabel: 'Ürünler',
  pointsLabel: (name: string) => `${name} parçaları`,
  loading: 'Model yükleniyor',
  fallback: 'Bu tarayıcı 3D modeli gösteremiyor.',
} as const

/** Picker order is the page order: the cabinet first, then what mounts around it. */
export const galleryProducts: GalleryProduct[] = [
  {
    id: 'rackkabin',
    name: 'RackKabin',
    role: 'Saha panosu',
    points: [
      { id: 'door', title: 'Kapı ve kilit', text: 'Kilitli kapı; saha ekipmanlarına erişim tek noktadan.' },
      { id: 'vent', title: 'Havalandırma', text: 'Filtreli menfez; kart yaz sıcağında da soğuk kalır.' },
      { id: 'body', title: 'Gövde ve montaj', text: 'Saha ekipmanları için güvenli ve düzenli kabin; kablolar alttan girer.' },
      { id: 'nano', title: 'Jetson Orin Nano', text: 'Kapı açılır: LENS\'in beş aşaması bu kartın üzerinde çalışır.' },
      { id: 'modem', title: '4G modem', text: 'Sahada kablolu hat yoksa bağlantı buradan gelir.' },
      { id: 'poe', title: 'PoE switch', text: 'Kameraya güç ve veri tek kablodan gider.' },
      { id: 'relay', title: 'USB röle', text: 'Karar buradan çıkar, bariyer kolu kalkar.' },
    ],
  },
  {
    id: 'kiosk',
    name: 'Kiosk',
    role: 'İnsansız çıkış ödeme',
    points: [
      { id: 'screen', title: 'Ekran', text: 'Plaka girişi gerekmeden ücret ve abonelik durumu sürücüye gösterilir.' },
      { id: 'pos', title: 'POS ve ödeme', text: 'HGS, temassız kart ve QR; çıkışta insansız tahsilat.' },
      { id: 'voice', title: 'Sesli ve görüntülü destek', text: 'Sürücü takılırsa operasyon ekibi 7/24 sesli ve görüntülü bağlanır.' },
      { id: 'relay', title: 'Bariyer çıkışı', text: 'Karar kiosktan çıkar, röle sürülür, kol kalkar.' },
    ],
  },
  {
    id: 'kamerastandi',
    name: 'Kamera standı',
    role: 'Kamera, LED ve aydınlatma tek gövdede',
    points: [
      { id: 'anpr', title: 'ANPR kameralar', text: 'Braket üstünde iki plaka kamerası; giriş ve çıkış şeridini tek stand okur.' },
      { id: 'bracket', title: 'Kamera braketi', text: 'Modüler montaj; bakış açısı ve yükseklik sahada ayarlanır.' },
      { id: 'ir', title: 'Kızılötesi aydınlatma', text: 'Gece plaka için görünmez ışık; kamera karanlıkta da okur.' },
      { id: 'led', title: 'LED tabela', text: 'Ücret, plaka ve yönlendirme; kart karar verir vermez tabelaya düşer.' },
      { id: 'canopy', title: 'Saçak', text: 'Yağmura ve güneşe karşı; kamera ve tabela dört mevsim dışarıda.' },
      { id: 'pole', title: 'Direk', text: '3 m; şerit kenarında, plakayı 6–8 m\'den görecek yerde.' },
      { id: 'base', title: 'Kaide', text: 'Beton temel ve ankraj; kablo kanalı kaideden kabine kadar.' },
    ],
  },
  {
    id: 'camera',
    name: 'Kamera',
    role: 'ANPR',
    points: [
      { id: 'lens', title: 'Lens', text: 'Plakayı 6–8 m\'den okuyan optik; farlara karşı HDR.' },
      { id: 'ir', title: 'Kızılötesi', text: 'Gece plaka için görünmez aydınlatma; kamera karanlıkta da okur.' },
      { id: 'housing', title: 'Muhafaza', text: 'Dış ortam için IP67 gövde, güneşlik ve ısıtıcı; dört mevsim dışarıda.' },
      { id: 'net', title: 'Ethernet / PoE', text: 'RTSP akışı ve güç tek kablodan; kabindeki karta gider.' },
    ],
  },
]
