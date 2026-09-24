
import { useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { statesCopy } from './statesCopy.ts'
import styles from './States.module.css'

export type SkeletonProps = {
  variant: 'text' | 'card' | 'article'

  count?: number

  label?: string

  tone?: 'light' | 'dark'
  className?: string
}

const DEFAULT_COUNT = { text: 3, card: 3, article: 3 } as const
const LINE_WIDTHS = ['100%', '92%', '96%', '84%', '70%']

function Lines({ count, prefix }: { count: number; prefix: string }) {
  return Array.from({ length: count }, (_, index) => (
    <span
      key={`${prefix}-${index.toString()}`}
      className={`${styles.block} ${styles.line}`}
      style={{ width: index === count - 1 && count > 1 ? '58%' : LINE_WIDTHS[index % LINE_WIDTHS.length] }}
    />
  ))
}

export default function Skeleton({ variant, count, label = statesCopy.loading, tone = 'light', className = '' }: SkeletonProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.1 })
  const total = Math.max(1, count ?? DEFAULT_COUNT[variant])

  return (
    <div
      ref={ref}
      role="status"
      aria-busy="true"
      aria-label={label}
      className={`${styles.skeleton} ${className}`.trim()}
      data-variant={variant}
      data-tone={tone}
      data-animate={inView && !reduce ? 'true' : 'false'}
    >
      {variant === 'text' ? <Lines count={total} prefix="text" /> : null}

      {variant === 'card'
        ? Array.from({ length: total }, (_, index) => (
            <div key={`card-${index.toString()}`} className={styles.card}>
              <span className={`${styles.block} ${styles.media}`} />
              <span className={`${styles.block} ${styles.line} ${styles.short}`} />
              <span className={`${styles.block} ${styles.heading}`} />
              <Lines count={2} prefix={`card-${index.toString()}`} />
            </div>
          ))
        : null}

      {variant === 'article' ? (
        <div className={styles.article}>
          <span className={`${styles.block} ${styles.line} ${styles.short}`} />
          <span className={`${styles.block} ${styles.title}`} />
          <span className={`${styles.block} ${styles.title} ${styles.titleSecond}`} />
          <span className={`${styles.block} ${styles.media} ${styles.articleMedia}`} />
          {Array.from({ length: total }, (_, index) => (
            <div key={`para-${index.toString()}`} className={styles.paragraph}>
              <Lines count={4} prefix={`para-${index.toString()}`} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
