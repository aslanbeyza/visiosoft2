import ScreenPatches from './ScreenPatches.tsx'
import type { ScreenPatch } from './ScreenPatches.tsx'
import type { ZoneShotKey } from './zoneTour.ts'

/**
 * Gerçek saha adı zone3 görüntüsünde saha seçicide ve dört kamera kartı başlığında görünür.
 * Görsel yeniden dışa aktarılana kadar bu yamalar adı, Oturumlar ekranındaki demo otopark adı "Merkez" ile değiştirir.
 * Ölçüler 1896 × 862 kaynak pikselidir.
 */
const cardTitle = (x: number, y: number, h: number, text: string): ScreenPatch => ({ x, y, w: 232, h, bg: '#2d2d2f', text, size: 24, weight: 600, color: '#f4f4f5', inset: 4 })

const zone3: ScreenPatch[] = [
  { x: 34, y: 107, w: 32, h: 30, bg: '#000000', radius: 8, text: 'M', size: 17, weight: 500, color: '#f4f4f5' },
  { x: 76, y: 104, w: 230, h: 36, bg: '#09090b', text: 'Merkez', size: 18, weight: 500, color: '#f4f4f5', inset: 9 },
  cardTitle(488, 508, 76, 'Merkez - GIRIS'),
  cardTitle(846, 508, 104, 'Merkez - GIRIS 2'),
  cardTitle(1213, 508, 104, 'Merkez - CIKIS 2'),
  cardTitle(1572, 508, 76, 'Merkez - CIKIS'),
]

const shots: Partial<Record<ZoneShotKey, { width: number; height: number; patches: ScreenPatch[] }>> = {
  zone3: { width: 1896, height: 862, patches: zone3 },
}

/** Zone turu görüntüsüne ait yamalar (yoksa hiçbir şey çizmez). */
export default function ZoneRedactions({ shot }: { shot: ZoneShotKey }) {
  const entry = shots[shot]
  if (!entry) return null
  return <ScreenPatches width={entry.width} height={entry.height} patches={entry.patches} />
}
