export const contactCopy = {
  seoTitle: 'İletişim | Visiosoft',
  seoDescription:
    'Visiosoft ile iletişime geçin: WhatsApp, telefon ve e-posta bilgileri, showroom, depo, Living LAB ve Teknopark lokasyonları, şirket bilgileri ve online görüşme planlama.',

  hero: {
    eyebrow: 'İletişim',
    /** Fixed title for screen readers; the visible title cycles through the greetings. */
    srTitle: 'İletişim',
    /** Kept short so each greeting fits one line from 36rem up; narrower screens break after "Merhaba,". */
    greetings: ['Merhaba, nasılsınız?', 'Merhaba, sizi dinliyoruz.', 'Merhaba, buradayız.'],
    lead: 'Satış, destek ve operasyon ekibimize tek yerden ulaşın.',
  },

  channels: {
    id: 'iletisim-kanallari',
    label: 'Doğrudan ulaşın',
    newTab: '(yeni sekmede açılır)',
    whatsapp: {
      eyebrow: 'Satış & WhatsApp Hattı',
      description: 'Hızlı teklif, demo ve satış soruları',
      action: 'WhatsApp ile yazın',
      callAction: 'Arayın',
    },
    dealer: {
      eyebrow: 'Bayi Kanal Yöneticisi',
      name: 'Cihan Topaç',
      phoneDisplay: '+90 530 392 34 68',
      phoneHref: 'tel:+905303923468',
      description: 'Partnerlik, bayi ve saha iş birlikleri',
      action: 'Arayın',
    },
    email: {
      eyebrow: 'Satış ve Destek',
      description: 'Genel iletişim ve destek talepleri',
      action: 'E-posta gönderin',
    },
  },

  locations: {
    id: 'lokasyonlar',
    eyebrow: 'Lokasyonlar',
    title: 'Showroom, depo, Living LAB ve Teknopark.',
    lead: 'Showroom ve depo Şişli’deki Perpa Ticaret Merkezi’nde; Living LAB ve Teknopark Başakşehir’de.',
    listLabel: 'Lokasyon listesi',
    directions: 'Yol tarifi al',
    map: {
      title: 'Lokasyonlarımız haritada',
      description: 'Harita OpenStreetMap üzerinden yüklenir; düğmeye bastığınızda bu hizmete bağlanılır.',
      load: 'Haritayı yükle',
      open: 'OpenStreetMap’te aç',
      src: 'https://www.openstreetmap.org/export/embed.html?bbox=28.78%2C41.05%2C28.99%2C41.11&layer=mapnik',
      href: 'https://www.openstreetmap.org/#map=13/41.0800/28.8850',
    },
  },

  cta: {
    title: 'Otoparkınız için ilk adımı atın.',
    description: 'Keşif ücretsiz ve online yapılır. Giriş-çıkış, tarife ve donanım ihtiyacı görüşmede netleşir.',
  },

  corporate: {
    id: 'sirket-bilgileri',
    eyebrow: 'Kurumsal',
    title: 'Şirket bilgileri',
    lead: 'Resmi yazışma, fatura ve sözleşme süreçlerinde kullanabileceğiniz şirket bilgilerimiz.',
    bankLink: 'Banka hesapları',
    listLabel: 'Visiosoft Teknoloji A.Ş. şirket bilgileri',
    facts: [
      { label: 'Şirket Unvanı', value: 'VİSİOSOFT TEKNOLOJİ A.Ş.' },
      { label: 'Vergi Dairesi', value: 'İKİTELLİ' },
      { label: 'Vergi No', value: '9251021443' },
      { label: 'Firma DUNS', value: '595600260' },
      { label: 'MERSİS Numarası', value: '0925102144300001' },
      { label: 'Ticaret Sicil No / Dosya No', value: '154166-5' },
      { label: 'Kuruluş Tarihi', value: '07-09-2018' },
      { label: 'Elektronik Tebligat Adresi', value: '25929-47072-05048' },
    ],
  },

  meeting: {
    id: 'gorusme',
    eyebrow: 'Online görüşme',
    title: 'Uzmanla 20 dakikada netleşin.',
    lead: 'Otopark ihtiyacınızı canlıda konuşun; uygun günü seçip randevunuzu hemen oluşturun.',
    note: 'Yazılı form yerine hızlı bir görüşme istiyorsanız takvimden slot seçmeniz yeterli.',
    pointsLabel: 'Görüşmede neler konuşulur',
    points: [
      { title: 'Saha ihtiyacı', text: 'Giriş-çıkış, tarife ve plaka tanıma senaryonuzu kısaca dinleriz.' },
      { title: 'Uygun çözüm', text: 'Donanım ve yazılım seçeneklerini operasyonunuza göre çerçeveleriz.' },
      { title: 'Sonraki adım', text: 'Keşif, teklif veya demo için net bir yol haritası çıkarırız.' },
    ],
    panel: {
      eyebrow: 'Randevu',
      title: 'Görüşme takvimi',
      metaLabel: 'Görüşme bilgileri',
      meta: ['20 dk', 'Çevrimiçi', 'Ücretsiz'],
    },
    embedTitle: 'Görüşme takvimini açın',
    embedDescription: 'Uygun günü seçmek için takvimi yükleyin. Calendly bağlantısı güvenli şekilde açılır.',
    load: 'Takvimi aç',
    open: 'Takvimi yeni sekmede açın',
    fallbackUrl: 'https://calendly.com/fatihalp/30min?hide_gdpr_banner=1',
  },
}
