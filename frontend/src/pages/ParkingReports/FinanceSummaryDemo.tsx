import { useId, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import CountUp from '../../components/CountUp/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import {
  financeDemoCopy as copy,
  financeSnapshots,
  type FinancePeriod,
  type FinanceSnapshot,
} from './financeDemoCopy.ts'
import styles from './FinanceSummaryDemo.module.css'

function rateLabel(n: number) {
  return `%${n} ORAN`
}

function trendPath(values: number[], width: number, height: number, pad = 8) {
  if (values.length < 2) return ''
  const max = Math.max(...values, 0.01)
  const step = (width - pad * 2) / (values.length - 1)
  return values
    .map((value, index) => {
      const x = pad + index * step
      const y = height - pad - (value / max) * (height - pad * 2)
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

function TrendChart({ snapshot, reduce }: { snapshot: FinanceSnapshot; reduce: boolean }) {
  const width = 360
  const height = 120
  const d = useMemo(() => trendPath(snapshot.trend, width, height), [snapshot.trend])
  const area = `${d} L${width - 8} ${height - 8} L8 ${height - 8} Z`

  return (
    <div className={styles.chart}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg} role="img" aria-label={copy.cards.trend.title}>
        {[0.25, 0.5, 0.75].map((line) => (
          <line
            key={line}
            x1="8"
            x2={width - 8}
            y1={height - 8 - line * (height - 16)}
            y2={height - 8 - line * (height - 16)}
            className={styles.gridLine}
          />
        ))}
        <motion.path
          d={area}
          className={styles.chartArea}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: revealEase }}
        />
        <motion.path
          d={d}
          className={styles.chartLine}
          fill="none"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: revealEase }}
        />
      </svg>
      <div className={styles.chartLabels} aria-hidden="true">
        {snapshot.trendLabels.filter((_, i) => i % Math.ceil(snapshot.trendLabels.length / 4) === 0 || i === snapshot.trendLabels.length - 1).map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}

export default function FinanceSummaryDemo({ className = '' }: { className?: string }) {
  const reduce = Boolean(useReducedMotion())
  const baseId = useId()
  const [period, setPeriod] = useState<FinancePeriod>('daily')
  const snapshot = financeSnapshots[period]

  return (
    <figure className={`${styles.root} ${className}`.trim()}>
      <figcaption className={styles.chrome}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.caption}>{copy.caption}</span>
      </figcaption>

      <div className={styles.app} role="region" aria-label={copy.ariaLabel}>
        <aside className={styles.side} aria-hidden="true">
          <p className={styles.brand}>{copy.brand}</p>
          <p className={styles.park}>{copy.park}</p>
          <span className={styles.sideActive}>{copy.navActive}</span>
        </aside>

        <div className={styles.main}>
          <div className={styles.filters} role="tablist" aria-label={copy.periodsLabel}>
            {copy.periods.map((item) => {
              const selected = item.id === period
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-${item.id}`}
                  aria-selected={selected}
                  className={styles.filter}
                  data-active={selected ? 'true' : 'false'}
                  onClick={() => setPeriod(item.id)}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <div className={styles.kpis} key={period}>
            <article className={styles.card}>
              <p className={styles.cardTitle}>{copy.cards.crossings.title}</p>
              <p className={styles.cardValue}>
                <CountUp value={snapshot.crossings} duration={1.1} grouping />
              </p>
              <p className={styles.cardHint} data-tone="blue">
                {copy.cards.crossings.hint}
              </p>
            </article>

            <article className={styles.card}>
              <p className={styles.cardTitle}>{copy.cards.paid.title}</p>
              <p className={styles.cardValue}>
                <CountUp value={snapshot.paid} duration={1.1} grouping />
              </p>
              <p className={styles.cardHint} data-tone="green">
                {rateLabel(snapshot.paidRate)}
              </p>
            </article>

            <article className={styles.card}>
              <p className={styles.cardTitle}>{copy.cards.subscribers.title}</p>
              <p className={styles.cardValue}>
                <CountUp value={snapshot.subscribers} duration={1.1} grouping />
              </p>
              <p className={styles.cardHint} data-tone="amber">
                {rateLabel(snapshot.subscriberRate)}
              </p>
            </article>

            <article className={styles.card}>
              <p className={styles.cardTitle}>{copy.cards.freeList.title}</p>
              <p className={styles.cardValue}>
                <CountUp value={snapshot.freeList} duration={1.1} grouping />
              </p>
              <div className={styles.split}>
                <span>
                  {copy.cards.freeList.free}
                  <strong>{snapshot.free}</strong>
                </span>
                <span>
                  {copy.cards.freeList.whitelist}
                  <strong>{snapshot.whitelist}</strong>
                </span>
              </div>
            </article>

            <article className={`${styles.card} ${styles.revenue}`}>
              <p className={styles.cardTitle}>{copy.cards.revenue.title(period)}</p>
              <p className={styles.revenueValue}>
                <CountUp value={snapshot.revenue} prefix="₺" duration={1.25} grouping />
              </p>
              <p className={styles.revenueMeta}>{copy.cards.revenue.paidPassages(snapshot.paidPassages)}</p>
            </article>

            <article className={`${styles.card} ${styles.trend}`}>
              <p className={styles.cardTitle}>{copy.cards.trend.title}</p>
              <TrendChart snapshot={snapshot} reduce={reduce} />
            </article>

            <article className={styles.card}>
              <p className={styles.cardTitle}>{copy.cards.collected.title}</p>
              <p className={styles.cardValue}>
                <CountUp value={snapshot.collected} prefix="₺" duration={1.1} grouping decimals={0} />
              </p>
              <p className={styles.cardMeta}>{copy.cards.collected.meta(snapshot.collectedVehicles, snapshot.collectedShare)}</p>
            </article>

            <article className={styles.card}>
              <p className={styles.cardTitle}>{copy.cards.cash.title}</p>
              <p className={styles.cardValue}>
                <CountUp value={snapshot.cash} prefix="₺" duration={1.1} grouping />
              </p>
              <p className={styles.cardMeta}>{copy.cards.cash.meta(snapshot.cashVehicles, snapshot.cashShare)}</p>
            </article>

            <article className={styles.card}>
              <p className={styles.cardTitle}>{copy.cards.debt.title}</p>
              <p className={styles.cardValue}>
                <CountUp value={snapshot.debt} prefix="₺" duration={1.1} grouping />
              </p>
              <p className={styles.cardMeta}>{copy.cards.debt.meta(snapshot.debtVehicles, snapshot.debtShare)}</p>
            </article>
          </div>
        </div>
      </div>
    </figure>
  )
}
