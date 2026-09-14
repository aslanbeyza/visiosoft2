import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { revealEase } from '../Reveal/index.ts'
import { navCta } from '../../data/siteNav.ts'
import type { NavItem, NavMenuLink } from '../../data/siteNav.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import NavIcon, { LedPanelArt } from './NavIcon.tsx'
import { discoveryPromo, menuIntros } from './navbarCopy.ts'
import { cardImageSize, menuKind } from './navData.ts'
import type { PanelCustom } from './navData.ts'
import styles from './MegaMenu.module.css'

// Gölge kırpılmasın diye açık durumda alt kenar negatif tutulur.
const CLIP_CLOSED = 'inset(0% 0% 100% 0%)'
const CLIP_OPEN = 'inset(0% 0% -40% 0%)'

const panelVariants: Variants = {
  hidden: ({ swap }: PanelCustom) => (swap ? { opacity: 0, y: 0, clipPath: CLIP_OPEN } : { opacity: 0, y: -8, clipPath: CLIP_CLOSED }),
  show: ({ swap }: PanelCustom) => ({
    opacity: 1,
    y: 0,
    clipPath: CLIP_OPEN,
    transition: {
      duration: swap ? 0.2 : 0.42,
      ease: revealEase,
      staggerChildren: 0.03,
      delayChildren: swap ? 0 : 0.06,
    },
  }),
  exit: ({ swap, reduce }: PanelCustom) =>
    swap || reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6, transition: { duration: 0.18, ease: revealEase } },
}

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: revealEase } },
}

type MegaMenuProps = {
  id: string
  item: NavItem
  current: string
  custom: PanelCustom
  onNavigate: () => void
}

/** Masaüstü mega menü paneli: tanıtım sütunu + donanım kartları ya da yazılım listesi. */
export default function MegaMenu({ id, item, current, custom, onNavigate }: MegaMenuProps) {
  const path = usePath()
  const kind = menuKind(item)
  const intro = menuIntros[kind]
  const links = item.menu ?? []

  return (
    <motion.div
      id={id}
      className={styles.panel}
      data-kind={kind}
      custom={custom}
      variants={panelVariants}
      initial={custom.reduce ? false : 'hidden'}
      animate="show"
      exit="exit"
    >
      <div className={styles.inner}>
        <motion.div className={styles.intro} variants={itemVariants}>
          <p className={styles.eyebrow}>
            <span className={styles.rule} aria-hidden="true" />
            {intro.eyebrow}
          </p>
          <p className={styles.title}>{intro.title}</p>
          <p className={styles.text}>{intro.text}</p>
          <div className={styles.introFoot}>
            <Link
              to={path(item.route)}
              className={styles.allLink}
              aria-current={item.route === current ? 'page' : undefined}
              onClick={onNavigate}
            >
              {intro.linkLabel}
              <NavIcon name="arrow" className={styles.allArrow} />
            </Link>
          </div>
        </motion.div>

        {kind === 'hardware' ? (
          <motion.ul className={styles.cards} variants={groupVariants}>
            {links.map((link) => (
              <motion.li key={link.route} className={styles.cardItem} variants={itemVariants}>
                <HardwareCard link={link} to={path(link.route)} active={link.route === current} onNavigate={onNavigate} />
              </motion.li>
            ))}
            <motion.li className={styles.cardItem} variants={itemVariants}>
              <Link
                to={path(navCta.secondary.route)}
                className={styles.promo}
                aria-current={navCta.secondary.route === current ? 'page' : undefined}
                onClick={onNavigate}
              >
                <span className={styles.promoEyebrow}>{discoveryPromo.eyebrow}</span>
                <span className={styles.promoTitle}>{discoveryPromo.title}</span>
                <span className={styles.promoText}>{discoveryPromo.text}</span>
                <span className={styles.promoFoot} aria-hidden="true">
                  <span className={styles.promoArrow}>
                    <NavIcon name="arrow" className={styles.promoArrowIcon} />
                  </span>
                </span>
              </Link>
            </motion.li>
          </motion.ul>
        ) : (
          <motion.ul className={styles.rows} variants={groupVariants}>
            {links.map((link) => (
              <motion.li key={link.route} variants={itemVariants}>
                <Link
                  to={path(link.route)}
                  className={styles.row}
                  data-active={link.route === current}
                  aria-current={link.route === current ? 'page' : undefined}
                  onClick={onNavigate}
                >
                  <span className={styles.iconTile}>{link.icon ? <NavIcon name={link.icon} className={styles.icon} /> : null}</span>
                  <span className={styles.rowText}>
                    <span className={styles.rowLabel}>{link.label}</span>
                    <span className={styles.rowDesc}>{link.description}</span>
                  </span>
                  <NavIcon name="arrow" className={styles.rowArrow} />
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.div>
  )
}

type HardwareCardProps = {
  link: NavMenuLink
  to: string
  active: boolean
  onNavigate: () => void
}

function HardwareCard({ link, to, active, onNavigate }: HardwareCardProps) {
  const size = link.image ? cardImageSize(link.image) : null

  return (
    <Link to={to} className={styles.card} data-active={active} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
      <span className={styles.stage}>
        {link.image && size ? (
          <img
            className={styles.image}
            src={link.image}
            alt=""
            width={size.width}
            height={size.height}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        ) : link.icon === 'led' ? (
          <LedPanelArt className={styles.art} />
        ) : link.icon ? (
          <NavIcon name={link.icon} className={styles.stageIcon} />
        ) : null}
      </span>
      <span className={styles.cardLabel}>{link.label}</span>
      <span className={styles.cardDesc}>{link.description}</span>
    </Link>
  )
}
