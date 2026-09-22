import { useId, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import PhoneFrame from './PhoneFrame.tsx'
import PhoneTabHits from './PhoneTabHits.tsx'
import { heroCopy, heroTabs } from './softwareHubCopy.ts'
import styles from './ParkBizPhoneStage.module.css'

const ease = (delay: number, duration = 1): Transition => ({ duration, delay, ease: revealEase })
const SCREENS = heroTabs.map((tab) => tab.image)
const LABELS = heroTabs.map((tab) => tab.label)

type ParkBizPhoneStageProps = {
  /** Görünür olunca giriş animasyonu (mobil bölümde IO ile birlikte kullanılır). */
  animateOnView?: boolean
  onInteract?: () => void
}

/** ParkBiz sekme demosu — visiosoft-3d MobileSection telefon kolonunun statik karşılığı. */
export default function ParkBizPhoneStage({ animateOnView = true, onInteract }: ParkBizPhoneStageProps) {
  const reduce = Boolean(useReducedMotion())
  const uid = useId()
  const stageRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const inView = useInView(stageRef, { once: true, amount: 0.2 })
  const play = animateOnView && !reduce && inView

  const [{ index, dir }, setView] = useState<{ index: number; dir: 1 | -1 }>({ index: 0, dir: 1 })
  const current = heroTabs[index]

  const select = (next: number) => {
    onInteract?.()
    setView((prev) => (prev.index === next ? prev : { index: next, dir: next > prev.index ? 1 : -1 }))
  }

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      aria-label={heroCopy.lineupLabel}
      onPointerDown={onInteract}
    >
      <motion.div
        className={styles.wrap}
        initial={reduce || !animateOnView ? false : { opacity: 0, y: 28 }}
        animate={play || reduce || !animateOnView ? { opacity: 1, y: 0 } : undefined}
        transition={ease(0.15, 0.9)}
      >
        <span className={styles.floor} aria-hidden="true" />
        <PhoneFrame
          image={current.image}
          screens={SCREENS}
          direction={dir}
          decorative
          eager={false}
          sizes="(min-width: 1024px) 19rem, 70vw"
        />
        <PhoneTabHits
          labels={LABELS}
          active={index}
          onSelect={select}
          tablistLabel={heroCopy.tablistLabel}
          idPrefix={`${uid}-mobil-tab`}
          tabRefs={tabRefs}
        />
      </motion.div>
    </div>
  )
}
