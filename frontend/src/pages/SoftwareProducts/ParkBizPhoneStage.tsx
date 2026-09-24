import { lazy, Suspense, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { heroCopy } from './softwareHubCopy.ts'
import styles from './ParkBizPhoneStage.module.css'

const MobilePhoneStandalone = lazy(() => import('../../components/panel/MobilePhoneStandalone.tsx'))

const ease = (delay: number, duration = 1): Transition => ({ duration, delay, ease: revealEase })

type ParkBizPhoneStageProps = {

  animateOnView?: boolean
  onInteract?: () => void
}

export default function ParkBizPhoneStage({ animateOnView = true, onInteract }: ParkBizPhoneStageProps) {
  const reduce = Boolean(useReducedMotion())
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, amount: 0.15 })
  const play = animateOnView && !reduce && inView
  const shouldMount = !animateOnView || inView

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
        {shouldMount ? (
          <Suspense fallback={<div className={styles.phoneSlot} aria-hidden="true" />}>
            <div className={styles.phoneSlot}>
              <div className={styles.phoneScale}>
                {}
                <MobilePhoneStandalone scale={1} />
              </div>
            </div>
          </Suspense>
        ) : (
          <div className={styles.phoneSlot} aria-hidden="true" />
        )}
      </motion.div>
    </div>
  )
}
