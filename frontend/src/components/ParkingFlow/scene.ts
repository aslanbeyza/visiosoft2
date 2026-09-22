/*
 * Otopark geçiş sahnesinin saf zaman çizelgesi. Bileşenden bağımsızdır; ilerleme (0–1) ve verilen adım
 * sırasından sahnedeki her değişkenin o anki değerini hesaplar. Adımların bir alt kümesi verilse de
 * pozlar art arda karıştırıldığı için hareket süreklidir.
 */
export type ParkingFlowStepId = 'approach' | 'detect' | 'verify' | 'pay' | 'open'

export type SceneState = {
  /** Araç grubunun x konumu (viewBox birimi). */
  car: number
  /** Kamera konisinin görünürlüğü (0–1). */
  cone: number
  /** Plaka köşe ayracının çizim oranı (0–1). */
  bracket: number
  /** Plaka etiketinin görünürlüğü (0–1). */
  plate: number
  /** Kameradan kontrol kutusuna inen veri darbesinin çizim oranı (0–1). */
  pulse: number
  /** Kontrol kutusu göstergesi (0 kapalı – 1 başarı). */
  led: number
  /** Kiosk ekranı: 0 beklemede, 1 lacivert (işlem), 2 yeşil (ödeme tamam). */
  screen: number
  /** Bariyer kolu açısı (derece, 0 kapalı ve şeride dikey … −170 açık ve yukarı). */
  arm: number
  /** Bariyer direği göstergesi (0–1). */
  gate: number
}

export type SceneProp = keyof SceneState

export const SCENE_WIDTH = 1200
export const SCENE_HEIGHT = 520

/**
 * Dar sahne (bkz. COMPACT_BELOW) için kırpılmış görünüm: boş kenar payları atılır, cihazlar ~%10 büyür.
 * LED panel çerçevesinin dış çizgisinden (x 88) bariyer gövdesine (x 964) ve kalkık kolun tepesinden (y ~230)
 * kaldırıma (y 464) sığar.
 */
export const COMPACT_VIEW = { x: 80, y: 72, width: 1092, height: 400 } as const
/** Sahne alanı bu genişliğin (px) altındaysa vurgu etiketi şeridin altına iner ve görünüm kırpılır. */
export const COMPACT_BELOW = 640

export const CAR_START = -200
export const CAR_READ = 400
export const CAR_KIOSK = 600
export const CAR_EXIT = 1320
/** Bariyer kapalıyken aracın durduğu son konum (ön tampon, şeride inen kola değmez). */
export const CAR_STOP = 778
/** Kol, direk gövdesindeki gösterge halkasında (cy 276) döner; kapalıyken şeride iner. */
export const ARM_PIVOT = { x: 946, y: 276 } as const
export const ARM_LENGTH = 170
/** Kapalı kol +y (şeridi keser). Açılınca ters saat yönünde (−170°) yukarı kalkar; saat yönü kioskun içinden geçer. */
export const ARM_OPEN = -170

export const STEP_ORDER: ParkingFlowStepId[] = ['approach', 'detect', 'verify', 'pay', 'open']

export const PROPS: SceneProp[] = ['car', 'cone', 'bracket', 'plate', 'pulse', 'led', 'screen', 'arm', 'gate']

const CONE_IDLE = 0.16

/** Her adımın başındaki poz ve akışın son pozu. */
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

/** Adım içinde hangi değişkenin, adımın hangi diliminde bir sonraki poza geçtiği. */
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
  /** Bariyer hiç açılmaz; araç direğin önünde durur (404 sahnesi). */
  barrierClosed?: boolean
  /** Otomatik döngüde 1'den sonra sistemin sıfırlandığı kuyruk uzunluğu (ilerleme birimi). */
  tail?: number
}

export function sceneAt(progress: number, stepIds: ParkingFlowStepId[], options: SceneOptions = {}): SceneState {
  const count = stepIds.length
  const out: SceneState = { ...poses.final }

  if (count === 0) return finish(out, options)

  const p = Math.max(0, progress)

  if (p >= 1) {
    // Kuyruk: araç çıktı; kol iner, göstergeler ve ekran beklemeye döner.
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

/** Adımın görsel olarak "tamamlanmış" sayıldığı ilerleme noktası (elle seçimde hedef). */
export function progressForStep(index: number, count: number, id: ParkingFlowStepId) {
  if (count <= 0) return 1
  const within = id === 'open' ? 0.66 : 0.9
  return Math.min(1, (index + within) / count)
}

/** İlerlemeye göre etkin adım; hiçbir şey başlamadıysa −1. */
export function activeIndexAt(progress: number, count: number) {
  if (count <= 0 || progress <= 0.0005) return -1
  return Math.min(count - 1, Math.floor(progress * count))
}
