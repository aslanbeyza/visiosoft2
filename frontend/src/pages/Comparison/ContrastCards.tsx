import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Badge from '../../components/Badge/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { comparisonCopy } from './comparisonCopy.ts'
import styles from './ContrastCards.module.css'

const copy = comparisonCopy.contrast

const cardVariants: Variants = {
  hidden: (side: number) => ({ opacity: 0, x: side * 28 }),
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: revealEase, staggerChildren: 0.12, delayChildren: 0.35 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: revealEase } },
}
const strokeVariants: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 0.55, delay: 0.15, ease: revealEase } },
}
const dividerVariants: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 1.1, delay: 0.2, ease: revealEase } },
}
const versusVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.6, ease: revealEase } },
}

function Mark({ kind }: { kind: 'no' | 'yes' }) {
  return (
    <svg className={styles.mark} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {kind === 'yes' ? (
        <motion.path d="m3.5 8.4 2.9 2.9 6.1-6.3" variants={strokeVariants} />
      ) : (
        <>
          <motion.path d="m4.5 4.5 7 7" variants={strokeVariants} />
          <motion.path d="m11.5 4.5-7 7" variants={strokeVariants} />
        </>
      )}
    </svg>
  )
}

type Side = { badge: string; title: string; body: string; items: string[] }

function Card({ side, data, dark }: { side: number; data: Side; dark: boolean }) {
  return (
    <motion.article className={styles.card} data-dark={dark} custom={side} variants={cardVariants}>
      <motion.div variants={itemVariants}>
        <Badge tone={dark ? 'light' : 'neutral'} dot={dark}>
          {data.badge}
        </Badge>
      </motion.div>
      <motion.h3 className={styles.title} variants={itemVariants}>
        {data.title}
      </motion.h3>
      <motion.p className={styles.body} variants={itemVariants}>
        {data.body}
      </motion.p>
      <ul className={styles.list}>
        {data.items.map((item) => (
          <motion.li key={item} className={styles.item} variants={itemVariants}>
            <span className={styles.markTile}>
              <Mark kind={dark ? 'yes' : 'no'} />
            </span>
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.article>
  )
}

/** İki yaklaşımı karşı karşıya koyan kartlar; kartlar iki yandan gelir, işaretler çizilir. */
export default function ContrastCards() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      className={styles.grid}
      initial={reduce ? false : 'hidden'}
      animate={reduce || inView ? 'show' : 'hidden'}
    >
      <Card side={-1} data={copy.traditional} dark={false} />
      <div className={styles.divider} aria-hidden="true">
        <motion.span className={styles.line} variants={dividerVariants} />
        <motion.span className={styles.versus} variants={versusVariants}>
          {copy.versus}
        </motion.span>
      </div>
      <Card side={1} data={copy.visio} dark />
    </motion.div>
  )
}
