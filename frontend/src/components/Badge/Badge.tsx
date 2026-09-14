/**
 * Kullanım:
 *   <Badge>Kiosk sistemleri</Badge>
 *   <Badge tone="success" dot>Canlı</Badge>      ← yalnızca gerçek "etkin/başarılı" durumlar için
 *   <Badge tone="light">temsilî görsel</Badge>   ← koyu zeminde
 * Küçük etiket; metin dönüştürülmez (Türkçe "i/İ" sorunu), yazımı olduğu gibi verin.
 */
import type { ReactNode } from 'react'
import styles from './Badge.module.css'

export type BadgeProps = {
  children: ReactNode
  /** navy: lacivert tint · success: yalnızca gerçek etkin/başarılı durum · neutral: gri · light: koyu zeminde beyaz. */
  tone?: 'navy' | 'success' | 'neutral' | 'light'
  /** Solda küçük durum noktası. */
  dot?: boolean
  className?: string
}

export default function Badge({ children, tone = 'navy', dot = false, className = '' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${className}`.trim()} data-tone={tone}>
      {dot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {children}
    </span>
  )
}
