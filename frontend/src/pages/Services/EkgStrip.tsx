import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import styles from './EkgStrip.module.css'

const BASE = 96
const BEAT_X = [150, 450, 750, 1050]
const WIDTH = 1200
const DURATION = 5.6

const TRACE_END = 0.72

const beat = (cx: number) =>
  `L${cx - 70} ${BASE} Q${cx - 58} ${BASE - 14} ${cx - 46} ${BASE} L${cx - 16} ${BASE} L${cx - 8} ${BASE + 12} ` +
  `L${cx} ${BASE - 70} L${cx + 9} ${BASE + 26} L${cx + 17} ${BASE} L${cx + 44} ${BASE} Q${cx + 62} ${BASE - 20} ${cx + 80} ${BASE}`

const PATH = `M0 ${BASE} ${BEAT_X.map(beat).join(' ')} L${WIDTH} ${BASE}`

type Beat = { id: string; label: string }

type Props = {
  beats: Beat[]
  label: string
  pauseLabel: string
  playLabel: string
}

function Trace({ className }: { className: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${WIDTH} 160`} preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
      <path d={PATH} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function EkgStrip({ beats, label, pauseLabel, playLabel }: Props) {
  const reduce = Boolean(useReducedMotion())
  const visible = usePageVisible()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const [paused, setPaused] = useState(false)
  const running = inView && visible && !paused && !reduce

  return (
    <div
      ref={ref}
      className={styles.root}
      data-running={running}
      data-reduce={reduce}
      style={{ '--dur': `${DURATION}s` } as CSSProperties}
    >
      <div className={styles.strip}>
        <Trace className={styles.base} />
        <div className={styles.bright}>
          <Trace className={styles.brightSvg} />
        </div>
        <span className={styles.head} aria-hidden="true" />
        {reduce ? null : (
          <button
            type="button"
            className={styles.toggle}
            aria-label={paused ? playLabel : pauseLabel}
            onClick={() => setPaused((value) => !value)}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              {paused ? <path d="M5 3.5v9l7-4.5z" /> : <path d="M4.5 3.5h2.5v9H4.5zM9 3.5h2.5v9H9z" />}
            </svg>
          </button>
        )}
      </div>

      <nav className={styles.beats} aria-label={label}>
        <ul>
          {beats.map((item, index) => {
            const fraction = BEAT_X[index % BEAT_X.length] / WIDTH
            const style = {
              '--x': `${fraction * 100}%`,
              '--delay': `${Math.max(0, fraction * TRACE_END * DURATION - 0.2).toFixed(2)}s`,
            } as CSSProperties
            return (
              <li key={item.id} className={styles.beat} style={style}>
                <a href={`#${item.id}`} className={styles.link}>
                  <span className={styles.marker} aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
