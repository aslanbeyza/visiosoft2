import { lazy, Suspense, useId, type Ref } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Picture from '../Picture/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { kioskExplodeCopy } from './kioskExplodeCopy.ts'
import { padCount } from './kioskExplodeStage.ts'
import styles from './KioskExplode.module.css'
import { useKioskExplodeStage } from './useKioskExplodeStage.ts'
import WebGlGate from './WebGlGate.tsx'

const Scene = lazy(() => import('./KioskExplodeScene.tsx'))

/**
 * Kaydırdıkça kiosk.glb parçalarına ayrılır.
 * visiosoft-3d KioskShowcase pin-spacer: 100svh sahne, +=200% kaydırma.
 */
export default function KioskExplode() {
  const prefersReducedMotion = Boolean(useReducedMotion())
  return prefersReducedMotion ? <StaticExplode /> : <ScrollExplode />
}

function StaticExplode() {
  const titleId = useId()
  const { image } = kioskExplodeCopy

  return (
    <section id={kioskExplodeCopy.id} className={styles.staticSection} aria-labelledby={titleId}>
      <div className={styles.staticInner}>
        <Header titleId={titleId} />
        <div className={styles.staticStage}>
          <Picture
            src={image.src}
            avif={image.avif}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className={styles.staticImage}
          />
        </div>
        <PartCards className={styles.staticList} />
      </div>
    </section>
  )
}

function ScrollExplode() {
  const titleId = useId()
  const {
    sectionRef,
    headRef,
    railRef,
    counterRef,
    phase,
    isMounted,
    isInView,
    handlePointerMove,
    handlePointerLeave,
    currentPhase,
    phaseCount,
  } = useKioskExplodeStage()
  const fallback = <StageFallback />

  return (
    <div ref={sectionRef} className={styles.pinSpacer}>
      <section
        id={kioskExplodeCopy.id}
        className={styles.section}
        aria-labelledby={titleId}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className={styles.stage} aria-hidden="true">
          <div className={styles.viewport}>
            {isMounted ? (
              <WebGlGate fallback={fallback}>
                <Suspense fallback={fallback}>
                  <Scene active={isInView} />
                </Suspense>
              </WebGlGate>
            ) : (
              fallback
            )}
          </div>
          <div className={styles.vignette} />
        </div>

        <div className={styles.overlay}>
          <Header titleId={titleId} headRef={headRef} />

          <div className={styles.bottom}>
            <div className={styles.foot}>
              <div className={styles.caption}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentPhase.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: revealEase }}
                  >
                    <div className={styles.counterRow}>
                      <span className={styles.counter}>
                        <span aria-hidden="true">
                          {padCount(phase + 1)} / {padCount(phaseCount)}
                        </span>
                        <span className={styles.srOnly}>
                          {kioskExplodeCopy.step} {phase + 1} / {phaseCount}
                        </span>
                      </span>
                      <span className={styles.counterRule} aria-hidden="true" />
                    </div>
                    <p className={styles.calloutTitle}>{currentPhase.title}</p>
                    <p className={styles.calloutText}>{currentPhase.desc}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className={styles.dots} aria-hidden="true">
                {kioskExplodeCopy.phases.map((item, index) => (
                  <span key={item.title} className={styles.dot} data-on={index === phase ? 'true' : 'false'} />
                ))}
              </div>

              <p className={styles.hint}>{kioskExplodeCopy.hint}</p>
            </div>

            <PartCards className={styles.cards} />
          </div>
        </div>

        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railLabel}>{kioskExplodeCopy.rail}</span>
          <span className={styles.railTrack}>
            <span ref={railRef} className={styles.railFill} />
          </span>
          <span ref={counterRef} className={styles.railCount}>
            000
          </span>
        </div>
      </section>
    </div>
  )
}

function Header({ titleId, headRef }: { titleId: string; headRef?: Ref<HTMLElement> }) {
  return (
    <header ref={headRef} className={styles.head}>
      <p className={styles.eyebrow}>
        <span className={styles.rule} aria-hidden="true" />
        {kioskExplodeCopy.eyebrow}
      </p>
      <h2 id={titleId} className={styles.title}>
        {kioskExplodeCopy.title} <span className={styles.titleAccent}>{kioskExplodeCopy.titleAccent}</span>
      </h2>
      <p className={styles.lede}>{kioskExplodeCopy.lede}</p>
    </header>
  )
}

function PartCards({ className }: { className: string }) {
  return (
    <ul className={className}>
      {kioskExplodeCopy.parts.map((part) => (
        <li key={part.partId} className={styles.card}>
          <span className={styles.labelCode}>{part.code}</span>
          <span className={styles.labelTitle}>{part.title}</span>
          <span className={styles.labelDesc}>{part.desc}</span>
        </li>
      ))}
    </ul>
  )
}

function StageFallback() {
  return (
    <div className={styles.fallback} role="status">
      <span className={styles.fallbackDot} />
      {kioskExplodeCopy.loading}
    </div>
  )
}
