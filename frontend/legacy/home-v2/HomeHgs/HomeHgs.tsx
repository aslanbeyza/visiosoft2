import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import Button from '../Button/index.ts'
import Reveal, { RevealGroup, RevealItem } from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import FlowIcon from './FlowIcon.tsx'
import { homeHgsCopy as text } from './homeHgsCopy.ts'
import styles from './HomeHgs.module.css'

const pad = (value: number) => String(value).padStart(2, '0')

type ConnectorProps = {
  progress: MotionValue<number>
  index: number
  count: number
  drawn: boolean
}

function Connector({ progress, index, count, drawn }: ConnectorProps) {
  const pathLength = useTransform(progress, [index / (count - 1), (index + 1) / (count - 1)], [0, 1])

  return (
    <svg className={styles.connector} viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M1 0V100" className={styles.connectorTrack} />
      <motion.path d="M1 0V100" className={styles.connectorFill} style={{ pathLength: drawn ? 1 : pathLength }} />
    </svg>
  )
}

export default function HomeHgs() {
  const path = usePath()
  const reduce = useReducedMotion()
  const flowRef = useRef<HTMLOListElement>(null)
  const steps = text.flow.steps
  const count = steps.length

  const { scrollYProgress } = useScroll({ target: flowRef, offset: ['start 0.75', 'end 0.6'] })
  const [reached, setReached] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = value <= 0.001 ? 0 : Math.min(count, Math.floor(value * (count - 1) + 0.001) + 1)
    if (next !== reached) setReached(next)
  })

  const shown = reduce ? count : reached

  return (
    <Section tone="surface" spacing="lg" labelledBy="home-hgs-title">
      <div className={styles.layout}>
        <div className={styles.copy}>
          <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} id="home-hgs-title" />

          <RevealGroup as="ul" className={styles.chips} stagger={0.08} delay={0.25} amount={0.5}>
            {text.chips.map((chip) => (
              <RevealItem as="li" key={chip} className={styles.chip} y={16}>
                <svg viewBox="0 0 16 16" className={styles.chipIcon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m3.5 8.4 2.9 2.9 6.1-6.3" />
                </svg>
                {chip}
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className={styles.actions} delay={0.2} amount={0.5}>
            <Button to={path(text.primary.route)} arrow>
              {text.primary.label}
            </Button>
            <Button to={path(text.secondary.route)} variant="secondary">
              {text.secondary.label}
            </Button>
          </Reveal>
        </div>

        <Reveal className={styles.panel} y={32} amount={0.2}>
          <div className={styles.panelHead}>
            <p className={styles.panelTitle}>{text.flow.title}</p>
            <img
              src="/img/hgspark.png"
              alt={text.logoAlt}
              width={330}
              height={225}
              className={styles.logo}
              loading="lazy"
              decoding="async"
            />
          </div>

          <ol ref={flowRef} className={styles.flow} aria-label={text.flow.label}>
            {steps.map((step, index) => {
              const on = index < shown
              return (
                <li key={step.id} className={styles.step} data-on={on}>
                  <span className={styles.node} aria-hidden="true">
                    <FlowIcon id={step.id} className={styles.nodeIcon} />
                  </span>
                  {index < count - 1 ? (
                    <Connector progress={scrollYProgress} index={index} count={count} drawn={Boolean(reduce)} />
                  ) : null}
                  <div className={styles.stepBody}>
                    <span className={styles.stepIndex} aria-hidden="true">
                      {pad(index + 1)}
                    </span>
                    <h3 className={styles.stepLabel}>{step.label}</h3>
                    <p className={styles.stepText}>{step.description}</p>
                    {step.channels ? (
                      <ul className={styles.channels} aria-label={text.flow.channelsLabel}>
                        {step.channels.map((channel) => (
                          <li key={channel}>{channel}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ol>
        </Reveal>
      </div>
    </Section>
  )
}
