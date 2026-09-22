import { useEffect, useId, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import { plakaCopy } from './plakaCopy.ts'
import PlateSvg from './PlateSvg.tsx'
import type { ScanPhase } from './PlateSvg.tsx'
import styles from './PlateScan.module.css'

const copy = plakaCopy.scan
// Görür → Tanır süreleri (ms); Onaylar sonrası bekleme.
const PHASE_MS = [1100, 1300, 0] as const
const FILL_S = [1, 1.2, 0.4] as const
const HOLD_MS = 2600
const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Başarı bölümü: sabit kamera kadrajında TR plakası; koşul yalnızca overlay katmanını değiştirir.
 * Görür → Tanır → Onaylar plakanın altında cam HUD’da ilerler. Koşullar görünürken döner;
 * seçimle o kareden devam eder. Hareket azaltmada kilitli son kare gösterilir.
 */
export default function PlateScan() {
  const reduce = Boolean(useReducedMotion())
  const pageVisible = usePageVisible()
  const uid = `plate${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const figureRef = useRef<HTMLElement>(null)
  const inView = useInView(figureRef, { amount: 0.35 })
  const revealed = useInView(figureRef, { once: true, amount: 0.2 })

  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<ScanPhase>(0)

  const condition = copy.conditions[index]
  const shown: ScanPhase = reduce ? 2 : phase
  const running = !reduce && inView && pageVisible

  useEffect(() => {
    if (!running) return
    if (phase < 2) {
      const timer = window.setTimeout(() => setPhase(phase === 0 ? 1 : 2), PHASE_MS[phase])
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => {
      setIndex((value) => (value + 1) % copy.conditions.length)
      setPhase(0)
    }, HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [running, phase, index])

  const select = (next: number) => {
    setIndex(next)
    setPhase(0)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.intro}>
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} id="basari-baslik" />
        <fieldset className={styles.conditions}>
          <legend className={styles.legend}>{copy.legend}</legend>
          <div className={styles.options}>
            {copy.conditions.map((item, itemIndex) => (
              <label key={item.id} className={styles.option} data-active={itemIndex === index}>
                <input
                  type="radio"
                  className={styles.radio}
                  name={`${uid}-kosul`}
                  value={item.id}
                  checked={itemIndex === index}
                  onChange={() => select(itemIndex)}
                />
                <span className={styles.optionText}>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <figure ref={figureRef} className={styles.figure}>
        <motion.div
          className={styles.stage}
          initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0% round 0.75rem)' }}
          animate={revealed ? { clipPath: 'inset(0% 0% 0% 0% round 0.75rem)' } : undefined}
          transition={{ duration: 1.1, ease: revealEase }}
        >
          <PlateSvg condition={condition.id} phase={shown} reduce={reduce} live={running} uid={uid} plateText={copy.plateText} />
          <span className={styles.conditionTag} aria-hidden="true">
            {condition.label}
          </span>
          <div className={styles.hud} role="status" aria-live="polite">
            <span className={styles.srOnly}>
              {copy.phases[shown]} — {condition.label}
            </span>
            <ol className={styles.hudSteps} aria-hidden="true">
              {copy.phases.map((label, phaseIndex) => {
                const done = shown > phaseIndex || shown === 2
                const state = done ? 'done' : shown === phaseIndex ? 'active' : 'idle'
                return (
                  <li key={label} className={styles.hudStep} data-state={state}>
                    <span className={styles.hudDot} aria-hidden="true">
                      <motion.span
                        className={styles.hudDotFill}
                        initial={false}
                        animate={{ scale: shown >= phaseIndex ? 1 : 0 }}
                        transition={
                          reduce
                            ? { duration: 0 }
                            : shown >= phaseIndex
                              ? { duration: FILL_S[phaseIndex], ease: 'linear' }
                              : { duration: 0.25, ease: revealEase }
                        }
                      />
                    </span>
                    <span className={styles.hudIndex}>{pad(phaseIndex + 1)}</span>
                    <span className={styles.hudLabel}>{label}</span>
                  </li>
                )
              })}
            </ol>
          </div>
          <motion.p
            className={styles.accuracy}
            initial={false}
            animate={{ opacity: shown === 2 ? 1 : 0, y: shown === 2 ? 0 : 8 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce || shown !== 2 ? 0 : 0.35, ease: revealEase }}
          >
            {copy.accuracy}
          </motion.p>
        </motion.div>
        <figcaption className={styles.caption}>
          <span className={styles.srOnly}>{copy.figureDescription(condition.label)} </span>
          {copy.note}
        </figcaption>
      </figure>
    </div>
  )
}
