import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { CardIcon, FeatureIcon } from '../FeatureGrid/icons.tsx'
import { revealEase } from '../Reveal/index.ts'
import { homeZoneCopy } from './homeZoneCopy.ts'
import styles from './PaymentStage.module.css'

const methods = homeZoneCopy.driver.payment.methods

function HgsGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="4" y="8" width="11" height="8" rx="1.5" />
      <path d="M7 12h5M18 9.5a3.5 3.5 0 0 1 0 5M20.5 7.5a6.5 6.5 0 0 1 0 9" />
    </svg>
  )
}

function QrGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 19v1M20 14v1" />
    </svg>
  )
}

const glyphs = [<HgsGlyph key="hgs" />, <CardIcon key="pos" />, <QrGlyph key="qr" />]

/** Üç ödeme kanalının aynı geçişe bağlandığı sade çizim; bağlantı çizgileri bir kez çizilir. */
export default function PaymentStage() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion() ?? false
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const drawn = reduce || inView

  return (
    <div ref={ref} className={styles.stage} aria-hidden="true">
      <ul className={styles.methods}>
        {methods.map((method, i) => (
          <motion.li
            key={method}
            className={styles.method}
            initial={reduce ? false : { opacity: 0, x: -14 }}
            animate={drawn ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: revealEase }}
          >
            <span className={styles.glyph}>{glyphs[i]}</span>
            <span className={styles.name}>{method}</span>
          </motion.li>
        ))}
      </ul>

      {/*
       * Çizgiler esnek genişlikte uzar; bu yüzden pathLength yerine soldan sağa clip-path silmesiyle çizilir (kalınlık sabit kalır).
       * SVG ilk kanalın ortasından son kanalın ortasına uzanır: uç çizgiler üst/alt kenarda, kırpma dikeyde 4 px taşar.
       */}
      <motion.svg
        className={styles.links}
        viewBox="0 0 80 180"
        preserveAspectRatio="none"
        focusable="false"
        initial={reduce ? false : { clipPath: 'inset(-4px 100% -4px 0%)' }}
        animate={drawn ? { clipPath: 'inset(-4px 0% -4px 0%)' } : undefined}
        transition={{ duration: 1, delay: 0.45, ease: revealEase }}
      >
        {[0, 90, 180].map((y) => (
          <path key={y} d={`M0 ${y} C 40 ${y}, 40 90, 80 90`} vectorEffect="non-scaling-stroke" />
        ))}
      </motion.svg>

      <motion.span
        className={styles.gate}
        initial={reduce ? false : { opacity: 0, scale: 0.85 }}
        animate={drawn ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.7, delay: 1.05, ease: revealEase }}
      >
        <FeatureIcon name="barrier" />
      </motion.span>
    </div>
  )
}
