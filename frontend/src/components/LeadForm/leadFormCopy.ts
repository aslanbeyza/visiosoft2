
export const leadFormCopy = {
  fields: {
    name: 'Ad Soyad',
    phone: 'Telefon',
    email: 'E-posta',
    company: 'Şirket Adı',
    address: 'Adres',
    message: 'Ek Mesaj',
    optional: 'Opsiyonel',
  },

  examples: {
    address: 'Otoparkın adresi',
  },
  hints: {
    phone: 'Uzmanımız bu numaradan size ulaşır.',
  },

  parking: {
    projectType: 'Proje tipi',
    paid: 'Ücretli otopark',
    subscription: 'Sadece abonelik',
    needs: 'İhtiyaçlar',
    barrier: 'Bariyer',
    turnkey: 'Anahtar teslim kurulum',
    payments: 'Ödeme yöntemleri',
    card: 'Kart',
    hgs: 'HGS',
    product: 'Plaka Tanıma Sistemi (PTS)',
  },
  submit: 'Teklif İste',
  sending: 'Gönderiliyor',
  successTitle: 'Talebiniz alındı',
  successBody: 'Otopark keşif uzmanımız en kısa sürede sizinle iletişime geçecektir.',
  reset: 'Yeni talep oluştur',
  errorFallback: 'Bir hata oluştu. Lütfen tekrar deneyin.',
  required: 'Zorunlu alanlar * ile işaretlidir.',
  turnstileError: 'Güvenlik doğrulaması yüklenemedi. Sayfayı yenileyip tekrar deneyin.',
  turnstileWaiting: 'Güvenlik doğrulaması tamamlanınca gönderebilirsiniz.',
} as const
