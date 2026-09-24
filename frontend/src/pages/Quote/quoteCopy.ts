export const quoteCopy = {
  seo: {
    title: 'Ücretsiz Keşif ve Teklif - Visiosoft',
    description:
      'Otoparkınız için ücretsiz teklif ve online keşif isteyin: bilgilerinizi bırakın ya da 3 soruda gereken kiosk, HGS ve bariyeri görün.',
  },
  form: {
    id: 'teklif-formu',
    eyebrow: 'Ücretsiz keşif ve teklif',
    title: 'Bilgilerinizi bırakın, sizi arayalım.',
    lead: 'Teklif, ücretsiz online keşif ya da başka bir konu için formu doldurun. WhatsApp ve e-posta da açık.',
    submit: 'Gönder',
    topics: {
      legend: 'Konu',
      options: [
        { kind: 'quote', label: 'Teklif' },
        { kind: 'discovery', label: 'Ücretsiz online keşif' },
        { kind: 'contact', label: 'Diğer soru / destek' },
      ],
    },
    messageExample: 'Otopark kapasitesi, giriş-çıkış sayısı vb.',
  },
  fastPath: {
    title: '3 soruda hızlı teklif',
    text: 'Otopark modelinizi seçin; gereken kiosk, HGS ve bariyer anında listelensin.',
    link: 'Teklif motorunu başlat',
    route: 'parking-quote-engine.index',
  },

  steps: [
    { title: 'Ücretsiz Online Keşif', description: 'Otoparkınızı online görüşmede inceler, maliyetsiz ilk kapsamı netleştiririz.' },
    { title: 'Teklif & Sözleşme (Online)', description: 'Ticari şartlar şeffaf şekilde iletilir ve online tamamlanır.' },
    { title: 'Operasyon', description: 'Canlıya alır, otopark süreçlerinizi sürekli izler ve destekleriz.' },
  ],
} as const
