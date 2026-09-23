import type { CSSProperties, ReactNode } from 'react'
import { deviceFrames } from './deviceFrames.ts'
import type { DeviceKind } from './deviceFrames.ts'
import styles from './DeviceFrame.module.css'

type DeviceFrameProps = {
  kind: DeviceKind
  /** Ekran deliğine yerleşen içerik; delik dışına taşan kısmı kırpılır. */
  children: ReactNode
  /** Çerçeve ölçülerini (--screen-*) kullanması gereken üst katman, imleç ipucu gibi. */
  overlay?: ReactNode
  className?: string
}

/**
 * Kullanım: `<DeviceFrame kind="laptop"><Demo /></DeviceFrame>`
 * Cihaz görseli ekranın üstünde durur, içerik delik içinde kalır. Delik oranları deviceFrames.ts'ten gelir;
 * çerçeve PNG'si değişirse tek yer güncellenir.
 */
export default function DeviceFrame({ kind, children, overlay, className = '' }: DeviceFrameProps) {
  const frame = deviceFrames[kind]
  const style = {
    '--screen-top': frame.screen.top,
    '--screen-right': frame.screen.right,
    '--screen-bottom': frame.screen.bottom,
    '--screen-left': frame.screen.left,
  } as CSSProperties

  return (
    <div className={`${styles.device} ${className}`.trim()} data-kind={kind} style={style}>
      <div className={styles.screen}>{children}</div>
      <img className={styles.frame} src={frame.src} width={frame.width} height={frame.height} alt="" />
      {overlay}
    </div>
  )
}
