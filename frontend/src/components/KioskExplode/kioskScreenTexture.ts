import { CanvasTexture, SRGBColorSpace } from 'three'
import { kioskExplodeCopy } from './kioskExplodeCopy.ts'

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()
  ctx.moveTo(left + radius, top)
  ctx.arcTo(left + width, top, left + width, top + height, radius)
  ctx.arcTo(left + width, top + height, left, top + height, radius)
  ctx.arcTo(left, top + height, left, top, radius)
  ctx.arcTo(left, top, left + width, top, radius)
  ctx.closePath()
  ctx.fill()
}

export function createKioskScreenTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const fill = ctx.createLinearGradient(0, 0, 0, 1024)
  fill.addColorStop(0, '#ff2a2a')
  fill.addColorStop(0.45, '#e10000')
  fill.addColorStop(1, '#b40000')
  ctx.fillStyle = fill
  ctx.fillRect(0, 0, 512, 1024)

  ctx.fillStyle = 'rgb(255 255 255 / 0.12)'
  ctx.fillRect(0, 0, 512, 72)
  ctx.fillStyle = 'rgb(255 255 255 / 0.88)'
  ctx.font = '600 22px Inter, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('VISIOSOFT', 36, 46)
  ctx.textAlign = 'right'
  ctx.fillText('12:40', 476, 46)

  const { welcome, payLead, payTitle, brand } = kioskExplodeCopy.screen
  ctx.textAlign = 'center'

  ctx.fillStyle = 'rgb(255 255 255 / 0.94)'
  ctx.font = '600 38px Inter, sans-serif'
  ctx.fillText(welcome, 256, 210)

  ctx.fillStyle = 'rgb(255 255 255 / 0.2)'
  fillRoundRect(ctx, 56, 360, 400, 280, 32)

  ctx.strokeStyle = 'rgb(255 255 255 / 0.55)'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(256, 430, 28, Math.PI * 0.15, Math.PI * 0.85, true)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(256, 430, 16, Math.PI * 0.15, Math.PI * 0.85, true)
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(256, 448, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = '600 26px Inter, sans-serif'
  ctx.fillText(payLead, 256, 520)
  ctx.font = '700 32px Inter, sans-serif'
  ctx.fillText(payTitle, 256, 568)

  ctx.font = '600 22px Inter, sans-serif'
  ctx.fillStyle = 'rgb(255 255 255 / 0.78)'
  ctx.fillText(brand, 256, 930)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.flipY = true
  texture.needsUpdate = true
  return texture
}
