/**
 * Kullanım:
 *   <SubNav items={[{ id: 'urunler', label: 'Ürünler' }, { id: 'katalog', label: 'Katalog' }]} extra={<Button …/>} />
 * `id` değerleri sayfadaki bölümlerin (Section id) kimlikleriyle aynı olmalıdır. Çubuk navbar'ın altına yapışır,
 * yapışmışken navbar gizlenince onunla birlikte kayar (useStickyShift); etkin bölüm useScrollSpy ile bulunur.
 * Bağlantılar `#id` hedefine tarayıcının kendi kaydırmasıyla gider; html scroll-padding-top çubuğu hesaba katar.
 */
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
  /** nav etiketi; varsayılan "Sayfa bölümleri". */
  label?: string
  /** Sağdaki ek alan (ör. küçük bir Button); ≥768px'te görünür. */
  extra?: ReactNode
  /**
   * Okuma çizgisinin üstten uzaklığı (px). html scroll-padding-top değerinden (8.25rem = 132 px) büyük olmalıdır;
   * aksi hâlde bağlantıyla gelinen bölümün üst kenarı çizginin altında kalır ve bir önceki bölüm etkin görünür.
   */
  offset?: number
  /** Sabitlenmiş bir bölüm ekranı kaplarken çubuğu yukarı kaydırır. */
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

  // Etkin bağlantı, kullanıcı sayfayı kaydırdıktan sonra dar ekranda listenin ortasına getirilir;
  // etkin bölüm yokken (ilk bölümün üstü) liste başa döner.
  useEffect(() => {
    reveal(active)
  }, [active, reveal])

  // Klavyeyle odaklanan bağlantı (ve odak halkası) kaydırılabilir listede görünür kalır (WCAG 2.4.11).
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
                              // Yerleşim animasyonu genişliği ölçekle değiştirir; yarıçap style'da olunca framer düzeltir.
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

              {/*
                Kenar geçişi bir etiketin değil boşluğun üstüne düşse de şeridin devam ettiği görülsün diye oklar.
                Yalnızca işaretçi içindir: klavyeyle bağlantılar zaten sırayla gezilir ve odaklanan bağlantı görünür
                alana kaydırılır; bu yüzden sekme sırasına ve erişilebilirlik ağacına eklenmez.
              */}
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
