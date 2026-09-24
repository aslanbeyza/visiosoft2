
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { copyFieldCopy } from './copyFieldCopy.ts'
import styles from './CopyField.module.css'

export type CopyFieldProps = {
  label: string

  value: string
  copyLabel: string
  copiedLabel: string

  mono?: boolean

  display?: string

  hint?: string
  className?: string
}

const FEEDBACK_MS = 2000

function selectContents(node: HTMLElement) {
  const selection = window.getSelection()
  if (!selection) return
  const range = document.createRange()
  range.selectNodeContents(node)
  selection.removeAllRanges()
  selection.addRange(range)
}

export default function CopyField({ label, value, copyLabel, copiedLabel, mono = false, display, hint, className = '' }: CopyFieldProps) {
  const reduce = Boolean(useReducedMotion())
  const valueRef = useRef<HTMLElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const [state, setState] = useState<'idle' | 'copied' | 'selected'>('idle')

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const announce = (next: 'copied' | 'selected') => {
    setState(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), next === 'copied' ? FEEDBACK_MS : FEEDBACK_MS * 2)
  }

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        announce('copied')
        return
      }
    } catch {

    }

    const node = valueRef.current
    if (!node) return
    selectContents(node)
    let copied = false
    try {
      copied = document.execCommand('copy')
    } catch {
      copied = false
    }
    announce(copied ? 'copied' : 'selected')
  }

  const copied = state === 'copied'
  const liveText = state === 'copied' ? `${label}: ${copiedLabel}` : state === 'selected' ? copyFieldCopy.selectedFallback : ''

  return (
    <div className={`${styles.root} ${className}`.trim()} data-mono={mono ? 'true' : undefined}>
      <span className={styles.label}>{label}</span>
      <div className={styles.row}>
        {mono ? (
          <code ref={valueRef} className={styles.value} onClick={() => valueRef.current && selectContents(valueRef.current)}>
            {display ?? value}
          </code>
        ) : (
          <span ref={valueRef} className={styles.value} onClick={() => valueRef.current && selectContents(valueRef.current)}>
            {display ?? value}
          </span>
        )}
        <button type="button" className={styles.button} data-copied={copied ? 'true' : undefined} onClick={copy} aria-label={`${copyLabel}: ${label}`}>
          <span className={styles.iconStack} aria-hidden="true">
            <svg viewBox="0 0 24 24" className={`${styles.icon} ${styles.iconCopy}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V6a2 2 0 0 1 2-2h9" />
            </svg>
            <svg viewBox="0 0 24 24" className={`${styles.icon} ${styles.iconCheck}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
              <motion.path
                d="m5 12.5 4.5 4.5L19 7.5"
                initial={false}
                animate={copied ? { pathLength: 1, opacity: 1 } : { pathLength: reduce ? 1 : 0, opacity: 0 }}
                transition={copied && !reduce ? { duration: 0.4, ease: revealEase } : { duration: 0 }}
              />
            </svg>
          </span>
          <span className={styles.buttonText}>{copied ? copiedLabel : copyLabel}</span>
        </button>
      </div>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
      <span className={styles.srOnly} aria-live="polite">
        {liveText}
      </span>
    </div>
  )
}
