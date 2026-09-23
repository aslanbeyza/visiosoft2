// Geliştiriciler sayfası metinleri — mevcut sayfadan; İngilizce notlar Türkçeleştirildi.
export const developersCopy = {
  seo: {
    title: 'Geliştiriciler | GATE SDK ve ZONE API | Visiosoft',
    description:
      'GATE SDK ve ZONE API ile sahadaki cihazlardan gerçek zamanlı veri alın, kendi uygulamalarınızı geliştirin ve webhook ile süreçleri otomatikleştirin.',
  },
  hero: {
    eyebrow: 'Geliştiriciler için',
    title: 'Yazılımcıdan yazılımcıya.',
    lead: 'SDK ve REST API hazır. Birlikte geliştirelim. GATE SDK ve ZONE API ile sahadaki cihazlardan gerçek zamanlı veri alın, webhook ile süreçleri otomatikleştirin.',
    primary: 'Teknik Ekip ile Görüşün',
    secondary: 'Yazılım Ürünleri',
    terminalLabel: 'GATE ve ZONE örnek olayları',
  },
  code: {
    socket: {
      title: 'wss://gate.visiosoft.com.tr/stream',
      language: 'json',
      code: '{\n  "event": "device.status",\n  "state": "online"\n}',
    },
    webhook: {
      title: 'ZONE API · Webhook',
      language: 'http',
      code: 'POST https://zone.visiosoft.com.tr/api/v1/webhooks\nContent-Type: application/json\n\n{\n  "event": "payment.completed"\n}',
    },
    flow: ['Saha cihazı', 'GATE SDK', 'ZONE Bulut', 'Uygulamanız'],
  },
  subNav: [
    { id: 'gate-sdk', label: 'GATE SDK' },
    { id: 'zone-api', label: 'ZONE API' },
    { id: 'kullanim', label: 'Neler geliştirilebilir' },
  ],
  gate: {
    eyebrow: 'GATE Yazılımı',
    title: 'SDK + WebSocket ile Gerçek Zamanlı Cihaz Erişimi',
    lead: 'GATE SDK ile sahadaki kiosk, bariyer, ödeme terminali ve sensörleri anlık olarak dinleyebilir; WebSocket üzerinden tüm olayları doğrudan kendi uygulamanıza akıtabilirsiniz.',
    points: [
      'Cihaz online/offline durum takibi ve alarm yönetimi',
      'Canlı oturum, geçiş ve ödeme olay yayınları',
      'Saha komutları için güvenli çift yönlü iletişim',
      'Kendi arayüz panelinizi veya mobil operasyon ekranınızı geliştirme imkânı',
    ],
    flow: { inputs: ['Kiosk', 'Bariyer', 'Ödeme terminali', 'Sensörler'], hub: 'GATE SDK', channel: 'WebSocket', outputs: ['Uygulamanız'] },
  },
  zone: {
    eyebrow: 'ZONE Bulut',
    title: 'REST API + Webhook ile Uçtan Uca Entegrasyon',
    lead: 'ZONE API ile tahsilat, abonelik, oturum, doluluk ve kullanıcı verisini ERP, CRM veya finans sistemlerinize bağlayabilir; webhook ile kritik olayları otomatik tetikleyebilirsiniz.',
    points: [
      'Çoklu tesis verisini tek API anahtarıyla yönetim',
      'Detaylı yetkilendirme ve tenant bazlı erişim modeli',
      'Webhook ile ödeme, ihlal, cihaz alarmı ve abonelik olay tetikleme',
      'Kendi raporlama, faturalama ve müşteri portalınızı oluşturma desteği',
    ],
    flow: { inputs: ['Tahsilat', 'Abonelik', 'Oturum', 'Doluluk'], hub: 'ZONE API', channel: 'REST · Webhook', outputs: ['ERP', 'CRM', 'Finans'] },
  },
  flowLabel: (hub: string) => `${hub} veri akışı şeması`,
  useCases: {
    eyebrow: 'Entegrasyon Örnekleri',
    title: 'Kendi ürününüzü bu altyapı üzerinde geliştirebilirsiniz',
    lead: 'Ekipleriniz için API-first, güvenli ve sürdürülebilir bir geliştirme zemini sağlıyoruz.',
    items: [
      { title: 'Ödeme uygulamanız', description: 'Ödeme olaylarını webhook ile kendi uygulamanıza bağlayın.' },
      { title: 'Kurumsal raporlama ekranınız', description: 'Tahsilat, abonelik ve doluluk verisini ZONE API ile kendi panonuza taşıyın.' },
      { title: 'Saha operasyon paneliniz', description: 'GATE SDK ile cihaz durumlarını ve geçişleri canlı izleyin.' },
      { title: 'Mobil müşteri deneyiminiz', description: 'Oturum ve abonelik verisiyle kendi mobil deneyiminizi kurun.' },
    ],
  },
  cta: {
    eyebrow: 'Entegrasyon',
    title: 'Ödeme uygulamanızı, raporlama ekranınızı veya saha panelinizi GATE ve ZONE üzerine kurun.',
    description: 'Kullanım senaryonuzu teknik ekibimizle paylaşın; entegrasyon adımlarını birlikte planlayalım.',
    primary: 'Teknik Ekip ile Görüşün',
    secondary: 'Yazılım Ürünleri',
  },
}
