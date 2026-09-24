import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import CountUp from '../../components/CountUp/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { price, pricingCopy } from './pricingCopy.ts'
import styles from './PriceCard.module.css'

const copy = pricingCopy.card

const card: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.55, ease: revealEase, when: 'beforeChildren', staggerChildren: 0.12 } },
}
const row: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
}
const tick: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 0.6, delay: 0.2, ease: revealEase } },
}
const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1, ease: revealEase } },
}

export default function PriceCard() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const v = (variants: Variants) => (reduce ? undefined : variants)

  return (
    <motion.div ref={ref} className={styles.card} variants={v(card)} initial={reduce ? false : 'hidden'} animate={inView || reduce ? 'show' : 'hidden'}>
      <div className={styles.head}>
        <span className={styles.label}>{copy.label}</span>
        <p className={styles.price}>
          {reduce ? price.label : <CountUp value={1499} prefix="$" suffix="+" grouping duration={1.4} delay={0.7} />}
        </p>
      </div>
      <motion.span className={styles.rule} aria-hidden="true" variants={v(rule)} />
      <p className={styles.note}>{copy.note}</p>
      <ul className={styles.list}>
        {copy.highlights.map((item) => (
          <motion.li key={item.title} className={styles.item} variants={v(row)}>
            <span className={styles.check} aria-hidden="true">
              <svg viewBox="0 0 20 20" focusable="false">
                <motion.path d="m5.5 10.5 3 3 6-7" variants={v(tick)} />
              </svg>
            </span>
            <strong className={styles.text}>{item.title}</strong>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
