import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Stepper } from '../../components/Form/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import PackagePanel from './PackagePanel.tsx'
import { quoteCopy } from './quoteCopy.ts'
import { buildPackage, emptyChoices, scenarioComplete, setupErrors } from './quoteRules.ts'
import type { QuoteChoices } from './quoteRules.ts'
import StepContact from './StepContact.tsx'
import StepScenario from './StepScenario.tsx'
import StepSetup from './StepSetup.tsx'
import styles from './QuoteWizard.module.css'

const PANEL_ID = 'onerilen-paket'
const TOTAL = quoteCopy.steps.length

export default function QuoteWizard() {
  const reduce = Boolean(useReducedMotion())
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [moved, setMoved] = useState(false)
  const [attempted, setAttempted] = useState([false, false])
  const [submitted, setSubmitted] = useState(false)
  const [choices, setChoices] = useState<QuoteChoices>(emptyChoices)
  const items = buildPackage(choices)

  const update = (patch: Partial<QuoteChoices>) => setChoices((previous) => ({ ...previous, ...patch }))

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
    setMoved(true)
  }

  const attempt = (index: number) => setAttempted((previous) => previous.map((value, i) => (i === index ? true : value)))

  const nextFromScenario = () => (scenarioComplete(choices) ? go(1) : attempt(0))
  const nextFromSetup = () => (Object.keys(setupErrors(choices)).length === 0 ? go(2) : attempt(1))

  const slide = {
    enter: (dir: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: dir * -28 }),
  }

  return (
    <div className={styles.layout}>
      <Reveal className={styles.card} y={32} amount={0.05}>
        <Stepper
          steps={[...quoteCopy.steps]}
          current={submitted ? TOTAL : step}
          label={quoteCopy.stepperLabel}
          onSelect={submitted ? undefined : go}
          className={styles.stepper}
        />

        <a className={styles.strip} href={`#${PANEL_ID}`}>
          <span className={styles.stripLabel}>{quoteCopy.panel.title}</span>
          <span className={styles.stripCount}>{quoteCopy.panel.count(items.length)}</span>
          <svg viewBox="0 0 24 24" className={styles.stripIcon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </a>

        <div className={styles.stage} role="group" aria-label={quoteCopy.wizardLabel}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0 : 0.45, ease: revealEase }}
            >
              {step === 0 ? (
                <StepScenario
                  value={choices.projectType}
                  onChange={(projectType) => update({ projectType })}
                  onNext={nextFromScenario}
                  showErrors={attempted[0]}
                  autoFocus={moved}
                  total={TOTAL}
                />
              ) : null}
              {step === 1 ? (
                <StepSetup
                  choices={choices}
                  onPayments={(payments) => update({ payments })}
                  onBarrier={(barrier) => update({ barrier })}
                  onInstallation={(installation) => update({ installation })}
                  onBack={() => go(0)}
                  onNext={nextFromSetup}
                  showErrors={attempted[1]}
                  autoFocus={moved}
                  total={TOTAL}
                />
              ) : null}
              {step === 2 ? (
                <StepContact
                  choices={choices}
                  items={items}
                  onBack={() => go(1)}
                  onSuccess={() => setSubmitted(true)}
                  autoFocus={moved}
                  total={TOTAL}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>

      <Reveal className={styles.aside} y={32} delay={0.12} amount={0.05}>
        <PackagePanel id={PANEL_ID} choices={choices} items={items} className={styles.panel} />
      </Reveal>
    </div>
  )
}
