import { useRef, useSyncExternalStore } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { homeTrustCopy as copy } from './homeTrustCopy.ts'
import { trustLogos } from './trustLogos.ts'
import type { TrustLogo } from './trustLogos.ts'
import styles from './TrustLogos.module.css'

const cascade: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: revealEase } }),
}

const SECONDS_PER_LOGO = 2.6

const subscribeVisibility = (callback: () => void) => {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}

const usePageVisible = () =>
  useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true,
  )

/**
 * Logo, gri (sabit filtreli) ve renkli iki katman olarak üst üste çizilir; aynı dosya olduğu için tek indirme yapılır.
 * Üzerine gelince yalnızca opaklık değişir, filtre hiç canlandırılmaz. Renkli katman ekran okuyuculardan gizlenir.
 * `colour` tek katmanlı renkli çizim (kayan şerit).
 */
function LogoMark({ logo, interactive, colour, alt }: { logo: TrustLogo; interactive: boolean; colour?: boolean; alt: string }) {
  const shared = {
    src: logo.src,
    width: logo.width,
    height: logo.height,
    style: logo.imgStyle,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    draggable: false,
  }
  return (
    <span
      className={styles.crop}
      style={{ '--box-w': `${logo.boxWidth}%`, '--ratio': String(logo.ratio), aspectRatio: logo.ratio } as CSSProperties}
    >
      {colour ? (
        <img {...shared} alt={alt} className={`${styles.img} ${styles.colourOnly}`} />
      ) : (
        <>
          <img {...shared} alt={alt} className={`${styles.img} ${styles.grey}`} />
          {interactive ? <img {...shared} alt="" aria-hidden="true" className={`${styles.img} ${styles.colour}`} /> : null}
        </>
      )}
    </span>
  )
}

function ColourTile({ logo, decorative = false }: { logo: TrustLogo; decorative?: boolean }) {
  const mark = <LogoMark logo={logo} interactive={false} colour alt={decorative ? '' : ''} />
  if (logo.website && !decorative) {
    return (
      <a href={logo.website} target="_blank" rel="noopener noreferrer" aria-label={`${logo.name} (${copy.external})`} className={styles.tile}>
        {mark}
      </a>
    )
  }
  return (
    <div className={styles.tile}>
      <LogoMark logo={logo} interactive={false} colour alt={decorative ? '' : logo.name} />
    </div>
  )
}

function ReferencesLink() {
  const path = usePath()
  return (
    <Link to={path('references')} className={styles.allLink}>
      {copy.allReferences}
      <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  )
}

function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.15 })
  const pageVisible = usePageVisible()
  const running = inView && pageVisible

  return (
    <div ref={ref} className={styles.marquee} data-running={running ? 'true' : 'false'}>
      <div className={styles.viewport}>
        <div className={styles.track} style={{ '--duration': `${trustLogos.length * SECONDS_PER_LOGO}s` } as CSSProperties}>
          <ul className={styles.marqueeList} role="list" aria-label={copy.logosLabel}>
            {trustLogos.map((logo) => (
              <li key={logo.key} className={styles.marqueeCell}>
                <ColourTile logo={logo} />
              </li>
            ))}
          </ul>
          <ul className={styles.marqueeList} aria-hidden="true">
            {trustLogos.map((logo) => (
              <li key={logo.key} className={styles.marqueeCell}>
                <ColourTile logo={logo} decorative />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function StaticStrip() {
  return (
    <div className={styles.marquee}>
      <div className={styles.viewport} data-static="true">
        <ul className={styles.marqueeList} role="list" aria-label={copy.logosLabel}>
          {trustLogos.map((logo) => (
            <li key={logo.key} className={styles.marqueeCell}>
              <ColourTile logo={logo} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Grid() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const state = reduce || inView ? 'show' : 'hidden'
  const initial = reduce ? false : 'hidden'

  return (
    <div ref={ref} className={styles.logos}>
      <ul className={styles.grid} role="list" aria-label={copy.logosLabel}>
        {trustLogos.map((logo, index) => {
          const tileProps = {
            className: styles.tile,
            'data-lift': logo.lift ? 'true' : undefined,
            'data-solid': logo.solid ? 'true' : undefined,
            initial,
            animate: state,
            variants: cascade,
            custom: 0.1 + index * 0.05,
          }
          return (
            <li key={logo.key} className={styles.cell}>
              {logo.website ? (
                <motion.a href={logo.website} target="_blank" rel="noopener noreferrer" aria-label={`${logo.name} (${copy.external})`} {...tileProps}>
                  <LogoMark logo={logo} interactive alt="" />
                </motion.a>
              ) : (
                <motion.div {...tileProps}>
                  <LogoMark logo={logo} interactive={false} alt={logo.name} />
                </motion.div>
              )}
            </li>
          )
        })}
      </ul>

      <motion.div className={styles.footer} initial={initial} animate={state} variants={cascade} custom={0.75}>
        <ReferencesLink />
      </motion.div>
    </div>
  )
}

/** Seçili 12 referans. `marquee`: tek satır, renkli, sürekli kayar. */
export default function TrustLogos({ variant = 'grid' }: { variant?: 'grid' | 'marquee' } = {}) {
  const reduce = Boolean(useReducedMotion())
  if (variant === 'marquee') return reduce ? <StaticStrip /> : <Marquee />
  return <Grid />
}
