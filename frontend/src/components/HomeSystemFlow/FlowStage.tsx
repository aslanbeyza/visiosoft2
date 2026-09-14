import { useRef } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import ParkingFlow from '../ParkingFlow/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { DOCK_INDEX, RECORD_INDEX, TOTAL_STEPS as total, flowSteps, pad } from './flowData.ts'
import SessionsFrame from './SessionsFrame.tsx'
import { homeSystemFlowCopy as text } from './homeSystemFlowCopy.ts'
import styles from './FlowStage.module.css'

type FlowStageProps = {
  active: number
  /** Adım cinsinden sürekli ilerleme (0 … adım sayısı). */
  fill: MotionValue<number>
  /** Değiştiğinde sahne baştan kurulur (döngü başa sardığında araç yeniden girer). */
  cycle?: number
  /** Zone oturumlar ekranı 02. adımdan itibaren köşede küçük hâliyle bekler (masaüstü sabit sahne). */
  dock?: boolean
  footer?: ReactNode
  className?: string
}

/** Sağ sütun: başlık satırı, şerit sahnesi ve Zone oturumlar ekranı (köşede küçük → 6. adımda tam boy). */
export default function FlowStage({ active, fill, cycle = 0, dock = false, footer, className = '' }: FlowStageProps) {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  // Sahne görünüme yaklaşınca kurulur; böylece araç ziyaretçi gelince şeride girer.
  const near = useInView(rootRef, { once: true, amount: 0.35 })
  const record = active >= RECORD_INDEX
  const sessionsState = record ? 'full' : dock && active >= DOCK_INDEX ? 'mini' : 'hidden'
  const current = text.steps[Math.max(0, active)]
  const progress = useTransform(fill, (value) => Math.min(1, Math.max(0, value / total)))

  return (
    <div ref={rootRef} className={`${styles.stage} ${className}`.trim()} data-record={record}>
      <div className={styles.header} aria-hidden="true">
        <span className={styles.counter}>
          {pad(Math.max(0, active) + 1)}
          <span className={styles.counterTotal}>/ {pad(total)}</span>
        </span>
        <span className={styles.headTitle}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.title}
              className={styles.headTitleText}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: revealEase }}
            >
              {current.title}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className={styles.track}>
          <motion.span className={styles.trackFill} style={{ scaleX: progress }} />
        </span>
      </div>

      <div className={styles.viewport}>
        <motion.div
          className={styles.scene}
          initial={false}
          animate={{ opacity: record ? 0 : 1 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: record && !reduce ? 0.15 : 0, ease: revealEase }}
        >
          {near || reduce ? (
            <motion.div
              key={cycle}
              className={styles.sceneInner}
              inert
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: revealEase }}
            >
              <ParkingFlow
                steps={flowSteps}
                mode="manual"
                active={Math.min(Math.max(0, active), RECORD_INDEX - 1)}
                showLabels={false}
                label={text.sceneLabel}
              />
            </motion.div>
          ) : null}
        </motion.div>

        {/* Tek öğe: köşedeki küçük pencere transform ile tam boya büyür (yalnızca transform/opaklık). */}
        <div className={styles.sessions} data-state={sessionsState}>
          <SessionsFrame />
        </div>
        {dock ? (
          <span className={styles.dockCaption} data-shown={sessionsState === 'mini'} aria-hidden="true">
            {text.sessions.caption}
          </span>
        ) : null}
      </div>

      <p className="sr-only">{text.sceneDescription}</p>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  )
}
