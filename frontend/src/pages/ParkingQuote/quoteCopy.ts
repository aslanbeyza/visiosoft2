
export const quoteCopy = {
  meta: {
    title: 'Otopark Teklif Motoru - Visiosoft',
    description:
      'Otopark modelinize göre kiosk, HGS, bariyer ve kurulum ihtiyacını anında önerip teklif talebi oluşturun.',
  },
  hero: {
    eyebrow: 'Otopark Teklif Motoru',
    title: '3 soruda otopark kurgunuzu çıkaralım.',
    lead: 'Ücretli otopark mı yoksa sadece abonelik mi istediğinizi seçin; kart, HGS, bariyer ve kurulum tercihinize göre gerekli bileşenleri anında önerelim.',
    start: 'Otopark modelinizi seçin',
    chips: [
      'Kart seçilince ödeme kiosku eklenir',
      'Bariyer seçilince bariyer sistemi eklenir',
      'Kurulum seçilince saha ekibi önerilir',
    ],
    rulesLabel: 'Teklif motorunun kuralları',
  },
  steps: ['Senaryo', 'Kurgu', 'İletişim'],
  stepperLabel: 'Teklif adımları',
  wizardLabel: 'Otopark teklif sihirbazı',
  nav: { back: 'Geri', next: 'Devam et' },
  scenario: {
    title: 'Otopark modelinizi seçin',
    legend: 'Otopark modeli',
    required: 'Devam etmek için önce otopark modelini seçin.',
    options: {
      paid: { label: 'Ücretli otopark', description: 'Kart ve/veya HGS ile araçlardan ücret almak istiyorum.' },
      subscription: {
        label: 'Sadece abonelik',
        description: 'Yalnızca belirli araçların bir alana girmesini sağlamak istiyorum.',
      },
    },
  },
  setup: {
    title: 'Operasyon kurgusunu netleştirin',
    required: 'Devam etmek için ödeme, bariyer ve kurulum tercihlerini tamamlayın.',
    paymentRequired: 'Ücretli otopark için en az bir ödeme yöntemi seçilmelidir.',
    barrierRequired: 'Bariyer ihtiyacı seçilmelidir.',
    installationRequired: 'Kurulum tercihi seçilmelidir.',
    payment: {
      section: '1. Ödeme Altyapısı',
      heading: 'Kart ve/veya HGS ile ödeme alacak mısınız?',
      subscriptionBadge: 'Abonelik Senaryosu',
      subscriptionNote: 'Bu senaryoda ödeme donanımı yerine abonelik yönetimi ve geçiş kontrolü önerilir.',
      options: {
        card: { label: 'Kart', description: 'POS veya kart ile ödeme almak istiyorum.' },
        hgs: { label: 'HGS', description: 'HGS üzerinden otomatik tahsilat yapmak istiyorum.' },
      },
    },
    access: {
      section: '2. Geçiş Kontrolü',
      heading: 'Bariyer ile fiziksel geçiş kontrolü istiyor musunuz?',
      yes: { label: 'Evet, bariyer istiyorum', description: 'Araç geçişlerini fiziksel olarak da kontrol etmek istiyorum.' },
      no: { label: 'Hayır, bariyer istemiyorum', description: 'Yalnızca yazılım ve yetkilendirme kurgusu yeterli.' },
    },
    installation: {
      section: '3. Kurulum',
      heading: 'Anahtar teslim kurulum istiyor musunuz?',
      yes: { label: 'Evet, saha ekibi gelsin', description: 'Montaj, devreye alma ve teslim sürecini Visiosoft yönetsin.' },
      no: { label: 'Hayır, kendi ekibim kuracak', description: 'Sadece ürün ve entegrasyon teklifini almak istiyorum.' },
    },
  },
  contact: {
    title: 'Bilgilerinizi bırakın',
    subtitle: 'Teklifi hazırlayabilmemiz için iletişim bilgilerinizi bırakın.',
    enterDetails: 'Bilgilerimi Gir',
    formLabel: 'Teklif talebi iletişim bilgileri',
    name: 'Ad Soyad',
    phone: 'Telefon',
    email: 'E-posta',
    company: 'Şirket Adı',
    note: 'Proje Notu',
    notePlaceholder: 'Varsa giriş-çıkış sayısı, saha bilgisi veya özel notlarınızı yazın.',
    submit: 'Teklif Talebini Gönder',
    sending: 'Gönderiliyor',
    error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.',
    successTitle: 'Talebiniz alındı',
    successBody:
      'Otopark kurgunuz ve iletişim bilgileriniz kaydedildi. Satış ekibimiz size en kısa sürede geri dönecek.',
  },
  panel: {
    badge: 'Canlı Öneri',
    title: 'Önerilen Paket',
    listLabel: 'Canlı ihtiyaç listesi',
    empty: 'Soruları cevapladıkça burada gerekli yazılım, donanım ve kurulum bileşenleri oluşacak.',
    summaryTitle: 'Seçim Özeti',
    count: (n: number) => `${n.toLocaleString('tr-TR')} bileşen`,
    added: (name: string) => `${name} eklendi.`,
    removed: (name: string) => `${name} çıkarıldı.`,
    rows: {
      projectType: 'Otopark modeli',
      payment: 'Ödeme kanalı',
      barrier: 'Bariyer',
      installation: 'Kurulum',
    },
    values: {
      yes: 'Evet',
      no: 'Hayır',
      notSelected: 'Seçilmedi',
      noPaymentNeeded: 'Ödeme altyapısı gerekmiyor',
    },
    rules: {
      kiosk: 'Kart seçildiği için ödeme kiosku otomatik eklendi.',
      barrier: 'Bariyer ihtiyacı seçildiği için fiziksel geçiş kontrolü eklendi.',
      installation: 'Anahtar teslim kurulum seçildiği için saha kurulum hizmeti eklendi.',
    },
  },
  catalog: {
    plate_recognition: {
      name: 'Plaka Tanıma Sistemi (PTS)',
      reason: 'Giriş-çıkış yetkilendirme ve araç hareketlerini otomatik yönetir.',
    },
    parking_software: { name: 'Otopark Yazılımı', reason: 'Operasyon, raporlama ve alan yönetimini tek panelde toplar.' },
    payment_automation: {
      name: 'Ücretlendirme ve Tahsilat Modülü',
      reason: 'Ücretli otopark senaryosu için süre, tarife ve çıkış akışını yönetir.',
    },
    kiosk: { name: 'Ödeme Kiosku', reason: 'Kart ile tahsilat seçildiği için sahada kiosk gereklidir.' },
    hgs_integration: {
      name: 'HGS Tahsilat Entegrasyonu',
      reason: 'HGS ile otomatik ödeme ve hızlı çıkış kurgusunu destekler.',
    },
    subscription_module: {
      name: 'Abonelik Yönetim Modülü',
      reason: 'Belirli araçları alan bazlı yetkilendirmek için abonelik kuralları tanımlar.',
    },
    barrier_system: { name: 'Bariyer Sistemi', reason: 'Fiziksel giriş-çıkış kontrolü için bariyer altyapısı eklenir.' },
    turnkey_installation: {
      name: 'Anahtar Teslim Kurulum',
      reason: 'Saha montajı, devreye alma ve teslim sürecini kapsar.',
    },
  },
} as const
