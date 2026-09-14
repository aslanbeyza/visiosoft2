import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import { formCopy } from '../../components/Form/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { quoteCopy } from './quoteCopy.ts'
import styles from './QuoteSteps.module.css'

type StepHeaderProps = {
  index: number
  total: number
  title: string
  lead?: string
  /** Kullanıcı adım değiştirdiyse başlık odak alır (klavye/ekran okuyucu yeni adımdan devam eder). */
  autoFocus: boolean
  children?: ReactNode
}

export function StepHeader({ index, total, title, lead, autoFocus, children }: StepHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  // Yalnızca adım ilk açıldığında odaklanır; sonraki render'lar seçim yapan kullanıcının odağını çalmaz.
  const focusOnMount = useRef(autoFocus)

  useEffect(() => {
    if (focusOnMount.current) titleRef.current?.focus()
  }, [])

  return (
    <header className={styles.head}>
      <p className={styles.position}>
        <span className={styles.positionRule} aria-hidden="true" />
        {formCopy.stepper.position(index + 1, total)}
      </p>
      <h2
        className={styles.title}
        tabIndex={-1}
        ref={titleRef}
      >
        {title}
      </h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      {children}
    </header>
  )
}

/** `visuallyHidden`: mesaj zaten alanın altında görünüyorsa yalnızca ekran okuyucuya duyurulur (çift metin olmaz). */
export function StepAlert({ message, visuallyHidden = false }: { message: string; visuallyHidden?: boolean }) {
  const reduce = Boolean(useReducedMotion())
  if (visuallyHidden) {
    return (
      <p role="alert" className={styles.srOnly}>
        {message}
      </p>
    )
  }
  return (
    <motion.p
      role="alert"
      className={styles.alert}
      initial={reduce ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: revealEase }}
    >
      <svg viewBox="0 0 24 24" className={styles.alertIcon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4.5M12 16h.01" />
      </svg>
      <span>{message}</span>
    </motion.p>
  )
}

type WizardNavProps = {
  onBack?: () => void
  onNext: () => void
}

export function WizardNav({ onBack, onNext }: WizardNavProps) {
  return (
    <div className={styles.nav}>
      {onBack ? (
        <span className={styles.back}>
          <BackButton onBack={onBack} />
        </span>
      ) : null}
      <Button size="lg" arrow onClick={onNext} className={styles.next}>
        {quoteCopy.nav.next}
      </Button>
    </div>
  )
}

export function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" className={styles.backLink} onClick={onBack}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </svg>
      {quoteCopy.nav.back}
    </button>
  )
}
