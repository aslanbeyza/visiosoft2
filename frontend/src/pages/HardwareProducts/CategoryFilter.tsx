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

/** Kategori sekmeleri — statik alt çizgi; animasyonlu pill yok. */
export default function CategoryFilter({ active, onChange, counts, visibleCount }: CategoryFilterProps) {
  const options: { key: FilterKey; label: string }[] = [
    { key: 'all', label: productsCopy.all },
    ...categories.map((category) => ({ key: category.key, label: category.label })),
  ]

  return (
    <div className={styles.wrap}>
      <nav className={styles.nav} aria-label={productsCopy.filterLabel}>
        <div className={styles.scroller}>
          <div className={styles.list}>
            {options.map((option) => {
              const pressed = option.key === active
              const count = counts[option.key]
              return (
                <button
                  key={option.key}
                  type="button"
                  className={styles.tab}
                  aria-pressed={pressed}
                  data-filter-key={option.key}
                  onClick={() => onChange(option.key)}
                >
                  {option.label}
                  <span className={styles.count} aria-hidden="true">
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <p className={styles.result} aria-live="polite">
        <span className={styles.resultNumber}>{visibleCount}</span> {productsCopy.resultSuffix}
      </p>
    </div>
  )
}
