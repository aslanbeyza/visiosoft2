import { useId, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import PhoneFrame from './PhoneFrame.tsx'
import PhoneTabHits from './PhoneTabHits.tsx'
import { heroCopy, heroTabs } from './softwareHubCopy.ts'
import styles from './HeroLineup.module.css'

const ease = (delay: number, duration = 1): Transition => ({ duration, delay, ease: revealEase })
const SCREENS = heroTabs.map((tab) => tab.image)
const LABELS = heroTabs.map((tab) => tab.label)

/**
 * Hero: yalnızca ParkBiz telefonu. Alt sekme çubuğundaki görünmez hedefler
 * parkbiz-port sekmelerine (Otoparklar, Abonelik, Borçlar, Profil) karşılık gelir.
 */
export default function HeroLineup() {
  const reduce = Boolean(useReducedMotion())
  const uid = useId()
  const stageRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const inView = useInView(stageRef, { once: true, amount: 0.2 })
  const play = !reduce && inView

  const [{ index, dir }, setView] = useState<{ index: number; dir: 1 | -1 }>({ index: 0, dir: 1 })
  const current = heroTabs[index]

  const select = (next: number) => {
    setView((prev) =>
      prev.index === next ? prev : { index: next, dir: next > prev.index ? 1 : -1 },
    )
  }

  return (
    <div ref={stageRef} className={styles.stage} aria-label={heroCopy.lineupLabel}>
      <motion.div
        className={styles.phoneWrap}
        initial={reduce ? false : { opacity: 0, y: 36 }}
        animate={play || reduce ? { opacity: 1, y: 0 } : undefined}
        transition={ease(0.2, 1.05)}
      >
        <span className={styles.floor} aria-hidden="true" />
        <PhoneFrame
          image={current.image}
          screens={SCREENS}
          direction={dir}
          decorative
          eager
          sizes="(min-width: 1024px) 18rem, (min-width: 768px) 16rem, 55vw"
        />
        <PhoneTabHits
          labels={LABELS}
          active={index}
          onSelect={select}
          tablistLabel={heroCopy.tablistLabel}
          idPrefix={`${uid}-tab`}
          tabRefs={tabRefs}
        />
      </motion.div>
    </div>
  )
}
