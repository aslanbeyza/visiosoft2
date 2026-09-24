import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePath } from '../../hooks/usePath/index.ts'
import { FeatureDetails } from './FeatureHotspot.tsx'
import FieldScene from './FieldScene.tsx'
import ProcessFlow from './ProcessFlow.tsx'
import { flowTiming, systemShowcaseCopy as text } from './systemShowcaseCopy.ts'
import styles from './SystemShowcase.module.css'

const easeApple = [0.25, 1, 0.5, 1] as const

function usePageVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible')

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return visible
}

export default function SystemShowcase() {
  const path = usePath()
  const reduce = useReducedMotion()
  const sceneRef = useRef<HTMLDivElement>(null)
  const revealed = useInView(sceneRef, { once: true, amount: 0.3 })
  const inView = useInView(sceneRef, { amount: 0.25 })
  const pageVisible = usePageVisible()

  const stepCount = text.steps.length
  const [progress, setProgress] = useState(-1)
  const running = !reduce && inView && pageVisible

  useEffect(() => {
    if (!running) return
    const delay = progress >= stepCount ? flowTiming.hold : progress < 0 ? flowTiming.start : flowTiming.step
    const id = window.setTimeout(() => setProgress((value) => (value >= stepCount ? -1 : value + 1)), delay)
    return () => window.clearTimeout(id)
  }, [progress, running, stepCount])

  const shownProgress = reduce ? stepCount : progress
  const highlightId = shownProgress >= 0 && shownProgress < stepCount ? text.steps[shownProgress].featureId : null

  const rise = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeApple } },
  }

  return (
    <section className={styles.section} aria-labelledby="system-showcase-title">
      <div className={styles.wrap}>
        <motion.div
          className={styles.copy}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.p variants={rise} className={styles.kicker}>
            {text.kicker}
          </motion.p>
          <motion.h2 variants={rise} id="system-showcase-title" className={styles.title}>
            {text.title}
          </motion.h2>
          <motion.p variants={rise} className={styles.lead}>
            {text.description}
          </motion.p>
          <motion.div variants={rise} className={styles.actions}>
            <Link to={path(text.primary.route)} className={styles.primary}>
              {text.primary.label}
              <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link to={path(text.secondary.route)} className={styles.secondary}>
              {text.secondary.label}
            </Link>
          </motion.div>
        </motion.div>

        <div
          ref={sceneRef}
          className={styles.sceneColumn}
          style={{ '--flow-step': `${flowTiming.step}ms` } as CSSProperties}
        >
          <FieldScene features={text.features} statusLabel={text.status} highlightId={highlightId} revealed={revealed} />
          <ProcessFlow label={text.flowLabel} steps={text.steps} progress={shownProgress} />
        </div>

        <ol className={styles.featureList}>
          {text.features.map((feature, index) => (
            <li key={feature.id} className={styles.featureItem}>
              <FeatureDetails feature={feature} index={index} href={path(feature.route)} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
