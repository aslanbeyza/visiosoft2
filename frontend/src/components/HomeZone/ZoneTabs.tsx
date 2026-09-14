import { useEffect, useRef } from 'react'
import type { FocusEventHandler, KeyboardEvent, PointerEventHandler } from 'react'
import { motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { FeatureIcon } from '../FeatureGrid/icons.tsx'
import { homeZoneCopy as copy } from './homeZoneCopy.ts'
import { tabId } from './zoneTour.ts'
import type { ZoneTourItem } from './zoneTour.ts'
import styles from './ZoneTabs.module.css'

type ZoneTabsProps = {
  items: ZoneTourItem[]
  active: number
  onSelect: (index: number) => void
  progress: MotionValue<number>
  showProgress: boolean
  idBase: string
  vertical: boolean
  onPointerEnter: PointerEventHandler
  onPointerLeave: PointerEventHandler
  onFocus: FocusEventHandler
  onBlur: FocusEventHandler
}

/** Zone modül sekmeleri: gezici tabindex, ok tuşları, Home/End. Mobilde yatay kaydırmalı çip listesi olur. */
export default function ZoneTabs({ items, active, onSelect, progress, showProgress, idBase, vertical, ...events }: ZoneTabsProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Mobil çip listesinde etkin çip görünür alana kaydırılır (sayfa dikeyde kaymaz).
  useEffect(() => {
    const list = listRef.current
    const tab = tabRefs.current[active]
    if (!list || !tab || vertical || list.scrollWidth <= list.clientWidth) return
    const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' })
  }, [active, vertical])

  // Yatay çip listesinde taşan kenar yumuşakça solar: dokunmatik kullanıcı altı modül olduğunu görür.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const update = () => {
      const rest = list.scrollWidth - list.clientWidth - list.scrollLeft
      list.dataset.fadeStart = String(!vertical && list.scrollLeft > 4)
      list.dataset.fadeEnd = String(!vertical && rest > 4)
    }
    update()
    list.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(list)
    return () => {
      list.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [vertical])

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = items.length
    // Oklar döngüsel ilerler; Home/End ilk ve son sekmeye gider.
    const keys: Record<string, number> = {
      ArrowRight: (active + 1) % count,
      ArrowDown: (active + 1) % count,
      ArrowLeft: (active + count - 1) % count,
      ArrowUp: (active + count - 1) % count,
      Home: 0,
      End: count - 1,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    const next = keys[event.key]
    onSelect(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div
      ref={listRef}
      className={styles.list}
      role="tablist"
      aria-label={copy.tablistLabel}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      onKeyDown={move}
      onPointerEnter={events.onPointerEnter}
      onPointerLeave={events.onPointerLeave}
      onFocus={events.onFocus}
      onBlur={events.onBlur}
    >
      {items.map((item, index) => {
        const selected = index === active
        return (
          <button
            key={item.id}
            ref={(node) => {
              tabRefs.current[index] = node
            }}
            type="button"
            role="tab"
            id={tabId(idBase, item.id)}
            className={styles.tab}
            aria-selected={selected}
            aria-controls={`${idBase}-panel`}
            aria-labelledby={`${idBase}-title-${item.id}`}
            aria-describedby={`${idBase}-desc-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(index)}
          >
            <span className={styles.icon} aria-hidden="true">
              <FeatureIcon name={item.icon} />
            </span>
            <span className={styles.text}>
              <span className={styles.title} id={`${idBase}-title-${item.id}`}>
                {item.title}
              </span>
              <span className={styles.desc} id={`${idBase}-desc-${item.id}`}>
                {item.description}
              </span>
            </span>
            <span className={styles.index} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            {selected && showProgress ? (
              <span className={styles.track} aria-hidden="true">
                <motion.span className={styles.bar} style={{ scaleX: progress }} />
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
