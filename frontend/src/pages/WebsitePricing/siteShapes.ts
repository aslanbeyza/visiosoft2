// Site kesiti çiziminin geometrisi (viewBox 560×460). Etiket konumları DOM katmanında yüzdeye çevrilir.

export const SITE_VIEW = { w: 560, h: 460 }

/** Zemin çizgisi, konut blokları, bariyerli giriş. */
export const outline = [
  'M20 232H540',
  'M64 232V64a8 8 0 0 1 8-8h76a8 8 0 0 1 8 8v168',
  'M172 232V104a8 8 0 0 1 8-8h62a8 8 0 0 1 8 8v128',
  'M272 232v-30M272 206h38',
]

function windowGrid(x0: number, y0: number, cols: number, rows: number, dx: number, dy: number): string {
  let d = ''
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) d += `M${x0 + c * dx} ${y0 + r * dy}h14v11h-14z`
  return d
}

export const windows = windowGrid(80, 74, 3, 6, 22, 25) + windowGrid(188, 114, 2, 4, 26, 27)

/** Bodrum katların döşemesi ve kat ayrımı. */
export const slabs = ['M40 244H528V424a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8z', 'M40 334H528']

/**
 * Otopark seviyeleri: kapasite hattı (x, y, genişlik), dolu oranı, sınır işareti oranı, araçların durduğu zemin,
 * araç konumları ve etiket noktası. Oranlar temsilîdir; ekranda sayı gösterilmez.
 */
export type Level = {
  key: string
  track: { x: number; y: number; w: number }
  fill: number
  limit: number
  floorY: number
  cars: number[]
  label: { x: number; y: number }
}

export const levels: Level[] = [
  { key: 'open', track: { x: 330, y: 196, w: 190 }, fill: 0.55, limit: 0.86, floorY: 232, cars: [336, 384, 432], label: { x: 330, y: 166 } },
  { key: 'b1', track: { x: 64, y: 284, w: 440 }, fill: 0.72, limit: 0.86, floorY: 326, cars: [70, 118, 166, 262, 310, 406], label: { x: 64, y: 252 } },
  { key: 'b2', track: { x: 64, y: 374, w: 440 }, fill: 0.46, limit: 0.86, floorY: 424, cars: [70, 166, 214, 262, 358], label: { x: 64, y: 342 } },
]

/** Yandan görünüm araç silueti ve tekerlekleri. */
export function carSilhouettes(xs: number[], y: number): string {
  return xs.map((x) => `M${x} ${y - 4}v-6q0-3 3-3h4l6-6h13l7 6h2q3 0 3 3v6z`).join('')
}

export function wheels(xs: number[], y: number): string {
  return xs.map((x) => `M${x + 6} ${y - 3}a3 3 0 1 0 6 0a3 3 0 1 0-6 0M${x + 24} ${y - 3}a3 3 0 1 0 6 0a3 3 0 1 0-6 0`).join('')
}

export function limitMark({ track, limit }: Level): string {
  const x = track.x + track.w * limit
  return `M${x} ${track.y + 7}V${track.y - 12}l9 3.5-9 3.5`
}

/** Katlardan bulut panele giden veri hattı ve cihaz bağlantıları. */
export const bus = 'M548 374V60H512'
export const branches = ['M520 196H548', 'M504 284H548', 'M504 374H548']
export const cloud = 'M412 78h82a18 18 0 0 0 0-36 26 26 0 0 0-50-8 20 20 0 0 0-32 14 15 15 0 0 0 0 30z'
export const deviceLinks = ['M430 78v18', 'M491 78v18']
export const laptop = 'M398 96h64v34h-64zM388 130h84l-6 8h-72z'
export const phone = 'M480 96h22a3 3 0 0 1 3 3v32a3 3 0 0 1-3 3h-22a3 3 0 0 1-3-3v-32a3 3 0 0 1 3-3zM488 129h6'

/** Etiket noktaları (SVG birimleri). */
export const labelPoints = {
  cloud: { x: 282, y: 52 },
  devices: { x: 388, y: 142 },
}
