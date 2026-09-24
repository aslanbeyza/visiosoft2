
import type { ReactNode } from 'react'
import styles from './Badge.module.css'

export type BadgeProps = {
  children: ReactNode

  tone?: 'navy' | 'success' | 'neutral' | 'light'

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
