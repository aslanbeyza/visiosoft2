import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { CardIcon, UsersIcon } from '../../components/FeatureGrid/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import styles from './InvoiceFlow.module.css'

type Props = { label: string; steps: string[] }

const listVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.35, delayChildren: 0.1 } } }
const nodeVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase, when: 'beforeChildren', staggerChildren: 0.08 } },
}
const drawVariants: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 0.7, ease: revealEase } },
}
const lineX: Variants = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, delay: 0.3, ease: revealEase } } }
const lineY: Variants = { hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.8, delay: 0.3, ease: revealEase } } }
const travelVariants: Variants = {
  hidden: { x: '0%', opacity: 0 },
  show: {
    // Belge düğümler arasında görünür, düğümün içine girerken kaybolur.
    x: ['0%', '16.667%', '33.333%', '50%', '66.667%'],
    opacity: [0, 1, 0, 1, 0],
    transition: { duration: 2.8, delay: 1.5, times: [0, 0.25, 0.5, 0.75, 1], ease: 'linear' },
  },
}

function Connector() {
  return (
    <span className={styles.connector} aria-hidden="true">
      <motion.span className={styles.lineX} variants={lineX} />
      <motion.span className={styles.lineY} variants={lineY} />
    </span>
  )
}

function DocumentGlyph() {
  return (
    <svg className={styles.doc} viewBox="0 0 48 60" fill="none" aria-hidden="true" focusable="false">
      <motion.path d="M8 4h22l10 10v42H8z" variants={drawVariants} />
      <motion.path d="M30 4v10h10" variants={drawVariants} />
      <motion.path d="M15 24h18M15 32h18M15 40h11" variants={drawVariants} />
      <motion.circle cx="34" cy="46" r="6" variants={drawVariants} />
    </svg>
  )
}

/** Gelirden müşteriye elektronik fatura akışı: düğümler sırayla gelir, bağlantılar çizilir, belge bir kez yol alır. */
export default function InvoiceFlow({ label, steps }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const state = reduce || inView ? 'show' : 'hidden'
  const icons = [<CardIcon key="card" />, <DocumentGlyph key="doc" />, <UsersIcon key="users" />]

  return (
    <motion.div ref={ref} className={styles.root} initial={reduce ? false : 'hidden'} animate={state}>
      <motion.ol className={styles.flow} aria-label={label} variants={listVariants}>
        {steps.map((step, index) => (
          <motion.li key={step} className={styles.node} data-main={index === 1} variants={nodeVariants}>
            <span className={styles.tile} aria-hidden="true">
              {icons[index]}
              {index === steps.length - 1 ? (
                <svg className={styles.check} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
                  <motion.path d="m3.5 8.4 2.9 2.9 6.1-6.3" variants={drawVariants} />
                </svg>
              ) : null}
            </span>
            <span className={styles.label}>{step}</span>
            {index < steps.length - 1 ? <Connector /> : null}
          </motion.li>
        ))}
      </motion.ol>
      {reduce ? null : (
        <motion.span className={styles.travel} aria-hidden="true" variants={travelVariants}>
          <span className={styles.travelDoc} />
        </motion.span>
      )}
    </motion.div>
  )
}
