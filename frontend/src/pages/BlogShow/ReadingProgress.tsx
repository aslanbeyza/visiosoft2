import type { RefObject } from 'react'
import { motion, useReducedMotion, useScroll } from 'framer-motion'
import styles from './ReadingProgress.module.css'

export default function ReadingProgress({ target }: { target: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] })

  if (reduce) return null

  return <motion.span className={styles.progress} style={{ scaleX: scrollYProgress }} aria-hidden="true" />
}
