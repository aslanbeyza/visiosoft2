import type { RefObject } from 'react'
import { motion, useReducedMotion, useScroll } from 'framer-motion'
import styles from './ReadingProgress.module.css'

/**
 * Sayfanın en üstünde, yazı boyunca ilerleyen ince lacivert okuma çizgisi (scaleX, kaydırmaya bağlı).
 * Dekoratiftir; hareket azaltıldığında hiç çizilmez.
 */
export default function ReadingProgress({ target }: { target: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] })

  if (reduce) return null

  return <motion.span className={styles.progress} style={{ scaleX: scrollYProgress }} aria-hidden="true" />
}
