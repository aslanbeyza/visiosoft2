import { products } from '../../HardwareProduct/products.ts'
import { detailCopy, drawingImage } from '../detailShared.ts'
import type { ProductDetailData } from '../detailTypes.ts'

const product = products.kiosk

export const kioskDetail: ProductDetailData = {
  slug: 'kiosk',
  route: product.route,
  navLabel: product.navLabel,
  copy: product.copy,
  seo: {
    title: 'İnsansız Çıkış Ödeme Kiosk | Visiosoft',
    description:
      'İnsansız çıkış ödeme kiosku: plaka girişi olmadan temassız ödeme, HGS + POS + QR tahsilat ve uzaktan 7/24 takip.',
  },
  hero: {
    kind: 'image',
    image: {
      src: '/img/products/kiosk-2064.webp',
      avif: '/img/products/kiosk-2064.avif',
      width: 545,
      height: 2064,
      alt: 'İnsansız çıkış ödeme kiosku: kırmızı ön panelde ekran, temassız kart okuyucu ve Visiosoft logosu, beyaz kolon ve havalandırmalı taban',
    },
    // Değerler görsel kutusuna göre yüzde: kafa üstü 0,5 · taban altı 99,5 · ön panel 23,7–95,6.
    dimensions: {
      height: { label: '1800 mm', span: { from: 0.5, to: 99.5 }, edges: [24, 1] },
      width: { label: '300 mm', span: { from: 23.7, to: 95.6 }, edges: [0.8, 1.6] },
    },
    note: 'Temsilî görsel: ön panel Visiosoft logosuyla gösterilmiştir.',
  },
  heroMeta: true,
  figures: {
    label: detailCopy.figures.dimensions,
    items: [
      { id: 'width', label: 'Genişlik', value: 300, unit: 'mm' },
      { id: 'height', label: 'Yükseklik', value: 1800, unit: 'mm' },
      { id: 'depth', label: 'Derinlik', value: 297.5, decimals: 1, unit: 'mm' },
      { id: 'channels', label: 'Ödeme kanalları', text: 'HGS · POS · QR', srText: 'HGS, POS ve QR' },
    ],
  },
  explode: true,
  drawing: {
    image: drawingImage(
      'kiosk',
      1233,
      860,
      'İnsansız çıkış ödeme kioskunun teknik çizimi: yan, ön ve arka görünüşler, 300 mm genişlik, 297,5 mm derinlik ve 1800 mm yükseklik ölçüleri',
    ),
    text: 'Yan, ön ve arka görünüşler ile izometrik görünümler tek paftada yer alır. Çizimi büyütüp ölçü detaylarını yakından inceleyebilirsiniz.',
    dimensions: [
      { label: 'Genişlik', value: '300 mm' },
      { label: 'Yükseklik', value: '1800 mm' },
      { label: 'Derinlik', value: '297,5 mm' },
    ],
  },
}
