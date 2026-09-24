
export type ParkingFlowStepId = 'approach' | 'detect' | 'verify' | 'pay' | 'open'

export type SceneState = {

  car: number

  cone: number

  bracket: number

  plate: number

  pulse: number

  led: number

  screen: number

  arm: number

  gate: number
}

export type SceneProp = keyof SceneState

export const SCENE_WIDTH = 1200
export const SCENE_HEIGHT = 520

export const COMPACT_VIEW = { x: 80, y: 72, width: 1092, height: 400 } as const

export const COMPACT_BELOW = 640

export const CAR_START = -200
export const CAR_READ = 400
export const CAR_KIOSK = 600
export const CAR_EXIT = 1320

export const CAR_STOP = 778

export const ARM_PIVOT = { x: 946, y: 276 } as const
export const ARM_LENGTH = 170

export const ARM_OPEN = -170

export const STEP_ORDER: ParkingFlowStepId[] = ['approach', 'detect', 'verify', 'pay', 'open']

export const PROPS: SceneProp[] = ['car', 'cone', 'bracket', 'plate', 'pulse', 'led', 'screen', 'arm', 'gate']

const CONE_IDLE = 0.16

const poses: Record<ParkingFlowStepId | 'final', SceneState> = {
  approach: { car: CAR_START, cone: CONE_IDLE, bracket: 0, plate: 0, pulse: 0, led: 0, screen: 0, arm: 0, gate: 0 },
  detect: { car: CAR_READ, cone: CONE_IDLE, bracket: 0, plate: 0, pulse: 0, led: 0, screen: 0, arm: 0, gate: 0 },
  verify: { car: CAR_READ, cone: 1, bracket: 1, plate: 1, pulse: 0, led: 0, screen: 0, arm: 0, gate: 0 },
  pay: { car: CAR_READ, cone: 0.4, bracket: 1, plate: 1, pulse: 1, led: 1, screen: 0, arm: 0, gate: 0 },
  open: { car: CAR_KIOSK, cone: CONE_IDLE, bracket: 0, plate: 0, pulse: 1, led: 1, screen: 2, arm: 0, gate: 0 },
  final: { car: CAR_EXIT, cone: CONE_IDLE, bracket: 0, plate: 0, pulse: 1, led: 1, screen: 2, arm: ARM_OPEN, gate: 1 },
}

type Window = [number, number]
const DEFAULT_WINDOW: Window = [0.1, 0.8]

const windows: Record<ParkingFlowStepId, Partial<Record<SceneProp, Window>>> = {
  approach: { car: [0, 0.92] },
  detect: { cone: [0, 0.3], bracket: [0.2, 0.7], plate: [0.55, 0.85] },
  verify: { cone: [0.55, 1], pulse: [0, 0.5], led: [0.45, 0.7] },
  pay: { car: [0, 0.45], cone: [0, 0.35], bracket: [0, 0.35], plate: [0.05, 0.35], screen: [0.3, 0.95] },
  open: { arm: [0, 0.45], gate: [0.12, 0.4], car: [0.38, 1] },
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export type SceneOptions = {

  barrierClosed?: boolean

  tail?: number
}

export function sceneAt(progress: number, stepIds: ParkingFlowStepId[], options: SceneOptions = {}): SceneState {
  const count = stepIds.length
  const out: SceneState = { ...poses.final }

  if (count === 0) return finish(out, options)

  const p = Math.max(0, progress)

  if (p >= 1) {

    const tail = options.tail ?? 0
    const t = tail > 0 ? easeInOut(clamp01((p - 1) / tail)) : 0
    out.arm = lerp(ARM_OPEN, 0, t)
    out.gate = lerp(1, 0, t)
    out.screen = lerp(2, 0, t)
    out.led = lerp(1, 0, t)
    out.pulse = lerp(1, 0, t)
    return finish(out, options)
  }

  const segment = 1 / count
  const index = Math.min(count - 1, Math.floor(p / segment))
  const local = (p - index * segment) / segment
  const id = stepIds[index]
  const from = poses[id]
  const to = index + 1 < count ? poses[stepIds[index + 1]] : poses.final
  const stepWindows = windows[id]

  for (const key of PROPS) {
    const [start, end] = stepWindows[key] ?? DEFAULT_WINDOW
    const t = end <= start ? (local >= end ? 1 : 0) : clamp01((local - start) / (end - start))
    out[key] = lerp(from[key], to[key], easeInOut(t))
  }

  return finish(out, options)
}

function finish(state: SceneState, options: SceneOptions): SceneState {
  if (options.barrierClosed) {
    state.arm = 0
    state.gate = 0
    state.car = Math.min(state.car, CAR_STOP)
  }
  return state
}

export function progressForStep(index: number, count: number, id: ParkingFlowStepId) {
  if (count <= 0) return 1
  const within = id === 'open' ? 0.66 : 0.9
  return Math.min(1, (index + within) / count)
}

export function activeIndexAt(progress: number, count: number) {
  if (count <= 0 || progress <= 0.0005) return -1
  return Math.min(count - 1, Math.floor(progress * count))
}
