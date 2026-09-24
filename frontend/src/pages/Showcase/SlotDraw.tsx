import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Lightbox from '../../components/Lightbox/index.ts'
import MediaFrame from '../../components/MediaFrame/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { designerImage, designerSlots, designerZoomImage, slotDrawCopy } from './designerCopy.ts'
import styles from './SlotDraw.module.css'

type Timing = { i: number; base: number }

const STEP = 0.35
const CALIBRATE = 2.5
const phaseDelays = [0, 1.6, CALIBRATE]
const phaseDurations = [1.5, 0.8, 1.2]

const strokeVariants: Variants = {
  idle: { pathLength: 0, opacity: 0 },
  done: ({ i, base }: Timing) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, delay: base + i * STEP, ease: revealEase },
      opacity: { duration: 0.2, delay: base + i * STEP },
    },
  }),
}

const fillVariants: Variants = {
  idle: { opacity: 0 },
  done: ({ i, base }: Timing) => ({ opacity: 1, transition: { duration: 0.6, delay: base + i * STEP + 0.75 } }),
}

const groupVariants: Variants = {
  idle: { x: 0, y: 0 },
  done: ({ i, base }: Timing) => ({
    x: [0, 14, 0],
    y: [0, -8, 0],
    transition: { duration: 1.2, delay: base + CALIBRATE + i * 0.06, ease: 'easeInOut' },
  }),
}

const chipVariants: Variants = {
  idle: { opacity: 0, y: 8 },
  done: ({ i, base }: Timing) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: base + i * STEP + 0.9, ease: revealEase } }),
}

const phaseVariants: Variants = {
  idle: { opacity: 0.55 },
  done: ({ i, base }: Timing) => ({ opacity: 1, transition: { duration: 0.4, delay: base + phaseDelays[i] } }),
}

const phaseLineVariants: Variants = {
  idle: { scaleX: 0 },
  done: ({ i, base }: Timing) => ({
    scaleX: 1,
    transition: { duration: phaseDurations[i], delay: base + phaseDelays[i], ease: 'linear' },
  }),
}

export default function SlotDraw() {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.3 })
  const [run, setRun] = useState(0)
  const [open, setOpen] = useState(false)

  const base = run === 0 ? 1 : 0.15
  const motionProps = { initial: reduce ? false : 'idle', animate: reduce || inView ? 'done' : 'idle' } as const

  return (
    <div ref={rootRef} className={styles.root}>
      <MediaFrame tone="dark" mode="screenshot" ratio="1600 / 722" caption={slotDrawCopy.caption} amount={0.3}>
        <div className={styles.canvas}>
          <picture className={styles.picture}>
            <source type="image/avif" srcSet={designerImage.avif} />
            <img src={designerImage.src} alt={designerImage.alt} width={designerImage.width} height={designerImage.height} loading="lazy" decoding="async" />
          </picture>
          <motion.svg key={`svg-${run}`} className={styles.overlay} viewBox="0 0 1600 722" aria-hidden="true" focusable="false" {...motionProps}>
            {designerSlots.map((slot, i) => (
              <motion.g key={slot.id} custom={{ i, base }} variants={groupVariants}>
                <motion.path d={slot.d} className={styles.fill} custom={{ i, base }} variants={fillVariants} />
                <motion.path d={slot.d} className={styles.stroke} custom={{ i, base }} variants={strokeVariants} />
              </motion.g>
            ))}
          </motion.svg>
          <motion.div key={`chips-${run}`} className={styles.chips} aria-hidden="true" {...motionProps}>
            {designerSlots.map((slot, i) => (
              <motion.span
                key={slot.id}
                className={styles.chip}
                style={{ left: `${slot.chip.x}%`, top: `${slot.chip.y}%` }}
                custom={{ i, base }}
                variants={chipVariants}
              >
                {slot.id}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </MediaFrame>

      <div className={styles.bar}>
        <motion.ol key={`phases-${run}`} className={styles.phases} aria-label={slotDrawCopy.phasesLabel} {...motionProps}>
          {slotDrawCopy.phases.map((phase, i) => (
            <motion.li key={phase} className={styles.phase} custom={{ i, base }} variants={phaseVariants}>
              <motion.span className={styles.phaseLine} aria-hidden="true" custom={{ i, base }} variants={phaseLineVariants} />
              <span className={styles.phaseIndex}>{String(i + 1).padStart(2, '0')}</span>
              {phase}
            </motion.li>
          ))}
        </motion.ol>

        <div className={styles.actions}>
          {reduce ? null : (
            <button type="button" className={styles.action} onClick={() => setRun((value) => value + 1)} disabled={!inView}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v4.5h4.5" />
              </svg>
              {slotDrawCopy.replay}
            </button>
          )}
          <button type="button" className={styles.action} aria-haspopup="dialog" onClick={() => setOpen(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4 4M11 8.5v5M8.5 11h5" />
            </svg>
            {slotDrawCopy.open}
          </button>
        </div>
      </div>

      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        image={designerZoomImage}
        caption={slotDrawCopy.caption}
        zoom={2}
      />
    </div>
  )
}
