import { useEffect, useState } from 'react'

export type ScenePhase =
  | 'approach'
  | 'scan'
  | 'locked'
  | 'kiosk'
  | 'paying'
  | 'paid'
  | 'open'
  | 'pass'
  | 'closing'

export const sceneSteps: { phase: ScenePhase; duration: number }[] = [
  { phase: 'approach', duration: 2800 },
  { phase: 'scan', duration: 1700 },
  { phase: 'locked', duration: 1500 },
  { phase: 'kiosk', duration: 2000 },
  { phase: 'paying', duration: 1600 },
  { phase: 'paid', duration: 1600 },
  { phase: 'open', duration: 1500 },
  { phase: 'pass', duration: 2000 },
  { phase: 'closing', duration: 1800 },
]

const order = sceneSteps.map((step) => step.phase)

export function phaseIndex(phase: ScenePhase) {
  return order.indexOf(phase)
}

/** Çıkış kapısı senaryosunu sırayla döndüren zaman çizelgesi. */
export function useParkingSequence(enabled: boolean) {
  const [step, setStep] = useState(0)
  const index = enabled ? step % sceneSteps.length : phaseIndex('paid')

  useEffect(() => {
    if (!enabled) return
    const id = setTimeout(() => setStep((value) => value + 1), sceneSteps[index].duration)
    return () => clearTimeout(id)
  }, [enabled, index])

  return {
    phase: sceneSteps[index].phase,
    index,
    loop: Math.floor(step / sceneSteps.length),
    reached: (phase: ScenePhase) => index >= phaseIndex(phase),
  }
}
