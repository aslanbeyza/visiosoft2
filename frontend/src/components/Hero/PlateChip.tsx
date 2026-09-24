import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../Reveal/motion.ts'
import styles from './StatusParts.module.css'

type PlateChipProps = {
  plate: string
  band: string

  active: boolean

  reduce: boolean
}

const off = { duration: 0, delay: 0.35 }

const root: Variants = {
  off: { opacity: 0, transition: off },
  on: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.035, delayChildren: 0.12 } },
}

const band: Variants = {
  off: { clipPath: 'inset(0 100% 0 0)', transition: off },
  on: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.5, ease: revealEase } },
}

const char: Variants = {
  off: { opacity: 0, y: 5, transition: off },
  on: { opacity: 1, y: 0, transition: { duration: 0.35, ease: revealEase } },
}

export default function PlateChip({ plate, band: bandLabel, active, reduce }: PlateChipProps) {
  const state = active ? 'on' : 'off'

  return (
    <motion.span className={styles.plate} initial={reduce ? false : 'off'} animate={state} variants={root}>
      <motion.span className={styles.band} variants={band}>
        {bandLabel}
      </motion.span>
      <span className={styles.chars}>
        {Array.from(plate).map((glyph, index) =>
          glyph === ' ' ? (
            <span key={index} className={styles.gap} />
          ) : (
            <motion.span key={index} className={styles.char} variants={char}>
              {glyph}
            </motion.span>
          ),
        )}
      </span>
    </motion.span>
  )
}
