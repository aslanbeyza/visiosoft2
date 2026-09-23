import { products } from '../../HardwareProduct/products.ts'
import { cardImage, detailCopy, drawingImage } from '../detailShared.ts'
import type { KeyFigure, ProductDetailData } from '../detailTypes.ts'
import type { ProductCopy } from '../../HardwareProduct/products.ts'

const product = products.visiobox

/** Ölçüsü products.ts'te bulunmayan ürünlerde künye satırları ölçü bandında gösterilir. */
export const metaFigures = (copy: ProductCopy): KeyFigure[] =>
  copy.meta.map((item, index) => ({ id: `meta-${index}`, label: item.label, text: item.value }))

const drawingAlt =
  'Toger Parking Box Lite ve Pro teknik çizimi: üst, ön ve alt görünüşler, izometrik görünümler ve arka yüzeydeki montaj aparatları'

export const visioboxDetail: ProductDetailData = {
  slug: 'visiobox',
  route: product.route,
  navLabel: product.navLabel,
  copy: product.copy,
  seo: {
    title: product.copy.page_title,
    description: 'Visiobox: Box Lite ve Box Pro seçenekleriyle bariyer ve sensörler için kompakt kontrol kutusu.',
  },
  hero: {
    kind: 'image',
    image: cardImage('visiobox', 'Visiobox kontrol kutusu: kırmızı kilitli ön kapak, ParkBiz markalı üst yüzey ve beyaz metal gövde'),
    note: 'Görsel, Box Pro seçeneğini gösterir.',
  },
  heroMeta: false,
  explode: true,
  figures: { label: detailCopy.figures.profile, items: metaFigures(product.copy) },
  zoom: {
    kind: 'drawing',
    eyebrow: detailCopy.zoomEyebrow,
    title: 'İki seçenek, tek paftada.',
    overview: {
      title: product.copy.name,
      description: 'Kaydırdıkça Box Lite ve Box Pro ön görünüşlerine, kablo girişlerine ve montaj aparatlarına yaklaşın.',
    },
    image: drawingImage('visiobox', 1228, 857, drawingAlt),
    details: [
      {
        id: 'options',
        title: 'Box Lite ve Box Pro',
        description: 'Kare gövdeli Box Lite ile daha geniş Box Pro aynı paftada, ölçü çağrılarıyla birlikte yer alır. İki kutuda da ön kapak kilitlidir.',
        box: { x: 0, y: 16.34, w: 58.63, h: 30.34 },
      },
      {
        id: 'ports',
        title: 'Kablo girişleri ve fan',
        description: 'Alt görünüşte kablo bağlantıları için girişler ve havalandırma fanı görülür; bağlantılar gövdeye düzenli girer.',
        box: { x: 32.98, y: 49.59, w: 24.02, h: 15.17 },
      },
      {
        id: 'mounts',
        title: 'Duvar ve direk montajı',
        description: 'Arka yüzeyde duvar askı aparatı ve direk montaj kordonu aparatı işaretlidir; kutu sahada duvara ya da direğe sabitlenir.',
        box: { x: 36.64, y: 61.84, w: 63.11, h: 35.59 },
      },
    ],
  },
  placement: {
    eyebrow: detailCopy.placement.eyebrow,
    title: 'Bariyer ve sensörleri geçiş noktasında yönetir.',
    lead: 'Plaka okunduktan sonra kontrol kutusu kaydı doğrular, bariyer ve sensörlerle haberleşir; işlemi tamamlanan araç için geçiş açılır.',
    device: 'controlBox',
    deviceLabel: product.copy.name,
  },
  drawing: {
    image: drawingImage('visiobox', 1228, 857, drawingAlt),
    text: 'Box Lite ve Box Pro seçeneklerinin üst, ön ve alt görünüşleri, izometrik görünümleri ve arka yüzeydeki montaj aparatları tek paftada yer alır.',
    note: 'Çizimdeki etiket alanı ürün tanıtım örneğidir.',
    dimensions: [],
  },
}

const toger = products.togerbox

/** Togerbox, Visiobox verisini kendi adı ve kısa tanımıyla kullanır; yakın inceleme ürün görsellerinden oluşur. */
export const togerboxDetail: ProductDetailData = {
  ...visioboxDetail,
  slug: 'togerbox',
  route: toger.route,
  navLabel: toger.navLabel,
  copy: toger.copy,
  seo: {
    title: toger.copy.page_title,
    description: 'Togerbox: bariyer ve sensörler için otopark kontrolünü sadeleştiren kompakt kontrol kutusu.',
  },
  hero: {
    kind: 'image',
    image: cardImage('visiobox', 'Togerbox kontrol kutusu: kırmızı kilitli ön kapak, etiket alanı ve beyaz metal gövde'),
  },
  figures: { label: detailCopy.figures.profile, items: metaFigures(toger.copy) },
  zoom: {
    kind: 'gallery',
    eyebrow: detailCopy.zoomEyebrow,
    title: 'Kapak, bağlantı yüzeyi ve montaj.',
    lead: 'Kilitli ön kapaktan kablo girişlerine ve arka yüzeydeki montaj aparatlarına kadar kutunun sahada kullanılan yüzleri.',
    // Kahramandaki görünüm ve bölümdeki tam pafta tekrarlanmaz: ön görünüş kırpması, bağlantı yüzeyi yakın planı ve montaj.
    items: [
      {
        id: 'front',
        image: {
          src: '/img/products/togerbox/on-gorunus.webp',
          avif: '/img/products/togerbox/on-gorunus.avif',
          width: 352,
          height: 264,
          alt: 'Teknik çizimden ön görünüş: 400 × 300 mm gövde, kilitli ön kapak ve etiket alanı',
        },
        caption: 'Kilitli ön kapak, 400 × 300 mm gövde (teknik çizim)',
        fit: 'contain',
      },
      {
        id: 'ports',
        image: {
          src: '/img/products/togerbox/baglanti-yuzeyi.webp',
          avif: '/img/products/togerbox/baglanti-yuzeyi.avif',
          width: 528,
          height: 396,
          alt: 'Kutunun yan yüzü yakın plan: güç girişi, kapaklı kablo bağlantı soketleri ve havalandırma fanı ızgarası',
        },
        caption: 'Güç girişi, kapaklı soketler ve fan',
        fit: 'cover',
      },
      {
        id: 'mounts',
        image: {
          src: '/img/products/drawings/visiobox-mounts.webp',
          avif: '/img/products/drawings/visiobox-mounts.avif',
          width: 775,
          height: 305,
          alt: 'Teknik çizimden arka yüzey: duvar askı aparatı ve direk montaj kordonu aparatı',
        },
        caption: 'Duvar askı ve direk montaj aparatları (teknik çizim)',
        fit: 'contain',
      },
    ],
  },
  placement: visioboxDetail.placement ? { ...visioboxDetail.placement, deviceLabel: toger.copy.name } : undefined,
}
