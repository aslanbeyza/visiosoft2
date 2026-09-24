import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import Button from '../Button/index.ts'
import Reveal, { RevealGroup, RevealItem, revealEase } from '../Reveal/index.ts'
import WhatsAppGlyph from '../WhatsAppButton/WhatsAppGlyph.tsx'
import { company, whatsappUrl } from '../../data/company.ts'
import { footerGroups, legalLinks, navCta } from '../../data/siteNav.ts'
import type { FooterGroup } from '../../data/siteNav.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { footerCopy } from './footerCopy.ts'
import { useMediaQuery } from './useMediaQuery.ts'
import styles from './Footer.module.css'

const LOGO_SRC = '/img/visiosoft_logo.svg'

const COLUMNS_QUERY = '(min-width: 640px)'

const iconPaths = {
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  external: 'M7 17 17 7M8 7h9v9',
  chevron: 'm6 9 6 6 6-6',
  mail: 'M3.5 6h17v12h-17zM4 6.5l8 6.5 8-6.5',
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
  const columns = useMediaQuery(COLUMNS_QUERY)
  const footerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: footerRef, offset: ['start end', 'end end'] })
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['30%', '0%'])

  const waId = config?.whatsapp_wa_id || company.whatsapp.waId
  const waDisplay = config?.whatsapp_display || company.whatsapp.display
  const year = new Date().getFullYear()

  const scrollToTop = () => {
    document.getElementById('main-content')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'instant' : 'smooth' })
  }

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.inner}>
        <h2 className={styles.srOnly}>{footerCopy.title}</h2>

        <RevealGroup className={styles.top} stagger={0.12}>
          <RevealItem className={styles.brand}>
            <Link to={path('home')} className={styles.brandLink}>
              <img
                className={styles.brandLogo}
                src={LOGO_SRC}
                alt={footerCopy.homeLabel}
                width={120}
                height={28}
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className={styles.statement}>{footerCopy.statement}</p>
            <div className={styles.actions}>
              <Button to={path(navCta.primary.route)} variant="light" arrow>
                {navCta.primary.label}
              </Button>
              <Button to={path(navCta.secondary.route)} variant="outlineLight">
                {navCta.secondary.label}
              </Button>
            </div>
          </RevealItem>

          <RevealItem className={styles.contact}>
            <h3 className={styles.heading}>{footerCopy.contactTitle}</h3>
            <ul className={styles.channels}>
              <li>
                <a className={styles.channel} href={whatsappUrl(waId)} target="_blank" rel="noopener noreferrer">
                  <span className={styles.channelIcon} aria-hidden="true">
                    <WhatsAppGlyph className={styles.channelGlyph} />
                  </span>
                  <span className={styles.channelText}>
                    <span className={styles.channelLabel}>{footerCopy.whatsappLabel}</span>{' '}
                    <span className={styles.channelValue}>
                      {waDisplay}
                      <Icon name="external" className={styles.channelArrow} />
                    </span>
                  </span>
                  <span className={styles.srOnly}> {footerCopy.newTab}</span>
                </a>
              </li>
              <li>
                <a className={styles.channel} href={`mailto:${company.email}`}>
                  <span className={styles.channelIcon} aria-hidden="true">
                    <Icon name="mail" className={styles.channelGlyph} />
                  </span>
                  <span className={styles.channelText}>
                    <span className={styles.channelLabel}>{footerCopy.emailLabel}</span>{' '}
                    <span className={styles.channelValue}>{company.email}</span>
                  </span>
                </a>
              </li>
            </ul>
            <Link to={path('contact')} className={styles.more}>
              <span className={styles.moreText}>{footerCopy.allContact}</span>
              <Icon name="arrowRight" className={styles.moreArrow} />
            </Link>
          </RevealItem>
        </RevealGroup>

        <nav className={styles.nav} aria-label={footerCopy.navLabel}>
          <Rule reduce={reduce} />
          <RevealGroup className={styles.groups} stagger={0.08}>
            {footerGroups.map((group) => (
              <RevealItem key={group.title} className={styles.group}>
                {columns ? (
                  <>
                    <h3 className={styles.heading}>{group.title}</h3>
                    <GroupLinks group={group} />
                  </>
                ) : (
                  <details className={styles.details}>
                    <summary className={styles.summary}>
                      <span className={styles.summaryInner}>
                        {group.title}
                        <Icon name="chevron" className={styles.chevron} />
                      </span>
                    </summary>
                    <GroupLinks group={group} />
                  </details>
                )}
              </RevealItem>
            ))}
          </RevealGroup>
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
