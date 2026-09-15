// Hub & spoke çiziminin geometrisi (viewBox 1000 × 600). Modül sırası endToEndCopy.modules ile aynıdır.
export const HUB_VIEWBOX = { width: 1000, height: 600 } as const

export const HUB_CENTER = { x: 500, y: 300, ring: 138 } as const

/** Kart bağlantı ucu (viewBox x). Sekmeler %27 / %73 ile hizalı. */
export const NODE_X = { left: 270, right: 730 } as const

export type Spoke = {
  side: 'left' | 'right'
  /** Kartın bağlantı ucunun y konumu (viewBox birimi). */
  y: number
}

export const spokes: Spoke[] = [
  { side: 'left', y: 110 },
  { side: 'left', y: 300 },
  { side: 'left', y: 490 },
  { side: 'right', y: 110 },
  { side: 'right', y: 300 },
  { side: 'right', y: 490 },
]

export type SpokeEnds = {
  nodeX: number
  nodeY: number
  edgeX: number
  edgeY: number
  d: string
}

/** Karttan halka kenarına yay (Magic UI Animated Beam eğrisi). */
export function spokeEnds(spoke: Spoke): SpokeEnds {
  const nodeX = NODE_X[spoke.side]
  const nodeY = spoke.y
  const dx = HUB_CENTER.x - nodeX
  const dy = HUB_CENTER.y - nodeY
  const len = Math.hypot(dx, dy)
  const edgeX = HUB_CENTER.x - (dx / len) * HUB_CENTER.ring
  const edgeY = HUB_CENTER.y - (dy / len) * HUB_CENTER.ring
  const ctrlX = (nodeX + edgeX) / 2
  const ctrlY = nodeY + (edgeY - nodeY) * 0.18
  return {
    nodeX,
    nodeY,
    edgeX,
    edgeY,
    d: `M${nodeX} ${nodeY} Q${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${edgeX.toFixed(1)} ${edgeY.toFixed(1)}`,
  }
}

/** Arka plan sinaps noktaları (kart ve halka dışında). */
export const FIELD: readonly [number, number][] = [
  [148, 72],
  [852, 84],
  [96, 220],
  [904, 248],
  [112, 380],
  [888, 412],
  [168, 538],
  [832, 548],
  [356, 64],
  [644, 58],
  [348, 536],
  [652, 544],
]

/** CPU Architecture köşe işaretleri (halka çevresi). */
export const CHIP = 156

/** Kartın kutu içindeki dikey konumu (%). */
export const spokeTop = (spoke: Spoke) => `${(spoke.y / HUB_VIEWBOX.height) * 100}%`
