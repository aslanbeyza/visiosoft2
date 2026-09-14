import { useCallback, useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../Button/index.ts'
import { revealEase } from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import FlagshipDetails from './FlagshipDetails.tsx'
import FlagshipStage from './FlagshipStage.tsx'
import FlagshipTabs from './FlagshipTabs.tsx'
import { flagships } from './flagships.ts'
import { homeFlagshipsCopy as text } from './homeFlagshipsCopy.ts'
import styles from './HomeFlagships.module.css'

const rise = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: revealEase } },
})

/**
 * Ana sayfa 4.6 — Dört ana donanım: sekmeli ürün değiştirici. Hiçbir şey kendiliğinden ilerlemez;
 * sekmeler, önceki/sonraki düğmeleri, ok tuşları ve dokunmatik kaydırma ile gezilir.
 */
export default function HomeFlagships() {
  const reduce = useReducedMotion()
  const path = usePath()
  const base = useId()
  const [active, setActive] = useState(0)
  const count = flagships.length
  const tabId = useCallback((index: number) => `${base}-tab-${index}`, [base])
  const panelId = `${base}-panel`
  const step = useCallback((direction: 1 | -1) => setActive((current) => (current + direction + count) % count), [count])
  const reveal = { initial: reduce ? false : ('hidden' as const), whileInView: 'show', viewport: { once: true, amount: 0.25 } }

  return (
    <Section id="donanim" tone="paper" spacing="md" labelledBy="home-flagships-title">
      <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} id="home-flagships-title" />

      <motion.div className={styles.tabs} variants={rise(0)} {...reveal}>
        <FlagshipTabs items={flagships} active={active} onSelect={setActive} tabId={tabId} panelId={panelId} />
      </motion.div>

      <div className={styles.panel} role="tabpanel" id={panelId} aria-labelledby={tabId(active)}>
        <motion.div className={styles.stage} variants={rise(0.05)} {...reveal}>
          <FlagshipStage items={flagships} active={active} onStep={step} />
        </motion.div>
        <motion.div className={styles.details} variants={rise(0.15)} {...reveal}>
          <FlagshipDetails items={flagships} active={active} />
        </motion.div>
      </div>

      <div className={styles.footer}>
        <Button to={path('hardware-products')} variant="secondary" arrow>
          {text.all}
        </Button>
      </div>
    </Section>
  )
}
