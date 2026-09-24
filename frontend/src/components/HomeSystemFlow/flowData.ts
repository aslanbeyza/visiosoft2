import type { ParkingFlowStep } from '../ParkingFlow/index.ts'
import { homeSystemFlowCopy as text } from './homeSystemFlowCopy.ts'

export const pad = (value: number) => String(value).padStart(2, '0')

export const TOTAL_STEPS = text.steps.length

export const RECORD_INDEX = TOTAL_STEPS - 1

export const DOCK_INDEX = 1

export const flowSteps: ParkingFlowStep[] = text.steps
  .slice(0, RECORD_INDEX)
  .map((step) => ({ id: step.scene, title: step.title, description: step.description }))

export const STEP_WEIGHTS = text.steps.map((_, index) => (index === RECORD_INDEX ? 60 : 30))
export const STORY_LENGTH = STEP_WEIGHTS.reduce((sum, weight) => sum + weight, 0)

export function progressToFill(progress: number) {
  let rest = Math.min(1, Math.max(0, progress)) * STORY_LENGTH
  for (let index = 0; index < STEP_WEIGHTS.length; index++) {
    const weight = STEP_WEIGHTS[index]
    if (rest < weight) return index + rest / weight
    rest -= weight
  }
  return STEP_WEIGHTS.length
}

export function stepMidProgress(index: number) {
  const before = STEP_WEIGHTS.slice(0, index).reduce((sum, weight) => sum + weight, 0)
  return (before + STEP_WEIGHTS[index] / 2) / STORY_LENGTH
}
