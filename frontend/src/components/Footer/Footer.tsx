import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import JsonLd from '../JsonLd/index.ts'
import { company, phoneUrl, whatsappUrl } from '../../data/company.ts'
import { footerColumns, legalLinks } from '../../data/siteNav.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { footerCopy } from './footerCopy.ts'
import { organizationSchema } from './organizationSchema.ts'
import styles from './Footer.module.css'

const LOGO_SRC = '/img/visiosoft_logo.svg'

/**
 * Apple-style footer: one contact line, a short link directory, the legal row,
 * and one small brand line above the large faint wordmark. No buttons — the navbar and page CTAs already carry them.
 */
export default function Footer() {
  const { config } = useLocale()
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const footerRef = useRef<HTMLElement>(null)

  // The wordmark rises from the bottom edge while the footer scrolls into view.
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ['start end', 'end end'] })
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['30%', '0%'])

  const waId = config?.whatsapp_wa_id || company.whatsapp.waId
  const waDisplay = config?.whatsapp_display || company.whatsapp.display
  const year = new Date().getFullYear()

  return (
    <footer ref={footerRef} className={styles.footer}>
      <JsonLd id="organization-schema" data={organizationSchema} />
      <div className={styles.inner}>
        <h2 className={styles.srOnly}>{footerCopy.title}</h2>

        <p className={styles.contact}>
          <span className={styles.contactLead}>{footerCopy.contactLead}</span>
          <a href={phoneUrl(waId)} className={styles.inline}>
            {waDisplay}
          </a>
          <span aria-hidden="true">·</span>
          <a href={whatsappUrl(waId)} target="_blank" rel="noopener noreferrer" className={styles.inline}>
            {footerCopy.whatsappLabel}
            <span className={styles.srOnly}> {footerCopy.newTab}</span>
          </a>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${company.email}`} className={styles.inline}>
            {company.email}
          </a>
        </p>

        <nav className={styles.nav} aria-label={footerCopy.navLabel}>
          {footerColumns.map((column) => (
            <div key={column.title} className={styles.column}>
              <h3 className={styles.heading}>{column.title}</h3>
              <ul className={styles.links}>
                {column.links.map((link) => (
                  <li key={link.route}>
                    <NavLink to={path(link.route)} end className={styles.link}>
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.bottom}>
          <nav aria-label={footerCopy.legalLabel}>
            <ul className={styles.legal}>
              {legalLinks.map((link) => (
                <li key={link.route}>
                  <NavLink to={path(link.route)} end className={styles.link}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Link to={`${path('contact')}#sirket-bilgileri`} className={styles.link}>
                  {footerCopy.companyFacts}
                </Link>
              </li>
            </ul>
          </nav>
          <p className={styles.copyright}>
            © {year} {company.legalName} {footerCopy.rights}
          </p>
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
