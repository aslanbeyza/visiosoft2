import { motion, useReducedMotion } from 'framer-motion'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import StatRow from '../../components/StatRow/index.ts'
import type { StatItem } from '../../components/StatRow/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { plakaCopy } from './plakaCopy.ts'
import styles from './PlakaTech.module.css'

const copy = plakaCopy.tech
const stats: StatItem[] = copy.stats

export default function PlakaTech() {
  const reduce = Boolean(useReducedMotion())

  return (
    <Section id="teknoloji" tone="night" spacing="lg" labelledBy="teknoloji-baslik" innerClassName={styles.inner}>
      <div className={styles.head}>
        <motion.p
          className={styles.eyebrow}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, ease: revealEase }}
        >
          <motion.span
            className={styles.rule}
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, delay: 0.1, ease: revealEase }}
          />
          {copy.eyebrow}
        </motion.p>
        <TextReveal as="h2" id="teknoloji-baslik" text={copy.title} className={styles.title} delay={0.1} />
      </div>
      <TextReveal as="p" mode="words" text={copy.statement} className={styles.statement} delay={0.25} stagger={0.025} />
      <motion.span
        className={styles.divider}
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.2, ease: revealEase }}
      />
      <StatRow items={stats} tone="dark" columns={4} label={copy.statsLabel} className={styles.stats} />
      <Reveal as="p" className={styles.note} delay={0.2}>
        {copy.note}
      </Reveal>
    </Section>
  )
}
