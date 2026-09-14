import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { contactCopy } from './contactCopy.ts'
import styles from './CompanyFacts.module.css'

const copy = contactCopy.corporate

/**
 * Şirket bilgileri: resmi değerler birebir, <dl> satırları olarak. Liste görünüme girince
 * her satırın üstünde ince lacivert çizgi soldan sağa süpürür (M12), satırlar sırayla belirir.
 */
export default function CompanyFacts({ id }: { id: string }) {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const run = reduce || inView
  const headingId = `${id}-baslik`

  return (
    <Section id={id} tone="paper" spacing="lg" labelledBy={headingId}>
      <div className={styles.grid}>
        <div className={styles.head}>
          <SectionHeading id={headingId} eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
          <Reveal delay={0.2} y={12}>
            <Link to={path('bank-accounts')} className={styles.bankLink}>
              <span>{copy.bankLink}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
        </div>

        <dl ref={ref} className={styles.list} aria-label={copy.listLabel}>
          {copy.facts.map((fact, index) => (
            <motion.div
              key={fact.label}
              className={styles.row}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={run ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.07, ease: revealEase }}
            >
              <motion.span
                className={styles.sweep}
                aria-hidden="true"
                initial={reduce ? false : { scaleX: 0, opacity: 1 }}
                animate={run ? { scaleX: [0, 1, 1], opacity: [1, 1, 0] } : undefined}
                transition={{ duration: 1.1, delay: index * 0.07, times: [0, 0.6, 1], ease: 'easeOut' }}
              />
              <dt className={styles.label}>{fact.label}</dt>
              <dd className={styles.value}>{fact.value}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
