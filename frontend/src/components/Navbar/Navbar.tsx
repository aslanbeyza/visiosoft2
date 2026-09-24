import { useEffect, useId, useRef, useState } from 'react'
import type {
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import Button from '../Button/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { navCta, primaryNav } from '../../data/siteNav.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { routeNameFromPath } from '../../lib/index.ts'
import MegaMenu from './MegaMenu.tsx'
import MobileMenu from './MobileMenu.tsx'
import NavIcon from './NavIcon.tsx'
import { navbarCopy } from './navbarCopy.ts'
import { DESKTOP_QUERY, focusableIn, isItemActive, warmMenuImages } from './navData.ts'
import type { PanelCustom } from './navData.ts'
import { useNavbarScroll } from './useNavbarScroll.ts'
import styles from './Navbar.module.css'

const OPEN_DELAY = 90
const SWAP_DELAY = 220
const CLOSE_DELAY = 150

const HOVER_CLICK_GRACE = 400

type MenuState = { key: string; at: string; swap: boolean }

export default function Navbar() {
  const path = usePath()
  const { pathname } = useLocation()
  const current = routeNameFromPath(pathname)
  const isHome = pathname === path('home')
  const reduce = useReducedMotion() ?? false
  const { atTop, hiddenByScroll } = useNavbarScroll()
  const uid = useId()
  const sheetId = `${uid}-mobile`

  const [menu, setMenu] = useState<MenuState | null>(null)
  const [mobileAt, setMobileAt] = useState<string | null>(null)

  const [seenPath, setSeenPath] = useState(pathname)
  if (seenPath !== pathname) {
    setSeenPath(pathname)
    setMenu(null)
    setMobileAt(null)
  }

  const headerRef = useRef<HTMLElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)

  const hoverOpenedAt = useRef(Number.NEGATIVE_INFINITY)

  const pendingSwap = useRef<string | null>(null)
  const lastPointerY = useRef<number | null>(null)

  const openKey = menu !== null && menu.at === pathname ? menu.key : null
  const mobileOpen = mobileAt === pathname
  const anyOpen = openKey !== null || mobileOpen
  const overHero = isHome && atTop && !anyOpen
  const hidden = !reduce && hiddenByScroll && !anyOpen
  const panelCustom: PanelCustom = { swap: menu?.swap ?? false, reduce }

  const pendingPanelFocus = useRef<string | null>(null)

  useEffect(() => {
    if (openKey === null || pendingPanelFocus.current !== openKey) return
    pendingPanelFocus.current = null
    const frame = window.requestAnimationFrame(() => {
      focusableIn(document.getElementById(`${uid}-panel-${openKey}`))[0]?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [openKey, uid])

  const clearTimers = () => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    pendingSwap.current = null
  }

  const openMenu = (key: string) => {
    clearTimers()
    setMenu((previous) => {
      const previousKey = previous !== null && previous.at === pathname ? previous.key : null
      if (previousKey === key) return previous
      return { key, at: pathname, swap: previousKey !== null }
    })
  }

  const closeMenu = () => {
    clearTimers()
    setMenu(null)
  }

  const closeAll = () => {
    clearTimers()
    setMenu(null)
    setMobileAt(null)
  }

  const scheduleOpen = (key: string, stamp: number) => {
    clearTimers()
    if (openKey === key) return
    const swap = openKey !== null
    const delay = swap ? SWAP_DELAY : OPEN_DELAY
    if (swap) pendingSwap.current = key
    openTimer.current = window.setTimeout(() => {
      pendingSwap.current = null
      hoverOpenedAt.current = stamp + delay
      openMenu(key)
    }, delay)
  }

  const scheduleClose = () => {
    clearTimers()
    if (openKey === null) return
    closeTimer.current = window.setTimeout(() => setMenu(null), CLOSE_DELAY)
  }

  const handlePointerEnter = (event: ReactPointerEvent<HTMLLIElement>, key: string) => {
    if (event.pointerType !== 'mouse') return
    warmMenuImages(primaryNav)
    scheduleOpen(key, event.timeStamp)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLLIElement>, key: string) => {
    if (event.pointerType !== 'mouse') return
    const previousY = lastPointerY.current
    lastPointerY.current = event.clientY
    if (pendingSwap.current === key && previousY !== null && event.clientY > previousY) {
      scheduleOpen(key, event.timeStamp)
    }
  }

  const handlePointerLeave = (event: ReactPointerEvent<HTMLLIElement>) => {
    if (event.pointerType === 'mouse') scheduleClose()
  }

  const handleFocus = () => warmMenuImages(primaryNav)

  const handleBlur = (event: ReactFocusEvent<HTMLLIElement>, key: string) => {
    const next = event.relatedTarget
    if (openKey !== key || !(next instanceof Node) || event.currentTarget.contains(next)) return
    closeMenu()
  }

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, key: string) => {
    if (event.key !== 'ArrowDown') return
    event.preventDefault()
    if (openKey === key) {
      focusableIn(document.getElementById(`${uid}-panel-${key}`))[0]?.focus()
      return
    }
    pendingPanelFocus.current = key
    openMenu(key)
  }

  const handleTriggerClick = (event: ReactMouseEvent<HTMLButtonElement>, key: string) => {
    if (openKey !== key) {
      openMenu(key)
      return
    }
    if (event.timeStamp - hoverOpenedAt.current < HOVER_CLICK_GRACE) return
    closeMenu()
  }

  const toggleMobile = () => {
    clearTimers()
    setMenu(null)
    setMobileAt(mobileOpen ? null : pathname)
  }

  const skipToContent = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById('main-content')
    if (!main) return
    event.preventDefault()
    closeAll()
    main.focus()
  }

  useEffect(() => {
    if (openKey === null) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && headerRef.current?.contains(event.target)) return
      window.clearTimeout(openTimer.current)
      window.clearTimeout(closeTimer.current)
      setMenu(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [openKey])

  useEffect(() => {
    if (openKey === null && !mobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (mobileOpen) {
          setMobileAt(null)
          toggleRef.current?.focus()
          return
        }
        const trigger = headerRef.current?.querySelector<HTMLElement>(`[data-menu-trigger="${openKey}"]`)
        const focusInside = trigger?.closest('li')?.contains(document.activeElement) ?? false
        window.clearTimeout(openTimer.current)
        window.clearTimeout(closeTimer.current)
        setMenu(null)
        if (trigger && focusInside) trigger.focus()
        return
      }

      if (event.key !== 'Tab' || !mobileOpen) return
      const focusables = [...focusableIn(headerRef.current), ...focusableIn(sheetRef.current)]
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      const inside = active instanceof HTMLElement && focusables.includes(active)
      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openKey, mobileOpen, uid])

  useEffect(() => {
    if (!mobileOpen) return
    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    const inerted: Element[] = []
    for (let node = headerRef.current; node && node !== body && node.parentElement; node = node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling === node || sibling === sheetRef.current || sibling.hasAttribute('inert')) continue
        sibling.setAttribute('inert', '')
        inerted.push(sibling)
      }
    }

    sheetRef.current?.querySelector<HTMLElement>('a[href], button')?.focus({ preventScroll: true })

    const query = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => {
      if (query.matches) setMobileAt(null)
    }
    query.addEventListener('change', onChange)

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
      for (const element of inerted) element.removeAttribute('inert')
      query.removeEventListener('change', onChange)
    }
  }, [mobileOpen])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-navbar', hidden ? 'hidden' : 'visible')
    return () => root.removeAttribute('data-navbar')
  }, [hidden])

  useEffect(() => {
    const openRef = openTimer
    const closeRef = closeTimer
    return () => {
      window.clearTimeout(openRef.current)
      window.clearTimeout(closeRef.current)
    }
  }, [])

  return (
    <>
      <a href="#main-content" className={styles.skip} onClick={skipToContent}>
        {navbarCopy.skipLink}
      </a>

      <header
        ref={headerRef}
        className={styles.header}
        data-theme={overHero ? 'hero' : 'solid'}
        data-elevated={!atTop}
        data-hidden={hidden}
      >
        <div className={styles.bar}>
          <Link to={path('home')} className={styles.brand} aria-label={navbarCopy.homeLabel} onClick={closeAll}>
            <img className={styles.logo} src="/img/visiosoft_logo.svg" alt="" width={111} height={26} />
          </Link>

          <nav className={styles.nav} aria-label={navbarCopy.navLabel}>
            <LayoutGroup id="navbar">
              <ul className={styles.list}>
                {primaryNav.map((item) => {
                  const active = isItemActive(item, current)
                  const open = openKey === item.key
                  const panelId = `${uid}-panel-${item.key}`
                  const hasMenu = Boolean(item.menu)

                  return (
                    <li
                      key={item.key}
                      className={styles.item}
                      data-active={active}
                      data-open={open}
                      data-menu={hasMenu}
                      onPointerEnter={hasMenu ? (event) => handlePointerEnter(event, item.key) : undefined}
                      onPointerMove={hasMenu ? (event) => handlePointerMove(event, item.key) : undefined}
                      onPointerLeave={hasMenu ? handlePointerLeave : undefined}
                      onFocus={hasMenu ? handleFocus : undefined}
                      onBlur={hasMenu ? (event) => handleBlur(event, item.key) : undefined}
                    >
                      <span className={styles.trigger}>
                        <Link
                          to={path(item.route)}
                          className={styles.link}
                          aria-current={item.route === current ? 'page' : undefined}
                          onClick={closeAll}
                        >
                          {item.label}
                        </Link>
                        {hasMenu ? (
                          <button
                            type="button"
                            className={styles.chevronButton}
                            aria-expanded={open}

                            aria-controls={open ? panelId : undefined}
                            data-menu-trigger={item.key}
                            aria-label={navbarCopy.submenu(item.label)}
                            onClick={(event) => handleTriggerClick(event, item.key)}
                            onKeyDown={(event) => handleTriggerKeyDown(event, item.key)}
                          >
                            <NavIcon name="chevron" className={styles.chevron} />
                          </button>
                        ) : null}
                        {active ? (
                          <motion.span
                            layoutId="navbar-active"
                            className={styles.indicator}
                            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: revealEase }}
                            aria-hidden="true"
                          />
                        ) : null}
                      </span>

                      {item.menu ? (
                        <AnimatePresence custom={panelCustom}>
                          {open ? (
                            <MegaMenu
                              key={item.key}
                              id={panelId}
                              item={item}
                              current={current}
                              custom={panelCustom}
                              onNavigate={closeAll}
                            />
                          ) : null}
                        </AnimatePresence>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </LayoutGroup>
          </nav>

          <div className={styles.actions}>
            <Link
              to={path(navCta.secondary.route)}
              className={styles.textLink}
              aria-current={navCta.secondary.route === current ? 'page' : undefined}
              onClick={closeAll}
            >
              {navCta.secondary.label}
            </Link>
            <span className={styles.ctaWrap}>
              <Button to={path(navCta.primary.route)} variant={overHero ? 'light' : 'primary'} onClick={closeAll}>
                {navCta.primary.label}
              </Button>
            </span>
            <button
              ref={toggleRef}
              type="button"
              className={styles.menuButton}
              data-open={mobileOpen}
              aria-expanded={mobileOpen}
              aria-controls={sheetId}
              aria-label={mobileOpen ? navbarCopy.closeMenu : navbarCopy.openMenu}
              onClick={toggleMobile}
            >
              <span className={styles.burger} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {openKey !== null && !mobileOpen ? (
          <motion.div
            key="navbar-scrim"
            className={styles.scrim}
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.2 } }}
            transition={{ duration: 0.35, ease: revealEase }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen ? (
          <MobileMenu
            key="navbar-mobile"
            id={sheetId}
            items={primaryNav}
            current={current}
            reduce={reduce}
            sheetRef={sheetRef}
            onNavigate={closeAll}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}
