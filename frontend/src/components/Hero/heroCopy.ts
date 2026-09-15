import type { StageId } from './heroTimeline.ts'

export type HeroCopy = {
  eyebrow: string
  title: string
  description: string
  primary: string
  secondary: string
  /** Aynı sayfadaki saha anlatısı bölümü ve başlığı. */
  systemTarget: { section: string; heading: string }
  proof: string[]
  hud: {
    label: string
    summary: string
    live: string
    camera: string
    reading: string
    plate: string
    plateLabel: string
    paid: string
    farewell: string
    progressLabel: string
    stages: Record<StageId, { headline: string; step: string }>
    play: string
    pause: string
  }
}

export const heroCopy: HeroCopy = {
  eyebrow: 'Tek işimiz park',
  title: 'Otoparkınızı tek merkezden yönetin.',
  description: 'Plaka tanıma, temassız ödeme, HGS, bariyer kontrolü ve raporlama tek sistemde.',
  primary: 'Demo ve Teklif Al',
  secondary: 'Sahada nasıl çalışır?',
  systemTarget: { section: 'saha', heading: 'saha-title' },
  proof: ["2018'den beri", 'Sahada çalışan geçiş sistemleri', '7/24 uzaktan destek'],
  hud: {
    label: 'Canlı geçiş örneği',
    summary: 'Canlı geçiş örneği: araç algılanır, plaka doğrulanır, bariyer açılır.',
    live: 'Canlı',
    camera: ' · Çıkış',
    reading: 'Plaka okunuyor…',
    plate: '34 PBB 261',
    plateLabel: 'TR',
    paid: 'Ödeme alındı',
    farewell: 'İyi yolculuklar',
    progressLabel: 'Geçiş adımları',
    stages: {
      detect: { headline: 'Araç algılandı', step: 'Algılama' },
      verified: { headline: 'Plaka doğrulandı', step: 'Doğrulama' },
      open: { headline: 'Bariyer açıldı', step: 'Bariyer' },
    },
    play: 'Videoyu oynat',
    pause: 'Videoyu duraklat',
  },
}
