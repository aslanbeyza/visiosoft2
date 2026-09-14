// /site-fiyatlari sayfasının Türkçe metinleri (mevcut sayfa metinlerinden taşındı).

/** Sayfada gösterilen ve JSON-LD Offer'da kullanılan başlangıç fiyatı (müşteri onayına bağlı; raporda listelendi). */
export const price = { amount: '1499', label: '$1.499+', currency: 'USD' }

export const pricingCopy = {
  seo: {
    title: 'Site Otopark Yönetim Sistemi | Bulut Tabanlı Çözüm - Visiosoft',
    description:
      'Site otoparkları için bulut tabanlı otopark yönetim sistemi. Her yerden erişim, kat başına araç sınırı, plaka tanıma, abone ve misafir yönetimiyle 1.499 dolardan başlayan fiyatlar.',
  },
  hero: {
    eyebrow: 'Site Otoparkları',
    title: 'Site otopark yönetimi için bulut tabanlı sistem.',
    lead: 'Visiosoft; apartman, site ve rezidans otoparklarında araç giriş-çıkışlarını tek panelden yönetmenizi sağlar. Her yerden erişilebilen bulut altyapısı ile kat başına araç sınırı, plaka tanıma, abone ve misafir yönetimi daha düzenli hale gelir.',
    primary: 'Teklif Al',
    secondary: 'Özellikleri İnceleyin',
  },
  card: {
    label: 'Başlangıç',
    note: 'Net fiyat; giriş-çıkış sayısı, kat yapısı, kamera/bariyer ihtiyacı ve entegrasyon kapsamına göre belirlenir.',
    // Kart kısa kalsın diye yalnızca başlıklar; ayrıntılar hemen alttaki Özellikler bölümünde.
    highlights: [{ title: 'Bulut tabanlı erişim' }, { title: 'Kat başına araç sınırı' }, { title: 'Plaka ve abone yönetimi' }],
  },
  diagram: {
    label: 'Site kesiti: kapalı otopark katları ve açık otopark alanı bulut panele bağlanır; panel her yerden erişilebilir.',
    floors: ['Açık otopark', 'Kat -1', 'Kat -2'],
    cloud: 'Bulut panel',
    devices: 'Ofis · saha · uzaktan',
    note: 'Site kesiti · temsilî çizim',
  },
  subNav: [
    { id: 'ozellikler', label: 'Özellikler' },
    { id: 'kurulum', label: 'Kurulum süreci' },
    { id: 'sistem', label: 'Sistem nedir?' },
    { id: 'sss', label: 'Sık sorulan sorular' },
  ],
  features: {
    eyebrow: 'Site otopark çözümü',
    title: 'Site sakinleri, güvenlik ekibi ve yönetim için daha düzenli otopark akışı.',
    lead: 'Site otopark yönetim sistemi 1.499 dolardan başlayan fiyatlarla sunulur. Giriş-çıkış sayısı, kat yapısı, kamera/bariyer ihtiyacı ve entegrasyon kapsamı birlikte değerlendirilerek net proje kapsamı belirlenir.',
    items: [
      { icon: 'cloud' as const, title: 'Her yerden yönetim', description: 'Bulut tabanlı otopark yazılımı sayesinde site otoparkınızı ofisten, sahadan veya uzaktan güvenle yönetebilirsiniz.', meta: 'Bulut erişim' },
      { icon: 'chart' as const, title: 'Kat bazlı kapasite', description: 'Kapalı otopark katları, bloklar ve açık otopark alanları için ayrı kapasite sınırları oluşturabilirsiniz.', meta: 'Esnek limit' },
      { icon: 'plate' as const, title: 'Kontrollü geçiş', description: 'Plaka tanıma, abone tanımı ve misafir yetkilendirme ile site içi araç trafiği daha düzenli ilerler.', meta: 'Düzenli erişim' },
    ],
  },
  onboarding: {
    eyebrow: 'Kurulum süreci',
    title: 'Mevcut otopark düzenini bozmadan dijital yönetime geçin.',
    lead: 'Önce otoparkın kat yapısını, giriş-çıkış noktalarını ve kullanıcı tiplerini analiz ederiz. Ardından bulut panel, plaka tanıma, bariyer ve yetkilendirme kurallarını site yapınıza uygun şekilde devreye alırız.',
    steps: [
      { title: 'Otopark analizi', description: 'Giriş-çıkış noktaları, kat yapısı, bloklar, araç grupları ve yönetim ihtiyaçları netleştirilir.' },
      { title: 'Kural planlama', description: 'Kat başına araç sınırı, abone/misafir geçişi, yetkili kullanıcı rolleri ve rapor ihtiyaçları belirlenir.' },
      { title: 'Bulut panel kurulumu', description: 'Plaka listeleri, kapasite kuralları, geçiş senaryoları ve uzaktan erişim paneli devreye alınır.' },
      { title: 'Test ve teslim', description: 'Geçiş senaryoları test edilir; site yönetimi ve güvenlik ekibine kullanım aktarılır.' },
    ],
  },
  info: {
    eyebrow: 'Sistem',
    items: [
      {
        title: 'Site otopark yönetim sistemi nedir?',
        copy: 'Site otopark yönetim sistemi; apartman, site ve rezidanslarda araç giriş-çıkışlarını, aboneleri, misafirleri ve kapasite kurallarını dijital olarak yönetmenizi sağlayan yazılım ve otomasyon altyapısıdır. Visiosoft bu süreci bulut tabanlı panel, plaka tanıma ve raporlama özellikleriyle tek ekranda toplar.',
      },
      {
        title: 'Neden bulut tabanlı otopark yönetimi?',
        copy: 'Bulut tabanlı yapı, otopark yönetimini güvenlik kulübesine veya tek bir bilgisayara bağlı bırakmaz. Yetkili kullanıcılar araç kayıtlarını, doluluk durumunu, kat bazlı limitleri ve raporları internet olan her yerden takip edebilir.',
      },
    ],
  },
  faq: {
    eyebrow: 'Sık sorulan sorular',
    title: 'Site otopark sistemi hakkında merak edilenler.',
    items: [
      {
        question: 'Site otoparklarında kat başına araç sınırı koyabilir miyiz?',
        answer: 'Evet. Visiosoft ile her kat, blok veya otopark alanı için ayrı araç limiti tanımlanabilir. Bu sayede doluluk, abone geçişi ve yetkilendirme kuralları daha düzenli yönetilir.',
      },
      {
        question: 'Sisteme site dışından erişilebilir mi?',
        answer: 'Evet. Bulut tabanlı mimari sayesinde yönetim paneline internet olan her yerden erişebilir; araç kayıtlarını, aboneleri, misafir geçişlerini ve raporları uzaktan takip edebilirsiniz.',
      },
      {
        question: 'Site otopark sistemi fiyatı nedir?',
        answer: 'Site otopark yönetim sistemi 1.499 dolardan başlayan fiyatlarla sunulur. Net fiyat; giriş-çıkış sayısı, kat yapısı, kamera/bariyer ihtiyacı ve entegrasyon kapsamına göre belirlenir.',
      },
    ],
  },
  schema: {
    name: 'Site Otoparkları İçin Bulut Tabanlı Otopark Yönetim Sistemi',
    serviceType: 'Site otopark yönetim sistemi',
    description: 'Apartman, site ve rezidans otoparkları için bulut tabanlı otopark yönetimi; plaka tanıma, abone yönetimi, raporlama ve kat başına araç sınırı.',
  },
  cta: {
    eyebrow: 'Hazır mısınız?',
    title: 'Site otoparkınızı buluttan yönetmeye başlayın.',
    description: '1.499 dolardan başlayan fiyatlarla; kat yapısını, araç limitlerini, geçiş senaryolarını ve teknik ihtiyaçları birlikte netleştirelim.',
    primary: 'Teklif Al',
    secondary: 'İletişime geçin',
  },
}
