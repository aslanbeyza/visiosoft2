import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { forkCopy } from './lowConfidenceCopy.ts'
import styles from './ConfidenceFork.module.css'

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: revealEase } }),
}

const drawX: Variants = {
  hidden: { scaleX: 0 },
  show: (delay: number) => ({ scaleX: 1, transition: { duration: 0.5, delay, ease: revealEase } }),
}

const drawY: Variants = {
  hidden: { scaleY: 0 },
  show: (delay: number) => ({ scaleY: 1, transition: { duration: 0.5, delay, ease: revealEase } }),
}

const ink: Variants = {
  hidden: { pathLength: 0 },
  show: (delay: number) => ({ pathLength: 1, transition: { duration: 0.9, delay, ease: revealEase } }),
}

const needle: Variants = {
  hidden: { rotate: -90 },
  show: (delay: number) => ({ rotate: 58, transition: { duration: 1.1, delay, ease: revealEase } }),
}

function Wire({ delay, className }: { delay: number; className: string }) {
  return (
    <div className={`${styles.wire} ${className}`} aria-hidden="true">
      <motion.span className={styles.wireH} custom={delay} variants={drawX} />
      <motion.span className={styles.wireV} custom={delay} variants={drawY} />
    </div>
  )
}

export default function ConfidenceFork() {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={rootRef}
      className={styles.fork}
      role="group"
      aria-label={forkCopy.label}
      initial={reduce ? false : 'hidden'}
      animate={reduce || inView ? 'show' : 'hidden'}
    >
      <motion.article className={`${styles.card} ${styles.source}`} custom={0} variants={rise}>
        <div className={styles.plateStage} aria-hidden="true">
          <span className={styles.plate}>
            <span className={styles.plateBand}>TR</span>
            {forkCopy.plate}
          </span>
          <svg className={styles.bracket} viewBox="0 0 200 80" preserveAspectRatio="none" focusable="false">
            {['M2 22 V2 H30', 'M170 2 H198 V22', 'M198 58 V78 H170', 'M30 78 H2 V58'].map((d) => (
              <motion.path key={d} d={d} custom={0.35} variants={ink} />
            ))}
          </svg>
        </div>
        <p className={styles.kicker}>{forkCopy.source.kicker}</p>
        <h3 className={styles.title}>{forkCopy.source.title}</h3>
        <p className={styles.text}>{forkCopy.source.text}</p>
      </motion.article>

      <Wire delay={0.7} className={styles.wireA} />

      <motion.article className={`${styles.card} ${styles.check}`} custom={0.9} variants={rise}>
        <svg className={styles.gauge} viewBox="0 0 120 68" aria-hidden="true" focusable="false">
          <path className={styles.gaugeTrack} d="M10 62 A50 50 0 0 1 110 62" />
          {}
          <motion.path className={styles.gaugeValue} d="M10 62 A50 50 0 0 1 102.4 35.5" custom={1.1} variants={ink} />
          <motion.line className={styles.gaugeNeedle} x1="60" y1="62" x2="60" y2="22" style={{ originX: 0.5, originY: 1 }} custom={1.1} variants={needle} />
          <circle className={styles.gaugeHub} cx="60" cy="62" r="4" />
        </svg>
        <p className={styles.kicker}>{forkCopy.check.kicker}</p>
        <h3 className={styles.title}>{forkCopy.check.title}</h3>
        <p className={styles.text}>{forkCopy.check.text}</p>
      </motion.article>

      <div className={styles.split} aria-hidden="true">
        <motion.span className={styles.splitIn} custom={1.7} variants={drawX} />
        <motion.span className={styles.splitSpine} custom={1.95} variants={drawY} />
        <motion.span className={`${styles.splitOut} ${styles.splitTop}`} custom={2.2} variants={drawX} />
        <motion.span className={`${styles.splitOut} ${styles.splitBottom}`} custom={2.2} variants={drawX} />
        <motion.span className={styles.splitMobile} custom={1.7} variants={drawY} />
      </div>

      <motion.article className={`${styles.card} ${styles.outcome} ${styles.high}`} custom={2.4} variants={rise}>
        <p className={styles.tag}>{forkCopy.high.tag}</p>
        <h3 className={styles.title}>{forkCopy.high.title}</h3>
        <p className={styles.text}>{forkCopy.high.text}</p>
      </motion.article>

      <motion.article className={`${styles.card} ${styles.outcome} ${styles.low}`} custom={2.55} variants={rise}>
        <p className={styles.tag} data-tone="navy">
          {forkCopy.low.tag}
        </p>
        <h3 className={styles.title}>{forkCopy.low.title}</h3>
        <p className={styles.text}>{forkCopy.low.text}</p>
        <p className={styles.verified}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle className={styles.verifiedRing} cx="12" cy="12" r="9.5" />
            <motion.path d="M7.5 12.5l3 3 6-6.5" custom={3.1} variants={ink} />
          </svg>
          {forkCopy.low.verified}
        </p>
      </motion.article>
    </motion.div>
  )
}
