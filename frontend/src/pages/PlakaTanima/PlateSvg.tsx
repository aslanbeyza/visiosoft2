import { motion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import type { PlateCondition } from './plakaCopy.ts'
import PlateOverlays from './PlateOverlays.tsx'
import styles from './PlateScan.module.css'

export type ScanPhase = 0 | 1 | 2

type PlateSvgProps = {
  condition: PlateCondition
  phase: ScanPhase
  reduce: boolean
  live: boolean
  uid: string
  plateText: string
}

const corners = [
  { d: 'M106 154V132h22', sx: -1, sy: -1 },
  { d: 'M512 132h22v22', sx: 1, sy: -1 },
  { d: 'M534 224v22h-22', sx: 1, sy: 1 },
  { d: 'M128 246h-22v-22', sx: -1, sy: 1 },
]

const groups = [
  { x: 186, w: 72, cx: 222 },
  { x: 290, w: 100, cx: 340 },
  { x: 420, w: 72, cx: 456 },
]
const poses = [
  { spread: 30, ox: -26, oy: 12, opacity: 0.7 },
  { spread: 10, ox: 0, oy: 0, opacity: 1 },
  { spread: 0, ox: 0, oy: 0, opacity: 1 },
]

export default function PlateSvg({ condition, phase, reduce, live, uid, plateText }: PlateSvgProps) {
  const pose = poses[phase]
  const [p1, p2, p3] = plateText.split(' ')
  const chars = [p1, p2, p3]
  const t = (duration: number, delay = 0) => ({ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: revealEase })

  return (
    <svg viewBox="0 0 640 360" className={styles.svg} data-live={live} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}-ir`}>
          <stop offset="0" stopColor="#eef0fb" stopOpacity="0.2" />
          <stop offset="1" stopColor="#eef0fb" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="360" className={styles.feed} />
      <path d="M58 360V160c0-46 30-82 76-96l58-18h256l58 18c46 14 76 50 76 96v200" className={styles.carBody} />
      <path d="M176 60h288l36 62H140Z" className={styles.carGlass} />
      <rect x="80" y="150" width="78" height="40" rx="10" className={styles.lamp} />
      <rect x="482" y="150" width="78" height="40" rx="10" className={styles.lamp} />
      <path d="M58 272h524M92 306h456" className={styles.carLine} />
      <rect x="108" y="136" width="424" height="106" rx="10" className={styles.recess} />

      <PlateOverlays condition={condition} uid={uid} layer="back" reduce={reduce} />

      <rect x="120" y="146" width="400" height="86" rx="8" className={styles.plate} />
      <path d="M128 146h36v86h-36a8 8 0 0 1-8-8v-70a8 8 0 0 1 8-8Z" className={styles.band} />
      <text x="142" y="220" className={styles.bandText} textAnchor="middle">
        TR
      </text>
      {groups.map((group, index) => (
        <text key={group.cx} x={group.cx} y="208" className={styles.plateText} textAnchor="middle">
          {chars[index]}
        </text>
      ))}

      <PlateOverlays condition={condition} uid={uid} layer="front" reduce={reduce} />

      {!reduce ? (
        <motion.g
          initial={false}
          animate={phase === 1 ? { x: [0, 340], opacity: [0, 1, 1, 0] } : { x: 0, opacity: 0 }}
          transition={{ x: { duration: 1.1, ease: 'easeInOut' }, opacity: { duration: 1.1, times: [0, 0.12, 0.85, 1] } }}
        >
          <rect x="136" y="150" width="30" height="78" className={styles.scanTrail} />
          <rect x="166" y="150" width="2.5" height="78" className={styles.scanLine} />
        </motion.g>
      ) : null}

      {groups.map((group, index) => (
        <motion.path
          key={group.x}
          d={`M${group.x} 166h${group.w}v52h-${group.w}Z`}
          className={styles.charBox}
          initial={false}
          animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
          transition={t(0.6, phase >= 1 ? 0.15 + index * 0.14 : 0)}
        />
      ))}

      {corners.map((corner) => (
        <motion.g
          key={corner.d}
          initial={false}
          animate={{ x: corner.sx * pose.spread + pose.ox, y: corner.sy * pose.spread + pose.oy, opacity: pose.opacity }}
          transition={t(phase === 2 ? 0.45 : 0.8)}
        >
          <path d={corner.d} className={styles.bracket} />
        </motion.g>
      ))}

      <motion.g
        className={styles.lock}
        initial={false}
        animate={{ scale: phase === 2 ? 1 : 0.4, opacity: phase === 2 ? 1 : 0 }}
        transition={t(0.45, phase === 2 ? 0.2 : 0)}
      >
        <circle cx="534" cy="132" r="15" className={styles.lockDisc} />
        <motion.path
          d="M527 132.5l5 5 9.5-10"
          className={styles.lockCheck}
          initial={false}
          animate={{ pathLength: phase === 2 ? 1 : 0 }}
          transition={t(0.5, phase === 2 ? 0.45 : 0)}
        />
      </motion.g>
    </svg>
  )
}
