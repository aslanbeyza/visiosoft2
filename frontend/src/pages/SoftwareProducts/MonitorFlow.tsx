import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { CameraIcon, ChartIcon, CloudIcon, UsersIcon } from '../../components/FeatureGrid/index.ts'
import { RevealGroup, RevealItem, revealEase } from '../../components/Reveal/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import { monitorCopy as text } from './softwareHubCopy.ts'
import styles from './MonitorFlow.module.css'

const ICONS = [CameraIcon, CloudIcon, ChartIcon, UsersIcon]

const PULSE_DELAYS = ['0.36s', '1.84s', '3.32s', '4.7s']

export default function MonitorFlow() {
  const reduce = Boolean(useReducedMotion())
  const wrapRef = useRef<HTMLDivElement>(null)
  const drawn = useInView(wrapRef, { once: true, amount: 0.4 })
  const inView = useInView(wrapRef, { amount: 0.2 })
  const visible = usePageVisible()
  const live = !reduce && drawn && inView && visible

  return (
    <div ref={wrapRef} className={styles.wrap} data-live={live}>
      {}
      <span className={styles.line} aria-hidden="true">
        <motion.span
          className={styles.base}
          initial={reduce ? false : { scaleX: 0 }}
          animate={drawn && !reduce ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.6, delay: 0.3, ease: revealEase }}
        />
      </span>
      {}
      <span className={styles.signalTrack} aria-hidden="true">
        <span className={styles.signal} />
      </span>

      <RevealGroup as="ol" className={styles.list} stagger={0.12} amount={0.3}>
        {text.flow.map((node, index) => {
          const Icon = ICONS[index]
          return (
            <RevealItem as="li" key={node.title} className={styles.node}>
              <span className={styles.tile} style={{ '--pulse-delay': PULSE_DELAYS[index] } as CSSProperties}>
                <span className={styles.ring} aria-hidden="true" />
                <Icon className={styles.icon} />
              </span>
              <span className={styles.text}>
                <strong className={styles.title}>{node.title}</strong>
                <span className={styles.desc}>{node.text}</span>
              </span>
            </RevealItem>
          )
        })}
      </RevealGroup>
    </div>
  )
}
