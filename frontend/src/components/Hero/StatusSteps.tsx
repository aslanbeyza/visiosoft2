import { motion } from 'framer-motion'
import { revealEase } from '../Reveal/motion.ts'
import styles from './StatusParts.module.css'

type StatusStepsProps = {
  labels: string[]

  reached: number
  reduce: boolean
}

export default function StatusSteps({ labels, reached, reduce }: StatusStepsProps) {
  const fill = { duration: reduce ? 0 : 0.7, ease: revealEase }
  const draw = { duration: reduce ? 0 : 0.45, ease: revealEase, delay: reduce ? 0 : 0.15 }

  return (
    <ol className={styles.steps}>
      {labels.map((label, index) => {
        const done = index <= reached
        return (
          <li key={label} className={styles.step} data-done={done} data-current={index === reached}>
            <span className={styles.track}>
              <motion.span className={styles.fill} initial={false} animate={{ scaleX: done ? 1 : 0 }} transition={fill} />
            </span>
            <span className={styles.stepLabel}>
              <svg className={styles.check} viewBox="0 0 16 16" aria-hidden="true">
                <circle className={styles.ring} cx="8" cy="8" r="7" />
                <motion.path
                  className={styles.tick}
                  d="M4.8 8.3 7 10.4l4.2-4.6"
                  initial={false}
                  animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }}
                  transition={draw}
                />
              </svg>
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
