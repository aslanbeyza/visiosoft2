
import { formCopy } from './formCopy.ts'
import styles from './Stepper.module.css'

export type StepperProps = {
  steps: string[]

  current: number

  label?: string

  onSelect?: (index: number) => void
  className?: string
}

type StepState = 'done' | 'current' | 'upcoming'

export default function Stepper({ steps, current, label = formCopy.stepper.label, onSelect, className = '' }: StepperProps) {
  const total = steps.length

  return (
    <nav className={`${styles.stepper} ${className}`.trim()} aria-label={label}>
      <ol className={styles.list}>
        {steps.map((step, index) => {
          const state: StepState = index < current ? 'done' : index === current ? 'current' : 'upcoming'
          const position = formCopy.stepper.position(index + 1, total)
          const status = state === 'done' ? formCopy.stepper.done : state === 'current' ? formCopy.stepper.current : ''
          const interactive = state === 'done' && Boolean(onSelect)

          const marker = (
            <span className={styles.marker} aria-hidden="true">
              <span className={styles.number}>{index + 1}</span>
              <svg viewBox="0 0 16 16" className={styles.checkSvg} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path className={styles.check} d="m3.5 8.4 2.9 2.9 6.1-6.3" pathLength="1" />
              </svg>
            </span>
          )

          const text = (
            <>
              <span className={styles.srOnly}>{position}: </span>
              <span className={styles.label}>{step}</span>
              {status ? <span className={styles.srOnly}>, {status}</span> : null}
            </>
          )

          return (
            <li key={step} className={styles.step} data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
              {interactive ? (
                <button type="button" className={styles.trigger} onClick={() => onSelect?.(index)}>
                  {marker}
                  {text}
                </button>
              ) : (
                <span className={styles.trigger}>
                  {marker}
                  {text}
                </span>
              )}
              {index < total - 1 ? (
                <span className={styles.line} aria-hidden="true">
                  <span className={styles.lineFill} />
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
