import { useEffect, useId, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import Section from '../../components/Section/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import type { KeyFigure } from './detailTypes.ts'
import styles from './KeyFigures.module.css'

type KeyFiguresProps = {
  label: string
  items: KeyFigure[]
  drawingLink?: string
  drawingId?: string
}

const formatNumber = (value: number, decimals: number) =>
  value.toLocaleString('tr-TR', {
    useGrouping: false,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

/** Gerçek ölçüler ve ödeme kanalları; sayılar görünür olunca sayarak yerine oturur. */
export default function KeyFigures({ label, items, drawingLink, drawingId }: KeyFiguresProps) {
  const titleId = useId()

  return (
    <Section tone="paper" spacing="md" labelledBy={titleId} className={styles.section}>
      <div className={styles.header}>
        <h2 id={titleId} className={styles.label}>
          {label}
        </h2>
        {drawingLink && drawingId ? (
          <a className={styles.link} href={`#${drawingId}`}>
            {drawingLink}
            <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        ) : null}
      </div>

      <dl className={styles.grid}>
        {items.map((item, index) => (
          <Figure key={item.id} item={item} index={index} />
        ))}
      </dl>
    </Section>
  )
}

function Figure({ item, index }: { item: KeyFigure; index: number }) {
  const reduce = Boolean(useReducedMotion())
  const delay = index * 0.1

  return (
    <motion.div
      className={styles.figure}
      data-kind={item.value === undefined ? 'text' : 'number'}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay, ease: revealEase }}
    >
      <motion.span
        className={styles.hairline}
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, delay: delay + 0.15, ease: revealEase }}
      />
      <dt className={styles.name}>{item.label}</dt>
      <dd className={styles.value}>
        {item.value === undefined ? (
          <>
            <span aria-hidden="true">{item.text}</span>
            <span className={styles.srOnly}>{item.srText ?? item.text}</span>
          </>
        ) : (
          <Counter value={item.value} decimals={item.decimals ?? 0} unit={item.unit} delay={delay} />
        )}
      </dd>
    </motion.div>
  )
}

function Counter({ value, decimals, unit, delay }: { value: number; decimals: number; unit?: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = Boolean(useReducedMotion())
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const count = useMotionValue(reduce ? value : 0)
  const display = useTransform(count, (latest) => formatNumber(latest, decimals))
  const finalText = formatNumber(value, decimals)

  useEffect(() => {
    if (reduce) {
      count.set(value)
      return
    }
    if (!inView) return
    const controls = animate(count, value, { duration: 1.6, delay: delay + 0.2, ease: revealEase })
    return () => controls.stop()
  }, [count, delay, inView, reduce, value])

  return (
    <>
      <span ref={ref} className={styles.number} aria-hidden="true">
        <motion.span>{display}</motion.span>
        {unit ? <span className={styles.unit}>{unit}</span> : null}
      </span>
      <span className={styles.srOnly}>
        {finalText}
        {unit ? ` ${unit}` : ''}
      </span>
    </>
  )
}
