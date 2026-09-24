
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import CountUp from '../CountUp/index.ts'
import { revealEase } from '../Reveal/index.ts'
import styles from './StatRow.module.css'

export type StatItem = {
  value: number | string
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  note?: string

  grouping?: boolean

  from?: number
}

export type StatRowProps = {
  items: StatItem[]
  columns?: 2 | 3 | 4
  tone?: 'light' | 'dark'
  className?: string

  label?: string
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
}

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1, delay: 0.15, ease: revealEase } },
}

export default function StatRow({ items, columns = 4, tone = 'light', className = '', label }: StatRowProps) {
  const reduce = Boolean(useReducedMotion())

  return (
    <motion.dl
      className={`${styles.grid} ${className}`.trim()}
      data-columns={columns}
      data-tone={tone}
      aria-label={label}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={listVariants}
    >
      {items.map((item, index) => {
        const numeric = typeof item.value === 'number'
        return (
          <motion.div key={`${index}-${item.label}`} className={styles.stat} data-kind={numeric ? 'number' : 'text'} variants={itemVariants}>
            <motion.span className={styles.hairline} aria-hidden="true" variants={lineVariants} />
            <dt className={styles.label}>{item.label}</dt>
            <dd className={styles.value}>
              {typeof item.value === 'number' ? (
                <CountUp
                  value={item.value}
                  decimals={item.decimals}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  grouping={item.grouping}
                  from={item.from}
                  delay={index * 0.1 + 0.2}
                  className={styles.count}
                />
              ) : (
                <span className={styles.text}>
                  {item.prefix}
                  {item.value}
                  {item.suffix}
                </span>
              )}
            </dd>
            {item.note ? <dd className={styles.note}>{item.note}</dd> : null}
          </motion.div>
        )
      })}
    </motion.dl>
  )
}
