import { motion } from 'framer-motion'
import type { PlateCondition } from './plakaCopy.ts'
import styles from './PlateScan.module.css'

type PlateOverlaysProps = {
  condition: PlateCondition
  /** SVG desen kimliklerini örneğe özgü yapmak için önek. */
  uid: string
  layer: 'back' | 'front'
  reduce: boolean
}

// Çamur lekeleri: plakanın alt kenarı ve köşelerinde düzensiz izler.
const mud = [
  'M126 222c12-9 30-4 36 4s-4 14-18 14-26-8-18-18Z',
  'M470 234c10-12 34-10 44-2 8 6 2 12-12 12h-26c-8 0-10-4-6-10Z',
  'M300 228c8-6 22-6 30 0s0 12-14 12-22-6-16-12Z',
  'M500 150c8-4 18 0 18 8s-10 12-16 8-8-12-2-16Z',
  'M222 236c4-3 10-3 12 1s-2 6-6 6-8-4-6-7Z',
]

/**
 * Koşul katmanları. back: sahne ile plaka arasında (gece karartması, kızılötesi aydınlatma).
 * front: plakanın üstünde (yağmur, kar, sis, çamur). Geçişler yalnızca opaklıkla yapılır.
 */
export default function PlateOverlays({ condition, uid, layer, reduce }: PlateOverlaysProps) {
  const show = (id: PlateCondition) => ({
    initial: false as const,
    animate: { opacity: condition === id ? 1 : 0 },
    transition: { duration: reduce ? 0 : 0.6, ease: 'easeInOut' as const },
  })

  if (layer === 'back') {
    return (
      <g aria-hidden="true">
        <motion.g {...show('gece')}>
          <rect width="640" height="360" fill="#02030f" opacity="0.62" />
          <ellipse cx="320" cy="190" rx="250" ry="120" fill={`url(#${uid}-ir)`} />
        </motion.g>
      </g>
    )
  }

  return (
    <g aria-hidden="true">
      <defs>
        <pattern id={`${uid}-rain`} width="22" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(14)">
          <line x1="6" y1="2" x2="6" y2="17" className={styles.rainDrop} />
          <line x1="17" y1="24" x2="17" y2="36" className={styles.rainDrop} />
        </pattern>
        <pattern id={`${uid}-snow`} width="48" height="60" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="10" r="2.4" className={styles.snowFlake} />
          <circle cx="32" cy="22" r="1.6" className={styles.snowFlake} />
          <circle cx="20" cy="44" r="2" className={styles.snowFlake} />
          <circle cx="42" cy="52" r="1.3" className={styles.snowFlake} />
        </pattern>
        <linearGradient id={`${uid}-fog`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfe2f7" stopOpacity="0.2" />
          <stop offset="0.55" stopColor="#eef0fb" stopOpacity="0.5" />
          <stop offset="1" stopColor="#dfe2f7" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <motion.g {...show('yagmur')}>
        <g className={styles.fall} data-kind="rain">
          <rect x="-40" y="-360" width="720" height="720" fill={`url(#${uid}-rain)`} />
        </g>
      </motion.g>
      <motion.g {...show('kar')}>
        <g className={styles.fall} data-kind="snow">
          <rect y="-360" width="640" height="720" fill={`url(#${uid}-snow)`} />
        </g>
      </motion.g>
      <motion.g {...show('sis')}>
        <rect width="640" height="360" fill={`url(#${uid}-fog)`} />
      </motion.g>
      <motion.g {...show('camur')}>
        {mud.map((d) => (
          <path key={d} d={d} className={styles.mud} />
        ))}
      </motion.g>
    </g>
  )
}
