import type { ProductZoomDetail, ProductZoomImage } from '../components/ProductZoom/index.ts'

/**
 * Kiosk yakınlaşma sahnesi. Görsel, kiosk ürün görselinin arka planı ayrılmış tam çözünürlüklü kesitidir (545x2064).
 * Detay kutuları bu kesite göre yüzde; yalnızca görselde gerçekten görünen parçaları gösterir.
 */
export const kioskZoomImage: ProductZoomImage = {
  src: '/img/products/kiosk-2064.webp',
  avif: '/img/products/kiosk-2064.avif',
  width: 545,
  height: 2064,
  alt: 'Visiosoft insansız çıkış ödeme kiosku: kırmızı ön panel, ekran, temassız kart okuyucu ve beyaz kolon',
}

/** Kiosk görselindeki ekran camının kesit içindeki yeri (yüzde). Cam 3/4 açıdan göründüğü için dar görünür. */
export const kioskScreenBox = { x: 51.19, y: 9.74, w: 28.81, h: 14.92 }

export const kioskZoomDetails: ProductZoomDetail[] = [
  {
    id: 'screen',
    title: 'Ödeme ekranı',
    description: 'Sürücü ödeme adımlarını ekrandan takip eder. Cihaz süreçleri yönetim panelinden uzaktan 7/24 izlenebilir.',
    box: { x: 46.06, y: 8.28, w: 40.37, h: 17.93 },
  },
  {
    id: 'reader',
    title: 'Temassız kart okuyucu',
    description: 'Banka kartı ve temassız ödeme POS üzerinden alınır; HGS ve QR kanallarıyla aynı tahsilat akışında çalışır.',
    box: { x: 36.51, y: 31.64, w: 49.54, h: 8.24 },
  },
  {
    id: 'panel',
    title: 'Kurumsal giydirme alanı',
    description: 'Ön panel, işletmenin veya ödeme iş ortağının kurumsal kimliğiyle giydirilir. Bu örnekte bir banka iş birliği görülüyor.',
    box: { x: 38.35, y: 40.84, w: 55.05, h: 15.5 },
  },
  {
    id: 'base',
    title: 'Havalandırmalı taban',
    description: 'Izgaralı taban plakası dört noktadan zemine sabitlenir. Kiosk 300 mm genişlik ve 1800 mm yüksekliktedir.',
    box: { x: 0, y: 86.97, w: 100, h: 13.03 },
  },
]

export const kioskZoomCopy = {
  eyebrow: 'Yakından inceleyin',
  title: 'Sahada çalışan her parçayı yakından görün.',
  overview: {
    title: 'İnsansız Çıkış Ödeme Kiosk',
    description: 'Kaydırdıkça kioskun ödeme ekranına, kart okuyucusuna, ön paneline ve tabanına yaklaşın.',
  },
}
