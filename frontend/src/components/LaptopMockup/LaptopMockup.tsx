import type { ReactNode } from 'react'
import styles from './LaptopMockup.module.css'

type LaptopMockupProps = {
  children: ReactNode
  className?: string
}

export default function LaptopMockup({ children, className = '' }: LaptopMockupProps) {
  return (
    <div className={`${styles.laptop} ${className}`.trim()}>
      <div className={styles.lid}>
        <span className={styles.camera} aria-hidden="true" />
        <div className={styles.screen}>{children}</div>
      </div>
      <div className={styles.hinge} aria-hidden="true" />
      <div className={styles.base} aria-hidden="true" />
    </div>
  )
}
