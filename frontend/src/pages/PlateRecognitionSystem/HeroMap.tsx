import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { prsCopy } from './prsCopy.ts'
import styles from './HeroMap.module.css'

const cameras: [number, number][] = [
  [17.6, 63.4],
  [19.15, 82.4],
  [25.35, 10.6],
  [25.75, 49.6],
  [25.75, 54],
  [25.7, 83.2],
  [28.6, 10.6],
  [30.25, 93.9],
  [44.1, 10.6],
  [45.5, 82.4],
  [54.55, 23.7],
  [54.95, 27.7],
  [56.2, 10.6],
  [57.8, 72.9],
  [58.95, 10.6],
]

const corners = ['M0 26V0h32', 'M147 0h32v26', 'M179 55v26h-32', 'M32 81H0V55']

const base = '/img/pages/plaka-tanima-canli-harita'

export default function HeroMap() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const run = !reduce && inView
  const { map } = prsCopy

  return (
    <div ref={ref} className={styles.root}>
      {}
      <MediaFrame caption={map.caption} chips={[{ label: map.chip, tone: 'navy' }]} mode="screenshot" amount={0.2}>
        <div className={styles.stage}>
          <Picture
            src={`${base}-1600.webp`}
            avif={`${base}-960.avif 960w, ${base}-1600.avif 1600w`}
            webp={`${base}-960.webp 960w, ${base}-1600.webp 1600w`}
            sizes="(min-width: 1280px) 40rem, (min-width: 1024px) 48vw, 100vw"
            width={1600}
            height={762}
            alt={map.alt}
            loading="eager"
            fetchPriority="high"
          />
          <div className={styles.overlay} aria-hidden="true">
            {cameras.map(([x, y], index) => (
              <span key={`${x}-${y}`} className={styles.cam} style={{ left: `${x}%`, top: `${y}%` }}>
                {reduce ? null : (
                  <motion.span
                    className={styles.wave}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={run ? { opacity: [0, 0.9, 0], scale: [0.3, 1.9] } : undefined}
                    transition={{ duration: 1.2, delay: 1 + index * 0.06, ease: 'easeOut' }}
                  />
                )}
                <motion.span
                  className={styles.ring}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={run ? { opacity: 0.75, scale: 1 } : undefined}
                  transition={{ duration: 0.6, delay: 1.35 + index * 0.06, ease: revealEase }}
                />
              </span>
            ))}
            <div className={styles.lock}>
              <svg viewBox="0 0 179 81" preserveAspectRatio="none">
                {corners.map((d, index) => (
                  <motion.path
                    key={d}
                    d={d}
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={run ? { pathLength: 1 } : undefined}
                    transition={{ duration: 0.5, delay: 2.2 + index * 0.08, ease: revealEase }}
                  />
                ))}
              </svg>
              {reduce ? null : (
                <motion.span
                  className={styles.scan}
                  initial={{ x: '0%', opacity: 0 }}
                  animate={run ? { x: ['0%', '100%'], opacity: [0, 1, 1, 0] } : undefined}
                  transition={{ duration: 0.9, delay: 2.7, ease: 'easeInOut' }}
                />
              )}
            </div>
          </div>
        </div>
      </MediaFrame>
    </div>
  )
}
