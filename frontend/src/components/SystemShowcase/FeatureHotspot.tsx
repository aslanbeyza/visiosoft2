import { forwardRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { SceneFeature } from './systemShowcaseCopy.ts'
import styles from './SystemShowcase.module.css'

const easeApple = [0.25, 1, 0.5, 1] as const

type FeatureDetailsProps = {
  feature: SceneFeature
  index: number
  href: string
}

/** Özellik kartının içeriği; masaüstünde bilgi noktası kartında, mobilde listede kullanılır. */
export function FeatureDetails({ feature, index, href }: FeatureDetailsProps) {
  return (
    <>
      <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
      <h3 className={styles.cardTitle}>{feature.title}</h3>
      <p className={styles.cardText}>{feature.description}</p>
      <Link to={href} className={styles.cardLink}>
        {feature.linkLabel}
        <span aria-hidden="true"> →</span>
      </Link>
    </>
  )
}

type FeatureHotspotProps = FeatureDetailsProps & {
  open: boolean
  /** İşlem akışında bu noktaya ait adım yürütülüyor. */
  current: boolean
  revealed: boolean
  onToggle: () => void
}

const FeatureHotspot = forwardRef<HTMLButtonElement, FeatureHotspotProps>(function FeatureHotspot(
  { feature, index, href, open, current, revealed, onToggle },
  ref,
) {
  const reduce = useReducedMotion()
  const cardId = `showcase-feature-${feature.id}`

  return (
    <div
      className={styles.hotspot}
      style={{ left: `${feature.x}%`, top: `${feature.y}%` }}
      data-hotspot=""
      data-open={open}
      data-current={current}
      data-placement={feature.placement}
    >
      <motion.button
        ref={ref}
        type="button"
        className={styles.hotspotButton}
        aria-expanded={open}
        aria-controls={open ? cardId : undefined}
        onClick={onToggle}
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        animate={revealed ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.45, delay: 0.45 + index * 0.15, ease: easeApple }}
      >
        <span className={styles.hotspotDot} aria-hidden="true" />
        <span className={styles.srOnly}>{feature.title}</span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={cardId}
            className={styles.hotspotCard}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.22, ease: easeApple }}
          >
            <FeatureDetails feature={feature} index={index} href={href} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
})

export default FeatureHotspot
