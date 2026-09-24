import type { FlowStep } from './systemShowcaseCopy.ts'
import styles from './SystemShowcase.module.css'

type ProcessFlowProps = {
  label: string
  steps: FlowStep[]

  progress: number

  paused: boolean
}

export default function ProcessFlow({ label, steps, progress, paused }: ProcessFlowProps) {
  return (
    <ol className={styles.flow} aria-label={label} data-paused={paused}>
      {steps.map((step, index) => {
        const state = index < progress ? 'done' : index === progress ? 'active' : 'pending'

        return (
          <li key={step.id} className={styles.flowStep} data-state={state} aria-current={state === 'active' ? 'step' : undefined}>
            <span className={styles.flowMarker} aria-hidden="true">
              <svg viewBox="0 0 16 16" className={styles.flowCheck}>
                <path d="M4.2 8.4l2.4 2.4 5.2-5.4" />
              </svg>
            </span>
            <span className={styles.flowLabel}>{step.label}</span>
          </li>
        )
      })}
    </ol>
  )
}
