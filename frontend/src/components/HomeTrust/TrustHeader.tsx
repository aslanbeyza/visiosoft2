import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import TextReveal from '../TextReveal/index.ts'
import { revealEase } from '../Reveal/index.ts'
import TrustIcon from './TrustIcon.tsx'
import { homeTrustCopy as copy } from './homeTrustCopy.ts'
import styles from './TrustHeader.module.css'

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: revealEase } }),
}

const draw: Variants = {
  hidden: { scaleX: 0 },
  show: (delay: number = 0) => ({ scaleX: 1, transition: { duration: 1, delay, ease: revealEase } }),
}

const keepCompounds = (text: string) => text.replace(/\be-(?=\p{L})/gu, 'e‑')

export default function TrustHeader({ titleId }: { titleId: string }) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const state = reduce || inView ? 'show' : 'hidden'
  const initial = reduce ? false : 'hidden'

  return (
    <div ref={ref} className={styles.header}>
      <div className={styles.headingCol}>
        <motion.p className={styles.eyebrow} initial={initial} animate={state} variants={rise} custom={0}>
          <motion.span className={styles.rule} aria-hidden="true" variants={draw} custom={0.1} />
          {copy.eyebrow}
        </motion.p>
        <TextReveal as="h2" id={titleId} text={copy.title} className={styles.title} delay={0.12} amount={0.2} />
      </div>

      <div className={styles.bodyCol}>
        <motion.p className={styles.lead} initial={initial} animate={state} variants={rise} custom={0.38}>
          {copy.lead}
        </motion.p>

        <ul className={styles.pillars} role="list">
          {copy.pillars.map((pillar, index) => {
            const delay = 0.55 + index * 0.1
            return (
              <motion.li key={pillar.title} className={styles.pillar} initial={initial} animate={state}>
                <motion.span className={styles.pillarRule} aria-hidden="true" variants={draw} custom={delay} />
                <motion.div className={styles.pillarBody} variants={rise} custom={delay + 0.08}>
                  <span className={styles.icon}>
                    <TrustIcon name={pillar.icon} />
                  </span>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <p className={styles.pillarText}>{keepCompounds(pillar.text)}</p>
                </motion.div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
