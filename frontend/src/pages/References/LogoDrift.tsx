import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import styles from './LogoDrift.module.css'

type DriftLogo = { file: string; url: string }

type LogoDriftProps = {
  logos: DriftLogo[]
  toggleLabel: string
}

export default function LogoDrift({ logos, toggleLabel }: LogoDriftProps) {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.1 })
  const visible = usePageVisible()
  const [paused, setPaused] = useState(false)

  const columns = [0, 1, 2].map((column) => logos.filter((_, index) => index % 3 === column))
  const copies = reduce ? [0] : [0, 1]
  const play = !reduce && !paused && inView && visible

  return (
    <div ref={rootRef} className={styles.root} data-play={play}>
      <div className={styles.columns} aria-hidden="true">
        {columns.map((column, columnIndex) => (
          <motion.div
            key={columnIndex}
            className={styles.column}
            data-dir={columnIndex === 1 ? 'down' : 'up'}
            initial={reduce ? false : { opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35 + columnIndex * 0.12, ease: revealEase }}
          >
            <div className={styles.track} style={{ '--duration': `${54 + columnIndex * 8}s` } as CSSProperties}>
              {copies.map((copy) =>
                column.map((logo) => (
                  <span key={`${copy}-${logo.file}`} className={styles.tile}>
                    <img src={logo.url} alt="" width={150} height={100} loading={copy === 0 ? 'eager' : 'lazy'} decoding="async" />
                  </span>
                )),
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {reduce ? null : (
        <button
          type="button"
          className={styles.toggle}
          aria-pressed={paused}
          aria-label={toggleLabel}
          title={toggleLabel}
          onClick={() => setPaused((value) => !value)}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            {paused ? <path d="M5 3.5v9l7-4.5z" /> : <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" />}
          </svg>
        </button>
      )}
    </div>
  )
}
