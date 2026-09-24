import { lazy, Suspense, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { HardwareSlug } from '../../pages/HardwareProduct/products.ts'
import Picture from '../Picture/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { explodeVariantFor, type ExplodeVariant } from './explodeVariants.ts'
import { padCount } from './kioskExplodeStage.ts'
import { preloadExplodeModel } from './KioskExplodeModel.tsx'
import styles from './KioskExplode.module.css'
import { useKioskExplodeStage } from './useKioskExplodeStage.ts'
import WebGlGate from './WebGlGate.tsx'

const Scene = lazy(() => import('./KioskExplodeScene.tsx'))

type KioskExplodeProps = {

  slug?: HardwareSlug
}

export default function KioskExplode({ slug = 'kiosk' }: KioskExplodeProps) {
  const prefersReducedMotion = Boolean(useReducedMotion())
  const variant = explodeVariantFor(slug)
  if (!variant) return null

  return prefersReducedMotion ? <StaticExplode variant={variant} /> : <ScrollExplode variant={variant} />
}

function StaticExplode({ variant }: { variant: ExplodeVariant }) {
  const { copy } = variant

  return (
    <section id={copy.id} className={styles.staticSection} aria-label={copy.rail}>
      <div className={styles.staticInner}>
        <div className={styles.staticStage}>
          <Picture
            src={copy.image.src}
            avif={copy.image.avif}
            alt={copy.image.alt}
            width={copy.image.width}
            height={copy.image.height}
            className={styles.staticImage}
          />
        </div>
        <PartCards variant={variant} className={styles.staticList} />
      </div>
    </section>
  )
}

function ScrollExplode({ variant }: { variant: ExplodeVariant }) {
  const { copy } = variant
  const {
    sectionRef,
    railRef,
    counterRef,
    phase,
    isMounted,
    isInView,
    handlePointerMove,
    handlePointerLeave,
    currentPhase,
    phaseCount,
  } = useKioskExplodeStage(copy)
  const fallback = <StageFallback loading={copy.loading} />

  useEffect(() => {
    preloadExplodeModel(variant.modelSrc)
  }, [variant.modelSrc])

  return (
    <div ref={sectionRef} className={styles.pinSpacer}>
      <section
        id={copy.id}
        className={styles.section}
        aria-label={copy.rail}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className={styles.stage} aria-hidden="true">
          <div className={styles.viewport}>
            {isMounted ? (
              <WebGlGate fallback={fallback}>
                <Suspense fallback={fallback}>
                  <Scene active={isInView} variant={variant} />
                </Suspense>
              </WebGlGate>
            ) : (
              fallback
            )}
          </div>
          <div className={styles.vignette} />
        </div>

        <div className={styles.overlay}>
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
                          {copy.step} {phase + 1} / {phaseCount}
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
                {copy.phases.map((item, index) => (
                  <span key={item.title} className={styles.dot} data-on={index === phase ? 'true' : 'false'} />
                ))}
              </div>

              <p className={styles.hint}>{copy.hint}</p>
            </div>

            <PartCards variant={variant} className={styles.cards} />
          </div>
        </div>

        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railLabel}>{copy.rail}</span>
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

function PartCards({ variant, className }: { variant: ExplodeVariant; className: string }) {
  return (
    <ul className={className}>
      {variant.copy.parts.map((part) => (
        <li key={part.partId} className={styles.card}>
          <span className={styles.labelCode}>{part.code}</span>
          <span className={styles.labelTitle}>{part.title}</span>
          <span className={styles.labelDesc}>{part.desc}</span>
        </li>
      ))}
    </ul>
  )
}

function StageFallback({ loading }: { loading: string }) {
  return (
    <div className={styles.fallback} role="status">
      <span className={styles.fallbackDot} />
      {loading}
    </div>
  )
}
