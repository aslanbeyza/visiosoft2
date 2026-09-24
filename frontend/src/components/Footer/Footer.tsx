import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import Reveal, { RevealGroup, RevealItem, revealEase } from '../Reveal/index.ts'
import WhatsAppGlyph from '../WhatsAppButton/WhatsAppGlyph.tsx'
import { company, whatsappUrl } from '../../data/company.ts'
import { footerGroups, legalLinks } from '../../data/siteNav.ts'
import type { FooterGroup } from '../../data/siteNav.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { footerCopy } from './footerCopy.ts'
import styles from './Footer.module.css'

const LOGO_SRC = '/img/visiosoft_logo.svg'

const iconPaths = {
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  mail: 'M3.5 6h17v12h-17zM4 6.5l8 6.5 8-6.5',
  phone: 'M22 16.9v2.6a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h2.6a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.7 9.5a16 16 0 0 0 6.8 6.8l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
} as const

type IconName = keyof typeof iconPaths

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={iconPaths[name]} />
    </svg>
  )
}

/** Satırları ayıran ince çizgi; görünüme girince soldan sağa çizilir. */
function Rule({ reduce }: { reduce: boolean }) {
  return (
    <motion.span
      className={styles.rule}
      aria-hidden="true"
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 1.2, ease: revealEase }}
    />
  )
}

function GroupLinks({ group }: { group: FooterGroup }) {
  const path = usePath()

  return (
    <ul className={styles.links}>
      {group.links.map((link) => (
        <li key={`${link.route}-${link.label}`}>
          <NavLink to={path(link.route)} end className={styles.link}>
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default function Footer() {
  const { config } = useLocale()
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const footerRef = useRef<HTMLElement>(null)

  // Dev logo, alt bilgi görünür olduğu andan sayfa sonuna kadar alt kenardan yükselir.
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ['start end', 'end end'] })
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['30%', '0%'])

  const waId = config?.whatsapp_wa_id || company.whatsapp.waId
  const waDisplay = config?.whatsapp_display || company.whatsapp.display
  const year = new Date().getFullYear()

  // Odak ana içeriğe taşınır; klavye kullanıcısı sayfanın başından devam eder.
  const scrollToTop = () => {
    document.getElementById('main-content')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'instant' : 'smooth' })
  }

  return (
    <footer id="site-footer" ref={footerRef} className={styles.footer}>
      <div className={styles.inner}>
        <h2 className={styles.srOnly}>{footerCopy.title}</h2>

        <nav className={styles.nav} aria-label={footerCopy.navLabel}>
          <RevealGroup className={styles.groups} stagger={0.08}>
            {footerGroups.map((group) => (
              <RevealItem key={group.title} className={styles.group}>
                <h3 className={styles.heading}>{group.title}</h3>
                <GroupLinks group={group} />
              </RevealItem>
            ))}
          </RevealGroup>
          <ul className={styles.reach} aria-label={footerCopy.contactTitle}>
            <li>
              <a className={styles.reachLink} href={`tel:+${waId}`}>
                <Icon name="phone" className={styles.reachIcon} />
                <span className={styles.reachTip}>{waDisplay}</span>
                <span className={styles.srOnly}>{footerCopy.phoneLabel}</span>
              </a>
            </li>
            <li>
              <a className={styles.reachLink} href={whatsappUrl(waId)} target="_blank" rel="noopener noreferrer">
                <WhatsAppGlyph className={styles.reachIcon} />
                <span className={styles.reachTip}>{waDisplay}</span>
                <span className={styles.srOnly}>
                  {footerCopy.whatsappLabel} {footerCopy.newTab}
                </span>
              </a>
            </li>
            <li>
              <a className={styles.mailField} href={`mailto:${company.email}`}>
                <Icon name="mail" className={styles.reachIcon} />
                <span>{company.email}</span>
                <span className={styles.srOnly}>{footerCopy.emailLabel}</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className={styles.locations}>
          <Rule reduce={reduce} />
          <RevealGroup stagger={0.07}>
            <RevealItem>
              <h3 className={styles.heading}>{footerCopy.locationsTitle}</h3>
            </RevealItem>
            <address className={styles.address}>
              <ul className={styles.locationList}>
                {company.locations.map((location) => (
                  <RevealItem as="li" key={location.key} className={styles.location}>
                    <span className={styles.locationLabel}>
                      <Icon name="pin" className={styles.pin} />
                      {location.label}
                    </span>{' '}
                    <span className={styles.locationAddress}>{location.address}</span>
                  </RevealItem>
                ))}
              </ul>
            </address>
          </RevealGroup>
        </div>

        <div className={styles.bottom}>
          <Rule reduce={reduce} />
          <Reveal className={styles.bottomGrid} y={16} amount={0.4}>
            <p className={styles.copyright}>
              © {year} {company.legalName} {footerCopy.rights}
            </p>
            <nav className={styles.legalNav} aria-label={footerCopy.legalLabel}>
              <ul className={styles.legal}>
                {legalLinks.map((link) => (
                  <li key={link.route}>
                    <NavLink to={path(link.route)} end className={`${styles.link} ${styles.legalLink}`}>
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <button type="button" className={styles.toTop} onClick={scrollToTop}>
              {footerCopy.backToTop}
              <Icon name="arrowUp" className={styles.toTopIcon} />
            </button>
          </Reveal>
        </div>
      </div>

      <div className={styles.wordmark} aria-hidden="true">
        <motion.img
          className={styles.wordmarkImg}
          src={LOGO_SRC}
          alt=""
          width={1648}
          height={385}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={reduce ? undefined : { y: wordmarkY }}
        />
      </div>
    </footer>
  )
}
