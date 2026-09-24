import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import CheckList from '../../components/CheckList/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import type { ProductCopy } from '../HardwareProduct/products.ts'
import styles from './DetailSections.module.css'

type DetailSpecsProps = {
  copy: ProductCopy
}

export default function DetailSpecs({ copy }: DetailSpecsProps) {
  const summaryId = useId()
  const useCasesId = useId()
  const reduce = Boolean(useReducedMotion())

  return (
    <Section id="teknik-ozet" tone="surface" spacing="lg" labelledBy={summaryId}>
      <div className={styles.specs}>
        <div className={styles.specPanel}>
          <TextReveal as="h2" id={summaryId} text={copy.tech_summary_title} className={styles.specTitle} />
          <CheckList items={copy.summary} label={copy.tech_summary_title} />
        </div>
        <motion.span
          className={styles.specRule}
          aria-hidden="true"
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: revealEase }}
        />
        <div className={styles.specPanel}>
          <TextReveal as="h2" id={useCasesId} text={copy.use_cases_title} className={styles.specTitle} delay={0.1} />
          <CheckList items={copy.use_cases} label={copy.use_cases_title} />
        </div>
      </div>
    </Section>
  )
}
