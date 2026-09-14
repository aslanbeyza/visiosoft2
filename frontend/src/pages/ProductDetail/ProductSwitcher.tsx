import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import type { HardwareSlug } from '../HardwareProduct/products.ts'
import { detailCopy, switcherItemsFor } from './detailShared.ts'
import styles from './ProductSwitcher.module.css'

type ProductSwitcherProps = {
  current: HardwareSlug
  /** Sabitlenmiş yakınlaşma bölümü ekrandayken çubuk yukarı kayar. */
  hidden?: boolean
}

/** Navbar'ın altına yapışan donanım ürünleri çubuğu; mobilde yatay kaydırılır. */
export default function ProductSwitcher({ current, hidden = false }: ProductSwitcherProps) {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  // Kenar gölgeleri React state'i yerine data özniteliğiyle güncellenir.
  const updateEdges = () => {
    const list = listRef.current
    const wrap = wrapRef.current
    if (!list || !wrap) return
    const max = list.scrollWidth - list.clientWidth
    wrap.dataset.fadeStart = String(list.scrollLeft > 4)
    wrap.dataset.fadeEnd = String(max - list.scrollLeft > 4)
  }

  // Klavyeyle odaklanan bağlantı yatay listede görünür alana kaydırılır; kenar geçişleri halkayı örtmez.
  // scrollIntoView kullanılmaz: sayfanın scroll-padding-top değeri yapışkan çubukta dikey kaymaya yol açar.
  const revealLink = (link: HTMLElement) => {
    const list = listRef.current
    if (!list || list.scrollWidth <= list.clientWidth) return
    const pad = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2.5
    const box = list.getBoundingClientRect()
    const rect = link.getBoundingClientRect()
    const delta =
      rect.left < box.left + pad ? rect.left - box.left - pad : rect.right > box.right - pad ? rect.right - box.right + pad : 0
    if (delta !== 0) list.scrollBy({ left: delta, behavior: reduce ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector<HTMLElement>('[aria-current="page"]')
    if (active && list.scrollWidth > list.clientWidth) {
      list.scrollLeft = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2
    }
    const observer = new ResizeObserver(() => updateEdges())
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={styles.sticky}>
      <motion.nav
        aria-label={detailCopy.switcher.label}
        className={styles.bar}
        initial={false}
        animate={hidden ? { y: '-100%', opacity: 0 } : { y: '0%', opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: revealEase }}
        inert={hidden}
      >
        <div className={styles.inner}>
          <span className={styles.heading} aria-hidden="true">
            {detailCopy.switcher.heading}
          </span>

          <div ref={wrapRef} className={styles.scrollWrap} data-fade-start="false" data-fade-end="false">
            <ul ref={listRef} className={styles.list} onScroll={updateEdges} onPointerLeave={() => setHovered(null)}>
              {switcherItemsFor(current).map((item) => {
                const isActive = item.slug === current
                return (
                  <li key={item.slug} className={styles.item}>
                    <Link
                      to={path(item.route)}
                      className={styles.link}
                      aria-current={isActive ? 'page' : undefined}
                      onPointerEnter={() => setHovered(item.slug)}
                      onFocus={(event) => {
                        setHovered(item.slug)
                        revealLink(event.currentTarget)
                      }}
                      onBlur={() => setHovered(null)}
                    >
                      {item.label}
                      {isActive ? (
                        <motion.span
                          className={styles.activeBar}
                          aria-hidden="true"
                          initial={reduce ? false : { scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: 0.6, ease: revealEase }}
                        />
                      ) : null}
                      {hovered === item.slug && !isActive ? (
                        <motion.span
                          layoutId="product-switcher-hover"
                          className={styles.hoverBar}
                          aria-hidden="true"
                          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 42 }}
                        />
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <Link to={path('hardware-products')} className={styles.all}>
            {detailCopy.switcher.all}
            <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </motion.nav>
    </div>
  )
}
