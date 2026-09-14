import { motion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { SCENE } from './routeTimeline.ts'
import styles from './RouteScene.module.css'

type RouteMarksProps = {
  variant: 'quote' | 'discovery'
  run: boolean
  reduce: boolean
  arrivals: number[]
}

const MARK_Y = 34
const { bay, roadTop, stops } = SCENE
const g = 9 // köşe işaretinin yolu çevreleyen boşluğu
const c = 16 // köşe kolu uzunluğu
const bx0 = bay.x - g
const by0 = bay.y - g
const bx1 = bay.x + bay.w + g
const by1 = bay.y + bay.h + g
const corners = [
  `M${bx0} ${by0 + c}V${by0}H${bx0 + c}`,
  `M${bx1 - c} ${by0}H${bx1}V${by0 + c}`,
  `M${bx1} ${by1 - c}V${by1}H${bx1 - c}`,
  `M${bx0 + c} ${by1}H${bx0}V${by1 - c}`,
].join('')

const ICONS = {
  // Teklif dosyası: kıvrık köşeli sayfa + onay
  quote: ['M-7-10h9l5 5v15h-14Z', 'M-3.5 2.5l2.6 2.6 5-5.2'],
  // Keşif: konum işareti
  discovery: ['M0 11c-6.5-6-8.5-9.5-8.5-13.5a8.5 8.5 0 0 1 17 0c0 4-2 7.5-8.5 13.5Z', 'M0-5.2a2.6 2.6 0 1 0 0 5.2a2.6 2.6 0 1 0 0-5.2'],
} as const

/** Kilometre taşları, bitiş işareti, park yeri köşeleri ve (keşifte) ölçü çizgisi. */
export default function RouteMarks({ variant, run, reduce, arrivals }: RouteMarksProps) {
  const ink = (delay: number, duration = 0.8) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: run ? { pathLength: 1 } : undefined,
    transition: { duration, delay, ease: revealEase },
  })
  const pop = (delay: number) => ({
    initial: reduce ? false : { scale: 0, opacity: 0 },
    animate: run ? { scale: 1, opacity: 1 } : undefined,
    transition: { duration: 0.5, delay, ease: revealEase },
  })
  const end = arrivals[arrivals.length - 1] ?? 0

  return (
    <>
      {stops.map((stop, index) => {
        const last = index === stops.length - 1
        return (
          <g key={stop} transform={`translate(${stop} ${MARK_Y})`}>
            <motion.path className={styles.stem} d={`M0 ${last ? 18 : 12}V${roadTop - MARK_Y}`} {...ink(0.7 + index * 0.08, 0.5)} />
            <motion.circle className={last ? styles.ringEnd : styles.ring} r={last ? 17 : 11} {...ink(0.75 + index * 0.1, 0.7)} />
            {last ? null : <motion.circle className={styles.dot} r={5} {...pop(arrivals[index] ?? 0)} />}
          </g>
        )
      })}

      <g transform={`translate(${stops[stops.length - 1]} ${MARK_Y})`}>
        <motion.circle className={styles.halo} r={17} {...pop(end)} />
        {ICONS[variant].map((d, index) => (
          <motion.path key={d} className={styles.icon} d={d} {...ink(end + 0.15 + index * 0.25, 0.6)} />
        ))}
      </g>

      <motion.path className={styles.corner} d={corners} {...ink(end + 0.2, 0.7)} />

      {variant === 'discovery' ? (
        <g className={styles.measure}>
          <motion.path d={`M${bay.x} ${by1 + 14}H${bay.x + bay.w}`} {...ink(end + 0.45, 0.7)} />
          <motion.path d={`M${bay.x} ${by1 + 8}v12M${bay.x + bay.w} ${by1 + 8}v12`} {...ink(end + 0.4, 0.4)} />
        </g>
      ) : null}
    </>
  )
}
