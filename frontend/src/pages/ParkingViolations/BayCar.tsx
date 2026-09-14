import { motion } from 'framer-motion'
import type { Transition, Variants } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import type { CarPose } from './bayGeometry.ts'
import styles from './BayDiagram.module.css'

// Araç, kendi ekseni boyunca manevra alanı tarafından slota "girer".
const driveIn: Variants = {
  hidden: { opacity: 0, y: -52 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: 0.75 + i * 0.09, ease: revealEase } }),
}

type BayCarProps = {
  pose: CarPose
  order: number
  /** violation: vurgulanabilir ihlal aracı · parked: kurala uygun araç */
  kind: 'violation' | 'parked'
  active: boolean
  dim: boolean
  reduce: boolean
}

/** Üstten görünüm araç sembolü; ön tarafı yerel -y yönünde. Vurgu katmanı opaklıkla açılır. */
export default function BayCar({ pose, order, kind, active, dim, reduce }: BayCarProps) {
  const state: Transition = reduce ? { duration: 0 } : { duration: 0.45, ease: revealEase }

  return (
    <g transform={`translate(${pose.cx} ${pose.cy}) rotate(${pose.rot})`}>
      <motion.g variants={reduce ? undefined : driveIn} custom={order}>
        <motion.g className={styles.car} data-kind={kind} initial={false} animate={{ opacity: dim ? 0.38 : 1 }} transition={state}>
          <rect className={styles.carShadow} x="-17" y="-31" width="38" height="70" rx="10" />
          <rect className={styles.carBody} x="-19" y="-35" width="38" height="70" rx="10" />
          <motion.rect
            className={styles.carActive}
            x="-19"
            y="-35"
            width="38"
            height="70"
            rx="10"
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={state}
          />
          <path className={styles.carGlass} d="M-14-16q14-7 28 0l-2.5 10h-23z" />
          <path className={styles.carGlass} d="M-12 19h24l1.5 8q-13.5 5-27 0z" />
          <path className={styles.carTrim} d="M-19-11h-3.5M19-11h3.5M-9-31h18" />
        </motion.g>
      </motion.g>
    </g>
  )
}

type MarkerProps = { pose: CarPose; active: boolean; reduce: boolean }

/** Aktif ihlal aracının tavanında beliren uyarı işareti (dönmez, dünyada dik durur). */
export function BayMarker({ pose, active, reduce }: MarkerProps) {
  return (
    <g transform={`translate(${pose.cx} ${pose.cy})`}>
      <motion.g
        className={styles.marker}
        initial={false}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.4 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, delay: active ? 0.15 : 0, ease: revealEase }}
      >
        <circle r="11" />
        <path d="M0-5.5v6.5M0 4.6v.4" />
      </motion.g>
    </g>
  )
}
