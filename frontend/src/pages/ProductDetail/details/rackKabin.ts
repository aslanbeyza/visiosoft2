import { products } from '../../HardwareProduct/products.ts'
import { cardImage, detailCopy, drawingImage } from '../detailShared.ts'
import type { ProductDetailData } from '../detailTypes.ts'

const product = products['rack-kabin']
const name = product.copy.name

export const rackKabinDetail: ProductDetailData = {
  slug: 'rack-kabin',
  route: product.route,
  navLabel: product.navLabel,
  copy: product.copy,
  seo: {
    title: product.copy.page_title,
    description: 'Visio Rack Kabin: kontrol, güç ve network ekipmanlarını sahada kilitli ve düzenli barındıran kabin.',
  },
  hero: {
    kind: 'image',
    image: cardImage('rack-kabin', 'Visio Rack Kabin: kırmızı ayaklar üzerinde kilitli kırmızı kapaklı kabin ve üstte havalandırma ızgarası'),
    note: 'Temsilî görsel: kapak logosuz gösterilmiştir.',
  },
  heroMeta: true,
  explode: true,
  figures: {
    label: detailCopy.figures.dimensions,
    items: [
      { id: 'width', label: 'Genişlik', value: 485, unit: 'mm' },
      { id: 'height', label: 'Yükseklik', value: 385, unit: 'mm' },
      { id: 'depth', label: 'Derinlik', value: 350, unit: 'mm' },
      { id: 'security', label: 'Güvenlik', text: 'Kilitli erişim' },
    ],
  },
  zoom: {
    kind: 'drawing',
    eyebrow: detailCopy.zoomEyebrow,
    title: 'Kapağın ardındaki düzeni görün.',
    overview: {
      title: name,
      description: 'Kaydırdıkça ön görünüşe, iç montaj plakasına ve açık kapaklı izometrik görünüme yaklaşın.',
    },
    image: drawingImage('rack-kabin', 1228, 860, `${name} teknik çizimi: yan, ön ve açık kapaklı görünüşler ile izometrik görünüm`),
    details: [
      {
        id: 'front',
        title: 'Kilitli ön kapak',
        description: 'Ön görünüşte kilitli kapak ve ayaklı taşıyıcı yer alır; 385 mm gövde yüksekliği ve 485 mm genişlik çizimde işaretlidir.',
        box: { x: 21.58, y: 11.63, w: 21.17, h: 40.12 },
      },
      {
        id: 'plate',
        title: 'Ekipman montaj plakası',
        description: 'Kapak açıldığında iç montaj plakası ve bağlantı alanı görünür; kontrol, güç ve network ekipmanları burada düzenlenir.',
        box: { x: 50.9, y: 11.63, w: 18.73, h: 33.72 },
      },
      {
        id: 'service',
        title: 'Servis erişimi',
        description: 'İzometrik görünümde açık kapak, iç yerleşim ve yan yüzeydeki açıklık görülür; bakım için gövdeye kolayca erişilir.',
        box: { x: 75.33, y: 9.88, w: 21.17, h: 43.02 },
      },
    ],
  },
  placement: {
    eyebrow: detailCopy.placement.eyebrow,
    title: 'Saha ekipmanlarını geçiş noktasında bir arada tutar.',
    lead: 'Kontrol, güç ve network ekipmanları kilitli kabinde korunur; şeritteki kamera, kiosk ve bariyer bu altyapı üzerinden çalışır.',
    device: 'controlBox',
    deviceLabel: name,
  },
  drawing: {
    image: drawingImage(
      'rack-kabin',
      1228,
      860,
      `${name} teknik çizimi: 485 mm genişlik, 385 mm yükseklik ve 350 mm derinlik ölçüleriyle yan, ön ve açık kapaklı görünüşler`,
    ),
    text: 'Yan, ön ve açık kapaklı görünüşler ile izometrik görünüm tek paftada yer alır. Çizimi büyütüp ölçüleri yakından inceleyebilirsiniz.',
    dimensions: [
      { label: 'Genişlik', value: '485 mm' },
      { label: 'Yükseklik', value: '385 mm' },
      { label: 'Derinlik', value: '350 mm' },
    ],
  },
}
