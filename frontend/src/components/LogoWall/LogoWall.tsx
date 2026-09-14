/**
 * Kullanım:
 * <LogoWall variant="grid" label="Referanslar" showNames logos={references.map((r) => ({ src: r.url, alt: r.name, href: r.website }))} />
 * <LogoWall variant="marquee" logos={…} />
 * grid: sabit boyutlu karolar ortalanır, satırlar dengelenir (6 logo dar alanda 3 + 3); hücreler sırayla belirir,
 * kenarlık köşeden açılır; logolar optik alanına göre sığdırılır, gri (%85) logo üzerine gelince ya da odakta renklenir.
 * marquee: iki ters yönlü satır; yalnızca görünürken kayar, üzerine gelince ve düğmeyle durur; hareket azaltmada ızgaraya döner.
 */
import { useRef, useState, useSyncExternalStore } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { fitLogo } from './fitLogo.ts'
import { logoWallCopy as copy } from './logoWallCopy.ts'
import styles from './LogoWall.module.css'

export type Logo = {
  src: string
  alt: string
  href?: string
  width?: number
  height?: number
}

export type LogoWallProps = {
  logos: Logo[]
  variant?: 'grid' | 'marquee'
  /** Listenin erişilebilir adı. */
  label?: string
  tone?: 'light' | 'dark'
  /** Logonun altında adını da yazar. */
  showNames?: boolean
  className?: string
}

/** Logo başına kayma süresi (sn); satır uzunluğu değişse de hız aynı kalır. */
const SECONDS_PER_LOGO = 3.4

const subscribeVisibility = (callback: () => void) => {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}

/** Sekme arka plandayken kayma durur. */
const usePageVisible = () =>
  useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true,
  )
const DEFAULT_SIZE = { width: 160, height: 80 }

const cellVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: revealEase, delay, delayChildren: delay },
  }),
}

/** Gerçek CSS kenarlığı sol üst köşeden açılır (clip-path); bittiğinde hiç kırpmaz, köşede boşluk kalmaz. */
const borderVariants: Variants = {
  hidden: { clipPath: 'inset(0% 100% 100% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, ease: revealEase } },
}

/** Yüklenince (ya da önbellekten hazır gelince) logoyu optik alanına göre yerleştirir. */
const fitOnReady = (img: HTMLImageElement | null) => {
  if (img?.complete && img.naturalWidth) fitLogo(img)
}

/**
 * Gri ve renkli iki katman aynı dosyadır (tek indirme); üzerine gelince yalnızca renkli katmanın opaklığı değişir.
 * Renkli katman ekran okuyucudan gizlidir.
 */
function LogoImage({ logo, decorative = false }: { logo: Logo; decorative?: boolean }) {
  const shared = {
    src: logo.src,
    width: logo.width ?? DEFAULT_SIZE.width,
    height: logo.height ?? DEFAULT_SIZE.height,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    draggable: false,
  }
  return (
    <span className={styles.art}>
      <img {...shared} alt={decorative ? '' : logo.alt} className={`${styles.logo} ${styles.grey}`} ref={fitOnReady} onLoad={(event) => fitLogo(event.currentTarget)} />
      <img {...shared} alt="" aria-hidden="true" className={`${styles.logo} ${styles.colour}`} />
    </span>
  )
}

type TileProps = {
  logo: Logo
  showNames: boolean
  decorative?: boolean
  drawn?: boolean
}

/** Logo kutusu: bağlantı varsa <a>, yoksa <div>. Ad, görselin alt metnini yinelediği için ekran okuyucudan gizlidir. */
function Tile({ logo, showNames, decorative = false, drawn = false }: TileProps) {
  const inner = (
    <span className={styles.logoBox}>
      {drawn ? <motion.span className={styles.border} variants={borderVariants} aria-hidden="true" /> : null}
      <LogoImage logo={logo} decorative={decorative} />
    </span>
  )

  const name = showNames ? (
    <span className={styles.name} aria-hidden="true">
      {logo.alt}
    </span>
  ) : null

  if (logo.href && !decorative) {
    return (
      <a href={logo.href} className={styles.tile} data-drawn={drawn ? 'true' : undefined} target="_blank" rel="noopener noreferrer">
        {inner}
        {name}
        <span className={styles.srOnly}> ({copy.external})</span>
      </a>
    )
  }

  return (
    <div className={styles.tile} data-drawn={drawn ? 'true' : undefined}>
      {inner}
      {name}
    </div>
  )
}

function Grid({ logos, label, showNames, reduce }: { logos: Logo[]; label?: string; showNames: boolean; reduce: boolean }) {
  return (
    // --n: satırları dengelemek için logo sayısı (ör. 6 logo, 4'lük alanda 3 + 3 ortalanır).
    <ul className={styles.grid} role="list" aria-label={label} style={{ '--n': logos.length } as CSSProperties}>
      {logos.map((logo, index) => (
        <motion.li
          key={`${logo.src}-${logo.alt}`}
          className={styles.cell}
          variants={cellVariants}
          custom={(index % 6) * 0.05}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <Tile logo={logo} showNames={showNames} drawn />
        </motion.li>
      ))}
    </ul>
  )
}

function Marquee({ logos, label, showNames }: { logos: Logo[]; label?: string; showNames: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.1 })
  const pageVisible = usePageVisible()
  const [paused, setPaused] = useState(false)

  const half = Math.ceil(logos.length / 2)
  const rows = [logos.slice(0, half), logos.slice(half)].filter((row) => row.length > 0)

  return (
    <div ref={rootRef} className={styles.marqueeRoot} data-running={inView && pageVisible && !paused ? 'true' : 'false'}>
      <div className={styles.marquee}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex === 0 ? 'first' : 'second'}
            className={styles.row}
            data-direction={rowIndex === 0 ? 'left' : 'right'}
            style={{ '--duration': `${row.length * SECONDS_PER_LOGO}s` } as CSSProperties}
          >
            <div className={styles.track}>
              <ul className={styles.list} role="list" aria-label={rowIndex === 0 ? label : undefined}>
                {row.map((logo) => (
                  <li key={`${logo.src}-${logo.alt}`} className={styles.marqueeCell}>
                    <Tile logo={logo} showNames={showNames} />
                  </li>
                ))}
              </ul>
              {/* Kesintisiz döngü için aynı liste ikinci kez; ekran okuyucudan gizli. */}
              <ul className={styles.list} aria-hidden="true">
                {row.map((logo) => (
                  <li key={`${logo.src}-${logo.alt}`} className={styles.marqueeCell}>
                    <Tile logo={logo} showNames={showNames} decorative />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.toggle} aria-label={paused ? copy.play : copy.pause} onClick={() => setPaused((value) => !value)}>
          <svg viewBox="0 0 16 16" className={styles.toggleIcon} fill="currentColor" aria-hidden="true" focusable="false">
            {paused ? <path d="M5 3.2v9.6L12.6 8z" /> : <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" />}
          </svg>
          <span aria-hidden="true">{paused ? copy.playShort : copy.pauseShort}</span>
        </button>
      </div>
    </div>
  )
}

export default function LogoWall({ logos, variant = 'grid', label, tone = 'light', showNames = false, className = '' }: LogoWallProps) {
  const reduce = Boolean(useReducedMotion())
  const marquee = variant === 'marquee' && !reduce

  return (
    <div className={`${styles.root} ${className}`.trim()} data-tone={tone} data-variant={marquee ? 'marquee' : 'grid'}>
      {marquee ? <Marquee logos={logos} label={label} showNames={showNames} /> : <Grid logos={logos} label={label} showNames={showNames} reduce={reduce} />}
    </div>
  )
}
