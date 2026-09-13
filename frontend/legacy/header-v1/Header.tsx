import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { routeNameFromPath } from '../../lib/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import Logo from '../Logo/index.ts'
import styles from './Header.module.css'

const softwareLinks = [
  { route: 'software-products', title: 'Park Yazılım', desc: 'nav_read_more' },
  { route: 'developers', title: 'nav_developers', desc: 'sw_dev_to_dev' },
  { route: 'end-to-end', title: 'footer_end_to_end_system', desc: 'Hub & Spoke Modeli' },
  { route: 'on-street', title: 'footer_on_street_parking', desc: 'Kamera & HGS' },
  { route: 'website-pricing', title: 'Site Otopark Yönetimi', desc: 'Bulut tabanlı site otopark yönetimi' },
  { route: 'parking-violations', title: 'footer_parking_violations', desc: 'sw_violation_desc' },
  { route: 'hgs', title: 'HGS Ödeme Sistemi', desc: 'footer_hgs_payment' },
  { route: 'kus-bakisi', title: 'nav_birds_eye', desc: 'sw_birds_eye_desc' },
]

const hardwareLinks = [
  { route: 'hardware-products.kiosk', title: 'Kiosk' },
  { route: 'hardware-products.tir-kiosk', title: 'TIR Kiosk' },
  { route: 'hardware-products.visiobox', title: 'Visiobox' },
  { route: 'hardware-products.rack-kabin', title: 'Rack Kabin' },
  { route: 'hardware-products.kamera-muhafaza', title: 'Kamera Muhafaza' },
  { route: 'hardware-products.kamera-montaj-kulesi', title: 'Kamera Montaj Kulesi' },
  { route: 'hardware-products.ledli-reklam-paneli', title: 'Ledli Reklam Paneli' },
]

export default function Header() {
  const { t } = useLocale()
  const path = usePath()
  const { pathname } = useLocation()
  const current = routeNameFromPath(pathname)
  const [open, setOpen] = useState(false)
  const [softwareOpen, setSoftwareOpen] = useState(false)
  const [hardwareOpen, setHardwareOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const softwareActive = softwareLinks.some((item) => item.route === current)
  const hardwareActive = current.startsWith('hardware-products')

  return (
    <header className={styles.shell}>
      <div className={styles.wrap}>
        <nav className={styles.bar}>
          <Logo invert />

          <ul className={styles.links}>
            <li>
              <NavLink to={path('alpr.index')} className={`${styles.link} ${current === 'alpr.index' ? styles.active : ''}`}>
                {t('nav_alpr')}
              </NavLink>
            </li>
            <li className={styles.dropdown}>
              <NavLink
                to={path('software-products')}
                className={`${styles.link} ${softwareActive ? styles.active : ''}`}
              >
                {t('nav_software')}
                <span className={styles.chevron}>▾</span>
              </NavLink>
              <div className={styles.menu}>
                <div className={styles.menuInner}>
                  {softwareLinks.map((item) => (
                    <NavLink key={item.route} to={path(item.route)} className={styles.menuItem}>
                      <strong>{t(item.title)}</strong>
                      <span>{t(item.desc)}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </li>
            <li className={styles.dropdown}>
              <NavLink
                to={path('hardware-products')}
                className={`${styles.link} ${hardwareActive ? styles.active : ''}`}
              >
                {t('nav_hardware')}
                <span className={styles.chevron}>▾</span>
              </NavLink>
              <div className={styles.menu}>
                <div className={styles.menuInner}>
                  <NavLink to={path('hardware-products')} className={styles.menuItem}>
                    <strong>{t('nav_hardware')}</strong>
                    <span>{t('nav_read_more')}</span>
                  </NavLink>
                  {hardwareLinks.map((item) => (
                    <NavLink key={item.route} to={path(item.route)} className={styles.menuItem}>
                      <strong>{t(item.title)}</strong>
                    </NavLink>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <NavLink to={path('services')} className={`${styles.link} ${current === 'services' ? styles.active : ''}`}>
                {t('nav_services')}
              </NavLink>
            </li>
            <li>
              <NavLink to={path('contact')} className={`${styles.link} ${current === 'contact' ? styles.active : ''}`}>
                {t('nav_contact')}
              </NavLink>
            </li>
          </ul>

          <button
            className={styles.menuBtn}
            type="button"
            aria-label={t('nav_mobile_menu')}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? '✕' : '☰'}
          </button>
        </nav>
      </div>

      {open ? (
        <div className={styles.mobile}>
          <div className={styles.mobileTop}>
            <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={t('nav_mobile_close')}>
              ✕
            </button>
          </div>

          <NavLink to={path('alpr.index')} className={styles.mobileLink}>
            {t('nav_alpr')}
          </NavLink>

          <button type="button" className={styles.mobileLink} onClick={() => setSoftwareOpen((value) => !value)}>
            <span>{t('nav_software')}</span>
            <span>{softwareOpen ? '▴' : '▾'}</span>
          </button>
          {softwareOpen
            ? softwareLinks.map((item) => (
                <NavLink key={item.route} to={path(item.route)} className={styles.mobileSub}>
                  {t(item.title)}
                </NavLink>
              ))
            : null}

          <button type="button" className={styles.mobileLink} onClick={() => setHardwareOpen((value) => !value)}>
            <span>{t('nav_hardware')}</span>
            <span>{hardwareOpen ? '▴' : '▾'}</span>
          </button>
          {hardwareOpen ? (
            <>
              <NavLink to={path('hardware-products')} className={styles.mobileSub}>
                {t('nav_hardware')}
              </NavLink>
              {hardwareLinks.map((item) => (
                <NavLink key={item.route} to={path(item.route)} className={styles.mobileSub}>
                  {t(item.title)}
                </NavLink>
              ))}
            </>
          ) : null}

          <NavLink to={path('services')} className={styles.mobileLink}>
            {t('nav_services')}
          </NavLink>
          <NavLink to={path('contact')} className={styles.mobileLink}>
            {t('nav_contact')}
          </NavLink>
        </div>
      ) : null}
    </header>
  )
}
