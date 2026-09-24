import { motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import styles from './PlateAnatomy.module.css'

type MV = MotionValue<number> | number

export type AnatomyValues = {
  frame: MV
  car: MV
  lockScale: MV
  lockOpacity: MV
  plateOpacity: MV
  plateY: MV
  cellOpacity: MV
  cellX: [MV, MV, MV]
}

const CORNERS = 'M40 78V40h38 M402 40h38v38 M440 262v38h-38 M78 300H40v-38'

const groups = [
  { cx: 160, x: 130, w: 60, text: '34' },
  { cx: 258, x: 212, w: 92, text: '•••' },
  { cx: 356, x: 324, w: 64, text: '••' },
]

export default function PlateAnatomySvg({ v }: { v: AnatomyValues }) {
  return (
    <svg className={styles.svg} viewBox="0 0 480 470" aria-hidden="true" focusable="false">
      {}
      <motion.path d={CORNERS} className={styles.ink} style={{ pathLength: v.frame }} />
      <line x1="40" y1="170" x2="440" y2="170" className={styles.grid} />
      <line x1="240" y1="40" x2="240" y2="300" className={styles.grid} />

      {}
      <motion.path
        d="M120 272V196c0-14 6-24 18-30l30-40c6-8 14-12 24-12h96c10 0 18 4 24 12l30 40c12 6 18 16 18 30v76"
        className={styles.body}
        style={{ pathLength: v.car }}
      />
      <motion.path d="M170 160l22-30h96l22 30z" className={styles.glass} style={{ pathLength: v.car }} />
      <motion.path d="M112 272h256M136 272v14h30v-14M314 272v14h30v-14" className={styles.body} style={{ pathLength: v.car }} />
      <motion.path d="M132 196h34M314 196h34" className={styles.lamp} style={{ pathLength: v.car }} />
      <motion.rect x="204" y="220" width="72" height="22" rx="3" className={styles.plateSmall} style={{ opacity: v.car }} />

      {}
      <motion.path
        d="M192 224v-14h14M274 210h14v14M288 238v14h-14M206 252h-14v-14"
        className={styles.lock}
        style={{ scale: v.lockScale, opacity: v.lockOpacity }}
      />

      {}
      <motion.g style={{ opacity: v.plateOpacity, y: v.plateY }}>
        <line x1="240" y1="262" x2="240" y2="344" className={styles.leader} />
        <rect x="70" y="352" width="340" height="76" rx="8" className={styles.plate} />
        <path d="M78 352h22v76H78a8 8 0 0 1-8-8v-60a8 8 0 0 1 8-8z" className={styles.band} />
        <text x="85" y="418" className={styles.tr}>
          TR
        </text>
        {groups.map((group) => (
          <text key={group.text} x={group.cx} y="404" className={styles.plateText}>
            {group.text}
          </text>
        ))}
      </motion.g>

      {}
      {groups.map((group, index) => (
        <motion.rect
          key={group.x}
          x={group.x}
          y="364"
          width={group.w}
          height="52"
          rx="4"
          className={styles.cell}
          style={{ opacity: v.cellOpacity, x: v.cellX[index] }}
        />
      ))}
    </svg>
  )
}
