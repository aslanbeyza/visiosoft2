import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { paymentCopy as copy } from './paymentCopy.ts'
import styles from './PaymentRail.module.css'

/**
 * Hero sahnesi: ödemenin yolu. "Visiosoft" ve "PayTR" uçları belirir, aradaki bağlantı çizgisi iki yandan
 * kilide doğru çizilir, kilidin gövdesi ve halkası mürekkeple çizilir (M3); altında kısa açıklama. Dekoratif yol,
 * metinler gerçek DOM'dur.
 */
export default function PaymentRail() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const play = reduce || inView

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.7, delay, ease: revealEase },
  })
  const line = (delay: number) => ({
    initial: reduce ? false : { scaleX: 0 },
    animate: play ? { scaleX: 1 } : undefined,
    transition: { duration: 0.8, delay, ease: revealEase },
  })
  const ink = (delay: number) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: play ? { pathLength: 1 } : undefined,
    transition: { duration: 0.9, delay, ease: revealEase },
  })

  return (
    <div ref={ref} className={styles.rail}>
      <div className={styles.track}>
        <motion.span className={styles.endpoint} {...rise(0.55)}>
          {copy.railFrom}
        </motion.span>
        <span className={styles.wire} aria-hidden="true">
          <motion.span className={styles.lineStart} {...line(0.85)} />
          <motion.span className={styles.lock} {...rise(1.05)}>
            <svg viewBox="0 0 24 24" className={styles.lockIcon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
              <motion.path d="M7 11h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" {...ink(1.15)} />
              <motion.path d="M9 11V8a3 3 0 0 1 6 0v3" {...ink(1.4)} />
            </svg>
          </motion.span>
          <motion.span className={styles.lineEnd} {...line(0.85)} />
        </span>
        <motion.span className={styles.endpoint} data-accent="true" {...rise(0.65)}>
          {copy.railTo}
        </motion.span>
      </div>
      <motion.p className={styles.note} {...rise(1.5)}>
        {copy.railNote}
      </motion.p>
    </div>
  )
}
