import { Link } from 'react-router-dom'
import type { NavMenuLink } from '../../data/siteNav.ts'
import NavIcon from './NavIcon.tsx'
import { imageAspectStyle } from './navData.ts'
import styles from './MobileMenu.module.css'

type SubLinkProps = {
  link: NavMenuLink
  /** product: küçük ürün görseli, icon: yazılım ikon karosu, plain: yalnızca metin (aksesuar). */
  media: 'product' | 'icon' | 'plain'
  to: string
  active: boolean
  onNavigate: () => void
}

/** Mobil akordeon satırı: ad + kısa açıklama, isteğe bağlı küçük görsel ya da ikon. */
export function SubLink({ link, media, to, active, onNavigate }: SubLinkProps) {
  const { image } = link

  return (
    <Link to={to} className={styles.sublink} data-media={media} data-active={active} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
      {media === 'product' ? (
        <span className={styles.thumb} style={image ? imageAspectStyle(image) : undefined}>
          {image ? (
            <picture>
              <source srcSet={image.avif} type="image/avif" />
              <img
                className={styles.thumbImage}
                src={image.webp}
                alt=""
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </picture>
          ) : null}
        </span>
      ) : null}
      {media === 'icon' ? (
        <span className={styles.iconTile}>{link.icon ? <NavIcon name={link.icon} className={styles.icon} /> : null}</span>
      ) : null}
      <span className={styles.subtext}>
        <span className={styles.sublabel}>{link.label}</span>
        <span className={styles.subdesc}>{link.description}</span>
      </span>
    </Link>
  )
}

export type GroupLink = { to: string; label: string; active: boolean }

/** Grubun altındaki düz bağlantılar: "tümünü görüntüle" ve yönlendirme (CTA kartı yerine sade bağlantı). */
export function GroupLinks({ links, onNavigate }: { links: GroupLink[]; onNavigate: () => void }) {
  return (
    <ul className={styles.groupLinks}>
      {links.map((link) => (
        <li key={link.to}>
          <Link to={link.to} className={styles.groupLink} aria-current={link.active ? 'page' : undefined} onClick={onNavigate}>
            {link.label}
            <NavIcon name="arrow" className={styles.groupArrow} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
