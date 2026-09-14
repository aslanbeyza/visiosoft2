/**
 * Kullanım:
 * <ComparisonTable
 *   caption="Geleneksel otopark yönetimi ile Visiosoft karşılaştırması"
 *   columns={{ a: 'Geleneksel', b: 'Visiosoft' }}
 *   rows={[
 *     { feature: 'Uzaktan erişim', a: false, b: true },
 *     { feature: 'Tahsilat başarısı', a: 'Değişken', b: 'Yüksek', note: 'HGS + POS + QR' },
 *   ]}
 * />
 * ≥768px gerçek <table> (caption, scope); satırlar belirirken ince lacivert çizgi soldan sağa süpürür (M12).
 * Daha dar ekranlarda her satır bir kart olur. b sütunu vurguludur.
 */
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { comparisonTableCopy as copy } from './comparisonTableCopy.ts'
import styles from './ComparisonTable.module.css'

export type ComparisonValue = string | boolean

export type ComparisonRow = {
  feature: string
  a: ComparisonValue
  b: ComparisonValue
  /** Özelliğin altında küçük açıklama. */
  note?: string
}

export type ComparisonTableProps = {
  columns: { a: string; b: string }
  rows: ComparisonRow[]
  /** Tablonun erişilebilir başlığı; `captionVisible` ile görünür de yapılabilir. */
  caption: string
  captionVisible?: boolean
  /** İlk sütun başlığı (varsayılan "Özellik"). */
  featureLabel?: string
  tone?: 'light' | 'dark'
  className?: string
}

/* M12 — süpüren çizgi: her hücrede bir parça; parçalar sırayla çizilir, hepsi bitince birlikte söner. */
const COLUMNS = 3
const SEGMENT = 0.24
const FADE = 0.4

const sweepVariants: Variants = {
  hidden: { scaleX: 0, opacity: 1 },
  show: (column: number = 0) => {
    const hold = (COLUMNS - 1 - column) * SEGMENT
    const duration = SEGMENT + hold + FADE
    return {
      scaleX: [0, 1, 1, 1],
      opacity: [1, 1, 1, 0],
      transition: {
        delay: column * SEGMENT,
        duration,
        times: [0, SEGMENT / duration, (SEGMENT + hold) / duration, 1],
        ease: ['easeOut', 'linear', 'easeIn'],
      },
    }
  },
}

const tableVariants: Variants = { hidden: {}, show: {} }
const headVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: revealEase } },
}
const bodyVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const rowVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: revealEase } },
}
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
}
const cardLineVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease: revealEase } },
}

function Sweep({ column }: { column: number }) {
  return <motion.span className={styles.sweep} aria-hidden="true" variants={sweepVariants} custom={column} />
}

function Mark({ value, strong = false }: { value: ComparisonValue; strong?: boolean }) {
  if (typeof value === 'string') return <span className={strong ? styles.strong : undefined}>{value}</span>

  return value ? (
    <span className={styles.yes}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="m3.5 8.4 2.9 2.9 6.1-6.3" />
      </svg>
      <span className={styles.srOnly}>{copy.yes}</span>
    </span>
  ) : (
    <span className={styles.no}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
        <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" />
      </svg>
      <span className={styles.srOnly}>{copy.no}</span>
    </span>
  )
}

export default function ComparisonTable({
  columns,
  rows,
  caption,
  captionVisible = false,
  featureLabel = copy.feature,
  tone = 'light',
  className = '',
}: ComparisonTableProps) {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.15 })
  const state = reduce || inView ? 'show' : 'hidden'

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`.trim()} data-tone={tone}>
      {/* Geniş ekran: gerçek tablo */}
      <div className={styles.scroller}>
        <motion.table className={styles.table} variants={tableVariants} initial={reduce ? false : 'hidden'} animate={state}>
          <caption className={captionVisible ? styles.caption : styles.srOnly}>{caption}</caption>
          <thead>
            <motion.tr variants={headVariants}>
              <th scope="col" className={styles.headFeature}>
                {featureLabel}
              </th>
              <th scope="col" className={styles.headA}>
                {columns.a}
              </th>
              <th scope="col" className={styles.headB}>
                {columns.b}
              </th>
            </motion.tr>
          </thead>
          <motion.tbody variants={bodyVariants}>
            {rows.map((row) => (
              <motion.tr key={row.feature} className={styles.row} variants={rowVariants}>
                <th scope="row" className={styles.feature}>
                  <Sweep column={0} />
                  <span className={styles.featureName}>{row.feature}</span>
                  {row.note ? <span className={styles.note}>{row.note}</span> : null}
                </th>
                <td className={styles.cellA}>
                  <Sweep column={1} />
                  <Mark value={row.a} />
                </td>
                <td className={styles.cellB}>
                  <Sweep column={2} />
                  <Mark value={row.b} strong />
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </motion.table>
      </div>

      {/* Dar ekran: satır başına kart */}
      <div className={styles.cards} role="list" aria-label={caption}>
        {rows.map((row) => (
          <motion.article
            key={row.feature}
            className={styles.card}
            role="listitem"
            variants={cardVariants}
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.span className={styles.cardLine} aria-hidden="true" variants={cardLineVariants} />
            <h3 className={styles.cardTitle}>{row.feature}</h3>
            {row.note ? <p className={styles.cardNote}>{row.note}</p> : null}
            <dl className={styles.cardGrid}>
              <div className={styles.cardCellA}>
                <dt>{columns.a}</dt>
                <dd>
                  <Mark value={row.a} />
                </dd>
              </div>
              <div className={styles.cardCellB}>
                <dt>{columns.b}</dt>
                <dd>
                  <Mark value={row.b} strong />
                </dd>
              </div>
            </dl>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
