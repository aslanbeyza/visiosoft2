import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Button from '../Button/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { FeatureDetails } from './FeatureHotspot.tsx'
import FieldScene from './FieldScene.tsx'
import ProcessFlow from './ProcessFlow.tsx'
import { flowTiming, systemShowcaseCopy as text } from './systemShowcaseCopy.ts'
import styles from './SystemShowcase.module.css'

function usePageVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible')

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return visible
}

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: revealEase } },
}

const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease: revealEase } },
}

export default function SystemShowcase() {
  const path = usePath()
  const reduce = useReducedMotion()
  const sceneRef = useRef<HTMLDivElement>(null)
  const revealed = useInView(sceneRef, { once: true, amount: 0.3 })
  const inView = useInView(sceneRef, { amount: 0.25 })
  // Görseller kırpılmış açılışın içinde; yükleme kırpılmamış sütun yaklaşınca başlar.
  const nearby = useInView(sceneRef, { once: true, margin: '800px 0px' })
  const pageVisible = usePageVisible()

  const stepCount = text.steps.length
  const [progress, setProgress] = useState(-1)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [cardOpen, setCardOpen] = useState(false)
  const running = !reduce && inView && pageVisible && !paused && !hovered && !focused && !cardOpen
  const remainingRef = useRef<number | null>(null)

  // Adımlar sırayla tamamlanır, kısa bir bekleyişten sonra akış baştan başlar. Sahne görünmezken durur.
  // Durunca kalan süre saklanır; devam edince adım, çizgisiyle birlikte kaldığı yerden sürer.
  useEffect(() => {
    if (!running) return
    const delay =
      remainingRef.current ?? (progress >= stepCount ? flowTiming.hold : progress < 0 ? flowTiming.start : flowTiming.step)
    const startedAt = performance.now()
    let fired = false
    const id = window.setTimeout(() => {
      fired = true
      remainingRef.current = null
      setProgress((value) => (value >= stepCount ? -1 : value + 1))
    }, delay)
    return () => {
      window.clearTimeout(id)
      if (!fired) remainingRef.current = Math.max(0, delay - (performance.now() - startedAt))
    }
  }, [progress, running, stepCount])

  // Hareket azaltma tercihinde akış animasyonsuz, tamamlanmış hâliyle gösterilir.
  const shownProgress = reduce ? stepCount : progress
  const highlightId = shownProgress >= 0 && shownProgress < stepCount ? text.steps[shownProgress].featureId : null

  const onSceneBlur = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.relatedTarget
    if (!(target instanceof Node) || !event.currentTarget.contains(target)) setFocused(false)
  }

  return (
    <section className={styles.section} aria-labelledby="system-showcase-title">
      <div className={styles.wrap}>
        <motion.div
          className={styles.copy}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p variants={rise} className={styles.kicker}>
            <motion.span variants={rule} className={styles.rule} aria-hidden="true" />
            {text.kicker}
          </motion.p>
          <motion.h2 variants={rise} id="system-showcase-title" className={styles.title}>
            {text.title}
          </motion.h2>
          <motion.p variants={rise} className={styles.lead}>
            {text.description}
          </motion.p>
          <motion.div variants={rise} className={styles.actions}>
            <Button to={path(text.primary.route)} arrow>
              {text.primary.label}
            </Button>
            <Button to={path(text.secondary.route)} variant="secondary">
              {text.secondary.label}
            </Button>
          </motion.div>
        </motion.div>

        <div
          ref={sceneRef}
          className={styles.sceneColumn}
          style={{ '--flow-step': `${flowTiming.step}ms` } as CSSProperties}
        >
          {/* Tamamen kırpılmış öğe IntersectionObserver'da hiç görünmez; tetik kırpılmamış sütundan (sceneRef) gelir. */}
          {/* Sahnenin üzerine gelinince, odaklanınca ya da bir kart açıkken akış durur. */}
          <motion.div
            className={styles.sceneReveal}
            initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={revealed ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
            transition={{ duration: 1.2, ease: revealEase }}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch') setHovered(true)
            }}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={onSceneBlur}
          >
            <FieldScene
              features={text.features}
              highlightId={highlightId}
              revealed={revealed}
              eager={nearby}
              onCardOpenChange={setCardOpen}
            />
            <ProcessFlow label={text.flowLabel} steps={text.steps} progress={shownProgress} paused={!running} />
          </motion.div>

          <div className={styles.sceneFooter}>
            <p className={styles.sceneNote}>{text.sceneNote}</p>
            {reduce ? null : (
              <button
                type="button"
                className={styles.toggle}
                aria-label={paused ? text.play : text.pause}
                onClick={() => setPaused((value) => !value)}
              >
                <svg viewBox="0 0 16 16" className={styles.toggleIcon} fill="currentColor" aria-hidden="true">
                  {paused ? <path d="M5 3.2v9.6L12.6 8z" /> : <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" />}
                </svg>
                <span className={styles.toggleText} aria-hidden="true">
                  {paused ? text.playShort : text.pauseShort}
                </span>
              </button>
            )}
          </div>
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
