import { motion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import type { HeroDimensions as HeroDimensionsData } from './detailTypes.ts'
import styles from './HeroStage.module.css'

type Coord = number | string

type LineProps = {
  x1: Coord
  y1: Coord
  x2: Coord
  y2: Coord
  className: string
  reduce: boolean
  delay: number
  duration?: number
}

function Stroke({ reduce, delay, duration = 0.8, ...line }: LineProps) {
  return (
    <motion.line
      {...line}
      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: { duration, delay, ease: revealEase }, opacity: { duration: 0.15, delay } }}
    />
  )
}

function Extension({ reduce, delay, ...line }: Omit<LineProps, 'duration'>) {
  return (
    <motion.line
      {...line}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay, ease: revealEase }}
    />
  )
}

const H_LINE = -26
const W_LINE = -22
const TICK = 7
const pct = (value: number) => `${value}%`

type HeroDimensionsProps = {
  dimensions: HeroDimensionsData
  reduce: boolean

  delay?: number
}

export default function HeroDimensions({ dimensions, reduce, delay = 1.25 }: HeroDimensionsProps) {
  const { height, width } = dimensions
  const base = delay
  const s = { reduce }

  return (
    <>
      <svg className={styles.dims} aria-hidden="true" focusable="false">
        <Extension {...s} className={styles.extension} x1={H_LINE + TICK} y1={pct(height.span.from)} x2={pct(height.edges[0])} y2={pct(height.span.from)} delay={base} />
        <Extension {...s} className={styles.extension} x1={H_LINE + TICK} y1={pct(height.span.to)} x2={pct(height.edges[1])} y2={pct(height.span.to)} delay={base} />
        <Stroke {...s} className={styles.tick} x1={H_LINE - TICK} y1={pct(height.span.from)} x2={H_LINE + TICK} y2={pct(height.span.from)} delay={base + 0.1} duration={0.3} />
        <Stroke {...s} className={styles.line} x1={H_LINE} y1={pct(height.span.to)} x2={H_LINE} y2={pct(height.span.from)} delay={base + 0.15} duration={1} />
        <Stroke {...s} className={styles.tick} x1={H_LINE - TICK} y1={pct(height.span.to)} x2={H_LINE + TICK} y2={pct(height.span.to)} delay={base + 0.1} duration={0.3} />

        {width ? (
          <>
            <Extension {...s} className={styles.extension} x1={pct(width.span.from)} y1={W_LINE + TICK} x2={pct(width.span.from)} y2={pct(width.edges[0])} delay={base + 0.55} />
            <Extension {...s} className={styles.extension} x1={pct(width.span.to)} y1={W_LINE + TICK} x2={pct(width.span.to)} y2={pct(width.edges[1])} delay={base + 0.55} />
            <Stroke {...s} className={styles.tick} x1={pct(width.span.from)} y1={W_LINE - TICK} x2={pct(width.span.from)} y2={W_LINE + TICK} delay={base + 0.6} duration={0.3} />
            <Stroke {...s} className={styles.line} x1={pct(width.span.from)} y1={W_LINE} x2={pct(width.span.to)} y2={W_LINE} delay={base + 0.65} duration={0.7} />
            <Stroke {...s} className={styles.tick} x1={pct(width.span.to)} y1={W_LINE - TICK} x2={pct(width.span.to)} y2={W_LINE + TICK} delay={base + 0.6} duration={0.3} />
          </>
        ) : null}
      </svg>

      <motion.span
        className={styles.labelHeight}
        style={{ top: pct((height.span.from + height.span.to) / 2) }}
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: base + 0.9, ease: revealEase }}
      >
        {height.label}
      </motion.span>
      {width ? (
        <motion.span
          className={styles.labelWidth}
          style={{ left: pct((width.span.from + width.span.to) / 2) }}
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: base + 1.2, ease: revealEase }}
        >
          {width.label}
        </motion.span>
      ) : null}
    </>
  )
}
