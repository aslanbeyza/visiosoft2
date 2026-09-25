import { useId, useState } from 'react'
import type { RefObject } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../Button/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { company } from '../../data/company.ts'
import { navCta } from '../../data/siteNav.ts'
import type { NavItem } from '../../data/siteNav.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { GroupLinks, SubLink } from './MobileMenuItems.tsx'
import NavIcon from './NavIcon.tsx'
import { menuCtas, menuIntros, navbarCopy } from './navbarCopy.ts'
import { isItemActive, menuKind, splitHardware } from './navData.ts'
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

export default function MobileMenu({ id, items, current, reduce, sheetRef, onNavigate }: MobileMenuProps) {
  const path = usePath()
  const baseId = useId()

  const [expanded, setExpanded] = useState<string | null>(
    () => items.find((item) => item.menu?.some((link) => link.route === current))?.key ?? null,
  )

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
              const split = splitHardware(item.menu)
              const primary = kind === 'hardware' ? split.cards : item.menu
              const accessories = kind === 'hardware' ? split.accessories : []
              const cta = menuCtas[kind]
              const extraLink = menuIntros[kind].extraLink
              const footLinks = [
                { to: path(item.route), label: menuIntros[kind].linkLabel, active: item.route === current },
                ...(extraLink ? [{ to: path(extraLink.route), label: extraLink.label, active: extraLink.route === current }] : []),
                { to: path(cta.route), label: cta.linkLabel, active: cta.route === current },
              ]

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
                      <div className={styles.groupBody}>
                        <ul className={styles.sublist} data-kind={kind}>
                          {primary.map((child) => (
                            <li key={child.route}>
                              <SubLink
                                link={child}
                                media={kind === 'hardware' ? 'product' : 'icon'}
                                to={path(child.route)}
                                active={child.route === current}
                                onNavigate={onNavigate}
                              />
                            </li>
                          ))}
                        </ul>
                        {accessories.length > 0 ? (
                          <>
                            <p className={styles.subcaption}>{navbarCopy.accessoryLabel}</p>
                            <ul className={styles.sublist}>
                              {accessories.map((child) => (
                                <li key={child.route}>
                                  <SubLink link={child} media="plain" to={path(child.route)} active={child.route === current} onNavigate={onNavigate} />
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                        <GroupLinks links={footLinks} onNavigate={onNavigate} />
                      </div>
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
            <Button to={path(navCta.contact.route)} variant="secondary" size="lg" className={styles.action} onClick={onNavigate}>
              {navCta.contact.label}
            </Button>
          </div>

          <div className={styles.contact}>
            <p className={styles.contactTitle}>{navbarCopy.contactTitle}</p>
            <a href={`mailto:${company.email}`} className={styles.contactLink}>
              <NavIcon name="mail" className={styles.contactIcon} />
              <span>{company.email}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
