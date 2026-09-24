import { products } from '../../HardwareProduct/products.ts'
import { cardImage, detailCopy, drawingImage } from '../detailShared.ts'
import type { ProductDetailData } from '../detailTypes.ts'

const product = products['tir-kiosk']
const name = product.copy.name

export const tirKioskDetail: ProductDetailData = {
  slug: 'tir-kiosk',
  route: product.route,
  navLabel: product.navLabel,
  copy: product.copy,
  seo: {
    title: product.copy.page_title,
    description:
      'İnsansız Çıkış Ödeme Kiosk TIR Versiyonu: iki katlı paralel yapı, üst/alt panel ödeme, araç sınıfı ve çekici-dorse tanıma.',
  },
  hero: {
    kind: 'image',
    image: cardImage(
      'tir-kiosk',
      'İnsansız Çıkış Ödeme Kiosk TIR Versiyonu: beyaz kolon üzerinde güneşlikli üst panel ve alt panel, her panelde ekran ve kart okuyucu',
    ),

    dimensions: {
      height: { label: '2455 mm', span: { from: 0.4, to: 96.4 }, edges: [41, 43] },
    },
    baseGap: 3.6,
  },
  heroMeta: true,
  explode: true,
  figures: {
    label: detailCopy.figures.dimensions,
    items: [
      { id: 'width', label: 'Genişlik', value: 300, unit: 'mm' },
      { id: 'height', label: 'Yükseklik', value: 2455, unit: 'mm' },
      { id: 'depth', label: 'Derinlik', value: 430, unit: 'mm' },
      { id: 'panels', label: 'Ödeme paneli', text: 'Üst · Alt', srText: 'Üst panel ve alt panel' },
    ],
  },
  zoom: {
    kind: 'drawing',
    eyebrow: detailCopy.zoomEyebrow,
    title: 'Çizimdeki her görünüşe yakından bakın.',
    overview: {
      title: name,
      description: 'Kaydırdıkça ön görünüşe, yan görünüşe ve açılan servis kapaklarına yaklaşın.',
    },
    image: drawingImage('tir-kiosk', 1227, 852, `${name} teknik çizimi: yan, ön ve arka görünüşler ile iki izometrik görünüm`),
    details: [
      {
        id: 'panels',
        title: 'Üst ve alt ödeme paneli',
        description: 'Ön görünüşte iki panel üst üste yer alır; sürücü aracına göre üst panelden veya alt panelden ödeme yapar.',
        box: { x: 16.3, y: 8.8, w: 16.3, h: 46.4 },
      },
      {
        id: 'side',
        title: 'İki katlı paralel yapı',
        description: 'Yan görünüşte güneşlikli üst gövde ve alt panel görülür; 430 mm derinlik ve 2455 mm yükseklik çizimde işaretlidir.',
        box: { x: 1.22, y: 4.69, w: 13.45, h: 49.3 },
      },
      {
        id: 'service',
        title: 'Servis kapakları',
        description: 'İzometrik görünümde kapaklar açıldığında iç yerleşime ve kolon içindeki bağlantı alanına erişilir.',
        box: { x: 80.28, y: 8.22, w: 17.93, h: 70.42 },
      },
    ],
  },
  process: {
    eyebrow: 'Sahada nasıl çalışır?',
    title: 'Otomobil, kamyon ve TIR aynı noktada ödeme yapar',
    lead: 'Ağır vasıta çıkışında tahsilat, araç sınıfına ve sürücünün kullandığı panele göre uyarlanır.',
    steps: [
      { id: 'class', icon: 'camera', title: 'Araç sınıfı tanınır', description: 'Çekici ve dorse ayrı ayrı tanınır, süreç sınıfa göre yönetilir.' },
      { id: 'panel', icon: 'kiosk', title: 'Panel seçilir', description: 'Sürücü üst panelden veya alt panelden ödeme adımlarını takip eder.' },
      { id: 'payment', icon: 'card', title: 'Ödeme alınır', description: 'HGS, POS ve QR kanalları standart kiosk ile aynı şekilde çalışır.' },
      { id: 'exit', icon: 'barrier', title: 'Geçiş açılır', description: 'Ödemesi tamamlanan araç için geçiş açılır, akış kesintisiz sürer.' },
    ],
  },
  drawing: {
    image: drawingImage(
      'tir-kiosk',
      1227,
      852,
      `${name} teknik çizimi: 300 mm genişlik, 430 mm derinlik ve 2455 mm yükseklik ölçüleriyle yan, ön ve arka görünüşler`,
    ),
    text: 'Yan, ön ve arka görünüşler ile açık ve kapalı izometrik görünümler tek paftada yer alır. Çizimi büyütüp ölçüleri yakından inceleyebilirsiniz.',
    dimensions: [
      { label: 'Genişlik', value: '300 mm' },
      { label: 'Yükseklik', value: '2455 mm' },
      { label: 'Derinlik', value: '430 mm' },
    ],
  },
}
