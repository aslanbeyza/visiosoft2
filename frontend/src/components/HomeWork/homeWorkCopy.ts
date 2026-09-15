/** Tamamlanan işler: mevcut referans metinlerinden, uydurma sonuç yok. */
export const homeWorkCopy = {
  titleId: 'isler-title',
  eyebrow: 'Tamamlanan işler',
  title: 'İsimleri bilinen sahalar.',
  more: 'Tüm referanslar',
  items: [
    {
      sector: 'Belediye ve yol üstü',
      title: 'Bakırköy, Başakşehir, Sarıyer',
      text: 'Yol üstü parklanma; kamera ve HGS ile personelsiz tahsilat.',
      route: 'on-street',
      image: {
        src: '/img/pages/otopark-cikis-1600.webp',
        avif: '/img/pages/otopark-cikis-960.avif 960w, /img/pages/otopark-cikis-1600.avif 1600w',
        webp: '/img/pages/otopark-cikis-960.webp 960w, /img/pages/otopark-cikis-1600.webp 1600w',
        width: 1600,
        height: 1200,
        alt: 'Yol üstü otopark çıkışı: kamera, LED panel ve bariyer',
      },
    },
    {
      sector: 'AVM, otel ve tesis',
      title: 'Metropark AVM, Crowne Plaza, İstanbul Akvaryum',
      text: 'Yoğun saatte plaka geçişi; kioskta ya da HGS ile ödeme.',
      route: 'end-to-end',
      image: {
        src: '/img/pages/otopark-1600.webp',
        avif: '/img/pages/otopark-960.avif 960w, /img/pages/otopark-1600.avif 1600w',
        webp: '/img/pages/otopark-960.webp 960w, /img/pages/otopark-1600.webp 1600w',
        width: 1600,
        height: 1066,
        alt: 'Kapalı otopark katı: şerit çizgileri ve yönlendirme',
      },
    },
    {
      sector: 'Üniversite ve teknopark',
      title: 'YTÜ, Yıldız Teknopark, Marmara Teknokent',
      text: 'Personel aboneliği ve misafir geçişi aynı panelde.',
      route: 'alpr.index',
      image: {
        src: '/img/pages/plaka-tanima-canli-harita-1600.webp',
        avif: '/img/pages/plaka-tanima-canli-harita-960.avif 960w, /img/pages/plaka-tanima-canli-harita-1600.avif 1600w',
        webp: '/img/pages/plaka-tanima-canli-harita-960.webp 960w, /img/pages/plaka-tanima-canli-harita-1600.webp 1600w',
        width: 1600,
        height: 762,
        alt: 'Zone canlı harita: otopark planı ve kamera konumları',
      },
    },
  ],
} as const
