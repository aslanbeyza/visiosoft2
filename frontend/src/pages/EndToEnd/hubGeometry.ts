// Hub & spoke çiziminin geometrisi (viewBox 1000 × 600). Modül sırası endToEndCopy.modules ile aynıdır.
export const HUB_VIEWBOX = { width: 1000, height: 600 } as const

export const HUB_CENTER = { x: 500, y: 300, ring: 138 } as const

export type Spoke = {
  side: 'left' | 'right'
  /** Kartın bağlantı ucunun y konumu (viewBox birimi). */
  y: number
  /** Karttan merkeze giden bağlantı; yol merkezde biter, akış noktaları bu yönde ilerler. */
  d: string
}

export const spokes: Spoke[] = [
  { side: 'left', y: 110, d: 'M270 110C330 110 348 173 394 211' },
  { side: 'left', y: 300, d: 'M270 300H362' },
  { side: 'left', y: 490, d: 'M270 490C330 490 348 427 394 389' },
  { side: 'right', y: 110, d: 'M730 110C670 110 652 173 606 211' },
  { side: 'right', y: 300, d: 'M730 300H638' },
  { side: 'right', y: 490, d: 'M730 490C670 490 652 427 606 389' },
]

/** Kartın kutu içindeki dikey konumu (%). */
export const spokeTop = (spoke: Spoke) => `${(spoke.y / HUB_VIEWBOX.height) * 100}%`
