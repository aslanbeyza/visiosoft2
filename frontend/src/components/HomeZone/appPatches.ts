import type { ScreenPatch } from './ScreenPatches.tsx'

/**
 * Mobil uygulama ekranları (516 × 1124 kaynak pikseli) için gizleme yamaları; renkler AVIF çözümünden örneklendi.
 * Görseller yeniden dışa aktarılana kadar: referans müşteri adı nötr "Merkez Otopark" olur, üçüncü tarafın telefon
 * numarası ve demo fiyat bulanıklaşır, yarım kaydırılmış "Sil" satırı ekran zeminiyle kapanır.
 */
const appHeader: ScreenPatch = { x: 50, y: 164, w: 388, h: 46, bg: '#181f27', text: 'Merkez Otopark', size: 23, weight: 600, color: '#fff', inset: 12 }

export const appPatches: Record<string, ScreenPatch[]> = {
  araclarim: [
    appHeader,
    { x: 0, y: 757, w: 516, h: 140, bg: '#ffffff' },
    { x: 82, y: 988, w: 186, h: 46, bg: '#ffffff', blur: 7 },
  ],
  'plaka-ekle': [appHeader],
  'abonelik-sec': [{ x: 370, y: 658, w: 110, h: 56, bg: '#f3fcf7', blur: 9 }],
}
