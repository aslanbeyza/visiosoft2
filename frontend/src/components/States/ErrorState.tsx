
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Button from '../Button/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { statesCopy } from './statesCopy.ts'
import styles from './States.module.css'

export type ErrorStateProps = {
  title: string
  description?: string
  retry?: () => void
  retryLabel?: string

  icon?: ReactNode

  tone?: 'light' | 'dark'
  className?: string
}

function AlertIcon({ draw }: { draw: boolean }) {
  const reduce = Boolean(useReducedMotion())
  const shared = { initial: reduce ? false : { pathLength: 0 }, animate: draw ? { pathLength: 1 } : undefined }
  return (
    <svg viewBox="0 0 48 48" className={styles.iconSvg} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <motion.circle cx="24" cy="24" r="17" {...shared} transition={{ duration: 1, ease: revealEase }} />
      <motion.path d="M24 15v11" {...shared} transition={{ duration: 0.4, delay: 0.7, ease: revealEase }} />
      <motion.path d="M24 32h.01" strokeWidth="2.6" {...shared} transition={{ duration: 0.2, delay: 1.05 }} />
    </svg>
  )
}

export default function ErrorState({ title, description, retry, retryLabel = statesCopy.retry, icon, tone = 'light', className = '' }: ErrorStateProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      role="alert"
      className={`${styles.state} ${styles.error} ${className}`.trim()}
      data-tone={tone}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: revealEase }}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <AlertIcon draw={inView} />}
      </span>
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {retry ? (
        <div className={styles.actions}>
          <Button variant={tone === 'dark' ? 'light' : 'secondary'} onClick={retry}>
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </motion.div>
  )
}
