import { Link } from 'react-router-dom'
import type { NavMenuLink } from '../../data/siteNav.ts'
import NavIcon from './NavIcon.tsx'
import { imageAspectStyle } from './navData.ts'
import styles from './MegaMenu.module.css'

type ItemProps = {
  link: NavMenuLink
  to: string
  active: boolean
  onNavigate: () => void
}

/** Donanım kartı: kartın tamamı tek bağlantı; görsel 4/3 kutuda contain ile tabana oturur. */
export function HardwareCard({ link, to, active, onNavigate }: ItemProps) {
  const { image } = link

  return (
    <Link to={to} className={styles.card} data-active={active} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
      <span className={styles.stage} style={image ? imageAspectStyle(image) : undefined}>
        {image ? (
          <picture>
            <source srcSet={image.avif} type="image/avif" />
            <img
              className={styles.image}
              src={image.webp}
              alt=""
              width={image.width}
              height={image.height}
              decoding="async"
              draggable={false}
            />
          </picture>
        ) : null}
      </span>
      <span className={styles.cardName}>
        <span className={styles.cardLabel}>{link.label}</span>
        <NavIcon name="arrow" className={styles.cardArrow} />
      </span>
      <span className={styles.cardDesc}>{link.description}</span>
    </Link>
  )
}

/** Yazılım bağlantısı: ikon karosu, ad + kısa açıklama; üzerine gelince ok belirir. */
export function SoftwareLink({ link, to, active, onNavigate }: ItemProps) {
  return (
    <Link to={to} className={styles.row} data-active={active} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
      <span className={styles.iconTile}>{link.icon ? <NavIcon name={link.icon} className={styles.icon} /> : null}</span>
      <span className={styles.rowText}>
        <span className={styles.rowName}>
          <span className={styles.rowLabel}>{link.label}</span>
          <NavIcon name="arrow" className={styles.rowArrow} />
        </span>
        <span className={styles.rowDesc}>{link.description}</span>
      </span>
    </Link>
  )
}
