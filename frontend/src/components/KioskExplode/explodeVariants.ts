import { cardImage } from '../../pages/ProductDetail/detailShared.ts'
import type { HardwareSlug } from '../../pages/HardwareProduct/products.ts'
import { kioskExplodeCopy } from './kioskExplodeCopy.ts'

export type ExplodeVariantId =
  | 'kiosk'
  | 'tir-kiosk'
  | 'kamera-muhafaza'
  | 'visiobox'
  | 'ledli-reklam-paneli'
  | 'rack-kabin'

export type ExplodePart = {
  partId: string
  code: string
  title: string
  desc: string
  side: 'left' | 'right'
}

export type ExplodePhase = {
  at: number
  title: string
  desc: string
}

export type ExplodeCopy = {
  id: string
  hint: string
  rail: string
  loading: string
  step: string
  image: {
    src: string
    avif?: string
    alt: string
    width: number
    height: number
  }
  phases: ExplodePhase[]
  parts: ExplodePart[]
}

export type ExplodeVariant = {
  id: ExplodeVariantId
  modelSrc: string
  /** Gölge atmayan gövde mesh adları. */
  bodyNames: ReadonlySet<string>
  screens: ReadonlySet<string>
  /** Ayrılma yönleri; değerler model yüksekliğinin oranıdır. */
  explode: Record<string, [number, number, number]>
  /** Ölçek: height = dikey ürün (kiosk); max = yatay/kompakt (kamera). */
  fit?: 'height' | 'max'
  /** Hedef boyut (fit birimine göre). */
  modelSize?: number
  /** tall: kiosk/TIR; compact: kamera gibi alçak ürün — yakın çekim + düşük etiketler. */
  framing?: 'tall' | 'compact'
  /**
   * Ön yüz grafiği (ör. navbar LED fotoğrafı).
   * faceGroups içindeki düğüm veya alt mesh’lere map olarak basılır.
   */
  faceMapSrc?: string
  faceGroups?: ReadonlySet<string>
  copy: ExplodeCopy
}

const KIOSK_EXPLODE: Record<string, [number, number, number]> = {
  tabletsc: [0, 0.1, 0.55],
  Cube: [0, 0.55, 0.2],
  PC_fan: [0, 0.05, -0.58],
  pos: [-0.62, 0.02, 0.34],
  possc: [-0.7, 0.02, 0.38],
  printer1: [0.62, -0.1, 0.34],
  printer2: [0.62, -0.1, 0.34],
  pleksi1: [0.72, 0.05, 0.1],
  plesi2: [-0.72, 0.05, 0.1],
  kiosk: [0, 0, -0.14],
}

/** TIR kiosk: üst/alt panel çiftleri; .001 alt paneli. */
const TIR_KIOSK_EXPLODE: Record<string, [number, number, number]> = {
  tabletsc: [0, 0.22, 0.55],
  'tabletsc.001': [0, -0.28, 0.55],
  possc: [-0.7, 0.18, 0.38],
  'possc.001': [-0.7, -0.22, 0.38],
  printer2: [0.62, 0.12, 0.34],
  'printer2.001': [0.62, -0.18, 0.34],
  pleksi1: [0.72, 0.12, 0.1],
  'pleksi1.001': [0.72, -0.18, 0.1],
  'pleksi1.002': [0.55, 0.35, 0.08],
  'pleksi1.003': [0.55, -0.35, 0.08],
  plesi2: [-0.72, 0.12, 0.1],
  'plesi2.001': [-0.72, -0.18, 0.1],
  kiosktruck: [0, 0, -0.16],
}

/** Visio Kamera muhafaza: gövde + optik birim — kiosk gibi belirgin ayrılma. */
const KAMERA_EXPLODE: Record<string, [number, number, number]> = {
  camera: [0.15, 0.35, 0.95],
  'body174672.002': [-0.2, -0.12, -0.55],
}

const tirKioskImage = cardImage(
  'tir-kiosk',
  'İnsansız Çıkış Ödeme Kiosk TIR Versiyonu: iki katlı ödeme panelli kolon',
)

const tirKioskCopy: ExplodeCopy = {
  id: 'tir-iceriden',
  hint: 'Kaydırarak parçalarına ayırın',
  rail: 'Parçalara ayrılış',
  loading: 'Model yükleniyor',
  step: 'Adım',
  image: tirKioskImage,
  phases: [
    {
      at: 0,
      title: 'Ağır vasıta çıkışında tahsilat',
      desc: 'Otomobil, kamyon ve TIR aynı noktada; üst veya alt panelden ödeme alır.',
    },
    {
      at: 0.3,
      title: 'İki katlı paralel yapı',
      desc: 'Üst ve alt paneller aynı anda çalışır; sürücü aracın yüksekliğine göre seçer.',
    },
    {
      at: 0.52,
      title: 'Gövde açılıyor',
      desc: 'POS, yazıcı ve arayüzler her iki seviyede de hazırdır.',
    },
    {
      at: 0.72,
      title: 'İçeride ne var?',
      desc: 'Çekici-dorse tanıma ve sınıf ayrımı ile geçiş aynı hattada yönetilir.',
    },
  ],
  parts: [
    {
      partId: 'tabletsc',
      code: 'T-01',
      title: 'Üst dokunmatik arayüz',
      desc: 'Yüksek kabinli araçlar için üst paneldan ödeme ve yönlendirme.',
      side: 'right',
    },
    {
      partId: 'tabletsc.001',
      code: 'T-02',
      title: 'Alt dokunmatik arayüz',
      desc: 'Otomobil ve düşük kabin için alt panel; aynı akış alt seviyede.',
      side: 'right',
    },
    {
      partId: 'possc',
      code: 'T-03',
      title: 'Temassız ödeme',
      desc: 'Banka kartı ve temassız okuma; HGS ve QR ile birlikte çalışır.',
      side: 'left',
    },
    {
      partId: 'printer2',
      code: 'T-04',
      title: 'Termal fiş yazıcı',
      desc: 'Uzun rulo desteği ile saha bakım aralıkları uzar.',
      side: 'left',
    },
    {
      partId: 'kiosktruck',
      code: 'T-05',
      title: 'İki katlı gövde',
      desc: '2455 mm yükseklik; üst ve alt ödeme hatları tek kolonda.',
      side: 'left',
    },
  ],
}

const kameraImage = cardImage(
  'kamera-muhafaza',
  'Visio Kamera muhafazası: kırmızı güneşlikli gövde, beyaz ön yüz ve montaj ayağı',
)

const kameraCopy: ExplodeCopy = {
  id: 'kamera-iceriden',
  hint: 'Kaydırarak parçalarına ayırın',
  rail: 'Parçalara ayrılış',
  loading: 'Model yükleniyor',
  step: 'Adım',
  image: kameraImage,
  phases: [
    {
      at: 0,
      title: 'Dış ortamda plaka okuma',
      desc: 'Güneşlikli muhafaza, plaka tanıma kamerasını yağmur ve güneşten korur.',
    },
    {
      at: 0.3,
      title: 'Kompakt gövde',
      desc: 'Navbar’daki Visio Kamera ile aynı form: kırmızı güneşlik, beyaz ön yüz.',
    },
    {
      at: 0.52,
      title: 'Gövde açılıyor',
      desc: 'Ön yüz ve optik birim servis için erişilebilir; montaj ayağı açı ayarı verir.',
    },
    {
      at: 0.72,
      title: 'İçeride ne var?',
      desc: 'Lens ve muhafaza birlikte çalışır; sahada keşif ve planlama ile konumlanır.',
    },
  ],
  parts: [
    {
      partId: 'camera',
      code: 'K-01',
      title: 'Optik birim',
      desc: 'Plaka tanıma için net görüş; ön cam ve lens muhafaza içinde.',
      side: 'right',
    },
    {
      partId: 'body174672.002',
      code: 'K-02',
      title: 'Güneşlikli muhafaza',
      desc: 'Kırmızı güneşlik ve gövde; dış ortam koşullarına karşı koruma.',
      side: 'left',
    },
  ],
}

/**
 * Visiobox / Togerbox GLB: Lite + Pro yan yana.
 * İsimler meshopt export’taki underscore biçimidir (boşluk değil).
 */
const VISIOBOX_EXPLODE: Record<string, [number, number, number]> = {
  // Pro
  'KAPI_3040(Varsayılan)Görüntü_Durumu_1': [0.28, 0.06, 0.78],
  KM05_1_5_01_64_BOYALI: [0.55, 0.12, 0.58],
  'ön_reklam(Varsayılan)Görüntü_Durumu_1': [0.28, 0.52, 0.18],
  'etanj_kutu(Varsayılan)Görüntü_Durumu_1': [0.22, 0, -0.1],
  'TABAN_SACI(Varsayılan)Görüntü_Durumu_1': [0.28, -0.45, 0.06],
  'MONTAJ_KULAK(Varsayılan)Görüntü_Durumu_1': [0.22, 0.06, -0.62],
  'ARKA_SAC(Varsayılan)Görüntü_Durumu_1': [0.28, 0.08, -0.48],
  // Lite
  'KAPI_KÜÇÜK(Varsayılan)Görüntü_Durumu_1': [-0.28, 0.06, 0.78],
  KM05_1_5_01_64_BOYALI_1: [-0.55, 0.12, 0.58],
  'ön_reklam-KÜÇÜK(Varsayılan)Görüntü_Durumu_1': [-0.28, 0.52, 0.18],
  'KÜÇÜK_KUTU(Varsayılan)Görüntü_Durumu_1': [-0.22, 0, -0.1],
  'TABAN_SACI_KÜÇÜK(Varsayılan)Görüntü_Durumu_1': [-0.28, -0.45, 0.06],
  'MONTAJ_KULAK(Varsayılan)Görüntü_Durumu_1_1': [-0.22, 0.06, -0.62],
  'ARKA_SAC(Varsayılan)Görüntü_Durumu_1_1': [-0.28, 0.08, -0.48],
}

const visioboxImage = cardImage(
  'visiobox',
  'Visiobox kontrol kutusu: kırmızı kilitli ön kapak ve beyaz metal gövde',
)

const visioboxCopy: ExplodeCopy = {
  id: 'visiobox-iceriden',
  hint: 'Kaydırarak parçalarına ayırın',
  rail: 'Parçalara ayrılış',
  loading: 'Model yükleniyor',
  step: 'Adım',
  image: visioboxImage,
  phases: [
    {
      at: 0,
      title: 'Sahada kompakt kontrol',
      desc: 'Box Lite ve Box Pro: bariyer ve sensörleri tek kutuda yönetir.',
    },
    {
      at: 0.3,
      title: 'Kilitli ön kapak',
      desc: 'Servis erişimi kilitli kapaktan; etiket alanı sahada okunur kalır.',
    },
    {
      at: 0.52,
      title: 'Gövde açılıyor',
      desc: 'İç yerleşim, kablo girişi ve montaj kulakları aynı gövdede toplanır.',
    },
    {
      at: 0.72,
      title: 'İçeride ne var?',
      desc: 'Kilit, kapak ve taban sacı; 7/24 çalışma için dayanıklı metal yapı.',
    },
  ],
  parts: [
    {
      partId: 'KAPI_3040(Varsayılan)Görüntü_Durumu_1',
      code: 'V-01',
      title: 'Kilitli ön kapak',
      desc: 'Servis ve müdahale için kilitli kapak; sahada güvenli erişim.',
      side: 'right',
    },
    {
      partId: 'KM05_1_5_01_64_BOYALI',
      code: 'V-02',
      title: 'Panel kilidi',
      desc: 'Ön kapak kilidi; yetkisiz müdahaleyi engeller.',
      side: 'right',
    },
    {
      partId: 'etanj_kutu(Varsayılan)Görüntü_Durumu_1',
      code: 'V-03',
      title: 'Etanj gövde',
      desc: 'Kompakt metal gövde; bariyer ve sensör bağlantılarını barındırır.',
      side: 'left',
    },
    {
      partId: 'TABAN_SACI(Varsayılan)Görüntü_Durumu_1',
      code: 'V-04',
      title: 'Taban ve kablo girişi',
      desc: 'Alt yüzeyden düzenli kablo girişi; saha montajına uygun.',
      side: 'left',
    },
    {
      partId: 'MONTAJ_KULAK(Varsayılan)Görüntü_Durumu_1',
      code: 'V-05',
      title: 'Montaj kulağı',
      desc: 'Arka yüzeydeki montaj aparatları ile sabitleme.',
      side: 'left',
    },
  ],
}

/**
 * LED bilgilendirme paneli: ekran, plexi, gövde, arka kapı ve ayak.
 * İsimler meshopt export’taki underscore biçimidir.
 */
const LED_PANEL_EXPLODE: Record<string, [number, number, number]> = {
  LED_MONTAJ: [0, 0.42, 0.12],
  'PLEXI(Varsayılan)Görüntü_Durumu_1': [0, 0.04, 0.62],
  'REKLAM_SACI_KAPIDA(Varsayılan)Görüntü_Durumu_1': [0, 0.02, 0.48],
  'REKLAM_PANELİ_ÖN_GÖVDE(Varsayılan)Görüntü_Durumu_1': [0, 0.08, -0.1],
  'RP_ARKA_KAPI,(Varsayılan)Görüntü_Durumu_1': [0, 0.06, -0.58],
  // Aşağı itme zemin altına kaçırıyor; ayak zeminde kalıp yana/arkaya ayrılsın.
  ALT_AYAK_SETİ: [0.42, 0.02, -0.35],
}

/** Navbar menü görseli — kart görseli yok; reduced-motion ve fallback aynı kaynaktan. */
const ledPanelImage = {
  src: '/img/nav/led-panel.webp',
  avif: '/img/nav/led-panel.avif',
  alt: 'LED Bilgilendirme Paneli: üstte kırmızı LED mesaj, Visiosoft tarif tablosu ve kırmızı taşıyıcı ayak',
  width: 130,
  height: 300,
}

const ledPanelCopy: ExplodeCopy = {
  id: 'led-iceriden',
  hint: 'Kaydırarak parçalarına ayırın',
  rail: 'Parçalara ayrılış',
  loading: 'Model yükleniyor',
  step: 'Adım',
  image: ledPanelImage,
  phases: [
    {
      at: 0,
      title: 'Girişte görünür bilgilendirme',
      desc: 'Ücret, süre ve yönlendirme mesajları sürücü şeride girmeden okunur.',
    },
    {
      at: 0.3,
      title: 'LED mesaj alanı',
      desc: 'Üstteki LED satır anlık duyuru ve yönlendirme metinlerini gösterir.',
    },
    {
      at: 0.52,
      title: 'Gövde açılıyor',
      desc: 'Reklam yüzeyi ve arka kapı servis erişimi için ayrılır; montaj kutusu görünür.',
    },
    {
      at: 0.72,
      title: 'İçeride ne var?',
      desc: 'LED tava, plexi ve taşıyıcı ayak aynı kolonda; iç ve dış ortamda çalışır.',
    },
  ],
  parts: [
    {
      partId: 'LED_MONTAJ',
      code: 'L-01',
      title: 'LED mesaj modülü',
      desc: 'Üstteki LED satır; tarife ve duyuru metinlerini yüksek görünürlükle gösterir.',
      side: 'right',
    },
    {
      partId: 'PLEXI(Varsayılan)Görüntü_Durumu_1',
      code: 'L-02',
      title: 'Ön plexi',
      desc: 'Mesaj ve reklam alanını koruyan şeffaf ön yüzey.',
      side: 'right',
    },
    {
      partId: 'REKLAM_SACI_KAPIDA(Varsayılan)Görüntü_Durumu_1',
      code: 'L-03',
      title: 'Reklam yüzeyi',
      desc: 'Kapıya entegre tarif / bilgilendirme alanı; Visiosoft menü görselindeki yüz.',
      side: 'left',
    },
    {
      partId: 'RP_ARKA_KAPI,(Varsayılan)Görüntü_Durumu_1',
      code: 'L-04',
      title: 'Arka servis kapağı',
      desc: 'LED tabela montaj kutusuna erişim; sahada bakım için açılır.',
      side: 'left',
    },
    {
      partId: 'ALT_AYAK_SETİ',
      code: 'L-05',
      title: 'Taşıyıcı ayak',
      desc: 'Kırmızı dikey ayak ve taban; paneli giriş hattında sabitler.',
      side: 'left',
    },
  ],
}

/**
 * Rack kabin / saha panosu: kapı, gövde, raf, PC, switch ve ayak.
 * İsimler meshopt export’taki underscore biçimidir.
 */
const RACK_KABIN_EXPLODE: Record<string, [number, number, number]> = {
  'ÖN_KAPI(Varsayılan)Görüntü_Durumu_1': [0, 0.04, 0.72],
  'EKRAN_TS-111(Varsayılan)Görüntü_Durumu_1': [0.12, 0.28, 0.45],
  'PC(Varsayılan)Görüntü_Durumu_1': [-0.42, 0.05, 0.2],
  'SWICH(Varsayılan)Görüntü_Durumu_1': [0.42, 0.08, 0.18],
  'RAF(Varsayılan)Görüntü_Durumu_1': [0, -0.08, 0.38],
  'ÇATI_600X350(Varsayılan)Görüntü_Durumu_1': [0, 0.48, 0.05],
  '600X450X350_GÖVDE(Varsayılan)Görüntü_Durumu_1': [0, 0, -0.12],
  '600X350_AYAK_SAHA_PANOSU(Varsayılan)Görüntü_Durumu_1': [0, -0.38, 0.04],
}

const rackKabinImage = cardImage(
  'rack-kabin',
  'Visio Rack Kabin: kırmızı ayaklar üzerinde kilitli kırmızı kapaklı kabin ve üstte havalandırma ızgarası',
)

const rackKabinCopy: ExplodeCopy = {
  id: 'rack-iceriden',
  hint: 'Kaydırarak parçalarına ayırın',
  rail: 'Parçalara ayrılış',
  loading: 'Model yükleniyor',
  step: 'Adım',
  image: rackKabinImage,
  phases: [
    {
      at: 0,
      title: 'Sahada kilitli ekipman kabini',
      desc: 'Kontrol, güç ve network birimleri tek kilitli gövdede düzenli kalır.',
    },
    {
      at: 0.3,
      title: 'Ön kapak açılıyor',
      desc: 'Kilitli kapak servis erişimi verir; iç montaj plakası ve raflar görünür.',
    },
    {
      at: 0.52,
      title: 'Gövde açılıyor',
      desc: 'PC, switch ve ekran raflarda sabitlenir; kablo düzeni korunur.',
    },
    {
      at: 0.72,
      title: 'İçeride ne var?',
      desc: 'Çatı ızgarası, ayak seti ve iç üniteler; 7/24 saha çalışmasına uygun.',
    },
  ],
  parts: [
    {
      partId: 'ÖN_KAPI(Varsayılan)Görüntü_Durumu_1',
      code: 'R-01',
      title: 'Kilitli ön kapak',
      desc: 'Yetkisiz müdahaleyi engeller; sahada hızlı servis erişimi sağlar.',
      side: 'right',
    },
    {
      partId: 'PC(Varsayılan)Görüntü_Durumu_1',
      code: 'R-02',
      title: 'Kontrol bilgisayarı',
      desc: 'Otopark kontrol yazılımı için sabitlenmiş endüstriyel PC.',
      side: 'right',
    },
    {
      partId: 'SWICH(Varsayılan)Görüntü_Durumu_1',
      code: 'R-03',
      title: 'Network switch',
      desc: 'Kamera ve uç birimleri aynı kabin içinde ağa bağlar.',
      side: 'left',
    },
    {
      partId: 'RAF(Varsayılan)Görüntü_Durumu_1',
      code: 'R-04',
      title: 'İç raf',
      desc: 'Ekipmanları dikeyde düzenler; montaj sacı ile sabitlenir.',
      side: 'left',
    },
    {
      partId: '600X350_AYAK_SAHA_PANOSU(Varsayılan)Görüntü_Durumu_1',
      code: 'R-05',
      title: 'Taşıyıcı ayak',
      desc: 'Kırmızı ayak seti; kabini sahada dengeli ve erişilebilir tutar.',
      side: 'left',
    },
  ],
}

export const explodeVariants: Record<ExplodeVariantId, ExplodeVariant> = {
  kiosk: {
    id: 'kiosk',
    modelSrc: '/models/products/kiosk.glb',
    bodyNames: new Set(['kiosk']),
    screens: new Set(['tabletsc', 'possc']),
    explode: KIOSK_EXPLODE,
    copy: {
      id: kioskExplodeCopy.id,
      hint: kioskExplodeCopy.hint,
      rail: kioskExplodeCopy.rail,
      loading: kioskExplodeCopy.loading,
      step: kioskExplodeCopy.step,
      image: kioskExplodeCopy.image,
      phases: kioskExplodeCopy.phases,
      parts: kioskExplodeCopy.parts,
    },
  },
  'tir-kiosk': {
    id: 'tir-kiosk',
    modelSrc: '/models/products/tir-kiosk.glb',
    bodyNames: new Set(['kiosktruck']),
    screens: new Set(['tabletsc', 'tabletsc.001', 'possc', 'possc.001']),
    explode: TIR_KIOSK_EXPLODE,
    copy: tirKioskCopy,
  },
  'kamera-muhafaza': {
    id: 'kamera-muhafaza',
    modelSrc: '/models/products/kamera-muhafaza.glb',
    bodyNames: new Set(['body174672.002']),
    screens: new Set(),
    explode: KAMERA_EXPLODE,
    fit: 'max',
    modelSize: 2.35,
    framing: 'compact',
    copy: kameraCopy,
  },
  visiobox: {
    id: 'visiobox',
    modelSrc: '/models/products/visiobox.glb',
    bodyNames: new Set([
      'etanj_kutu(Varsayılan)Görüntü_Durumu_1',
      'KÜÇÜK_KUTU(Varsayılan)Görüntü_Durumu_1',
      'TOGERBOX_ETANJ_OTOPARK',
    ]),
    screens: new Set(),
    explode: VISIOBOX_EXPLODE,
    fit: 'max',
    modelSize: 2.2,
    framing: 'compact',
    copy: visioboxCopy,
  },
  'ledli-reklam-paneli': {
    id: 'ledli-reklam-paneli',
    modelSrc: '/models/products/ledli-reklam-paneli.glb',
    bodyNames: new Set([
      'REKLAM_PANELİ_ÖN_GÖVDE(Varsayılan)Görüntü_Durumu_1',
      'OTOPARK_REKLAM_PANELİ',
    ]),
    screens: new Set(),
    explode: LED_PANEL_EXPLODE,
    framing: 'tall',
    faceMapSrc: '/img/nav/led-panel.webp',
    faceGroups: new Set(['REKLAM_PANELİ_ÖN_GÖVDE(Varsayılan)Görüntü_Durumu_1']),
    copy: ledPanelCopy,
  },
  'rack-kabin': {
    id: 'rack-kabin',
    modelSrc: '/models/products/rack-kabin.glb',
    bodyNames: new Set([
      '600X450X350_GÖVDE(Varsayılan)Görüntü_Durumu_1',
      'OTOPARK_SAHA_PANOSU',
    ]),
    screens: new Set(),
    explode: RACK_KABIN_EXPLODE,
    fit: 'max',
    modelSize: 1.7,
    framing: 'tall',
    copy: rackKabinCopy,
  },
}

/** Donanım slug’ı için patlatma yapılandırması; yoksa undefined. */
export function explodeVariantFor(slug: HardwareSlug): ExplodeVariant | undefined {
  if (slug === 'togerbox') return explodeVariants.visiobox
  if (
    slug === 'kiosk' ||
    slug === 'tir-kiosk' ||
    slug === 'kamera-muhafaza' ||
    slug === 'visiobox' ||
    slug === 'ledli-reklam-paneli' ||
    slug === 'rack-kabin'
  ) {
    return explodeVariants[slug]
  }
  return undefined
}

export function phaseIndexAt(phases: ExplodePhase[], progress: number) {
  let index = 0
  for (let step = phases.length - 1; step >= 0; step--) {
    if (progress >= phases[step].at) {
      index = step
      break
    }
  }
  return index
}
