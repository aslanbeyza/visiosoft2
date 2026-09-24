import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import Button from '../Button/index.ts'
import Reveal, { RevealGroup, RevealItem } from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { homeProcessCopy as text } from './homeProcessCopy.ts'
import type { ProcessStepId } from './homeProcessCopy.ts'
import styles from './HomeProcess.module.css'

const pad = (value: number) => String(value).padStart(2, '0')

const icons: Record<ProcessStepId, string[]> = {
  discovery: ['M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z', 'M12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z'],
  install: ['M14.7 6.3a4 4 0 0 0-5.4 5.4l-5.8 5.8a1.5 1.5 0 0 0 2.1 2.1l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.5-.5-2.1Z'],
  monitor: ['M4.5 4h15A1.5 1.5 0 0 1 21 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 14.5v-9A1.5 1.5 0 0 1 4.5 4Z', 'M8 20h8M12 16v4', 'm7 11.5 2.5-2.5 2.5 2 4-4'],
}

type SegmentProps = {
  progress: MotionValue<number>
  index: number
  count: number
  filled: boolean
}

function Segment({ progress, index, count, filled }: SegmentProps) {
  const scale = useTransform(progress, [index / (count - 1), (index + 1) / (count - 1)], [0, 1])

  return (
    <span className={styles.segment} aria-hidden="true">
      <motion.span className={styles.fillX} style={{ scaleX: filled ? 1 : scale }} />
      <motion.span className={styles.fillY} style={{ scaleY: filled ? 1 : scale }} />
    </span>
  )
}

export default function HomeProcess() {
  const path = usePath()
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)
  const steps = text.steps
  const count = steps.length

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.8', 'end 0.5'] })
  const [reached, setReached] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = value <= 0.001 ? 0 : Math.min(count, Math.floor(value * (count - 1) + 0.001) + 1)
    if (next !== reached) setReached(next)
  })

  const shown = reduce ? count : reached

  return (
    <Section tone="paper" spacing="md" labelledBy="home-process-title">
      <div className={styles.head}>
        <SectionHeading eyebrow={text.eyebrow} title={text.title} id="home-process-title" />
        <Reveal className={styles.headAction} delay={0.2} amount={0.5}>
          <Button to={path('discovery.show')} size="lg" arrow>
            {text.cta}
          </Button>
        </Reveal>
      </div>

      <div ref={listRef}>
        <RevealGroup as="ol" className={styles.steps} stagger={0.12} amount={0.3}>
          {steps.map((step, index) => (
            <RevealItem as="li" key={step.id} className={styles.step} y={28}>
              <div className={styles.stepInner} data-on={index < shown}>
                <span className={styles.marker} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                {index < count - 1 ? (
                  <Segment progress={scrollYProgress} index={index} count={count} filled={Boolean(reduce)} />
                ) : null}
                <div className={styles.body}>
                  <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {icons[step.id].map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                  <h3 className={styles.title}>{step.title}</h3>
                  <p className={styles.text}>{step.description}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  )
}
