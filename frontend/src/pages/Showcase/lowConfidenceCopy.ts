export const forkCopy = {
  id: 'onay-akisi',
  headingId: 'onay-akisi-baslik',
  eyebrow: 'Çift katmanlı yapı',
  title: 'Sistem emin olamadığında karar insana geçer.',
  lead: 'Yapay zeka destekli PTS okumaları sürekli kontrol edilir; düşük güvenli geçişler operatör onayına ayrılır.',
  label: 'Düşük güvenli okuma onay akışı',
  plate: '34 ••• ••',
  source: {
    kicker: '01 · PTS okuması',
    title: 'Yapay zeka destekli okuma',
    text: 'Her geçişte plaka okunur ve okumanın güven oyu (confidence) belirlenir.',
  },
  check: {
    kicker: '02 · Güven kontrolü',
    title: 'Sistem emin mi?',
    text: 'Güven oyu kontrol edilir; geçiş iki yoldan birine ayrılır.',
  },
  high: {
    tag: 'Yüksek güven',
    title: 'Otomatik geçiş',
    text: 'Otomasyon hızı korunur; geçiş otomatik olarak tamamlanır.',
  },
  low: {
    tag: "Düşük güven · yaklaşık %1",
    title: 'Operatör onayı',
    text: 'Onay mekanizmasına düşer ve gerçek insan tarafından doğrulanır.',
    verified: 'İnsan onaylı',
  },
}

export const approvalCopy = {
  id: 'onay-ekrani',
  eyebrow: 'Merkezden yönetim',
  title: 'İşimizi şansa bırakmıyoruz.',
  image: {
    src: '/img/pages/onay-ekrani-crop.webp',
    avif: '/img/pages/onay-ekrani-crop.avif',
    width: 1010,
    height: 448,
    alt: 'Onay ekranı: okunan plaka, iki kamera görüntüsü, park kaydı ile Onayla ve Reddet düğmeleri',
  },
  caption: 'Onay ekranı — iş ortağı paneli · demo verisi',
}

export const lowFeaturesCopy = {
  id: 'dusuk-guven-faydalar',
  eyebrow: 'Neden önemli?',
  title: 'Hız ve doğruluk bir arada.',
  items: [
    {
      key: 'merkez',
      title: 'Merkezden yönetim',
      description: 'Geçişler merkezden yönetilir; yapay zeka destekli PTS okumaları sürekli kontrol edilir.',
    },
    {
      key: 'hiz',
      title: 'Otomasyon hızı',
      description: 'Yalnızca sistemin emin olamadığı geçişler onaya düşer; diğerleri otomatik ilerler.',
    },
    {
      key: 'dogruluk',
      title: 'Tahsilat ve güvenlik doğruluğu',
      description: 'Çift katmanlı yapı, tahsilat ve güvenlik doğruluğunu en üst seviyede tutar.',
    },
  ],
}
