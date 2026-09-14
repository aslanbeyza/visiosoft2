/**
 * Hero videosunun zaman çizelgesi (saniye, 24 fps, 245 kare).
 * Kare zamanları scripts/hero-video/build.py çıktısından ölçülmüştür (home3/u4-hero-video.md §2, §6).
 * Video yeniden üretilirse bu değerler de güncellenmelidir.
 */
export const VIDEO_DURATION = 10.208

/** Kartın üç ana durumu: algılama → doğrulama → bariyer. */
export type StageId = 'detect' | 'verified' | 'open'

/** Ayrıntı satırı dahil ince evre; kart yalnızca evre değişince yeniden çizilir. */
export type Phase = 'detect' | 'reading' | 'verified' | 'paid' | 'open'

export const stages: StageId[] = ['detect', 'verified', 'open']

export const cueTimes = {
  /** Görüntüdeki köşe çerçevesi plakayı sarar. */
  readStart: 2.667,
  /** Çerçeve ve tarama çizgisi biter; plaka net ve sabit. */
  verified: 4.667,
  /** Kiosk ekranı "ÖDENDİ" gösterir. */
  paid: 6.125,
  /** Bariyer kolu ilk kez kalkar (n164). */
  open: 6.833,
  /** Döngü geçişinde gri araç yeniden baskın olur (n237). */
  loopDetect: 9.875,
} as const

export function phaseAt(time: number): Phase {
  const t = Number.isFinite(time) ? time : 0
  if (t >= cueTimes.loopDetect) return 'detect'
  if (t >= cueTimes.open) return 'open'
  if (t >= cueTimes.paid) return 'paid'
  if (t >= cueTimes.verified) return 'verified'
  if (t >= cueTimes.readStart) return 'reading'
  return 'detect'
}

export function stageOf(phase: Phase): StageId {
  if (phase === 'verified' || phase === 'paid') return 'verified'
  if (phase === 'open') return 'open'
  return 'detect'
}

/** "Plaka okunuyor…" rayı: 2,667 → 4,667 sn arasında 0 → 1. */
export function readProgressAt(time: number) {
  if (!Number.isFinite(time) || time >= cueTimes.loopDetect) return 0
  const span = cueTimes.verified - cueTimes.readStart
  return Math.min(1, Math.max(0, (time - cueTimes.readStart) / span))
}

/** Hareket azaltma tercihinde afiş (4,875 sn doğrulanmış plaka karesi) ile eşleşen sabit evre. */
export const STATIC_PHASE: Phase = 'verified'

export const heroVideo = {
  poster: '/video/hero/poster.webp',
  desktop: [
    { src: '/video/hero/hero-1080.webm', type: 'video/webm' },
    { src: '/video/hero/hero-1080.mp4', type: 'video/mp4' },
  ],
  mobile: [{ src: '/video/hero/hero-720.mp4', type: 'video/mp4' }],
}
