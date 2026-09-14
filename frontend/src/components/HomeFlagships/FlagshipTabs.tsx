import { useId, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import type { Flagship } from './flagships.ts'
import { homeFlagshipsCopy as text } from './homeFlagshipsCopy.ts'
import styles from './FlagshipTabs.module.css'

type FlagshipTabsProps = {
  items: Flagship[]
  active: number
  onSelect: (index: number) => void
  tabId: (index: number) => string
  panelId: string
}

/** Ürün sekmeleri: gezici tabindex, ←/→/Home/End; etkin sekmenin altında layoutId ile kayan çizgi. */
export default function FlagshipTabs({ items, active, onSelect, tabId, panelId }: FlagshipTabsProps) {
  const reduce = useReducedMotion()
  const group = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const keydown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = items.length
    const target: Record<string, number> = {
      ArrowRight: (active + 1) % count,
      ArrowLeft: (active + count - 1) % count,
      Home: 0,
      End: count - 1,
    }
    const next = target[event.key]
    if (next === undefined) return
    event.preventDefault()
    onSelect(next)
    refs.current[next]?.focus()
  }

  return (
    <LayoutGroup id={group}>
      <div className={styles.list} role="tablist" aria-label={text.tablistLabel} onKeyDown={keydown}>
        {items.map((item, index) => {
          const on = index === active
          return (
            <button
              key={item.slug}
              ref={(node) => {
                refs.current[index] = node
              }}
              id={tabId(index)}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={on}
              aria-controls={panelId}
              tabIndex={on ? 0 : -1}
              onClick={() => onSelect(index)}
            >
              <span className={styles.thumb} aria-hidden="true">
                <img
                  src={item.thumb ?? item.image.src}
                  alt=""
                  width={item.image.width}
                  height={item.image.height}
                  sizes="36px"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className={styles.text}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.label}>{item.tab}</span>
              </span>
              {on ? (
                <motion.span
                  layoutId="flagship-indicator"
                  className={styles.indicator}
                  aria-hidden="true"
                  transition={reduce ? { duration: 0 } : { duration: 0.5, ease: revealEase }}
                />
              ) : null}
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
