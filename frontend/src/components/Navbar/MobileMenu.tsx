import { useId, useState } from 'react'
import type { RefObject } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../Button/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { company, whatsappUrl } from '../../data/company.ts'
import { navCta } from '../../data/siteNav.ts'
import type { NavItem, NavMenuLink } from '../../data/siteNav.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import NavIcon, { LedPanelArt } from './NavIcon.tsx'
import { navbarCopy } from './navbarCopy.ts'
import { cardImageSize, isItemActive, menuKind } from './navData.ts'
import type { MenuKind } from './navData.ts'
import styles from './MobileMenu.module.css'

const sheetVariants: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
  show: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.45, ease: revealEase, staggerChildren: 0.04, delayChildren: 0.08 },
  },
  exit: (reduce: boolean) =>
    reduce
      ? { opacity: 0, transition: { duration: 0 } }
      : { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.3, ease: revealEase } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: revealEase } },
}

type MobileMenuProps = {
  id: string
  items: NavItem[]
  current: string
  reduce: boolean
  sheetRef: RefObject<HTMLDivElement | null>
  onNavigate: () => void
}

/** 1024px altındaki tam yükseklik menü: akordeon gruplar, düz bağlantılar, CTA ve iletişim. */
export default function MobileMenu({ id, items, current, reduce, sheetRef, onNavigate }: MobileMenuProps) {
  const path = usePath()
  const { config } = useLocale()
  const baseId = useId()
  // Açılışta etkin sayfanın grubu açık gelir.
  const [expanded, setExpanded] = useState<string | null>(
    () => items.find((item) => item.menu?.some((link) => link.route === current))?.key ?? null,
  )

  const waId = config?.whatsapp_wa_id || company.whatsapp.waId
  const waDisplay = config?.whatsapp_display || company.whatsapp.display

  return (
    <motion.div
      ref={sheetRef}
      id={id}
      className={styles.sheet}
      custom={reduce}
      variants={sheetVariants}
      initial={reduce ? false : 'hidden'}
      animate="show"
      exit="exit"
    >
      <div className={styles.inner}>
        <nav aria-label={navbarCopy.navLabel}>
          <ul className={styles.list}>
            {items.map((item) => {
              const active = isItemActive(item, current)
              const link = (
                <Link
                  to={path(item.route)}
                  className={styles.link}
                  data-active={active}
                  aria-current={item.route === current ? 'page' : undefined}
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
              )

              if (!item.menu) {
                return (
                  <motion.li key={item.key} className={styles.item} variants={itemVariants}>
                    {link}
                  </motion.li>
                )
              }

              const open = expanded === item.key
              const groupId = `${baseId}-${item.key}`
              const kind = menuKind(item)

              return (
                <motion.li key={item.key} className={styles.item} variants={itemVariants}>
                  <div className={styles.row}>
                    {link}
                    <button
                      type="button"
                      className={styles.toggle}
                      aria-expanded={open}
                      aria-controls={groupId}
                      aria-label={navbarCopy.submenu(item.label)}
                      onClick={() => setExpanded(open ? null : item.key)}
                    >
                      <NavIcon name="chevron" className={styles.chevron} />
                    </button>
                  </div>
                  <div id={groupId} className={styles.group} data-open={open} inert={!open}>
                    <div className={styles.groupClip}>
                      <ul className={styles.sublist} data-kind={kind}>
                        {item.menu.map((child) => (
                          <li key={child.route}>
                            <SubLink link={child} kind={kind} to={path(child.route)} active={child.route === current} onNavigate={onNavigate} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        <motion.div className={styles.foot} variants={itemVariants}>
          <div className={styles.actions}>
            <Button to={path(navCta.primary.route)} variant="primary" size="lg" className={styles.action} onClick={onNavigate}>
              {navCta.primary.label}
            </Button>
            <Button to={path(navCta.secondary.route)} variant="secondary" size="lg" className={styles.action} onClick={onNavigate}>
              {navCta.secondary.label}
            </Button>
          </div>

          <div className={styles.contact}>
            <p className={styles.contactTitle}>{navbarCopy.contactTitle}</p>
            <a href={`mailto:${company.email}`} className={styles.contactLink}>
              <NavIcon name="mail" className={styles.contactIcon} />
              <span>{company.email}</span>
            </a>
            <a href={whatsappUrl(waId)} className={styles.contactLink} target="_blank" rel="noopener noreferrer">
              <NavIcon name="chat" className={styles.contactIcon} />
              <span>{waDisplay}</span>
              <span className={styles.srOnly}>{`, ${navbarCopy.whatsappHint}`}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

type SubLinkProps = {
  link: NavMenuLink
  kind: MenuKind
  to: string
  active: boolean
  onNavigate: () => void
}

function SubLink({ link, kind, to, active, onNavigate }: SubLinkProps) {
  const size = link.image ? cardImageSize(link.image) : null

  return (
    <Link to={to} className={styles.sublink} data-active={active} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
      {kind === 'hardware' ? (
        <span className={styles.thumb}>
          {link.image && size ? (
            <img
              className={styles.thumbImage}
              src={link.image}
              alt=""
              width={size.width}
              height={size.height}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          ) : (
            <LedPanelArt className={styles.thumbArt} />
          )}
        </span>
      ) : (
        <span className={styles.iconTile}>{link.icon ? <NavIcon name={link.icon} className={styles.icon} /> : null}</span>
      )}
      <span className={styles.subtext}>
        <span className={styles.sublabel}>{link.label}</span>
        <span className={styles.subdesc}>{link.description}</span>
      </span>
    </Link>
  )
}
