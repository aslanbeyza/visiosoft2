import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { pricingCopy } from './pricingCopy.ts'
import {
  SITE_VIEW, branches, bus, carSilhouettes, cloud, deviceLinks, labelPoints, laptop, levels, limitMark, outline, phone, slabs, wheels, windows,
} from './siteShapes.ts'
import styles from './SiteDiagram.module.css'

const copy = pricingCopy.diagram

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number = 0) => ({ pathLength: 1, opacity: 1, transition: { pathLength: { duration: 1.2, delay: d, ease: revealEase }, opacity: { duration: 0.2, delay: d } } }),
}
const fade: Variants = { hidden: { opacity: 0 }, show: (d: number = 0) => ({ opacity: 1, transition: { duration: 0.7, delay: d } }) }
const grow: Variants = { hidden: { scaleX: 0 }, show: (d: number = 0) => ({ scaleX: 1, transition: { duration: 1.2, delay: d, ease: revealEase } }) }
const drop: Variants = { hidden: { opacity: 0, y: -10 }, show: (d: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: revealEase } }) }

const pulse: Variants = {
  hidden: { opacity: 0, y: 0 },
  show: (d: number = 0) => ({ opacity: [0, 1, 1, 0], y: [0, -60, -300, -314], transition: { duration: 1.6, delay: d, times: [0, 0.12, 0.88, 1], ease: 'easeInOut' } }),
}

const pct = (x: number, y: number): CSSProperties => ({ left: `${(x / SITE_VIEW.w) * 100}%`, top: `${(y / SITE_VIEW.h) * 100}%` })

export default function SiteDiagram() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const v = (variants: Variants) => (reduce ? undefined : variants)

  return (
    <div ref={ref} className={styles.wrap}>
      <motion.svg viewBox={`0 0 ${SITE_VIEW.w} ${SITE_VIEW.h}`} className={styles.svg} role="img" aria-label={copy.label} initial={reduce ? false : 'hidden'} animate={inView || reduce ? 'show' : 'hidden'}>
        <motion.path className={styles.slabFill} d={slabs[0]} variants={v(fade)} custom={0.5} />
        {outline.map((d, i) => <motion.path key={d} className={styles.ink} d={d} variants={v(draw)} custom={0.15 + i * 0.12} />)}
        {slabs.map((d, i) => <motion.path key={d} className={styles.ink} d={d} variants={v(draw)} custom={0.45 + i * 0.15} />)}
        <motion.path className={styles.windows} d={windows} variants={v(fade)} custom={0.9} />

        {levels.map((level, i) => {
          const base = 1.05 + i * 0.18
          return (
            <g key={level.key}>
              <motion.g variants={v(fade)} custom={base}>
                <path className={styles.car} d={carSilhouettes(level.cars, level.floorY)} />
                <path className={styles.wheel} d={wheels(level.cars, level.floorY)} />
                <path className={styles.track} d={`M${level.track.x} ${level.track.y}h${level.track.w}`} />
              </motion.g>
              <motion.path className={styles.fill} d={`M${level.track.x} ${level.track.y}h${level.track.w * level.fill}`} style={{ originX: 0 }} variants={v(grow)} custom={base + 0.25} />
              <motion.path className={styles.limit} d={limitMark(level)} variants={v(drop)} custom={base + 0.7} />
            </g>
          )
        })}

        <motion.path className={styles.link} d={bus} variants={v(draw)} custom={1.7} />
        {branches.map((d, i) => <motion.path key={d} className={styles.link} d={d} variants={v(draw)} custom={1.6 + i * 0.08} />)}
        <motion.path className={styles.cloud} d={cloud} variants={v(draw)} custom={2.1} />
        {deviceLinks.map((d) => <motion.path key={d} className={styles.link} d={d} variants={v(draw)} custom={2.4} />)}
        <motion.path className={styles.device} d={laptop} variants={v(draw)} custom={2.5} />
        <motion.path className={styles.device} d={phone} variants={v(draw)} custom={2.6} />
        {reduce ? null : [0, 1, 2].map((i) => <motion.circle key={i} className={styles.dot} cx="548" cy="374" r="3.5" variants={pulse} custom={2.6 + i * 0.35} />)}
      </motion.svg>

      <motion.div className={styles.labels} aria-hidden="true" initial={reduce ? false : 'hidden'} animate={inView || reduce ? 'show' : 'hidden'}>
        {levels.map((level, i) => (
          <motion.span key={level.key} className={styles.label} style={pct(level.label.x, level.label.y)} variants={v(drop)} custom={1.1 + i * 0.18}>
            {copy.floors[i]}
          </motion.span>
        ))}
        <motion.span className={`${styles.label} ${styles.strong}`} style={pct(labelPoints.cloud.x, labelPoints.cloud.y)} variants={v(drop)} custom={2.3}>
          {copy.cloud}
        </motion.span>
        <motion.span className={styles.label} style={pct(labelPoints.devices.x, labelPoints.devices.y)} variants={v(drop)} custom={2.7}>
          {copy.devices}
        </motion.span>
      </motion.div>
    </div>
  )
}
