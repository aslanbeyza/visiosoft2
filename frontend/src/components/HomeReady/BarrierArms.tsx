import { useEffect, useState, type CSSProperties } from 'react'
import styles from './HomeReady.module.css'

type BarrierArmsProps = {
  open: boolean
}

export default function BarrierArms({ open }: BarrierArmsProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const armClass = reducedMotion ? styles.arm : `${styles.arm} ${styles.armMotion}`

  return (
    <div className={styles.arms} aria-hidden="true">
      <div className={styles.ground} />
      <div
        className={`${armClass} ${styles.armLeft}`}
        style={{ '--arm-turn': open ? '-82deg' : '0deg' } as CSSProperties}
      />
      <div className={`${styles.cabin} ${styles.cabinLeft}`} />
      <div
        className={`${armClass} ${styles.armRight}`}
        style={{ '--arm-turn': open ? '82deg' : '0deg' } as CSSProperties}
      />
      <div className={`${styles.cabin} ${styles.cabinRight}`} />
    </div>
  )
}
