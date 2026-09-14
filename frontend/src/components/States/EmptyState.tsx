/**
 * Kullanım: <EmptyState title="Henüz yazı yok." description="Yeni içerikler yayınlandığında burada görünecek." action={<Button to={path('home')}>Ana sayfa</Button>} />
 * Boş liste/sonuç kartı; simge görünüme girince çizilir, hareket azaltılmışsa hazır gelir.
 */
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import styles from './States.module.css'

export type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  /** Ek: özel simge (SVG). */
  icon?: ReactNode
  /** Ek: koyu zeminde kullanım. */
  tone?: 'light' | 'dark'
  className?: string
}

function TrayIcon({ draw }: { draw: boolean }) {
  const reduce = Boolean(useReducedMotion())
  const shared = { initial: reduce ? false : { pathLength: 0 }, animate: draw ? { pathLength: 1 } : undefined }
  return (
    <svg viewBox="0 0 48 48" className={styles.iconSvg} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <motion.path d="M8 26 13 12h22l5 14v10a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3Z" {...shared} transition={{ duration: 1, ease: revealEase }} />
      <motion.path d="M8 26h10l2 4h8l2-4h10" {...shared} transition={{ duration: 0.7, delay: 0.6, ease: revealEase }} />
      <motion.path d="M24 4v4M16 6l2 3M32 6l-2 3" {...shared} transition={{ duration: 0.4, delay: 1.1, ease: revealEase }} />
    </svg>
  )
}

export default function EmptyState({ title, description, action, icon, tone = 'light', className = '' }: EmptyStateProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      className={`${styles.state} ${className}`.trim()}
      data-tone={tone}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: revealEase }}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <TrayIcon draw={inView} />}
      </span>
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? <div className={styles.actions}>{action}</div> : null}
    </motion.div>
  )
}
