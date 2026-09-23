import { products } from '../../HardwareProduct/products.ts'
import { cardImage, detailCopy, drawingImage } from '../detailShared.ts'
import type { ProductDetailData } from '../detailTypes.ts'
import { metaFigures } from './visiobox.ts'

const product = products['kamera-muhafaza']
const name = product.copy.name
const drawingAlt = `${name} teknik çizimi: ön, yan ve arka görünüşler ile montaj ayaklı perspektif görünüm`

export const kameraMuhafazaDetail: ProductDetailData = {
  slug: 'kamera-muhafaza',
  route: product.route,
  navLabel: product.navLabel,
  copy: product.copy,
  seo: {
    title: product.copy.page_title,
    description: 'Visio Kamera: plaka tanıma ve dış ortam kameralarını koruyan, ayarlanabilir montaj ayaklı muhafaza.',
  },
  hero: {
    kind: 'image',
    image: cardImage('kamera-muhafaza', 'Visio Kamera muhafazası: kırmızı güneşlikli gövde, beyaz ön yüz, ParkBiz markalı yan panel ve duvar plakalı montaj ayağı'),
  },
  heroMeta: false,
  figures: { label: detailCopy.figures.profile, items: metaFigures(product.copy) },
  zoom: {
    kind: 'drawing',
    eyebrow: detailCopy.zoomEyebrow,
    title: 'Gövdeden montaj ayağına kadar.',
    overview: {
      title: name,
      description: 'Kaydırdıkça ön yüze, güneşlikli gövdeye ve ayarlanabilir montaj ayağına yaklaşın.',
    },
    image: drawingImage('kamera-muhafaza', 1227, 850, drawingAlt),
    details: [
      {
        id: 'front',
        title: 'Vidalı ön yüz',
        description: 'Ön görünüşte kameranın baktığı cam alanı ve dört vidayla sabitlenen yüzey yer alır; bakım ve temizlik için erişilir.',
        box: { x: 4.89, y: 9.41, w: 15.89, h: 27.06 },
      },
      {
        id: 'body',
        title: 'Güneşlikli gövde',
        description: 'Yan görünüşte gövdeyi örten güneşlik ve altındaki montaj ayağı birlikte görülür; gövde darbe ve hava koşullarına karşı korur.',
        box: { x: 30.15, y: 9.41, w: 35.05, h: 27.06 },
      },
      {
        id: 'arm',
        title: 'Ayarlanabilir montaj ayağı',
        description: 'Mafsallı ayak ve duvar plakası, kameranın açısını ve yönünü sahada pratik biçimde ayarlamayı sağlar.',
        box: { x: 48.08, y: 62.35, w: 24.45, h: 23.53 },
      },
    ],
  },
  placement: {
    eyebrow: detailCopy.placement.eyebrow,
    title: 'Plakayı okuyan kamerayı dış koşullardan korur.',
    lead: 'Muhafaza, giriş ve çıkış şeridindeki plaka tanıma kamerasını taşır; araç şeride girdiğinde kamera plakayı okur ve akış başlar.',
    device: 'camera',
    deviceLabel: name,
  },
  drawing: {
    image: drawingImage('kamera-muhafaza', 1227, 850, drawingAlt),
    text: 'Ön, yan ve arka görünüşler ile montaj ayaklı perspektif görünüm tek paftada yer alır. Çizimi büyütüp detayları yakından inceleyebilirsiniz.',
    note: 'Çizimdeki gövde yazısı ürün tanıtım örneğidir.',
    dimensions: [],
  },
}
