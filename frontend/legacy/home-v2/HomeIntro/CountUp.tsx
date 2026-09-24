import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import styles from './HomeIntro.module.css'

type CountUpProps = {
  value: number

  from?: number

  grouping?: boolean
  className?: string
}

const format = (value: number, grouping: boolean) =>
  Math.round(value).toLocaleString('tr-TR', { useGrouping: grouping })

export default function CountUp({ value, from = 0, grouping = true, className }: CountUpProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const count = useMotionValue(reduce ? value : from)
  const display = useTransform(count, (latest) => format(latest, grouping))

  useEffect(() => {
    if (reduce) {
      count.set(value)
      return
    }
    if (!inView) return
    const controls = animate(count, value, { duration: 1.6, ease: revealEase })
    return () => controls.stop()
  }, [count, inView, reduce, value])

  return (
    <span ref={ref} className={className}>
      <span className={styles.srOnly}>{format(value, grouping)}</span>
      <motion.span aria-hidden="true">{display}</motion.span>
    </span>
  )
}
