import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { homeAssuranceCopy as text } from './homeAssuranceCopy.ts'
import type { AssuranceColumnId } from './homeAssuranceCopy.ts'
import { columnIcons } from './icons.ts'
import { drawVariants, riseVariants } from './variants.ts'
import styles from './AssuranceColumns.module.css'

type CardModel = {
  id: AssuranceColumnId
  title: string
  lead: string
  proofs: readonly string[]
}

function CardIcon({ id, delay }: { id: AssuranceColumnId; delay: number }) {
  return (
    <span className={styles.mark} aria-hidden="true">
      <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {columnIcons[id].map((d, k) => (
          <motion.path key={d} d={d} custom={delay + k * 0.08} variants={drawVariants} />
        ))}
      </svg>
    </span>
  )
}

function Card({ card, index }: { card: CardModel; index: number }) {
  const delay = index * 0.1

  return (
    <motion.article className={styles.card} data-id={card.id} custom={delay} variants={riseVariants}>
      <CardIcon id={card.id} delay={delay + 0.2} />
      <div className={styles.body}>
        <h3 id={`home-assurance-${card.id}`} className={styles.title}>
          {card.title}
        </h3>
        <p className={styles.lead}>{card.lead}</p>
        <ul className={styles.proofs} aria-label={`${card.title} kanıtları`}>
          {card.proofs.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  )
}

export default function AssuranceColumns() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.22 })
  const [focusedEarly, setFocusedEarly] = useState(false)
  const { support, security, integration } = text
  const state = reduce ? 'show' : focusedEarly ? 'instant' : inView ? 'show' : 'hidden'

  return (
    <motion.div
      ref={ref}
      className={styles.stack}
      initial={reduce ? false : 'hidden'}
      animate={state}
      onFocusCapture={() => {
        if (!inView && !reduce) setFocusedEarly(true)
      }}
    >
      <Card card={support} index={0} />
      <Card card={security} index={1} />
      <Card card={integration} index={2} />
    </motion.div>
  )
}
