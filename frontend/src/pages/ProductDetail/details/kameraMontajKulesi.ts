import { products } from '../../HardwareProduct/products.ts'
import { cardImage, detailCopy } from '../detailShared.ts'
import type { ProductDetailData } from '../detailTypes.ts'
import { metaFigures } from './visiobox.ts'

const product = products['kamera-montaj-kulesi']
const name = product.copy.name

export const kameraMontajKulesiDetail: ProductDetailData = {
  slug: 'kamera-montaj-kulesi',
  route: product.route,
  navLabel: product.navLabel,
  copy: product.copy,
  seo: {
    title: product.copy.page_title,
    description: 'Visio Kamera Montaj Kulesi: kameraları yüksekten konumlandırmak için modüler, dayanıklı ve iç kablo kanallı kule.',
  },
  hero: {
    kind: 'image',
    image: cardImage('kamera-montaj-kulesi', 'Visio Kamera Montaj Kulesi: kırmızı üst tabla, kırmızı panelli beyaz gövde ve beyaz sabitleme tabanı'),
    // Kart görselinde kulenin tabanı kutunun %87,9'unda biter.
    baseGap: 12.1,
  },
  heroMeta: false,
  figures: { label: detailCopy.figures.profile, items: metaFigures(product.copy) },
  zoom: {
    kind: 'callouts',
    eyebrow: detailCopy.zoomEyebrow,
    title: 'Tabladan tabana, üç parça.',
    lead: 'Kule; kamerayı taşıyan üst tabla, kablolamayı koruyan modüler gövde ve zemine sabitlenen tabandan oluşur.',
    image: cardImage('kamera-montaj-kulesi', `${name}: üst tabla, modüler gövde ve sabitleme tabanı`),
    callouts: [
      {
        id: 'top',
        title: 'Üst montaj tablası',
        description: 'Kamera ağırlığına uygun dengeli tasarım; kamera ekipmanı kulenin üst tablasına yerleştirilir.',
        x: 50,
        y: 10.5,
      },
      {
        id: 'body',
        title: 'Modüler gövde ve iç kanal',
        description: 'Modüler yükseklik seçenekleri sunar; kablolama gövdenin içindeki kanaldan korunarak geçer.',
        x: 50,
        y: 46,
      },
      {
        id: 'base',
        title: 'Güvenli sabitleme tabanı',
        description: 'Zemin ankrajına uygun sağlam taban, kuleyi sahada güvenle sabitler.',
        x: 50,
        y: 81,
      },
    ],
  },
  placement: {
    eyebrow: detailCopy.placement.eyebrow,
    title: 'Kamerayı şeridi en iyi gören noktaya taşır.',
    lead: 'Montaj kulesi, giriş ve çıkış şeritlerinde plaka tanıma kamerasını yüksekten konumlandırır; kablolama kule gövdesinin içinden geçer.',
    device: 'pole',
    deviceLabel: name,
  },
}
