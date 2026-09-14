import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

// Otopark Yazılımı sayfası metinleri — mevcut sayfa ve SSS verisinden alınmıştır.
export const parkingSoftwareCopy = {
  seoTitle: 'Otopark Yazılımı | Park Yönetim Sistemi | Visiosoft',
  hero: {
    eyebrow: 'Bulut tabanlı yönetim',
    title: 'Otopark Yazılımı',
    lead: 'Modern ve bulut tabanlı otopark yönetim yazılımı ile operasyonlarınızı dijitalleştirin. Otomatik, güvenilir ve kullanıcı dostu.',
    primary: 'Teklif Al',
    secondary: 'Sık sorulan sorular',
    mapAlt: 'Zone yazılımında bir otoparkın kuş bakışı canlı haritası',
    mapCaption: 'Zone canlı harita ekranı (demo verisi)',
    mapLabel: 'Yazılım modülleri',
  },
  subNav: [
    { id: 'nedir', label: 'Nedir?' },
    { id: 'ozellikler', label: 'Özellikler' },
    { id: 'mimari', label: 'Mimari' },
    { id: 'neden-visiosoft', label: 'Neden Visiosoft' },
    { id: 'sss', label: 'SSS' },
  ],
  explainer: {
    eyebrow: 'Tanım',
    title: 'Otopark Yazılımı Nedir?',
    paragraphs: [
      'Otopark yazılımı, otopark işletmelerinin tüm operasyonlarını dijital ortamda yönetmesini sağlayan kapsamlı bir yönetim platformudur. Araç giriş-çıkış takibi, ücret hesaplama, ödeme alma, abonelik yönetimi ve raporlama gibi süreçleri otomatikleştirir.',
      'Visiosoft otopark yazılımı, bulut tabanlı mimarisi sayesinde her yerden erişilebilir, güvenli ve ölçeklenebilir bir çözüm sunar. Hem küçük otoparklar hem de büyük otopark zincirleri için uygun bir platformdur.',
    ],
    listLabel: 'Otomatikleşen süreçler',
    list: ['Araç giriş-çıkış takibi', 'Ücret hesaplama', 'Ödeme alma', 'Abonelik yönetimi', 'Raporlama'],
  },
  features: {
    eyebrow: 'Modüller',
    title: 'Yazılım Özellikleri',
    lead: 'Sahadaki her adım tek platformda: girişten tahsilata, abonelikten rapora.',
    items: [
      { icon: 'camera', title: 'Araç Giriş-Çıkış', description: 'Otomatik araç tespiti ve kayıt sistemi.' },
      { icon: 'card', title: 'Ödeme Entegrasyonu', description: 'Tüm ödeme yöntemleri ile entegre çalışma.' },
      { icon: 'users', title: 'Abonelik Yönetimi', description: 'Kapsamlı abonelik ve üyelik sistemi.' },
      { icon: 'chart', title: 'Raporlama ve Analiz', description: 'Detaylı gelir ve operasyon raporları.' },
      { icon: 'shield', title: 'Güvenlik Kontrolü', description: 'Kapsamlı güvenlik ve erişim kontrol sistemi.' },
      { icon: 'clock', title: 'Anlık Bildirimler', description: 'Önemli olaylar için otomatik bildirimler.' },
    ] satisfies { icon: FeatureIconName; title: string; description: string }[],
  },
  architecture: {
    eyebrow: 'Mimari',
    title: 'Bağlantı kesilse de saha çalışır.',
    lead: 'Mimari hibrittir: merkezi yönetim bulutta ya da kurum veri merkezinde çalışır; sahadaki Edge Controller kritik işlemleri yerinde yürütür.',
    listLabel: 'Mimari özellikleri',
    list: [
      'Bulut veya kurum veri merkezinde (on-premise) kurulum',
      'İnternet kesintisinde plaka okuma, bariyer kontrolü ve geçiş logları çalışmaya devam eder',
      'Bağlantı geri geldiğinde veriler merkezi sunucuya otomatik senkronize edilir',
      'SSL/TLS ile veri aktarımı, AES-256 seviyesinde şifreli depolama',
      'Rol bazlı yetkilendirme ve zaman damgalı loglar',
    ],
    diagramLabel: 'Hibrit mimari şeması',
    nodes: {
      field: { title: 'Saha', items: ['Kamera', 'Bariyer', 'Kiosk'] },
      edge: { title: 'Edge Controller', note: 'Offline modda çalışır' },
      center: { title: 'Merkezi yönetim', note: 'Bulut veya on-premise' },
    },
    links: { local: 'Yerel ağ', sync: 'Otomatik senkronizasyon' },
  },
  reasons: {
    eyebrow: 'Neden Visiosoft',
    title: 'Neden Visiosoft Yazılımı?',
    items: [
      { title: 'İnsansız Çalışma', description: 'Otomatik süreçlerle personel ihtiyacı en aza iner.' },
      { title: 'Maliyet Tasarrufu', description: 'Otomasyon, operasyonel giderleri düşürmeye yardımcı olur.' },
      { title: 'Gelir Artışı', description: 'Kaçak önleme ve verimli yönetimle gelir artışı.' },
      { title: 'Müşteri Memnuniyeti', description: 'Hızlı ve sorunsuz hizmetle yüksek memnuniyet.' },
    ],
  },
  faqEyebrow: 'SSS',
  faqLabel: 'Otopark yazılımı sık sorulan sorular',
  cta: {
    eyebrow: 'Demo',
    title: 'Başlamaya Hazır mısınız?',
    description: 'Demo için bizimle iletişime geçin, sistemimizi kendi senaryolarınızla birlikte inceleyelim.',
    primary: 'Teklif Al',
    secondary: 'İletişim',
  },
}
