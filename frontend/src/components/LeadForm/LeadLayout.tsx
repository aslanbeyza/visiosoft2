import { useId } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Section from '../Section/index.ts'
import TextReveal from '../TextReveal/index.ts'
import { revealEase } from '../Reveal/index.ts'
import styles from './LeadLayout.module.css'

export type LeadLayoutProps = {
  /** Hero'daki "Forma geçin" bağlantısının hedefi. */
  id: string
  eyebrow: string
  title: string
  lead?: string
  /** LeadForm; başlık kimliği formun erişilebilir adı için verilir. */
  children: ReactNode
  aside: ReactNode
}

/** Form bölümü: solda kart içinde form, sağda "sonraki adımlar" ve doğrudan iletişim paneli. */
export default function LeadLayout({ id, eyebrow, title, lead, children, aside }: LeadLayoutProps) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()

  return (
    <Section id={id} tone="surface" labelledBy={titleId} className={styles.section}>
      <div className={styles.grid}>
        <motion.div
          className={styles.card}
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: revealEase }}
        >
          <motion.span
            className={styles.cardRule}
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: revealEase }}
          />
          <header className={styles.head}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <TextReveal as="h2" id={titleId} className={styles.title} text={title} delay={0.1} />
            {lead ? <p className={styles.lead}>{lead}</p> : null}
          </header>
          {children}
        </motion.div>

        <div className={styles.aside}>{aside}</div>
      </div>
    </Section>
  )
}
