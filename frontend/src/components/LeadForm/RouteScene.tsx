import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import RouteMarks from './RouteMarks.tsx'
import { DRIVE_START, SCENE, buildDrive } from './routeTimeline.ts'
import styles from './RouteScene.module.css'

export type RouteSceneProps = {
  /** Dört kilometre taşının etiketleri (son etiket park yerine denk gelir). */
  steps: string[]
  variant: 'quote' | 'discovery'
  label: string
}

const drive = buildDrive()
const { bay, laneY, roadTop, roadBottom, roadEnd } = SCENE
const lastX = drive.x[drive.x.length - 1]

/**
 * Hero anı: yol çizilir, araç talep → görüşme → keşif → teklif taşlarında durarak ilerler
 * ve park yerine yanaşır; park yeri köşe işaretleriyle "tamamlandı" olarak çerçevelenir (M3 + M8 dili).
 */
export default function RouteScene({ steps, variant, label }: RouteSceneProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const run = reduce || inView

  const ink = (delay: number, duration = 0.9) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: run ? { pathLength: 1 } : undefined,
    transition: { duration, delay, ease: revealEase },
  })

  return (
    <div ref={ref} className={styles.scene} data-variant={variant}>
      <svg viewBox={`0 0 ${SCENE.width} ${SCENE.height}`} className={styles.svg} aria-hidden="true" focusable="false">
        <motion.rect
          className={styles.road}
          x={0}
          y={roadTop}
          width={roadEnd}
          height={roadBottom - roadTop}
          style={{ originX: 0 }}
          initial={reduce ? false : { scaleX: 0, opacity: 0 }}
          animate={run ? { scaleX: 1, opacity: 1 } : undefined}
          transition={{ duration: 1.1, delay: 0.2, ease: revealEase }}
        />
        <motion.path className={styles.edge} d={`M0 ${roadTop}H${roadEnd}`} {...ink(0.25, 1.1)} />
        <motion.path className={styles.edge} d={`M0 ${roadBottom}H${roadEnd}`} {...ink(0.35, 1.1)} />
        <motion.g
          style={{ originX: 0 }}
          initial={reduce ? false : { scaleX: 0 }}
          animate={run ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.2, delay: 0.45, ease: revealEase }}
        >
          <path className={styles.dash} d={`M12 ${(roadTop + roadBottom) / 2}H${roadEnd - 12}`} />
        </motion.g>
        <motion.path className={styles.bay} d={`M${bay.x} ${bay.y}H${bay.x + bay.w}V${bay.y + bay.h}H${bay.x}`} {...ink(0.9, 0.8)} />

        <RouteMarks variant={variant} run={run} reduce={reduce} arrivals={drive.arrivals} />

        <motion.g
          initial={reduce ? false : { x: SCENE.carStart, opacity: 0 }}
          animate={run ? { x: reduce ? lastX : drive.x, opacity: 1 } : undefined}
          transition={{
            x: { duration: drive.duration, times: drive.times, ease: 'easeInOut', delay: DRIVE_START },
            opacity: { duration: 0.4, delay: DRIVE_START },
          }}
        >
          <rect className={styles.car} x={-34} y={laneY - 15} width={68} height={30} rx={9} />
          <path className={styles.glass} d={`M10 ${laneY - 11}q7 11 0 22M-22 ${laneY - 10}q-4 10 0 20`} />
          <path className={styles.roof} d={`M-14 ${laneY - 9}h20M-14 ${laneY + 9}h20`} />
        </motion.g>
      </svg>

      <ol className={styles.labels} aria-label={label}>
        {steps.map((step, index) => (
          <motion.li
            key={step}
            className={styles.label}
            initial={reduce ? false : { opacity: 0.38, y: 6 }}
            animate={run ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: drive.arrivals[index] ?? 0, ease: revealEase }}
          >
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.text}>{step}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
