export type FeatureId = 'alpr' | 'payment' | 'barrier' | 'monitoring'

export type SceneFeature = {
  id: FeatureId
  title: string
  description: string
  linkLabel: string
  route: string

  x: number
  y: number

  placement: 'right' | 'bottom'
}

export type FlowStep = {
  id: string
  label: string
  featureId: FeatureId
}

export const systemShowcaseCopy = {
  kicker: 'UÇTAN UCA OTOPARK TEKNOLOJİSİ',
  title: 'Otoparkın her noktasında çalışan akıllı sistem',
  description:
    'Plaka tanımadan ödemeye, geçiş kontrolünden canlı takibe kadar tüm süreç tek bir altyapıda yönetilir.',
  primary: { label: 'Sistemi Keşfet', route: 'end-to-end' },
  secondary: { label: 'Gerçek Kurulumları Gör', route: 'references' },
  status: 'Sistem aktif',
  flowLabel: 'Çıkış işlem akışı',
  features: [
    {
      id: 'alpr',
      title: 'Yapay zekâ destekli plaka tanıma',
      description: 'Kamera, araç yaklaşırken plakayı okur; giriş ve çıkış kaydı sürücü bir işlem yapmadan oluşur.',
      linkLabel: 'Plaka tanımayı incele',
      route: 'alpr.index',
      x: 14.8,
      y: 9.1,
      placement: 'right',
    },
    {
      id: 'payment',
      title: 'Temassız ve banka kartıyla ödeme',
      description: 'Kiosk POS, HGS ve QR kanallarını birlikte çalıştırır; sürücü plaka yazmadan ödemesini tamamlar.',
      linkLabel: 'Kiosku incele',
      route: 'hardware-products.kiosk',
      x: 18.5,
      y: 45.2,
      placement: 'right',
    },
    {
      id: 'barrier',
      title: 'Bariyer ve geçiş kontrolü',
      description: 'Visiobox kontrol kutusu bariyeri ve sensörleri yönetir; ödemesi ya da aboneliği doğrulanan araç için geçiş açılır.',
      linkLabel: "Visiobox'u incele",
      route: 'hardware-products.visiobox',
      x: 50,
      y: 42.6,
      placement: 'bottom',
    },
    {
      id: 'monitoring',
      title: 'Canlı izleme ve uzaktan destek',
      description: 'Ödeme, geçiş ve alarm süreçleri yönetim panelinden 7/24 izlenir; gerektiğinde sürücüye sesli yönlendirme yapılır.',
      linkLabel: 'Destek hizmetlerini incele',
      route: 'services',
      x: 20.3,
      y: 33.2,
      placement: 'right',
    },
  ] satisfies SceneFeature[],
  steps: [
    { id: 'plate', label: 'Plaka algılandı', featureId: 'alpr' },
    { id: 'verify', label: 'Geçiş doğrulandı', featureId: 'monitoring' },
    { id: 'pay', label: 'Ödeme tamamlandı', featureId: 'payment' },
    { id: 'gate', label: 'Bariyer açıldı', featureId: 'barrier' },
  ] satisfies FlowStep[],
}

export const flowTiming = {
  start: 800,
  step: 1800,
  hold: 3200,
}

const field = '/img/showcase/field-exit'
const kiosk = '/img/showcase/kiosk'

export const sceneImages = {
  field: {
    alt: 'Otopark çıkış şeridi: direkteki plaka tanıma kamerası, LED bilgi ekranı ve bariyer kolu',
    width: 1280,
    height: 1016,
    avif: `${field}-720.avif 720w, ${field}-1280.avif 1280w`,
    webp: `${field}-720.webp 720w, ${field}-1280.webp 1280w`,
    src: `${field}-1280.webp`,
    sizes: '(min-width: 1024px) 56vw, 150vw',
  },
  kiosk: {
    alt: 'Dokunmatik ekranlı, temassız kart okuyuculu Visiosoft çıkış ödeme kiosku',
    width: 274,
    height: 1040,
    avif: `${kiosk}-164.avif 164w, ${kiosk}-274.avif 274w`,
    webp: `${kiosk}-164.webp 164w, ${kiosk}-274.webp 274w`,
    src: `${kiosk}-274.webp`,
    sizes: '(min-width: 1024px) 9vw, 22vw',
  },
}
