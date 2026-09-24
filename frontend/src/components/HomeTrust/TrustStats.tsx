import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import CountUp from '../CountUp/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { homeTrustCopy as copy } from './homeTrustCopy.ts'
import styles from './TrustStats.module.css'

const line: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease: revealEase } },
}

const divider: Variants = {
  hidden: { scaleY: 0 },
  show: (delay: number = 0) => ({ scaleY: 1, transition: { duration: 0.9, delay, ease: revealEase } }),
}

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: revealEase } }),
}

export default function TrustStats() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const state = reduce || inView ? 'show' : 'hidden'
  const { since, references, plate, support } = copy.stats

  const stats: { key: string; sr: string; label: string; value: ReactNode }[] = [
    { key: 'since', sr: since.sr, label: since.label, value: <span className={styles.number}>{since.value}</span> },
    {
      key: 'references',
      sr: references.sr,
      label: references.label,
      value: <CountUp value={references.value} duration={1.2} delay={0.25} className={styles.number} />,
    },
    {
      key: 'plate',
      sr: plate.sr,
      label: plate.label,
      value: (
        <>
          <CountUp value={plate.value} duration={1.2} delay={0.35} className={styles.number} />
          <span className={styles.affix}>{plate.suffix}</span>
        </>
      ),
    },
    { key: 'support', sr: support.sr, label: support.label, value: <span className={styles.number}>{support.value}</span> },
  ]

  return (
    <motion.div ref={ref} className={styles.stats} initial={reduce ? false : 'hidden'} animate={state}>
      <motion.span className={`${styles.rule} ${styles.ruleTop}`} aria-hidden="true" variants={line} />
      <ul className={styles.list} role="list" aria-label={copy.statsLabel}>
        {stats.map((stat, index) => (
          <li key={stat.key} className={styles.stat}>
            <motion.span className={styles.divider} aria-hidden="true" variants={divider} custom={0.2 + index * 0.08} />
            <span className={styles.srOnly}>{stat.sr}</span>
            <motion.div className={styles.visual} aria-hidden="true" variants={item} custom={0.1 + index * 0.08}>
              <p className={styles.value}>{stat.value}</p>
              <p className={styles.label}>{stat.label}</p>
            </motion.div>
          </li>
        ))}
      </ul>
      <motion.span className={`${styles.rule} ${styles.ruleBottom}`} aria-hidden="true" variants={line} />
    </motion.div>
  )
}
