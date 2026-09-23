import { CanvasTexture, SRGBColorSpace } from 'three'

const ROWS: Array<{ sure: string; ucret: string }> = [
  { sure: '1 Saat', ucret: '120 TL' },
  { sure: '2 Saat', ucret: '180 TL' },
  { sure: '3 Saat', ucret: '240 TL' },
  { sure: '5 Saat', ucret: '350 TL' },
  { sure: '24 Saat', ucret: '750 TL' },
]

/**
 * Navbar LED fotoğrafındaki tarif yüzünün düz (ortografik) kopyası.
 * Perspektifli ürün fotoğrafı mesh’e basılınca çift görüntü oluştuğu için çizilir.
 */
export function createLedPanelFaceTexture() {
  const width = 512
  const height = 1024
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Beyaz gövde / plexi alanı
  ctx.fillStyle = '#f2f3f5'
  ctx.fillRect(0, 0, width, height)

  // Üst LED satır
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(28, 36, width - 56, 168)
  ctx.fillStyle = '#ff2a2a'
  ctx.font = '700 52px ui-monospace, SFMono-Regular, Menlo, monospace'
  ctx.textAlign = 'center'
  ctx.shadowColor = '#ff2a2a'
  ctx.shadowBlur = 12
  ctx.fillText('<<<  BOS YER  >>>', width / 2, 140)
  ctx.shadowBlur = 0

  // Visiosoft şerit
  const tableTop = 236
  ctx.fillStyle = '#3a3f48'
  ctx.fillRect(28, tableTop, width - 56, 64)
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 34px Inter, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Visiosoft', 52, tableTop + 44)

  // SÜRE / ÜCRET başlık
  const headY = tableTop + 64
  ctx.fillStyle = '#4a505a'
  ctx.fillRect(28, headY, width - 56, 52)
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 24px Inter, system-ui, sans-serif'
  ctx.fillText('SÜRE', 64, headY + 34)
  ctx.textAlign = 'right'
  ctx.fillText('ÜCRET', width - 64, headY + 34)

  // Satırlar
  let rowY = headY + 52
  const rowH = 88
  ROWS.forEach((row, index) => {
    ctx.fillStyle = index % 2 === 0 ? '#ffffff' : '#eef0f3'
    ctx.fillRect(28, rowY, width - 56, rowH)
    ctx.fillStyle = '#2a2f38'
    ctx.font = '600 28px Inter, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(row.sure, 64, rowY + 54)
    ctx.textAlign = 'right'
    ctx.fillText(row.ucret, width - 64, rowY + 54)
    rowY += rowH
  })

  // Alt boşluk / çerçeve hissi
  ctx.strokeStyle = '#d5d8de'
  ctx.lineWidth = 4
  ctx.strokeRect(28, 36, width - 56, rowY - 36)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}
