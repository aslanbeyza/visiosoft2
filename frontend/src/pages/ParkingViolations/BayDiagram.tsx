import { useId } from 'react'
import { motion } from 'framer-motion'
import type { Transition, Variants } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import BayCar, { BayMarker } from './BayCar.tsx'
import { BoltMark, DisabledMark, KeyMark } from './BayGlyphs.tsx'
import { SLOT, VIEW, bracketPaths, hatchLines, parkedCars, scenarios, slotLines } from './bayGeometry.ts'
import type { ViolationId } from './violationsCopy.ts'
import styles from './BayDiagram.module.css'

const lineDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay: i * 0.035, ease: revealEase }, opacity: { duration: 0.2, delay: i * 0.035 } },
  }),
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({ opacity: 1, transition: { duration: 0.7, delay: 0.55 + i * 0.06 } }),
}

type BayDiagramProps = {
  active: ViolationId | null
  /** Görünüme girince çizim başlar. */
  play: boolean
  reduce: boolean
  label: string
  className?: string
}

const marked = scenarios.find((s) => s.id === 'marked')?.zone ?? { x: 582, y: 24, w: 78, h: 128 }
const slotCenter = (k: number) => SLOT.x0 + k * SLOT.w + SLOT.w / 2
const bottomBack = SLOT.bottomY + SLOT.depth

/**
 * Özgün park alanı planı (üstten): slot çizgileri çizilir, zemin işaretleri belirir, araçlar slotlarına girer.
 * `active` ihlal bölgesini köşe parantezleriyle çerçeveler, aracını lacivertle vurgular, diğerlerini soldurur.
 */
export default function BayDiagram({ active, play, reduce, label, className = '' }: BayDiagramProps) {
  const clipId = `${useId().replace(/:/g, '')}-hatch`
  const state: Transition = reduce ? { duration: 0 } : { duration: 0.55, ease: revealEase }
  const lines = slotLines()

  return (
    <motion.svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className={`${styles.svg} ${className}`.trim()}
      role="img"
      aria-label={label}
      initial={reduce ? false : 'hidden'}
      animate={play || reduce ? 'show' : 'hidden'}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={marked.x} y={marked.y} width={marked.w} height={marked.h} />
        </clipPath>
      </defs>

      <rect className={styles.ground} x="0" y="0" width={VIEW.w} height={VIEW.h} rx="14" />

      {scenarios.map((s) => (
        <motion.rect
          key={`zone-${s.id}`}
          className={styles.zone}
          x={s.zone.x}
          y={s.zone.y}
          width={s.zone.w}
          height={s.zone.h}
          initial={false}
          animate={{ opacity: active === s.id ? 1 : 0 }}
          transition={state}
        />
      ))}

      <motion.g variants={reduce ? undefined : fadeIn} custom={0}>
        <path className={styles.hatch} d={hatchLines(marked)} clipPath={`url(#${clipId})`} />
        <rect className={styles.ev} x={SLOT.x0} y={SLOT.topY} width={SLOT.w * 2} height={SLOT.depth} />
        <rect className={styles.ev} x={SLOT.x0} y={SLOT.bottomY} width={SLOT.w * 2} height={SLOT.depth} />
      </motion.g>

      {lines.map((d, i) => (
        <motion.path key={d} className={styles.line} d={d} variants={reduce ? undefined : lineDraw} custom={i} />
      ))}

      <motion.g variants={reduce ? undefined : fadeIn} custom={2} className={styles.marks}>
        <path className={styles.aisle} d={`M${SLOT.x0} 220H${SLOT.x0 + SLOT.w * 8}`} />
        <path className={styles.arrow} d="M96 196h28m-8-7 8 7-8 7M404 244h-28m8-7-8 7 8 7" />
        <BoltMark x={slotCenter(0)} y={42} className={styles.glyphFill} />
        <BoltMark x={slotCenter(1)} y={42} className={styles.glyphFill} />
        <BoltMark x={slotCenter(0)} y={bottomBack - 18} className={styles.glyphFill} />
        <BoltMark x={slotCenter(1)} y={bottomBack - 18} className={styles.glyphFill} />
        <DisabledMark x={slotCenter(6) - 3} y={44} className={styles.glyph} />
        <KeyMark x={slotCenter(2) - 2} y={bottomBack - 16} className={styles.glyph} />
        <KeyMark x={slotCenter(3) - 2} y={bottomBack - 16} className={styles.glyph} />
      </motion.g>

      {parkedCars.map((pose, i) => (
        <BayCar key={`parked-${pose.cx}`} pose={pose} order={i + 3} kind="parked" active={false} dim={active !== null} reduce={reduce} />
      ))}
      {scenarios.map((s, i) => (
        <BayCar key={`car-${s.id}`} pose={s.car} order={i} kind="violation" active={active === s.id} dim={active !== null && active !== s.id} reduce={reduce} />
      ))}

      {scenarios.map((s) =>
        bracketPaths(s.zone).map((d) => (
          <motion.path
            key={`${s.id}-${d}`}
            className={styles.bracket}
            d={d}
            initial={false}
            animate={{ pathLength: active === s.id ? 1 : 0, opacity: active === s.id ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, ease: revealEase }}
          />
        )),
      )}
      {scenarios.map((s) => (
        <BayMarker key={`marker-${s.id}`} pose={s.car} active={active === s.id} reduce={reduce} />
      ))}
    </motion.svg>
  )
}
