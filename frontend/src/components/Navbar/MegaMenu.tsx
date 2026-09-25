import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { revealEase } from '../Reveal/index.ts'
import type { NavItem } from '../../data/siteNav.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { HardwareCard, SoftwareLink } from './MegaMenuItems.tsx'
import NavIcon from './NavIcon.tsx'
import { menuCtas, menuIntros, navbarCopy } from './navbarCopy.ts'
import { menuKind, splitHardware } from './navData.ts'
import type { PanelCustom } from './navData.ts'
import styles from './MegaMenu.module.css'

const OFFSET = 8

const panelVariants: Variants = {
  hidden: ({ swap, reduce }: PanelCustom) => ({ opacity: 0, y: swap || reduce ? 0 : OFFSET }),
  show: ({ swap, reduce }: PanelCustom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: swap || reduce ? 0.14 : 0.22, ease: revealEase },
  }),
  exit: ({ swap, reduce }: PanelCustom) =>
    swap
      ? { opacity: 0, transition: { duration: 0 } }
      : { opacity: 0, y: reduce ? 0 : OFFSET, transition: { duration: reduce ? 0.1 : 0.2, ease: revealEase } },
}

type MegaMenuProps = {
  id: string
  item: NavItem
  current: string
  custom: PanelCustom
  onNavigate: () => void
}

export default function MegaMenu({ id, item, current, custom, onNavigate }: MegaMenuProps) {
  const path = usePath()
  const kind = menuKind(item)
  const intro = menuIntros[kind]
  const cta = menuCtas[kind]
  const links = item.menu ?? []
  const { cards, accessories } = splitHardware(links)
  const pageState = (route: string) => (route === current ? ('page' as const) : undefined)

  return (
    <motion.div
      id={id}
      className={styles.panel}
      data-kind={kind}
      custom={custom}
      variants={panelVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            <span className={styles.rule} aria-hidden="true" />
            {intro.eyebrow}
          </p>
          <p className={styles.title}>{intro.title}</p>
          <p className={styles.text}>{intro.text}</p>
          <Link to={path(item.route)} className={styles.allLink} aria-current={pageState(item.route)} onClick={onNavigate}>
            {intro.linkLabel}
            <NavIcon name="arrow" className={styles.allArrow} />
          </Link>
          {intro.extraLink ? (
            <Link
              to={path(intro.extraLink.route)}
              className={styles.allLink}
              aria-current={pageState(intro.extraLink.route)}
              onClick={onNavigate}
            >
              {intro.extraLink.label}
              <NavIcon name="arrow" className={styles.allArrow} />
            </Link>
          ) : null}

          {kind === 'hardware' && accessories.length > 0 ? (
            <div className={styles.accessory}>
              <p className={styles.accessoryLabel}>{navbarCopy.accessoryLabel}</p>
              <ul className={styles.accessoryList}>
                {accessories.map((link) => (
                  <li key={link.route}>
                    <Link to={path(link.route)} className={styles.accessoryLink} aria-current={pageState(link.route)} onClick={onNavigate}>
                      <span className={styles.accessoryName}>
                        {link.label}
                        <NavIcon name="arrow" className={styles.accessoryArrow} />
                      </span>
                      <span className={styles.accessoryDesc}>{link.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {kind === 'hardware' ? (
          <ul className={styles.cards}>
            {cards.map((link) => (
              <li key={link.route} className={styles.cardItem}>
                <HardwareCard link={link} to={path(link.route)} active={link.route === current} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className={styles.rows}>
            {links.map((link) => (
              <li key={link.route} className={styles.rowItem}>
                <SoftwareLink link={link} to={path(link.route)} active={link.route === current} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        )}

        {}
        <div className={styles.cta}>
          <p className={styles.ctaTitle}>{cta.title}</p>
          <p className={styles.ctaText}>{cta.text}</p>
          {cta.steps ? (
            <div className={styles.ctaSteps}>
              <p className={styles.ctaCaption}>{cta.steps.caption}</p>
              <ol className={styles.ctaStepList}>
                {cta.steps.items.map((step, index) => (
                  <li key={step} className={styles.ctaStep}>
                    <span className={styles.ctaStepIndex} aria-hidden="true">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          <Link to={path(cta.route)} className={styles.ctaLink} aria-current={pageState(cta.route)} onClick={onNavigate}>
            {cta.linkLabel}
            <NavIcon name="arrow" className={styles.ctaArrow} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
