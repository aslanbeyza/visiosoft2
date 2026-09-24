import { comparisonCopy } from './comparisonCopy.ts'
import styles from './CompareRows.module.css'

const { columns, rows } = comparisonCopy.table

/** Six buyer questions answered side by side; the column names appear once (repeated per row only on phones). */
export default function CompareRows() {
  return (
    <div className={styles.root} role="table" aria-label={comparisonCopy.table.title}>
      <div className={styles.head} role="row">
        <span role="columnheader" className={styles.srOnly}>
          {columns.question}
        </span>
        <span role="columnheader" className={styles.oldHead}>
          {columns.old}
        </span>
        {/* lang="en" keeps the uppercase brand name as VISIOSOFT (Turkish casing would dot the I). */}
        <span role="columnheader" className={styles.newHead} lang="en">
          {columns.new}
        </span>
      </div>
      {rows.map((row) => (
        <div key={row.question} className={styles.row} role="row">
          <p role="rowheader" className={styles.question}>
            {row.question}
          </p>
          <p role="cell" className={styles.old}>
            <span className={styles.label}>{columns.old}</span>
            {row.old}
          </p>
          <p role="cell" className={styles.new}>
            <span className={styles.label} lang="en">
              {columns.new}
            </span>
            {row.new}
          </p>
        </div>
      ))}
    </div>
  )
}
