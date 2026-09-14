import { useId } from 'react'
import { motion } from 'framer-motion'
import Reveal, { RevealGroup, RevealItem, revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import styles from './SpecLists.module.css'

type SpecListsProps = {
  summaryTitle: string
  summary: string[]
  useCasesTitle: string
  useCases: string[]
}

/** Teknik özet ve kullanım alanları: onay işaretleri çizilerek sırayla beliren iki liste. */
export default function SpecLists({ summaryTitle, summary, useCasesTitle, useCases }: SpecListsProps) {
  return (
    <Section tone="paper" spacing="lg" label={`${summaryTitle} ve ${useCasesTitle.toLocaleLowerCase('tr-TR')}`}>
      <div className={styles.grid}>
        <Column index={1} title={summaryTitle} items={summary} />
        <Column index={2} title={useCasesTitle} items={useCases} />
      </div>
    </Section>
  )
}

function Column({ index, title, items }: { index: number; title: string; items: string[] }) {
  const titleId = useId()

  return (
    <div className={styles.column} role="group" aria-labelledby={titleId}>
      <Reveal className={styles.header} y={20}>
        <span className={styles.index} aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
      </Reveal>

      <RevealGroup as="ul" className={styles.list} stagger={0.09} delay={0.1}>
        {items.map((item) => (
          <RevealItem as="li" key={item} className={styles.item} y={16}>
            <span className={styles.check} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <motion.path
                  d="m5 12.5 4.5 4.5L19 7.5"
                  variants={{
                    hidden: { pathLength: 0 },
                    show: { pathLength: 1, transition: { duration: 0.6, delay: 0.2, ease: revealEase } },
                  }}
                />
              </svg>
            </span>
            <span className={styles.text}>{item}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
