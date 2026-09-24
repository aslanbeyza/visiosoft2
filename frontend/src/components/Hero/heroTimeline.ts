
export const VIDEO_DURATION = 10.208

export type StageId = 'detect' | 'verified' | 'open'

export type Phase = 'detect' | 'reading' | 'verified' | 'paid' | 'open'

export const stages: StageId[] = ['detect', 'verified', 'open']

export const cueTimes = {

  readStart: 2.667,

  verified: 4.667,

  paid: 6.125,

  open: 6.833,

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

export function readProgressAt(time: number) {
  if (!Number.isFinite(time) || time >= cueTimes.loopDetect) return 0
  const span = cueTimes.verified - cueTimes.readStart
  return Math.min(1, Math.max(0, (time - cueTimes.readStart) / span))
}

export const STATIC_PHASE: Phase = 'verified'

export const heroVideo = {
  poster: '/video/hero/poster.webp',
  desktop: [
    { src: '/video/hero/hero-1080.webm', type: 'video/webm' },
    { src: '/video/hero/hero-1080.mp4', type: 'video/mp4' },
  ],
  mobile: [{ src: '/video/hero/hero-720.mp4', type: 'video/mp4' }],
}
