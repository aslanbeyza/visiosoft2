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
  /** Sayfanın ilk bölümüyse h1 (ör. iletişim). */
  headingAs?: 'h1' | 'h2'
  /** İlk ekranda form için üst boşluğu kısaltır. */
  spacing?: 'md' | 'lg'
  /** LeadForm; başlık kimliği formun erişilebilir adı için verilir. */
  children: ReactNode
  aside: ReactNode
}

/** Form bölümü: tek kartta solda form, sağda "sonraki adımlar" ve doğrudan iletişim. */
export default function LeadLayout({
  id,
  eyebrow,
  title,
  lead,
  headingAs = 'h2',
  spacing = 'md',
  children,
  aside,
}: LeadLayoutProps) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()

  return (
    <Section
      id={id}
      tone="surface"
      spacing={spacing}
      labelledBy={titleId}
      className={`${styles.section} ${headingAs === 'h1' ? styles.first : ''}`.trim()}
    >
      <motion.div
        className={styles.card}
        initial={reduce ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.9, ease: revealEase }}
      >
        <motion.span
          className={styles.cardRule}
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 1.1, delay: 0.25, ease: revealEase }}
        />
        <div className={styles.body}>
          <div className={styles.main}>
            <header className={styles.head}>
              <p className={styles.eyebrow}>{eyebrow}</p>
              <TextReveal as={headingAs} id={titleId} className={styles.title} text={title} delay={0.1} />
              {lead ? <p className={styles.lead}>{lead}</p> : null}
            </header>
            {children}
          </div>
          <aside className={styles.aside}>{aside}</aside>
        </div>
      </motion.div>
    </Section>
  )
}
