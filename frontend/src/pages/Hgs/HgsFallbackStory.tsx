import type { CSSProperties } from 'react'
import styles from './HgsFallbackStory.module.css'

export type FallbackStoryMetric = { value: string; label: string }
export type FallbackStoryStep = {
  state: 'warn' | 'active' | 'done'
  title: string
  detail: string
}
export type FallbackStorySession = {
  plate: string
  duration: string
  gate: string
  amount: string
}

export type HgsFallbackStoryProps = {
  kicker: string
  caption: string
  ariaLabel: string
  metrics: FallbackStoryMetric[]
  session: FallbackStorySession
  steps: FallbackStoryStep[]
  className?: string
}

export default function HgsFallbackStory({
  kicker,
  caption,
  ariaLabel,
  metrics,
  session,
  steps,
  className = '',
}: HgsFallbackStoryProps) {
  return (
    <figure className={`${styles.root} ${className}`.trim()} aria-label={ariaLabel}>
      <p className={styles.kicker}>{kicker}</p>
      <ul className={styles.metrics}>
        {metrics.map((metric) => (
          <li key={metric.label} className={styles.metric}>
            <span className={styles.metricValue}>{metric.value}</span>
            <span className={styles.metricLabel}>{metric.label}</span>
          </li>
        ))}
      </ul>
      <div className={styles.session}>
        <p className={styles.plate}>{session.plate}</p>
        <p className={styles.meta}>
          <span>{session.duration}</span>
          <span>{session.gate}</span>
          <span className={styles.amount}>{session.amount}</span>
        </p>
      </div>
      <ol className={styles.timeline} aria-label={kicker}>
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={styles.step}
            data-state={step.state}
            style={{ '--i': index } as CSSProperties}
          >
            <span className={styles.dot} aria-hidden="true" />
            <p className={styles.title}>{step.title}</p>
            <p className={styles.detail}>{step.detail}</p>
          </li>
        ))}
      </ol>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  )
}
