
import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue, Variants } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import styles from './StepList.module.css'

export type Step = {
  title: string
  description: string
  icon?: ReactNode
}

export type StepListProps = {
  steps: Step[]
  direction?: 'horizontal' | 'vertical'
  progress?: 'scroll' | 'static'
  tone?: 'light' | 'dark'

  compact?: boolean

  headingAs?: 'h3' | 'h4'

  label?: string
  className?: string
}

const pad = (value: number) => String(value).padStart(2, '0')

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: revealEase } },
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

export default function StepList({
  steps,
  direction = 'horizontal',
  progress = 'scroll',
  tone = 'light',
  compact = false,
  headingAs: Heading = 'h3',
  label,
  className = '',
}: StepListProps) {
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLOListElement>(null)
  const count = steps.length
  const scrollLinked = progress === 'scroll' && !reduce && count > 1

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.8', 'end 0.55'] })
  const [reached, setReached] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!scrollLinked) return
    const next = value <= 0.001 ? 0 : Math.min(count, Math.floor(value * (count - 1) + 0.001) + 1)
    if (next !== reached) setReached(next)
  })

  const shown = scrollLinked ? reached : count

  return (
    <motion.ol
      ref={listRef}
      className={`${styles.list} ${className}`.trim()}
      role="list"
      aria-label={label}
      data-direction={direction}
      data-tablet={count === 3 ? 'row' : 'pairs'}
      data-tone={tone}
      data-compact={compact ? 'true' : undefined}
      style={{ '--count': count } as CSSProperties}
      variants={listVariants}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {steps.map((step, index) => (
        <motion.li key={step.title} className={styles.step} variants={stepVariants}>
          <div className={styles.inner} data-on={index < shown ? 'true' : 'false'}>
            <span className={styles.marker} aria-hidden="true">
              {pad(index + 1)}
            </span>
            {index < count - 1 ? (
              <Segment progress={scrollYProgress} index={index} count={count} filled={!scrollLinked} />
            ) : null}
            <div className={styles.body}>
              {step.icon ? (
                <span className={styles.icon} aria-hidden="true">
                  {step.icon}
                </span>
              ) : null}
              <Heading className={styles.title}>{step.title}</Heading>
              <p className={styles.text}>{step.description}</p>
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  )
}
