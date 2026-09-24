import type { CSSProperties, ReactNode } from 'react'
import { deviceFrames } from './deviceFrames.ts'
import type { DeviceKind } from './deviceFrames.ts'
import styles from './DeviceFrame.module.css'

type DeviceFrameProps = {
  kind: DeviceKind

  children: ReactNode

  overlay?: ReactNode
  className?: string
}

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
      <div className={styles.screenGlare} aria-hidden="true" />
      <img className={styles.frame} src={frame.src} width={frame.width} height={frame.height} alt="" />
      {overlay}
    </div>
  )
}
