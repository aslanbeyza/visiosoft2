import { useRef } from 'react'
import { useInView } from 'framer-motion'
import styles from './KioskScreen.module.css'

export default function KioskScreen() {
  const ref = useRef<HTMLDivElement>(null)

  const inView = useInView(ref, { margin: '200px 0px' })

  return (
    <div ref={ref} className={styles.screen} data-running={inView ? 'true' : 'false'}>
      <div className={styles.ui}>
        <span className={styles.status}>
          <span className={styles.statusDot} />
          Bağlı
        </span>
        <span className={styles.lang}>TR</span>

        <span className={styles.icon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="15" height="11" rx="2" />
            <path d="M3 10h15M6 14h3M20 9.5a4 4 0 0 1 0 5M22 8a7 7 0 0 1 0 8" />
          </svg>
        </span>

        <p className={styles.welcome}>Hoş geldiniz</p>

        <div className={styles.card}>
          <span className={styles.cardLead}>Ödeme yapmak için</span>
          <span className={styles.cardRule} />
          <strong className={styles.cardTitle}>KARTINIZI OKUTUN</strong>
        </div>

        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>

        <span className={styles.support}>CANLI DESTEK</span>
        <span className={styles.powered}>
          Powered by <b>VISIOSOFT</b>
        </span>
      </div>
      <span className={styles.gloss} />
    </div>
  )
}
