import { useId } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { categories } from './data.ts'
import type { CategoryKey } from './data.ts'
import { productsCopy } from './listingCopy.ts'
import styles from './CategoryFilter.module.css'

export type FilterKey = CategoryKey | 'all'

type CategoryFilterProps = {
  active: FilterKey
  onChange: (key: FilterKey) => void
  counts: Record<FilterKey, number>
  visibleCount: number
}

/** Kategori çipleri: basılı durum aria-pressed ile, etkin zemin layoutId ile kayar. */
export default function CategoryFilter({ active, onChange, counts, visibleCount }: CategoryFilterProps) {
  const reduce = useReducedMotion()
  const groupId = useId()
  const options: { key: FilterKey; label: string }[] = [
    { key: 'all', label: productsCopy.all },
    ...categories.map((category) => ({ key: category.key, label: category.label })),
  ]

  return (
    <div className={styles.wrap}>
      <LayoutGroup id={groupId}>
        <div className={styles.scroller}>
          <div className={styles.chips} role="group" aria-label={productsCopy.filterLabel}>
            {options.map((option) => {
              const pressed = option.key === active
              return (
                <button
                  key={option.key}
                  type="button"
                  className={styles.chip}
                  aria-pressed={pressed}
                  data-filter-key={option.key}
                  onClick={() => onChange(option.key)}
                >
                  {pressed ? (
                    <motion.span
                      layoutId="hardware-filter-active"
                      className={styles.pill}
                      aria-hidden="true"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 42 }}
                    />
                  ) : null}
                  <span className={styles.chipLabel}>{option.label}</span>
                  <span className={styles.count}>{counts[option.key]}</span>
                </button>
              )
            })}
          </div>
        </div>
      </LayoutGroup>

      <p className={styles.result} aria-live="polite">
        <span className={styles.resultNumber}>{visibleCount}</span> {productsCopy.resultSuffix}
      </p>
    </div>
  )
}
