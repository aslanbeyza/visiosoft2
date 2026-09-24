import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Badge from '../../components/Badge/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import PackageList from './PackageList.tsx'
import { quoteCopy } from './quoteCopy.ts'
import { summaryRows } from './quoteRules.ts'
import type { PackageItem, QuoteChoices } from './quoteRules.ts'
import styles from './PackagePanel.module.css'

type PackagePanelProps = {
  choices: QuoteChoices
  items: PackageItem[]
  id?: string
  className?: string
}

type Track = { key: string; ids: string[]; note: string }

const { panel, catalog } = quoteCopy

function describeChange(previous: string[], items: PackageItem[]) {
  const added = items.filter((item) => !previous.includes(item.id))
  const removed = previous.filter((id) => !items.some((item) => item.id === id))
  const parts = added.map((item) => item.rule ?? panel.added(item.name))
  for (const id of removed) {
    if (id in catalog) parts.push(panel.removed(catalog[id as keyof typeof catalog].name))
  }
  return parts.join(' ')
}

export default function PackagePanel({ choices, items, id, className = '' }: PackagePanelProps) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const ids = items.map((item) => item.id)
  const key = ids.join('|')
  const [track, setTrack] = useState<Track>({ key, ids, note: '' })

  if (track.key !== key) {
    setTrack({ key, ids, note: describeChange(track.ids, items) })
  }

  const rows = summaryRows(choices)
  const answered = rows.filter((row) => !row.pending).length

  return (
    <aside id={id} className={`${styles.panel} ${className}`.trim()} aria-labelledby={titleId}>
      <header className={styles.head}>
        <div className={styles.headTop}>
          <Badge tone="light" dot>
            {panel.badge}
          </Badge>
          <span className={styles.count} aria-hidden={items.length === 0 || undefined}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={items.length}
                className={styles.countValue}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: revealEase }}
              >
                {panel.count(items.length)}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <h2 id={titleId} className={styles.title}>
          {panel.title}
        </h2>
        <div className={styles.progress} aria-hidden="true">
          <motion.span
            className={styles.progressFill}
            initial={false}
            animate={{ scaleX: answered / rows.length }}
            transition={reduce ? { duration: 0 } : { duration: 0.8, ease: revealEase }}
          />
        </div>
      </header>

      <div className={styles.body}>
        <p className={styles.note} aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}>
            {track.note ? (
              <motion.span
                key={track.note}
                className={styles.noteText}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: revealEase }}
              >
                {track.note}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </p>

        <PackageList items={items} />

        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>{panel.summaryTitle}</h3>
          <dl className={styles.rows}>
            {rows.map((row) => (
              <div key={row.key} className={styles.row} data-pending={row.pending || undefined}>
                <dt className={styles.rowLabel}>{row.label}</dt>
                <dd className={styles.rowValue}>
                  <motion.span
                    key={row.value}
                    className={styles.rowValueText}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: revealEase }}
                  >
                    {row.value}
                  </motion.span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </aside>
  )
}
