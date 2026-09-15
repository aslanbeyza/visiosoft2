import type { KeyboardEvent, RefObject } from 'react'
import styles from './PhoneTabHits.module.css'

type PhoneTabHitsProps = {
  labels: readonly string[]
  active: number
  onSelect: (index: number) => void
  /**
   * true: yalnızca dokunma/tık; sekme listesi başka yerde tutuluyorsa.
   * false: bu katman erişilebilir tablist olur (Hero).
   */
  decorative?: boolean
  tablistLabel?: string
  idPrefix?: string
  tabRefs?: RefObject<(HTMLButtonElement | null)[]>
}

/**
 * PhoneFrame ekran alanının altındaki görünmez sekme hedefleri (parkbiz-port alt çubuğu).
 * Konum PhoneFrame.module.css .screen inset'iyle aynıdır.
 */
export default function PhoneTabHits({
  labels,
  active,
  onSelect,
  decorative = false,
  tablistLabel,
  idPrefix = 'phone-tab',
  tabRefs,
}: PhoneTabHitsProps) {
  const last = labels.length - 1

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, from: number) => {
    if (decorative) return
    const targets: Record<string, number> = {
      ArrowRight: from === last ? 0 : from + 1,
      ArrowLeft: from === 0 ? last : from - 1,
      Home: 0,
      End: last,
    }
    const next = targets[event.key]
    if (next === undefined) return
    event.preventDefault()
    onSelect(next)
    tabRefs?.current[next]?.focus()
  }

  return (
    <div className={styles.hits} aria-hidden={decorative || undefined}>
      <div
        role={decorative ? undefined : 'tablist'}
        aria-label={decorative ? undefined : tablistLabel}
        className={styles.hitRow}
      >
        {labels.map((label, i) => {
          const selected = i === active
          return (
            <button
              key={`${idPrefix}-${i}`}
              ref={(node) => {
                if (tabRefs) tabRefs.current[i] = node
              }}
              type="button"
              role={decorative ? undefined : 'tab'}
              id={decorative ? undefined : `${idPrefix}-${i}`}
              aria-selected={decorative ? undefined : selected}
              aria-label={decorative ? undefined : label}
              tabIndex={decorative ? -1 : selected ? 0 : -1}
              className={styles.hit}
              onClick={() => onSelect(i)}
              onKeyDown={(event) => onKeyDown(event, i)}
            />
          )
        })}
      </div>
    </div>
  )
}
