import type { ChapterId, CueId } from './heroTimeline.ts'

export type HeroCopy = {
  badgeTag: string
  badge: string
  title: string[]
  description: string
  primary: string
  secondary: string
  proof: string[]
  hud: {
    live: string
    camera: string
    waiting: string
    scanning: string
    confidence: string
    confidenceValue: string
    duration: string
    durationValue: string
    amount: string
    amountValue: string
    tapCard: string
    paid: string
    barrier: string
    barrierOpen: string
    openTime: string
    play: string
    pause: string
    chapterNav: string
  }
  chapters: Record<ChapterId, { label: string; title: string; description: string; cta: string }>
  cues: Record<CueId, string>
}

/** Sayısal iddialar (400+ saha, %99,9 vb.) pazarlama değerleridir; kurumsal verilerle güncellenmelidir. */
export const heroCopy: HeroCopy = {
  badgeTag: 'Canlı simülasyon',
  badge: 'Girişten çıkışa insansız otopark',
  title: ['Tek İşimiz Park', 'En gelişmiş otopark otomasyon sistemi.'],
  description:
    "İsveç ve Kırgizistan'a kadar ürünleri kanıtlamış bulut yazılım mimarisi, AI destekli Kiosk. Mobil uygulama. 7/24 destek",
  primary: 'Teklif Al',
  secondary: 'Ürünleri Keşfet',
  proof: ['400+ aktif saha', '%99,9 plaka doğruluğu', '7/24 izleme ve destek'],
  hud: {
    live: 'Canlı',
    camera: 'TOGER · Çıkış',
    waiting: 'Bekleniyor',
    scanning: 'Taranıyor',
    confidence: 'güven',
    confidenceValue: '%99,4',
    duration: 'Süre',
    durationValue: '3 sa 6 dk',
    amount: 'Tutar',
    amountValue: '90 ₺',
    tapCard: 'Kartınızı okutunuz',
    paid: 'Ödendi',
    barrier: 'Bariyer',
    barrierOpen: 'Açık',
    openTime: '0,8 sn',
    play: 'Videoyu oynat',
    pause: 'Videoyu duraklat',
    chapterNav: 'Video bölümleri',
  },
  chapters: {
    alpr: {
      label: '',
      title: '',
      description: '',
      cta: 'Plaka tanımayı incele',
    },
    kiosk: {
      label: '',
      title: '',
      description: '',
      cta: 'Kiosku incele',
    },
  },
  cues: {
    detect: 'Araç algılandı',
    scan: 'Plaka taranıyor…',
    locked: 'Plaka doğrulandı',
    kioskWait: 'Kiosk ödemesi bekleniyor',
    paid: 'Ödeme alındı · Fiş yazdırılıyor',
    open: 'Bariyer açıldı · İyi yolculuklar',
  },
}
