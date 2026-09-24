import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { usePath } from '../../hooks/usePath/index.ts'
import FeatureHotspot from './FeatureHotspot.tsx'
import { sceneImages } from './systemShowcaseCopy.ts'
import type { FeatureId, SceneFeature } from './systemShowcaseCopy.ts'
import styles from './SystemShowcase.module.css'

const WIDE_QUERY = '(min-width: 1024px)'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const list = window.matchMedia(query)
    const apply = () => setMatches(list.matches)
    list.addEventListener('change', apply)
    return () => list.removeEventListener('change', apply)
  }, [query])

  return matches
}

type FieldSceneProps = {
  features: SceneFeature[]
  statusLabel: string

  highlightId: FeatureId | null
  revealed: boolean
}

export default function FieldScene({ features, statusLabel, highlightId, revealed }: FieldSceneProps) {
  const path = usePath()
  const reduce = useReducedMotion()
  const wide = useMediaQuery(WIDE_QUERY)
  const frameRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef(new Map<FeatureId, HTMLButtonElement>())
  const [openId, setOpenId] = useState<FeatureId | null>(null)

  const activeId = wide ? openId : null

  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['1.5%', '-1.5%'])
  const parallax = wide && !reduce

  useEffect(() => {
    if (!activeId) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      buttonRefs.current.get(activeId)?.focus()
      setOpenId(null)
    }
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('[data-hotspot]')) setOpenId(null)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [activeId])

  return (
    <div ref={frameRef} className={styles.scene}>
      <motion.div className={styles.stage} style={parallax ? { y, scale: 1.04 } : { y: 0, scale: 1 }}>
        <picture>
          <source type="image/avif" srcSet={sceneImages.field.avif} sizes={sceneImages.field.sizes} />
          <source type="image/webp" srcSet={sceneImages.field.webp} sizes={sceneImages.field.sizes} />
          <img
            className={styles.fieldPhoto}
            src={sceneImages.field.src}
            alt={sceneImages.field.alt}
            width={sceneImages.field.width}
            height={sceneImages.field.height}
            decoding="async"
            fetchPriority="low"
          />
        </picture>

        <span className={styles.kioskShadow} aria-hidden="true" />
        <picture>
          <source type="image/avif" srcSet={sceneImages.kiosk.avif} sizes={sceneImages.kiosk.sizes} />
          <source type="image/webp" srcSet={sceneImages.kiosk.webp} sizes={sceneImages.kiosk.sizes} />
          <img
            className={styles.kiosk}
            src={sceneImages.kiosk.src}
            alt={sceneImages.kiosk.alt}
            width={sceneImages.kiosk.width}
            height={sceneImages.kiosk.height}
            decoding="async"
            fetchPriority="low"
          />
        </picture>

        {features.map((feature, index) =>
          wide ? (
            <FeatureHotspot
              key={feature.id}
              ref={(node) => {
                if (node) buttonRefs.current.set(feature.id, node)
                else buttonRefs.current.delete(feature.id)
              }}
              feature={feature}
              index={index}
              href={path(feature.route)}
              open={activeId === feature.id}
              current={highlightId === feature.id}
              revealed={revealed}
              onToggle={() => setOpenId((value) => (value === feature.id ? null : feature.id))}
            />
          ) : (
            <span
              key={feature.id}
              className={styles.marker}
              style={{ left: `${feature.x}%`, top: `${feature.y}%`, transitionDelay: `${0.3 + index * 0.12}s` }}
              data-revealed={revealed}
              data-current={highlightId === feature.id}
              aria-hidden="true"
            >
              {index + 1}
            </span>
          ),
        )}
      </motion.div>

      <p className={styles.status}>
        <span className={styles.statusDot} aria-hidden="true" />
        {statusLabel}
      </p>
    </div>
  )
}
