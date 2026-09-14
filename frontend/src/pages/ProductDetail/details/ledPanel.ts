import { products } from '../../HardwareProduct/products.ts'
import { detailCopy, drawingImage } from '../detailShared.ts'
import type { ProductDetailData } from '../detailTypes.ts'

const product = products['ledli-reklam-paneli']
const name = product.copy.name
const drawingAlt = `${name} teknik çizimi: yan, ön ve arka görünüşler, açık kapaklı perspektif ve LED tabela montaj kutusu notları`

export const ledPanelDetail: ProductDetailData = {
  slug: 'ledli-reklam-paneli',
  route: product.route,
  navLabel: product.navLabel,
  copy: product.copy,
  seo: {
    title: product.copy.page_title,
    description: 'LED Bilgilendirme Paneli: otopark girişinde yönlendirme, tarife ve duyuru mesajları için yüksek görünürlüklü LED panel.',
  },
  hero: {
    kind: 'ledPanel',
    alt: `${name} görünüşü: üstte LED mesaj alanı, altında reklam yüzeyi ve kırmızı taşıyıcı ayak; 715 mm genişlik ve 1900 mm toplam yükseklik`,
    note: 'Temsilî çizim: görünüş, teknik çizimdeki oranlarla hazırlanmıştır.',
  },
  heroMeta: true,
  figures: {
    label: detailCopy.figures.dimensions,
    items: [
      { id: 'width', label: 'Genişlik', value: 715, unit: 'mm' },
      { id: 'height', label: 'Yükseklik', value: 1900, unit: 'mm' },
      { id: 'depth', label: 'Derinlik', value: 100, unit: 'mm' },
      { id: 'usage', label: 'Kullanım', text: 'İç ve dış ortam' },
    ],
  },
  zoom: {
    kind: 'drawing',
    eyebrow: detailCopy.zoomEyebrow,
    title: 'Mesaj alanından montaj kutusuna.',
    overview: {
      title: name,
      description: 'Kaydırdıkça LED mesaj alanına, gövde ölçülerine ve kapıya entegre reklam alanına yaklaşın.',
    },
    image: drawingImage('ledli-reklam-paneli', 987, 695, drawingAlt),
    details: [
      {
        id: 'front',
        title: 'LED mesaj alanı',
        description: 'Ön görünüşte üstte LED mesaj alanı, altında geniş reklam yüzeyi yer alır; panel 715 mm genişliktedir.',
        box: { x: 9.63, y: 0.72, w: 13.68, h: 35.97 },
      },
      {
        id: 'body',
        title: 'Gövde ve taşıyıcı',
        description: 'Arka görünüşte panel gövdesi, havalandırma yarıkları ve taşıyıcı ayak ile 1900 mm toplam yükseklik işaretlidir.',
        box: { x: 22.8, y: 2.88, w: 25.33, h: 47.48 },
      },
      {
        id: 'door',
        title: 'Kapıya entegre reklam alanı',
        description: 'Kapak açıldığında LED tabela montaj kutusuna erişilir; reklam yapıştırma alanı kapıya entegre olduğu için işlem rahatça yapılır.',
        box: { x: 63.83, y: 1.44, w: 35.97, h: 66.19 },
      },
    ],
  },
  placement: {
    eyebrow: detailCopy.placement.eyebrow,
    title: 'Sürücüyü girişte bilgilendirir.',
    lead: 'LED panel, otopark girişinde yönlendirme, tarife ve duyuru mesajlarını sürücünün şeride girmeden göreceği noktada gösterir.',
    device: 'ledPanel',
    deviceLabel: name,
  },
  drawing: {
    image: drawingImage('ledli-reklam-paneli', 987, 695, drawingAlt),
    text: 'Yan, ön ve arka görünüşler ile açık kapaklı perspektif tek paftada yer alır. Çizimi büyütüp ölçüleri ve montaj notlarını yakından inceleyebilirsiniz.',
    dimensions: [
      { label: 'Genişlik', value: '715 mm' },
      { label: 'Yükseklik', value: '1900 mm' },
      { label: 'Derinlik', value: '100 mm' },
    ],
  },
}
