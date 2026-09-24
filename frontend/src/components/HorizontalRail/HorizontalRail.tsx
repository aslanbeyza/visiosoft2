import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, ReactNode } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import styles from './HorizontalRail.module.css'

export type HorizontalRailProps = {
  panels: ReactNode[]

  label?: string
  className?: string

  panelWidth?: string

  showProgress?: boolean
}

const pad = (value: number) => String(value).padStart(2, '0')

export default function HorizontalRail({ panels, label, className = '', panelWidth, showProgress = true }: HorizontalRailProps) {
  const reduce = Boolean(useReducedMotion())
  const wide = useMediaQuery('(min-width: 1024px)')
  const pinned = wide && !reduce && panels.length > 1

  const rootRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const count = panels.length

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end end'] })
  const maxShift = useMotionValue(0)
  const x = useTransform(() => -scrollYProgress.get() * maxShift.get())

  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(count - 1, Math.max(0, Math.round(value * (count - 1))))
    if (next !== activeRef.current) {
      activeRef.current = next
      setActive(next)
    }
  })

  useLayoutEffect(() => {
    if (!pinned) return
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const measure = () => maxShift.set(Math.max(0, track.scrollWidth - viewport.clientWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(track)
    return () => observer.disconnect()
  }, [pinned, maxShift, count])

  const onTrackFocus = useCallback(
    (event: FocusEvent<HTMLOListElement>) => {
      const root = rootRef.current
      if (!root || !pinned) return
      const panel = (event.target as HTMLElement).closest<HTMLElement>('[data-panel]')
      if (!panel) return
      const index = Number(panel.dataset.panel)
      if (Number.isNaN(index) || index === activeRef.current) return
      const top = root.getBoundingClientRect().top + window.scrollY
      const distance = root.offsetHeight - window.innerHeight
      window.scrollTo({ top: top + (distance * index) / Math.max(1, count - 1), behavior: 'smooth' })
    },
    [count, pinned],
  )

  const style = {
    '--rail-count': count,
    ...(panelWidth ? { '--rail-panel': panelWidth } : {}),
  } as CSSProperties

  if (!pinned) {
    return (
      <section ref={rootRef} className={`${styles.root} ${className}`.trim()} data-pinned="false" aria-label={label} style={style}>
        <ol className={styles.stack}>
          {panels.map((panel, index) => (

            <li key={index} className={styles.stackPanel} data-panel={index}>
              {panel}
            </li>
          ))}
        </ol>
      </section>
    )
  }

  return (
    <section ref={rootRef} className={`${styles.root} ${className}`.trim()} data-pinned="true" aria-label={label} style={style}>
      <div ref={viewportRef} className={styles.viewport}>
        <motion.ol ref={trackRef} className={styles.track} style={{ x }} onFocus={onTrackFocus}>
          {panels.map((panel, index) => (
            <li key={index} className={styles.panel} data-panel={index} data-active={index === active}>
              {panel}
            </li>
          ))}
        </motion.ol>

        {showProgress ? (
          <div className={styles.hud} aria-hidden="true">
            <span className={styles.counter}>
              {pad(active + 1)} / {pad(count)}
            </span>
            <span className={styles.progressTrack}>
              <motion.span className={styles.progressFill} style={{ scaleX: scrollYProgress }} />
            </span>
          </div>
        ) : null}
      </div>
    </section>
  )
}
