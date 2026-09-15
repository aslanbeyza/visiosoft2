import { useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Picture from '../Picture/index.ts'
import { revealEase } from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { homeCatalogCopy as text } from './homeCatalogCopy.ts'
import styles from './HomeCatalog.module.css'

/**
 * Parklio Solutions / Software vitrininin Visiosoft örneği:
 * ortada hap geçiş, değişen başlık, üç kolonlu ürün ızgarası.
 */
export default function HomeCatalog() {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const baseId = useId()
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tab = text.tabs[active]
  const panelId = `${baseId}-panel`
  const titleId = text.titleId

  const select = (index: number) => {
    setActive(index)
    tabRefs.current[index]?.focus()
  }

  const keydown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = text.tabs.length
    const next: Record<string, number> = {
      ArrowRight: (active + 1) % count,
      ArrowLeft: (active + count - 1) % count,
      Home: 0,
      End: count - 1,
    }
    const index = next[event.key]
    if (index === undefined) return
    event.preventDefault()
    select(index)
  }

  return (
    <Section id="katalog" tone="paper" spacing="lg" labelledBy={titleId} className={styles.section}>
      <div className={styles.head}>
        <div className={styles.switch} role="tablist" aria-label={text.tablistLabel} onKeyDown={keydown}>
          {text.tabs.map((item, index) => {
            const on = index === active
            return (
              <button
                key={item.id}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                id={`${baseId}-tab-${item.id}`}
                type="button"
                role="tab"
                className={styles.tab}
                aria-selected={on}
                aria-controls={panelId}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(index)}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div className={styles.titleWrap}>
          <h2 id={titleId} className={styles.title}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={tab.id}
                className={styles.titleText}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: revealEase }}
              >
                {tab.title}
              </motion.span>
            </AnimatePresence>
          </h2>
        </div>
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={`${baseId}-tab-${tab.id}`} aria-label={text.panelLabel}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={tab.id}
            className={styles.grid}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease: revealEase }}
          >
            {tab.items.map((item) => (
              <li key={item.route} className={styles.cell}>
                <Link to={path(item.route)} className={styles.card}>
                  <span className={styles.visual} data-kind={item.kind} data-shape={item.shape}>
                    <Picture
                      src={item.image.src}
                      avif={item.image.avif}
                      width={item.image.width}
                      height={item.image.height}
                      alt=""
                      className={styles.image}
                      pictureClassName={styles.picture}
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 80vw"
                    />
                  </span>
                  <h3 className={styles.name}>{item.name}</h3>
                  <p className={styles.text}>{item.text}</p>
                </Link>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <p className={styles.more}>
        <Link to={path(tab.more.route)} className={styles.moreLink}>
          {tab.more.label}
          <svg viewBox="0 0 24 24" className={styles.moreArrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </p>
    </Section>
  )
}
