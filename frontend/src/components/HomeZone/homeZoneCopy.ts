/** Ana sayfa 4.4 Zone bölümü metinleri (HOME3 §4.4). */
export const homeZoneCopy = {
  driver: {
    title: 'Sürücünün gördüğü ekranlar',
    kiosk: {
      title: 'Kiosk ödeme ekranı',
      text: 'Sürücü plakasını okutur, tutarı görür ve kartla öder.',
      /** Kart altı künye: ekrandaki arayüz temsilîdir. */
      meta: 'Temsilî arayüz',
      screenLabel: 'Kiosk ödeme ekranı: Hoş geldiniz, ödeme yapmak için kartınızı okutun',
    },
    app: {
      title: 'Mobil uygulama',
      text: 'Sürücü otoparkı bulur, borcunu öder, aboneliğini alır.',
      /** Kart altı künye: marka satırı ve demo verisi uyarısı (ekran görüntüleri demo verisiyle alındı). */
      meta: 'ParkBiz mobil uygulaması · demo verisi',
      screensLabel: 'Uygulama ekranları',
      pause: 'Ekran geçişini duraklat',
      play: 'Ekran geçişini başlat',
      /** Gerçek ParkBiz ekranları (public/img/app, screens.json); dosyalar 780×1692, telefon çerçevesinin ekran alanına oturur. */
      screens: [
        {
          id: 'otoparklar',
          label: 'Otopark bul',
          src: '/img/app/otoparklar',
          alt: 'ParkBiz uygulamasında Otoparklar ekranı: yakındaki otoparklar müsaitlik durumu, mesafe ve adresle listelenir',
        },
        {
          id: 'borc-odeme',
          label: 'Borç öde',
          src: '/img/app/borc-odeme',
          alt: 'ParkBiz uygulamasında Borç Ödeme ekranı: geçiş detayı, ödenecek tutar ve kayıtlı kartla güvenli ödeme',
        },
        {
          id: 'paketler',
          label: 'Abonelik al',
          src: '/img/app/paketler',
          alt: 'ParkBiz uygulamasında Paket Seçimi ekranı: seçili otopark, araç plakası ve aylık, 3 aylık, yıllık abonelik paketleri',
        },
      ],
    },
    payment: {
      title: 'HGS, POS ve QR',
      text: "Sürücü aynı geçişi HGS'den, kartla ya da QR ile öder.",
      methods: ['HGS', 'POS', 'QR'],
    },
    cta: 'Yazılım ürünlerini inceleyin',
  },
} as const

/** Mobil uygulama ekranları arası süre (ms). */
export const APP_INTERVAL = 4000
