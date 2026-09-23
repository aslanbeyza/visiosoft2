export const contactCopy = {
  seoTitle: 'İletişim | Visiosoft',
  seoDescription:
    'Visiosoft ile iletişime geçin: iletişim formu, WhatsApp ve e-posta, şirket bilgileri ve online görüşme planlama.',
  newTab: '(yeni sekmede açılır)',

  form: {
    id: 'iletisim-formu',
    eyebrow: 'İletişim',
    title: 'Bize yazın.',
    lead: 'Satış, destek veya operasyon için formu doldurun. WhatsApp ve e-posta da açık.',
    submit: 'Mesaj gönder',
    successTitle: 'Mesajınız alındı',
    successBody: 'Satış ve destek ekibimiz en kısa sürede sizinle iletişime geçecektir.',
    messageExample: 'Konunuz, saha ihtiyacı veya sorularınız…',
  },

  steps: [
    { title: 'Mesajınız', description: 'Formu gönderirsiniz; talep kayıt altına alınır.' },
    { title: 'İlk dönüş', description: 'Ekibimiz aynı gün içinde size ulaşır.' },
    { title: 'Yönlendirme', description: 'Teklif, keşif veya destek için doğru kişiyle devam ederiz.' },
  ],

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
