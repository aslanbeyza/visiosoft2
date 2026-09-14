/** /ucretsiz-kesif metinleri; ifadeler tr.json ve süreç metinlerinden alınmıştır. */
export const discoveryCopy = {
  seo: {
    title: 'Ücretsiz Keşif - Visiosoft',
    description:
      'Otoparkınız için ücretsiz keşif talep edin. Uzman ekibimiz yerinde inceleme yapsın, size en uygun çözümü sunalım.',
  },
  hero: {
    eyebrow: 'Ücretsiz Keşif',
    title: 'Otoparkınızı yerinde inceleyelim.',
    lead: 'Size en uygun çözümü projelendirelim. Adresinizi bırakın, ekibimiz randevu için sizinle iletişime geçsin.',
  },
  route: {
    label: 'Keşif talebinizin izleyeceği yol',
    steps: ['Talebiniz', 'Randevu', 'Yerinde keşif', 'Projelendirme'],
  },
  form: {
    id: 'kesif-formu',
    eyebrow: 'Talep formu',
    title: 'Keşif bilgileri',
    lead: 'Otoparkın adresini ve iletişim bilgilerinizi bırakın.',
    submit: 'Keşif İste',
    successTitle: 'Keşif talebiniz alındı',
    successBody:
      'Ücretsiz keşif talebiniz bize ulaştı. Ekibimiz en kısa sürede sizinle iletişime geçerek randevu oluşturacaktır.',
    messageExample: 'Otopark kapasitesi, giriş-çıkış sayısı vb.',
  },
  /** Ana sayfa "Keşiften canlı operasyona." süreç adımları. */
  steps: [
    { title: 'Keşif', description: 'Giriş-çıkış, tarife ve entegrasyon yerinde netleşir.' },
    { title: 'Kurulum', description: 'Kamera, kiosk ve panel planlanan takvimde devreye alınır.' },
    { title: '7/24 izleme', description: 'Bariyer, tahsilat ve arıza uzaktan takip edilir.' },
  ],
} as const
