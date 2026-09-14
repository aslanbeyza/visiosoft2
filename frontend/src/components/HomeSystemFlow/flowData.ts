import type { ParkingFlowStep } from '../ParkingFlow/index.ts'
import { homeSystemFlowCopy as text } from './homeSystemFlowCopy.ts'

export const pad = (value: number) => String(value).padStart(2, '0')

export const TOTAL_STEPS = text.steps.length
/** Kayıt ve rapor adımı: sahne son pozda kalır, Zone oturumlar ekranı büyüyüp sahnenin yerini alır. */
export const RECORD_INDEX = TOTAL_STEPS - 1
/** Zone oturumlar ekranı bu adımdan itibaren sahnenin köşesinde küçük hâliyle görünür. */
export const DOCK_INDEX = 1

/** Sahne yalnızca ilk beş adımı canlandırır (approach, detect, verify, pay, open). */
export const flowSteps: ParkingFlowStep[] = text.steps
  .slice(0, RECORD_INDEX)
  .map((step) => ({ id: step.scene, title: step.title, description: step.description }))

/** Sabitlenmiş hikâyede adım başına kaydırma payı (svh); kayıt adımı Zone ekranı için iki kat sürer. */
export const STEP_WEIGHTS = text.steps.map((_, index) => (index === RECORD_INDEX ? 60 : 30))
export const STORY_LENGTH = STEP_WEIGHTS.reduce((sum, weight) => sum + weight, 0)

/** Kaydırma ilerlemesi (0 … 1) → adım cinsinden ilerleme (0 … adım sayısı), adım paylarına göre. */
export function progressToFill(progress: number) {
  let rest = Math.min(1, Math.max(0, progress)) * STORY_LENGTH
  for (let index = 0; index < STEP_WEIGHTS.length; index++) {
    const weight = STEP_WEIGHTS[index]
    if (rest < weight) return index + rest / weight
    rest -= weight
  }
  return STEP_WEIGHTS.length
}

/** Bir adımın kaydırma diliminin ortası (0 … 1); adım seçilince pencere buraya gider. */
export function stepMidProgress(index: number) {
  const before = STEP_WEIGHTS.slice(0, index).reduce((sum, weight) => sum + weight, 0)
  return (before + STEP_WEIGHTS[index] / 2) / STORY_LENGTH
}
