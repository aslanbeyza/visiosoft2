import { useId } from 'react'
import { motion } from 'framer-motion'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { RevealGroup, RevealItem, revealEase } from '../../components/Reveal/index.ts'
import styles from './FeatureList.module.css'

type FeatureListProps = {
  eyebrow: string
  title: string
  features: { title: string; desc: string }[]
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Solda yapışkan başlık, sağda çizgisi çizilerek beliren numaralı özellik satırları. */
export default function FeatureList({ eyebrow, title, features }: FeatureListProps) {
  const titleId = useId()

  return (
    <Section tone="paper" spacing="lg" labelledBy={titleId}>
      <div className={styles.layout}>
        <div className={styles.aside}>
          <div className={styles.sticky}>
            <SectionHeading eyebrow={eyebrow} title={title} id={titleId} className={styles.heading} />
          </div>
        </div>

        <RevealGroup as="ol" className={styles.list} stagger={0.12} amount={0.15}>
          {features.map((feature, index) => (
            <RevealItem as="li" key={feature.title} className={styles.row} y={28}>
              <motion.span
                className={styles.hairline}
                aria-hidden="true"
                variants={{
                  hidden: { scaleX: 0 },
                  show: { scaleX: 1, transition: { duration: 1.1, ease: revealEase } },
                }}
              />
              <span className={styles.index} aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.desc}>{feature.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  )
}
