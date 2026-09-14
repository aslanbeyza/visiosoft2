import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Badge from '../../components/Badge/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import styles from './StatusBoard.module.css'

type Row = { device: string; status: string }

type Props = {
  title: string
  note: string
  camera: string
  pause: string
  play: string
  rows: Row[]
}

const boardVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.5 } } }
const drawVariants: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 1.2, ease: revealEase } },
}
const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, delay: 0.9, ease: revealEase } },
}
const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: revealEase } },
}
const sweepVariants: Variants = {
  hidden: { scaleX: 0, opacity: 1 },
  show: { scaleX: [0, 1, 1], opacity: [1, 1, 0], transition: { duration: 1.1, times: [0, 0.55, 1], ease: 'easeOut' } },
}

/** Nötr izleme ekranı: sayı, plaka veya tutar içermez; kamera karesi çizilir, cihaz satırları süpürülerek gelir. */
export default function StatusBoard({ title, note, camera, pause, play, rows }: Props) {
  const reduce = Boolean(useReducedMotion())
  const visible = usePageVisible()
  const ref = useRef<HTMLDivElement>(null)
  const entered = useInView(ref, { once: true, amount: 0.3 })
  const inView = useInView(ref, { amount: 0.15 })
  const [paused, setPaused] = useState(false)
  const running = inView && visible && !paused && !reduce

  return (
    <motion.div
      ref={ref}
      className={styles.board}
      role="group"
      aria-label={`${title} (${note})`}
      data-running={running}
      variants={boardVariants}
      initial={reduce ? false : 'hidden'}
      animate={reduce || entered ? 'show' : 'hidden'}
    >
      <div className={styles.head}>
        <p className={styles.title}>{title}</p>
        <Badge tone="light">{note}</Badge>
        {reduce ? null : (
          <button type="button" className={styles.toggle} aria-label={paused ? play : pause} onClick={() => setPaused((v) => !v)}>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              {paused ? <path d="M5 3.5v9l7-4.5z" /> : <path d="M4.5 3.5h2.5v9H4.5zM9 3.5h2.5v9H9z" />}
            </svg>
          </button>
        )}
      </div>

      <div className={styles.camera}>
        <svg className={styles.scene} viewBox="0 0 320 180" fill="none" aria-hidden="true" focusable="false">
          <motion.path d="M96 180L150 44M244 180L186 44" className={styles.edge} variants={drawVariants} />
          <motion.path d="M170 180L168 44" className={styles.centre} variants={drawVariants} />
          <motion.path d="M118 118H236" className={styles.arm} variants={drawVariants} />
          <motion.g variants={fadeVariants}>
            <circle cx="238" cy="118" r="4" className={styles.post} />
            <rect x="252" y="94" width="10" height="24" rx="2" className={styles.kiosk} />
            <path d="M296 24L140 130L222 150Z" className={styles.cone} />
            <rect x="288" y="16" width="18" height="10" rx="2" className={styles.post} />
            <rect x="146" y="132" width="48" height="30" rx="7" className={styles.car} />
            <rect x="160" y="148" width="20" height="7" rx="1.5" className={styles.plate} />
          </motion.g>
        </svg>
        <span className={styles.scan} aria-hidden="true" />
        <p className={styles.cameraLabel}>{camera}</p>
      </div>

      <ul className={styles.rows}>
        {rows.map((row, index) => (
          <motion.li key={row.device} className={styles.row} variants={rowVariants} style={{ '--i': index } as CSSProperties}>
            <motion.span className={styles.sweep} aria-hidden="true" variants={sweepVariants} />
            <span className={styles.device}>{row.device}</span>
            <span className={styles.status}>
              <span className={styles.dot} aria-hidden="true" />
              {row.status}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
