export type CatalogItem = {
  route: string
  image: string
  icon: string
  navLabel: string
  tag: string
  title: string
  desc: string
}

export const hubSeo = {
  title: 'Donanım Ürünleri | 3D Ürün Kataloğu - Visiosoft',
  description:
    'Visiosoft donanım kataloğu: İnsansız Çıkış Ödeme Kiosk, İnsansız Çıkış Ödeme Kiosk TIR Versiyonu, Visiobox, Rack Kabin, Kamera Muhafaza, Kamera Montaj Kulesi ve Ledli Reklam Paneli. 3D ürün sayfalarıyla detaylı inceleme.',
}

export const heroContent = {
  eyebrow: 'Visiosoft donanım',
  title: 'Yerli Üretim Otopark Donanımları.',
  description: 'Kiosk, kabin, kontrol kutusu ve saha ekipmanlarını geliştiriyor, üretiyor ve kurulum sonrası destekliyoruz.',
  points: [
    { title: 'Tüm donanımlar tek merkezde', description: 'İhtiyacınız olan tüm otopark donanımlarını bünyemizde üretiyoruz.' },
    { title: 'Tüm ürünler uyumlu', description: 'Tüm ürünlerimiz birlikte mükemmel şekilde çalışacak şekilde tasarlanır.' },
    { title: 'En son teknoloji', description: "Ürünlerimiz Nvidia'nın son teknolojisini kullanmaktadır." },
  ],
}

export const catalogSection = {
  eyebrow: 'Ürünler',
  title: 'Donanım ürünleri.',
  description: 'Kiosk, kontrol kutusu, kabin ve saha bileşenlerini inceleyin.',
  cta: 'A4 Katalog ve Yazdır',
}

export const catalogItems: CatalogItem[] = [
  {
    route: 'hardware-products.kiosk',
    image: '/img/kioks2.webp',
    icon: '💳',
    navLabel: 'Kiosk',
    tag: 'Kiosk',
    title: 'İnsansız Çıkış Ödeme Kiosk',
    desc: 'Plaka girişi gerektirmeden çıkışta temassız ödeme alan, HGS + POS + QR destekli kiosk çözümü.',
  },
  {
    route: 'hardware-products.tir-kiosk',
    image: '/img/tir-kiosk.png',
    icon: '🚚',
    navLabel: 'TIR Kiosk',
    tag: 'TIR',
    title: 'İnsansız Çıkış Ödeme Kiosk TIR Versiyonu',
    desc: 'TIR ve kamyon garajları için iki katlı paralel çalışan, üst/alt panelden ödeme alabilen kiosk çözümü.',
  },
  {
    route: 'hardware-products.visiobox',
    image: '/img/visio_parking_box_pro.webp',
    icon: '📦',
    navLabel: 'Visiobox',
    tag: 'Kontrol Kutusu',
    title: 'Visiobox',
    desc: 'Kameralardan görüntülenen plaka ve aracı tanıtan teknoloji.',
  },
  {
    route: 'hardware-products.rack-kabin',
    image: '/img/minikabin.webp',
    icon: '🖥',
    navLabel: 'Rack Kabin',
    tag: 'Kabin',
    title: 'Visio Rack Kabin',
    desc: 'Saha ekipmanları için güvenli ve düzenli kabin.',
  },
  {
    route: 'hardware-products.kamera-muhafaza',
    image: '/img/kamera_muhafazasi.webp',
    icon: '📷',
    navLabel: 'Kamera Muhafaza',
    tag: 'Koruma',
    title: 'Visio Kamera',
    desc: 'Dış ortam kameraları için koruyucu muhafaza.',
  },
  {
    route: 'hardware-products.kamera-montaj-kulesi',
    image: '/img/kamera-montaj-kulesi.png',
    icon: '🗼',
    navLabel: 'Kamera Montaj Kulesi',
    tag: 'Montaj',
    title: 'Visio Kamera Montaj Kulesi',
    desc: 'Yüksekten konumlandırma için modüler montaj.',
  },
  {
    route: 'hardware-products.ledli-reklam-paneli',
    image: '/img/ucret_gostergesi_led_reklam.webp',
    icon: '📺',
    navLabel: 'Ledli Reklam Paneli',
    tag: 'Panel',
    title: 'Visio Ledli Reklam Paneli',
    desc: 'Yönlendirme ve duyuru için yüksek görünürlük.',
  },
]
