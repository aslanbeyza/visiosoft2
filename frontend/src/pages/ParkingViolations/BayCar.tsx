import { motion } from 'framer-motion'
import type { Transition, Variants } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import type { CarPose } from './bayGeometry.ts'
import styles from './BayDiagram.module.css'

const driveIn: Variants = {
  hidden: { opacity: 0, y: -52 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: 0.75 + i * 0.09, ease: revealEase } }),
}

type BayCarProps = {
  pose: CarPose
  order: number

  kind: 'violation' | 'parked'
  active: boolean
  dim: boolean
  reduce: boolean
  pulseKey?: number
  onSelect?: () => void
  onPreview?: (active: boolean) => void
}

export default function BayCar({ pose, order, kind, active, dim, reduce, pulseKey = 0, onSelect, onPreview }: BayCarProps) {
  const state: Transition = reduce ? { duration: 0 } : { duration: 0.45, ease: revealEase }
  const pulse = reduce || !active ? { scale: 1 } : { scale: [1, 1.04, 1] }
  const pulseTransition: Transition = reduce ? { duration: 0 } : { duration: 0.55, ease: revealEase }

  return (
    <g transform={`translate(${pose.cx} ${pose.cy}) rotate(${pose.rot})`}>
      <motion.g variants={reduce ? undefined : driveIn} custom={order}>
        <motion.g
          key={active ? `${order}-${pulseKey}` : order}
          className={styles.car}
          data-kind={kind}
          data-active={active}
          initial={{ scale: 1 }}
          animate={{ opacity: dim ? 0.38 : 1, ...pulse }}
          transition={{ opacity: state, scale: pulseTransition }}
        >
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
          {kind === 'violation' && onSelect ? (
            <rect
              className={styles.carHit}
              x="-24"
              y="-40"
              width="48"
              height="82"
              onClick={onSelect}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') onPreview?.(true)
              }}
              onPointerLeave={() => onPreview?.(false)}
            />
          ) : null}
        </motion.g>
      </motion.g>
    </g>
  )
}
