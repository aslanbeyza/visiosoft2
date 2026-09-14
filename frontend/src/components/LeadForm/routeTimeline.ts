/**
 * Talep rotası sahnesinin zaman çizelgesi (SVG birimleri: viewBox 0 0 1200 200).
 * Araç her kilometre taşında kısa bir süre durur; taş, araç vardığı anda etkinleşir.
 */
export const SCENE = {
  width: 1200,
  height: 200,
  laneY: 124,
  roadTop: 64,
  roadBottom: 144,
  roadEnd: 996,
  bay: { x: 996, y: 96, w: 120, h: 56 },
  /** Kilometre taşlarının x konumları (etiket sütunlarının ortaları: %12,5 · %37,5 · %62,5 · %87,5). */
  stops: [150, 450, 750, 1056],
  carStart: -60,
} as const

/** Sahne çizimi bittikten sonra aracın yola çıkış anı (s). */
export const DRIVE_START = 1.35
const SPEED = 0.0024 // s / birim
const DWELL = 0.38

export type DriveTimeline = {
  x: number[]
  times: number[]
  duration: number
  /** Her taşa varış anı (s, DRIVE_START dahil). */
  arrivals: number[]
}

export function buildDrive(): DriveTimeline {
  const x: number[] = [SCENE.carStart]
  const stamps: number[] = [0]
  const arrivals: number[] = []
  let clock = 0
  let from: number = SCENE.carStart

  SCENE.stops.forEach((stop, index) => {
    // Park yerine girişte biraz daha yavaş, yumuşak yanaşma
    const factor = index === SCENE.stops.length - 1 ? 1.35 : 1
    clock += Math.max(0.55, (stop - from) * SPEED * factor)
    x.push(stop)
    stamps.push(clock)
    arrivals.push(DRIVE_START + clock)
    if (index < SCENE.stops.length - 1) {
      clock += DWELL
      x.push(stop)
      stamps.push(clock)
    }
    from = stop
  })

  return { x, times: stamps.map((stamp) => stamp / clock), duration: clock, arrivals }
}
