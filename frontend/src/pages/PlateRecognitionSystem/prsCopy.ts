import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

export const prsCopy = {
  metaTitle: 'Plaka Tanıma Sistemi | PTS Teknolojisi | Visiosoft',
  metaDescription:
    'Plaka tanıma sistemi ile otopark giriş ve çıkışlarınızı otomatikleştirin: %99 üzeri doğruluk, hızlı işlem ve 7/24 çalışma. PTS teknolojisi ile insansız otopark yönetimi.',
  breadcrumbHome: 'Ana sayfa',
  eyebrow: 'PTS Teknolojisi',
  title: 'Plaka Tanıma Sistemi',
  lead: 'Yapay zeka destekli otomatik plaka tanıma teknolojisi ile otoparkınızı yönetin. Hızlı, güvenilir ve kesintisiz hizmet.',
  quote: 'Teklif Al',
  contact: 'İletişim',
  map: {
    chip: 'Otomatik Tanıma',
    caption: 'Zone canlı harita ekranı — demo verisi',
    alt: 'Zone canlı harita ekranı: otopark yerleşimi, kamera konumları ve doluluk paneli',
  },
  subNav: [
    { id: 'nedir', label: 'Nedir?' },
    { id: 'ozellikler', label: 'Özellikler' },
    { id: 'nasil-calisir', label: 'Nasıl çalışır?' },
    { id: 'sss', label: 'SSS' },
  ],
  about: {
    eyebrow: 'Temel bilgi',
    title: 'Plaka Tanıma Sistemi Nedir?',
    paragraphs: [
      'Plaka tanıma sistemi (PTS), araç plakalarını otomatik olarak tespit eden ve tanıyan bir görüntü işleme teknolojisidir. Yapay zeka ve makine öğrenmesi algoritmalarıyla araçların giriş-çıkış işlemlerini otomatik olarak gerçekleştirir.',
      'Giriş ve çıkışta insan hatasını en aza indirir, operasyon maliyetlerini düşürür ve sürücülere beklemesiz bir geçiş sunar. Visiosoft plaka tanıma sistemi ile otoparkınızı insansız yönetebilirsiniz.',
    ],
    diagramLabel: 'Plaka tanıma adımlarını gösteren şema: kamera görüntüsü, plaka tespiti, karakter tanıma ve kayıt',
    diagramNote: 'Temsilî çizim; plaka karakterleri gizlenmiştir.',
    stages: [
      { key: 'tespit', title: 'Tespit', text: 'Plaka bölgesi bulunur' },
      { key: 'tanima', title: 'Tanıma', text: 'Karakterler okunur' },
      { key: 'kayit', title: 'Kayıt', text: 'Geçiş otomatik işlenir' },
    ],
  },
  features: {
    eyebrow: 'Özellikler',
    title: 'Sistem Özellikleri',
    lead: 'Giriş ve çıkışlarda hız, doğruluk ve merkezi yönetim bir arada.',
    items: [
      { icon: 'clock', title: 'Hızlı Tanıma', description: 'Milisaniyeler içinde plaka okuma ve tanıma' },
      { icon: 'plate', title: 'Yüksek Doğruluk', description: '%99 üzeri doğruluk oranı ile güvenilir sonuçlar' },
      { icon: 'camera', title: 'Gece Görüşü', description: '7/24 kesintisiz çalışma, gece-gündüz fark etmez' },
      { icon: 'cloud', title: 'Bulut Tabanlı', description: 'Her yerden erişim ve merkezi yönetim imkânı' },
      { icon: 'chart', title: 'Veri Analizi', description: 'Detaylı raporlama ve iş zekası analitiği' },
      { icon: 'phone', title: 'Mobil Erişim', description: 'Mobil uygulama ile anlık takip ve yönetim' },
    ] satisfies { icon: FeatureIconName; title: string; description: string }[],
  },
  how: {
    eyebrow: 'Süreç',
    title: 'Nasıl çalışır?',
    lead: 'Araç kameranın görüş alanına girdiği andan bariyerin açılmasına kadar dört adım.',
    steps: [
      { title: 'Görüntü', description: 'Kamera, giriş ve çıkışa yaklaşan aracı gece-gündüz fark etmeksizin 7/24 izler.' },
      { title: 'Plaka tespiti', description: 'Görüntü işleme teknolojisi, kare içindeki plaka bölgesini otomatik olarak tespit eder.' },
      { title: 'Tanıma', description: 'Yapay zeka ve makine öğrenmesi algoritmaları plakayı milisaniyeler içinde okur.' },
      { title: 'Otomatik geçiş', description: 'Giriş-çıkış işlemi otomatik gerçekleşir; kayıt merkezi yönetime ve raporlara aktarılır.' },
    ],
  },
  faq: {
    eyebrow: 'SSS',
    title: 'Sık Sorulan Sorular',
    lead: 'Plaka tanıma sistemi hakkında en çok sorulan sorular.',
    items: [
      {
        question: 'Plaka tanıma sistemi nedir?',
        answer:
          'Plaka tanıma sistemi (PTS), araç plakalarını otomatik olarak tespit eden ve tanıyan bir görüntü işleme teknolojisidir. Yapay zeka ve makine öğrenmesi algoritmaları kullanarak araçların giriş-çıkış işlemlerini otomatik olarak gerçekleştirir.',
      },
      {
        question: 'Plaka tanıma doğruluğu hangi seviyededir?',
        answer:
          'Sistem, %99 üzeri doğruluk oranı ile güvenilir sonuçlar sunar. Uygun kamera konfigürasyonu ve doğru saha açılandırması sonucu doğrudan etkiler.',
      },
      {
        question: 'Gece koşullarında plaka okuma güvenilir mi?',
        answer:
          'IR destekli gece görüş, parlama önleyici lens ve doğru saha açılandırması ile düşük ışıkta yüksek doğruluk elde edilir. Opsiyonel çift kamera doğrulama ile hata payı daha da düşürülür.',
      },
      {
        question: 'İnternet kesilirse giriş-çıkış operasyonu duruyor mu?',
        answer:
          'Hayır. Edge Controller mimarisi sayesinde plaka okuma, bariyer kontrolü ve geçiş logları offline modda çalışmaya devam eder. Bağlantı geri geldiğinde biriken veriler merkezi sunucuya otomatik senkronize edilir.',
      },
      {
        question: 'Mevcut bariyer, turnike ve kameralarla uyumlu mu?',
        answer:
          'Açık protokol yaklaşımıyla kuru kontak, RS485/TCP-IP, ONVIF ve RTSP tabanlı sistemlerle entegrasyon desteklenir. Kurulum öncesi envanter analizi yapılarak uyumluluk raporu hazırlanır.',
      },
    ],
  },
  cta: {
    eyebrow: 'Demo',
    title: 'Başlamaya Hazır mısınız?',
    description: 'Demo için bizimle iletişime geçin; sistemi kendi senaryolarınızla birlikte inceleyelim.',
  },
}
