/**
 * DOM kaydırması ile 3B sahne arasındaki köprü.
 * Scroll yazar, useFrame okur — kaydırma sırasında React state yok.
 */
export const kioskStage = {
  /** Bölümün 0→1 kaydırma ilerlemesi. */
  progress: 0,
  /** 0→1 gövdenin parçalarına ayrılması. */
  explode: 0,
  /** Sahne üzerindeki fare, -1→1. */
  pointer: { x: 0, y: 0 },
}

/** Three.js temizleme rengi; CSS `--ke-stage` ile aynı tutulur. */
export const STUDIO_CLEAR = '#e8ebf1'

const EXPLODE_START = 0.5
const EXPLODE_END = 0.9

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export const mapRange = (value: number, from: number, to: number) => clamp((value - from) / (to - from || 1))

export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount

export const easeInOut = (amount: number) =>
  amount < 0.5 ? 4 * amount * amount * amount : 1 - Math.pow(-2 * amount + 2, 3) / 2

export const damp = (current: number, target: number, lambda: number, delta: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * delta))

export const padCount = (value: number) => String(value).padStart(2, '0')

export function writeStageFromProgress(progress: number) {
  kioskStage.progress = progress
  kioskStage.explode = clamp(mapRange(progress, EXPLODE_START, EXPLODE_END))
}

export function writePointer(clientX: number, clientY: number, bounds: DOMRect) {
  kioskStage.pointer.x = ((clientX - bounds.left) / bounds.width) * 2 - 1
  kioskStage.pointer.y = -(((clientY - bounds.top) / bounds.height) * 2 - 1)
}

export function clearPointer() {
  kioskStage.pointer.x = 0
  kioskStage.pointer.y = 0
}
