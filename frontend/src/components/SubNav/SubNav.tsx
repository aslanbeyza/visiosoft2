
import { useEffect, useId, useRef } from 'react'
import type { FocusEvent, ReactNode } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { useScrollSpy } from '../../hooks/useScrollSpy/index.ts'
import { subNavCopy } from './subNavCopy.ts'
import { useStripScroll } from './useStripScroll.ts'
import { useStickyShift } from './useStickyShift.ts'
import styles from './SubNav.module.css'

export type SubNavItem = {
  id: string
  label: string
}

export type SubNavProps = {
  items: SubNavItem[]

  label?: string

  extra?: ReactNode

  offset?: number

  hidden?: boolean
  className?: string
}

export default function SubNav({ items, label, extra, offset = 148, hidden = false, className = '' }: SubNavProps) {
  const reduce = Boolean(useReducedMotion())
  const uid = useId()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const ids = items.map((item) => item.id)
  const active = useScrollSpy(ids, offset)

  useStickyShift(sentinelRef, stickyRef, reduce)
  const { updateEdges, reveal, page } = useStripScroll(listRef, wrapRef, ids, reduce)

  useEffect(() => {
    reveal(active)
  }, [active, reveal])

  const onFocus = (event: FocusEvent<HTMLUListElement>) => {
    if (event.target instanceof HTMLElement) reveal(null, event.target)
  }

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      <div ref={stickyRef} className={`${styles.sticky} ${className}`.trim()}>
        <motion.nav
          aria-label={label ?? subNavCopy.label}
          className={styles.bar}
          initial={false}
          animate={hidden ? { y: '-100%', opacity: 0 } : { y: '0%', opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: revealEase }}
          inert={hidden}
        >
          <div className={styles.inner}>
            <div ref={wrapRef} className={styles.scrollWrap} data-fade-start="false" data-fade-end="false">
              <LayoutGroup id={uid}>
                <ul ref={listRef} className={styles.list} onScroll={updateEdges} onFocus={onFocus}>
                  {items.map((item) => {
                    const isActive = item.id === active
                    return (
                      <li key={item.id} className={styles.item}>
                        <a href={`#${item.id}`} className={styles.link} aria-current={isActive ? 'location' : undefined}>
                          {item.label}
                          {isActive ? (
                            <motion.span
                              layoutId="subnav-active"
                              className={styles.activeBar}

                              style={{ borderRadius: 3 }}
                              aria-hidden="true"
                              initial={reduce ? false : { opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 44 }}
                            />
                          ) : null}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </LayoutGroup>

              {}
              {(['start', 'end'] as const).map((edge) => (
                <button
                  key={edge}
                  type="button"
                  className={`${styles.scrollButton} ${edge === 'start' ? styles.scrollStart : styles.scrollEnd}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => page(edge === 'start' ? -1 : 1)}
                >
                  <span className={styles.scrollIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                      <path d={edge === 'start' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
                    </svg>
                  </span>
                </button>
              ))}
            </div>

            {extra ? <div className={styles.extra}>{extra}</div> : null}
          </div>
        </motion.nav>
      </div>
    </>
  )
}
