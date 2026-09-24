import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Badge from '../../components/Badge/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import { comparisonCopy } from './comparisonCopy.ts'
import RemoteScene from './RemoteScene.tsx'
import type { RemoteMode } from './RemoteScene.tsx'
import controls from './RemoteControls.module.css'
import styles from './RemoteView.module.css'

const copy = comparisonCopy.scene
const MODES: RemoteMode[] = ['traditional', 'visio']

export default function RemoteView() {
  const reduce = Boolean(useReducedMotion())
  const visible = usePageVisible()
  const rootRef = useRef<HTMLDivElement>(null)
  const entered = useInView(rootRef, { once: true, amount: 0.45 })
  const inView = useInView(rootRef, { amount: 0.2 })
  const [chosen, setChosen] = useState<RemoteMode | null>(null)
  const [auto, setAuto] = useState(false)

  useEffect(() => {
    if (!entered || reduce || chosen) return
    const timer = window.setTimeout(() => setAuto(true), 1500)
    return () => window.clearTimeout(timer)
  }, [entered, reduce, chosen])

  const mode: RemoteMode = chosen ?? (reduce || auto ? 'visio' : 'traditional')
  const active = copy.modes[mode]

  return (
    <div ref={rootRef} className={styles.root} role="group" aria-label={copy.label}>
      <div className={styles.stage}>
        <RemoteScene mode={mode} reduce={reduce} running={inView && visible} />
        <p className={controls.you}>
          <strong>{copy.you}</strong>
          <span>{copy.youNote}</span>
        </p>
        <p className={controls.lot}>{copy.lot}</p>
        <span className={controls.status} data-mode={mode}>
          <Badge tone={mode === 'visio' ? 'navy' : 'neutral'} dot={mode === 'visio'}>
            {active.badge}
          </Badge>
        </span>
      </div>

      <div className={controls.bar}>
        <div className={controls.toggle} role="group" aria-label={copy.toggleLabel}>
          <motion.span
            className={controls.thumb}
            aria-hidden="true"
            initial={false}
            animate={{ x: mode === 'visio' ? '100%' : '0%' }}
            transition={reduce ? { duration: 0 } : { duration: 0.55, ease: revealEase }}
          />
          {MODES.map((key) => (
            <button
              key={key}
              type="button"
              className={controls.option}
              aria-pressed={mode === key}
              onClick={() => setChosen(key)}
            >
              {copy.modes[key].label}
            </button>
          ))}
        </div>
        <motion.p
          key={mode}
          className={controls.caption}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: revealEase }}
        >
          {active.caption}
        </motion.p>
      </div>

      <ul className={controls.chips} data-on={mode === 'visio'} aria-hidden={mode !== 'visio'}>
        {copy.chips.map((chip, i) => (
          <motion.li
            key={chip}
            className={controls.chip}
            initial={false}
            animate={mode === 'visio' ? { opacity: 1, y: 0 } : { opacity: 0.45, y: 4 }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, delay: mode === 'visio' ? 0.9 + i * 0.1 : 0, ease: revealEase }}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="m3.5 8.4 2.9 2.9 6.1-6.3" />
            </svg>
            {chip}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
