import { useRef } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { pad } from './flowData.ts'
import type { SystemFlowStep } from './homeSystemFlowCopy.ts'
import styles from './FlowSteps.module.css'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** "e-fatura", "e-arşiv" satır sonunda bölünmez; metin ASCII kısa çizgiyle aranabilir kalır. */
const NO_BREAK = /(e-fatura|e-arşiv)/
const renderText = (value: string) =>
  value.split(NO_BREAK).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className={styles.nowrap}>
        {part}
      </span>
    ) : (
      part
    ),
  )

type StepState = 'idle' | 'active' | 'done' | 'static'

type FlowStepsProps = {
  steps: readonly SystemFlowStep[]
  /** Etkin adım; −1 hiçbir adımı vurgulamaz (hareket azaltma). */
  active: number
  /** Adım cinsinden sürekli ilerleme (0 … adım sayısı); etkin adımın çizgisini doldurur. */
  fill?: MotionValue<number>
  onSelect?: (index: number) => void
  variant: 'pinned' | 'compact' | 'static'
  label: string
}

type StepItemProps = {
  step: SystemFlowStep
  index: number
  state: StepState
  fill: MotionValue<number>
  onSelect?: (index: number) => void
  shown: boolean
  reduce: boolean
}

function StepItem({ step, index, state, fill, onSelect, shown, reduce }: StepItemProps) {
  const scaleX = useTransform(fill, (value) => clamp01(value - index))

  return (
    <motion.li
      className={styles.step}
      data-state={state}
      aria-current={state === 'active' ? 'step' : undefined}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: 0.08 * index, ease: revealEase }}
    >
      <span className={styles.rule} aria-hidden="true">
        {state === 'static' ? null : <motion.span className={styles.ruleFill} style={{ scaleX }} />}
      </span>
      <span className={styles.index} aria-hidden="true">
        {pad(index + 1)}
      </span>
      <div className={styles.body}>
        <h3 className={styles.title}>
          {onSelect ? (
            <button type="button" className={styles.button} onClick={() => onSelect(index)}>
              {step.title}
            </button>
          ) : (
            step.title
          )}
        </h3>
        <p className={styles.text}>{renderText(step.description)}</p>
        {step.chips ? (
          <ul className={styles.chips}>
            {step.chips.map((chip) => (
              <li key={chip} className={styles.chip}>
                {chip}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </motion.li>
  )
}

/** Sol sütundaki adım listesi: etkin adım aria-current ile işaretlenir, üst çizgisi ilerlemeyle dolar. */
export default function FlowSteps({ steps, active, fill, onSelect, variant, label }: FlowStepsProps) {
  const reduce = Boolean(useReducedMotion())
  const listRef = useRef<HTMLOListElement>(null)
  const shown = useInView(listRef, { once: true, amount: 0.15 })
  const idle = useMotionValue(0)

  return (
    <ol ref={listRef} className={styles.list} data-variant={variant} aria-label={label}>
      {steps.map((step, index) => {
        const state: StepState =
          variant === 'static' || active < 0 ? 'static' : index < active ? 'done' : index === active ? 'active' : 'idle'
        return (
          <StepItem
            key={step.title}
            step={step}
            index={index}
            state={state}
            fill={fill ?? idle}
            onSelect={onSelect}
            shown={shown}
            reduce={reduce}
          />
        )
      })}
    </ol>
  )
}
