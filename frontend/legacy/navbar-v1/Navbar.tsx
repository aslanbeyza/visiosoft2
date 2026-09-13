import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { routeNameFromPath } from '../../lib/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'

type MenuLink = { route: string; title: string; desc?: string; icon: IconName }
type NavItem = { key: string; route: string; label: string; menu?: MenuLink[] }

type IconName = 'plate' | 'cloud' | 'code' | 'network' | 'street' | 'building' | 'ticket' | 'hgs' | 'eye' | 'kiosk' | 'truck' | 'box' | 'rack' | 'camera' | 'tower' | 'led'

const iconPaths: Record<IconName, string> = {
  plate: 'M3 7h18v10H3zM7 11v2M11 11v2M15 11v2',
  cloud: 'M7 18a4 4 0 0 1 .5-7.97 5.5 5.5 0 0 1 10.6 1.6A3.5 3.5 0 0 1 17.5 18z',
  code: 'M9 8l-4 4 4 4M15 8l4 4-4 4',
  network: 'M12 3v6M6 21v-4M18 21v-4M6 17h12M12 9l-6 8M12 9l6 8',
  street: 'M4 20L8 4M20 20L16 4M12 6v3M12 12v3M12 18v2',
  building: 'M4 21V6l8-3 8 3v15M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01',
  ticket: 'M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4 2 2 0 0 0 0-4zM12 8v8',
  hgs: 'M3 12h18M7 12V7h10v5M5 17h14M9 20h6',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  kiosk: 'M7 3h10v18H7zM10 7h4M10 11h4M9 17h6',
  truck: 'M3 16V6h11v10M14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  box: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9',
  rack: 'M5 3h14v18H5zM8 7h8M8 12h8M8 17h8',
  camera: 'M4 8h3l2-2h6l2 2h3v11H4zM12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  tower: 'M12 3v18M7 21l5-13 5 13M5 8h14',
  led: 'M3 5h18v11H3zM8 20h8M12 16v4M7 9h4M7 12h8',
}

function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  )
}

const softwareMenu: MenuLink[] = [
  { route: 'software-products', title: 'Park Yazılım', desc: 'nav_read_more', icon: 'cloud' },
  { route: 'developers', title: 'nav_developers', desc: 'sw_dev_to_dev', icon: 'code' },
  { route: 'end-to-end', title: 'footer_end_to_end_system', desc: 'Hub & Spoke Modeli', icon: 'network' },
  { route: 'on-street', title: 'footer_on_street_parking', desc: 'Kamera & HGS', icon: 'street' },
  { route: 'website-pricing', title: 'Site Otopark Yönetimi', desc: 'Bulut tabanlı site otopark yönetimi', icon: 'building' },
  { route: 'parking-violations', title: 'footer_parking_violations', desc: 'sw_violation_desc', icon: 'ticket' },
  { route: 'hgs', title: 'HGS Ödeme Sistemi', desc: 'footer_hgs_payment', icon: 'hgs' },
  { route: 'kus-bakisi', title: 'nav_birds_eye', desc: 'sw_birds_eye_desc', icon: 'eye' },
]

const hardwareMenu: MenuLink[] = [
  { route: 'hardware-products', title: 'nav_hardware', desc: 'nav_read_more', icon: 'box' },
  { route: 'hardware-products.kiosk', title: 'Kiosk', desc: 'Self-servis ödeme terminali', icon: 'kiosk' },
  { route: 'hardware-products.tir-kiosk', title: 'TIR Kiosk', desc: 'Ağır vasıta geçiş noktası', icon: 'truck' },
  { route: 'hardware-products.visiobox', title: 'Visiobox', desc: 'Uçtan uca saha kontrol ünitesi', icon: 'rack' },
  { route: 'hardware-products.rack-kabin', title: 'Rack Kabin', desc: 'Saha donanım kabini', icon: 'rack' },
  { route: 'hardware-products.kamera-muhafaza', title: 'Kamera Muhafaza', desc: 'IP66 dış ortam koruması', icon: 'camera' },
  { route: 'hardware-products.kamera-montaj-kulesi', title: 'Kamera Montaj Kulesi', desc: 'Modüler direk sistemi', icon: 'tower' },
  { route: 'hardware-products.ledli-reklam-paneli', title: 'Ledli Reklam Paneli', desc: 'Dijital yönlendirme ekranı', icon: 'led' },
]

const navItems: NavItem[] = [
  { key: 'alpr', route: 'alpr.index', label: 'nav_alpr' },
  { key: 'software', route: 'software-products', label: 'nav_software', menu: softwareMenu },
  { key: 'hardware', route: 'hardware-products', label: 'nav_hardware', menu: hardwareMenu },
  { key: 'services', route: 'services', label: 'nav_services' },
  { key: 'about', route: 'team', label: 'nav_about' },
  { key: 'contact', route: 'contact', label: 'nav_contact' },
]

const easeApple = [0.25, 1, 0.5, 1] as const

export default function Navbar() {
  const { t } = useLocale()
  const path = usePath()
  const { pathname } = useLocation()
  const current = routeNameFromPath(pathname)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 16))

  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpenMenu(null)
      setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const isHome = current === 'home'
  const overHero = isHome && !scrolled && !mobileOpen

  const isActive = (item: NavItem) => {
    if (item.menu) return item.menu.some((link) => link.route === current) || current === item.route
    return current === item.route
  }

  const openWithHover = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(key)
  }

  const closeWithDelay = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: easeApple }}
        className={`mx-auto flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-500 sm:gap-4 sm:px-4 lg:rounded-[1.25rem] ${
          overHero
            ? 'max-w-7xl border-white/15 bg-white/[0.07] shadow-none backdrop-blur-md'
            : scrolled
              ? 'max-w-6xl border-black/10 bg-white/90 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.35)] backdrop-blur-2xl'
              : 'max-w-7xl border-black/[0.06] bg-white/75 shadow-[0_10px_40px_-26px_rgba(0,0,0,0.3)] backdrop-blur-2xl'
        }`}
      >
        <Link to={path('home')} aria-label="Visiosoft" className="shrink-0 rounded-lg px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/50">
          <img
            src="/img/visiosoft_logo.svg"
            alt="Visiosoft"
            width={103}
            height={24}
            className={`h-5 w-auto sm:h-6 ${overHero ? 'brightness-0 invert' : ''}`}
          />
        </Link>

        <ul className="ml-1 hidden flex-1 items-center gap-0 lg:flex xl:ml-2 xl:gap-0.5">
          {navItems.map((item) => (
            <li
              key={item.key}
              className="relative"
              onMouseEnter={() => {
                setHovered(item.key)
                if (item.menu) openWithHover(item.key)
              }}
              onMouseLeave={() => {
                setHovered(null)
                if (item.menu) closeWithDelay()
              }}
            >
              <NavLink
                to={path(item.route)}
                onFocus={() => (item.menu ? openWithHover(item.key) : setOpenMenu(null))}
                aria-expanded={item.menu ? openMenu === item.key : undefined}
                className={`relative z-10 flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2 text-[0.8rem] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#0071e3]/50 xl:px-3 xl:text-[0.9rem] ${
                  overHero
                    ? isActive(item)
                      ? 'text-white'
                      : 'text-white/75 hover:text-white'
                    : isActive(item)
                      ? 'text-[#1d1d1f]'
                      : 'text-[#1d1d1f]/70 hover:text-[#1d1d1f]'
                }`}
              >
                {t(item.label)}
                {item.menu ? (
                  <motion.svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3 opacity-60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ rotate: openMenu === item.key ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: easeApple }}
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </motion.svg>
                ) : null}
              </NavLink>

              {hovered === item.key ? (
                <motion.span
                  layoutId="nav-hover-pill"
                  className={`absolute inset-0 rounded-xl ${overHero ? 'bg-white/12' : 'bg-black/[0.05]'}`}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              ) : null}

              {isActive(item) ? (
                <motion.span
                  layoutId="nav-active-bar"
                  className={`absolute -bottom-0.5 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full ${overHero ? 'bg-white' : 'bg-[#0071e3]'}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              ) : null}

              <AnimatePresence>
                {item.menu && openMenu === item.key ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.985 }}
                    transition={{ duration: 0.18, ease: easeApple }}
                    onMouseEnter={() => openWithHover(item.key)}
                    onMouseLeave={closeWithDelay}
                    className="absolute left-0 top-full w-[min(44rem,calc(100vw-4rem))] pt-3"
                  >
                    <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white/95 p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                      <div className="grid gap-1 md:grid-cols-2">
                        {item.menu.map((link) => (
                          <NavLink
                            key={link.route}
                            to={path(link.route)}
                            className="group flex items-start gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-black/[0.04] focus-visible:bg-black/[0.04]"
                          >
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-[#f5f5f7] text-[#0071e3] transition-colors group-hover:border-[#0071e3]/40 group-hover:bg-[#e8f1fd]">
                              <Icon name={link.icon} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[0.875rem] font-semibold text-[#1d1d1f]">{t(link.title)}</span>
                              {link.desc ? <span className="mt-0.5 block truncate text-xs text-[#6e6e73]">{t(link.desc)}</span> : null}
                            </span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            to={path('quote.index')}
            className="group relative hidden overflow-hidden rounded-xl bg-[#0071e3] px-4 py-2 text-[0.85rem] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,113,227,0.6)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0077ed] focus-visible:ring-2 focus-visible:ring-[#0071e3]/50 md:inline-flex"
          >
            <span className="relative z-10">{t('Teklif Al')}</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={t('nav_mobile_menu')}
            aria-expanded={mobileOpen}
            className={`flex h-9 w-9 items-center justify-center rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#0071e3]/50 lg:hidden ${
              overHero
                ? 'border border-white/20 bg-white/10 text-white hover:bg-white/15'
                : 'border border-black/[0.08] bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.08]'
            }`}
          >
            <span className="relative block h-4 w-4">
              <motion.span
                className="absolute left-0 top-[3px] block h-[1.5px] w-4 rounded-full bg-current"
                animate={mobileOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.24, ease: easeApple }}
              />
              <motion.span
                className="absolute left-0 top-[11px] block h-[1.5px] w-4 rounded-full bg-current"
                animate={mobileOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.24, ease: easeApple }}
              />
            </span>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.26, ease: easeApple }}
            className="mx-auto mt-2 max-h-[calc(100svh-6rem)] max-w-7xl overflow-y-auto overscroll-contain rounded-2xl border border-black/[0.08] bg-white/95 p-3 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } }}
              className="flex flex-col"
            >
              {navItems.map((item) => (
                <motion.li
                  key={item.key}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.3, ease: easeApple }}
                  className="border-b border-black/[0.06] last:border-0"
                >
                  {item.menu ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMobileSection((value) => (value === item.key ? null : item.key))}
                        aria-expanded={mobileSection === item.key}
                        className="flex w-full items-center justify-between px-2 py-3.5 text-left text-base font-semibold text-[#1d1d1f] outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/50"
                      >
                        {t(item.label)}
                        <motion.svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 text-[#1d1d1f]/50"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          animate={{ rotate: mobileSection === item.key ? 180 : 0 }}
                          transition={{ duration: 0.22, ease: easeApple }}
                          aria-hidden="true"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </motion.svg>
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileSection === item.key ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: easeApple }}
                            className="overflow-hidden"
                          >
                            <div className="grid gap-1 pb-3 sm:grid-cols-2">
                              {item.menu.map((link) => (
                                <NavLink
                                  key={link.route}
                                  to={path(link.route)}
                                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-[#1d1d1f]/70 transition-colors hover:bg-black/[0.04] hover:text-[#1d1d1f]"
                                >
                                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-[#f5f5f7] text-[#0071e3]">
                                    <Icon name={link.icon} className="h-3.5 w-3.5" />
                                  </span>
                                  {t(link.title)}
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </>
                  ) : (
                    <NavLink
                      to={path(item.route)}
                      className="block px-2 py-3.5 text-base font-semibold text-[#1d1d1f] outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/50"
                    >
                      {t(item.label)}
                    </NavLink>
                  )}
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-3">
              <Link
                to={path('quote.index')}
                className="block rounded-xl bg-[#0071e3] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(0,113,227,0.7)]"
              >
                {t('Teklif Al')}
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
