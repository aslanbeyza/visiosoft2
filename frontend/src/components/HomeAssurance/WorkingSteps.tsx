import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { RevealGroup, RevealItem } from '../Reveal/index.ts'
import { homeAssuranceCopy as text } from './homeAssuranceCopy.ts'
import { stepIcons } from './icons.ts'
import styles from './WorkingSteps.module.css'

const pad = (value: number) => String(value).padStart(2, '0')

type SegmentProps = { progress: MotionValue<number>; index: number; count: number; filled: boolean }

function Segment({ progress, index, count, filled }: SegmentProps) {
  const scale = useTransform(progress, [index / (count - 1), (index + 1) / (count - 1)], [0, 1])

  return (
    <span className={styles.segment} aria-hidden="true">
      <motion.span className={styles.fillX} style={{ scaleX: filled ? 1 : scale }} />
      <motion.span className={styles.fillY} style={{ scaleY: filled ? 1 : scale }} />
    </span>
  )
}

function StepIcon({ id, className }: { id: keyof typeof stepIcons; className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {stepIcons[id].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

export default function WorkingSteps() {
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)
  const steps = text.steps.items
  const count = steps.length

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.85', 'end 0.6'] })
  const [reached, setReached] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = value <= 0.001 ? 0 : Math.min(count, Math.floor(value * (count - 1) + 0.001) + 1)
    if (next !== reached) setReached(next)
  })

  const shown = reduce ? count : reached

  return (
    <div className={styles.band}>
      <div className={styles.inner}>
        <h3 className={styles.label} id="home-assurance-steps">
          <span className={styles.labelRule} aria-hidden="true" />
          {text.steps.title}
        </h3>

        <div ref={listRef}>
          <RevealGroup as="ol" className={styles.steps} stagger={0.12} amount={0.3}>
            {steps.map((step, index) => {
              const on = index < shown
              return (
                <RevealItem as="li" key={step.id} className={styles.step} y={20} data-on={on}>
                  {index < count - 1 ? <Segment progress={scrollYProgress} index={index} count={count} filled={Boolean(reduce)} /> : null}
                  <span className={styles.marker} aria-hidden="true">
                    <span className={styles.markerFill} />
                    <StepIcon id={step.id} className={`${styles.markerIcon} ${styles.iconOff}`} />
                    <StepIcon id={step.id} className={`${styles.markerIcon} ${styles.iconOn}`} />
                  </span>
                  <div className={styles.body}>
                    <p className={styles.index} aria-hidden="true">
                      {pad(index + 1)}
                    </p>
                    <h4 className={styles.title}>{step.title}</h4>
                    <p className={styles.text}>{step.description}</p>
                  </div>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </div>
    </div>
  )
}
