/**
 * Kullanım:
 *   <CountUp value={1800} suffix=" mm" />          → "1800 mm"
 *   <CountUp value={297.5} decimals={1} suffix=" mm" /> → "297,5 mm"
 *   <CountUp value={6500000} suffix="+" />        → "6.500.000+"
 * Görünüme girince bir kez sayar (tr-TR biçimi, tabular rakamlar); değer React state'i yerine motion value ile
 * güncellenir. Son değer ekran okuyucu için ayrı basılır; hareket azaltmada doğrudan son değer görünür.
 * Binlik ayırıcı varsayılan olarak 10.000 ve üzeri sayılarda kullanılır (yıl ve mm ölçüleri "2018", "1800" kalır).
 */
import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { formatCount } from './format.ts'
import styles from './CountUp.module.css'

export type CountUpProps = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  /** Süre (s). */
  duration?: number
  className?: string
  /** Sayacın başladığı değer. */
  from?: number
  /** Binlik ayırıcı; varsayılan |value| ≥ 10.000 için açık. */
  grouping?: boolean
  /** Gecikme (s). */
  delay?: number
}

export default function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
  className = '',
  from = 0,
  grouping,
  delay = 0,
}: CountUpProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const useGrouping = grouping ?? Math.abs(value) >= 10000
  const count = useMotionValue(reduce ? value : from)
  const display = useTransform(count, (latest) => formatCount(latest, decimals, useGrouping))
  const finalText = formatCount(value, decimals, useGrouping)

  useEffect(() => {
    if (reduce) {
      count.set(value)
      return
    }
    if (!inView) return
    const controls = animate(count, value, { duration, delay, ease: revealEase })
    return () => controls.stop()
  }, [count, delay, duration, inView, reduce, value])

  if (reduce) {
    return (
      <span className={`${styles.root} ${className}`.trim()}>
        {prefix ? <span data-part="prefix">{prefix}</span> : null}
        <span data-part="number" className={styles.number}>
          {finalText}
        </span>
        {suffix ? <span data-part="suffix">{suffix}</span> : null}
      </span>
    )
  }

  return (
    <span ref={ref} className={`${styles.root} ${className}`.trim()}>
      <span className={styles.srOnly}>
        {prefix}
        {finalText}
        {suffix}
      </span>
      <span aria-hidden="true" className={styles.visual}>
        {prefix ? <span data-part="prefix">{prefix}</span> : null}
        <motion.span data-part="number" className={styles.number}>
          {display}
        </motion.span>
        {suffix ? <span data-part="suffix">{suffix}</span> : null}
      </span>
    </span>
  )
}
