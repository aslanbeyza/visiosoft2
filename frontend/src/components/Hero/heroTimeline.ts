/**
 * Hero videosunun zaman çizelgesi (saniye).
 * Değerler scripts/hero-video/build.py'nin ürettiği /public/video/hero/timeline.json ile eşleşir
 * (bölüm sınırı = ikinci sahnenin xfadeStart değeri + 0,25 sn). Video yeniden üretilirse güncellenmelidir.
 */
export type ChapterId = 'alpr' | 'kiosk'

export type CueId = 'detect' | 'scan' | 'locked' | 'kioskWait' | 'paid' | 'open'

export type Tone = 'sky' | 'emerald' | 'amber' | 'neutral'

export type Chapter = { id: ChapterId; start: number; end: number; route: string }

/** `line`: başlıktaki hangi satırın (Plakayı okur / Ödemeyi alır / Bariyeri açar) vurgulanacağı. */
export type Cue = { id: CueId; start: number; end: number; tone: Tone; line?: 0 | 1 | 2 }

export const VIDEO_DURATION = 10.167

export const chapters: Chapter[] = [
  { id: 'alpr', start: 0, end: 5.375, route: 'plate-recognition-system' },
  { id: 'kiosk', start: 5.375, end: VIDEO_DURATION, route: 'hardware-products.kiosk' },
]

export const cues: Cue[] = [
  { id: 'detect', start: 0, end: 2.4, tone: 'sky', line: 0 },
  { id: 'scan', start: 2.4, end: 4.2, tone: 'sky', line: 0 },
  { id: 'locked', start: 4.2, end: 5.375, tone: 'emerald', line: 0 },
  { id: 'kioskWait', start: 5.375, end: 6.125, tone: 'amber', line: 1 },
  { id: 'paid', start: 6.125, end: 6.7, tone: 'emerald', line: 1 },
  { id: 'open', start: 6.7, end: VIDEO_DURATION, tone: 'emerald', line: 2 },
]

export function chapterIndexAt(time: number) {
  for (let index = chapters.length - 1; index >= 0; index -= 1) {
    if (time >= chapters[index].start) return index
  }
  return 0
}

export function cueAt(time: number): Cue {
  for (let index = cues.length - 1; index >= 0; index -= 1) {
    if (time >= cues[index].start) return cues[index]
  }
  return cues[0]
}

export const heroVideo = {
  poster: '/video/hero/poster.webp',
  desktop: [
    { src: '/video/hero/hero-1080.webm', type: 'video/webm' },
    { src: '/video/hero/hero-1080.mp4', type: 'video/mp4' },
  ],
  mobile: [{ src: '/video/hero/hero-720.mp4', type: 'video/mp4' }],
}
