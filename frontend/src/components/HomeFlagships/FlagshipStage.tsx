import { useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { STAGE } from './flagships.ts'
import type { Flagship } from './flagships.ts'
import { homeFlagshipsCopy as text } from './homeFlagshipsCopy.ts'
import styles from './FlagshipStage.module.css'

type FlagshipStageProps = {
  items: Flagship[]
  active: number
  onStep: (direction: 1 | -1) => void
}

/** Ürünün alfa kutusu sahnede ölçeklenir; görsel kutunun içine şeffaf kenarları taşacak şekilde yerleşir. */
function geometry({ image, fit }: Flagship) {
  const [x0, y0, x1, y1] = image.bbox
  const pw = x1 - x0
  const ph = y1 - y0
  const boxH = 'height' in fit ? fit.height : (fit.width * ph) / pw
  const boxW = 'height' in fit ? (fit.height * pw) / ph : fit.width
  const { factor, min, max } = STAGE.shadow
  // Küçük çift (genişliğe göre ölçülen) sahnenin ortasına yükselir; uzun ürünler tabandaki zeminde kalır.
  const lift = 'width' in fit ? Math.max(0, STAGE.centre - boxH / 2 - STAGE.floor) : 0
  return {
    lift,
    style: {
      '--box-w': `${boxW}cqh`,
      '--box-h': `${boxH}cqh`,
      '--lift': `${lift}cqh`,
      '--img-w': `${(image.width / pw) * 100}%`,
      '--img-l': `${(-x0 / pw) * 100}%`,
      '--img-t': `${(-y0 / ph) * 100}%`,
    } as CSSProperties,
    shadow: Math.min(max, Math.max(min, boxW * factor)) / max,
  }
}

const SWIPE_MIN = 48

/** Sabit oranlı açık sahne: dört ürün üst üste, etkin olan opaklık + 0.98→1 ölçekle belirir; gölge aynı öğedir. */
export default function FlagshipStage({ items, active, onStep }: FlagshipStageProps) {
  const reduce = useReducedMotion()
  const start = useRef<{ x: number; y: number } | null>(null)
  const shapes = items.map(geometry)
  const duration = reduce ? 0 : 0.5

  const down = (event: PointerEvent<HTMLDivElement>) => {
    start.current = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY }
  }
  const up = (event: PointerEvent<HTMLDivElement>) => {
    const from = start.current
    start.current = null
    if (!from) return
    const dx = event.clientX - from.x
    if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(event.clientY - from.y) * 1.2) onStep(dx < 0 ? 1 : -1)
  }

  return (
    <div className={styles.stage}>
      <div
        className={styles.canvas}
        style={
          {
            '--floor': `${STAGE.floor}cqh`,
            '--shadow-max': `${STAGE.shadow.max}cqh`,
            '--lift-active': `${shapes[active].lift}cqh`,
          } as CSSProperties
        }
        onPointerDown={down}
        onPointerUp={up}
        onPointerCancel={() => (start.current = null)}
      >
        <span className={styles.ground} aria-hidden="true">
          <span className={styles.floor} />
          <motion.span
            className={styles.shadow}
            initial={false}
            animate={{ scaleX: shapes[active].shadow }}
            transition={{ duration, ease: revealEase }}
          />
        </span>
        {items.map((item, index) => {
          const on = index === active
          return (
            <motion.div
              key={item.slug}
              className={styles.product}
              style={shapes[index].style}
              aria-hidden={!on}
              initial={false}
              animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.98 }}
              transition={{ duration: on ? duration : duration * 0.7, ease: revealEase }}
            >
              <picture>
                <source type="image/avif" srcSet={item.image.avif} />
                <img
                  className={styles.image}
                  src={item.image.src}
                  alt={on ? item.image.alt : ''}
                  width={item.image.width}
                  height={item.image.height}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </picture>
            </motion.div>
          )
        })}
      </div>

      <div className={styles.controls}>
        <p className={styles.counter}>
          <span className="sr-only">{text.counterLabel(active + 1, items.length)}</span>
          <span aria-hidden="true">
            <span className={styles.current}>{String(active + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
          </span>
        </p>
        <div className={styles.buttons}>
          <StepButton label={text.previous} direction={-1} onStep={onStep} />
          <StepButton label={text.next} direction={1} onStep={onStep} />
        </div>
      </div>
    </div>
  )
}

function StepButton({ label, direction, onStep }: { label: string; direction: 1 | -1; onStep: (d: 1 | -1) => void }) {
  return (
    <button type="button" className={styles.step} aria-label={label} onClick={() => onStep(direction)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={direction === 1 ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} />
      </svg>
    </button>
  )
}
