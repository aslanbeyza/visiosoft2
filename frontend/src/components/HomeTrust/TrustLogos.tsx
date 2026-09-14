import { useRef } from 'react'
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

/**
 * Logo, gri (sabit filtreli) ve renkli iki katman olarak üst üste çizilir; aynı dosya olduğu için tek indirme yapılır.
 * Üzerine gelince yalnızca opaklık değişir, filtre hiç canlandırılmaz. Renkli katman ekran okuyuculardan gizlenir.
 */
function LogoMark({ logo, interactive, alt }: { logo: TrustLogo; interactive: boolean; alt: string }) {
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
    <span className={styles.crop} style={{ '--box-w': `${logo.boxWidth}%`, aspectRatio: logo.ratio } as CSSProperties}>
      <img {...shared} alt={alt} className={`${styles.img} ${styles.grey}`} />
      {interactive ? <img {...shared} alt="" aria-hidden="true" className={`${styles.img} ${styles.colour}`} /> : null}
    </span>
  )
}

/** Seçili 12 referans: kutusuz sıra, gri; üzerine gelince ya da odakta renklenir. */
export default function TrustLogos() {
  const reduce = Boolean(useReducedMotion())
  const path = usePath()
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
                <motion.a
                  href={logo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${logo.name} (${copy.external})`}
                  {...tileProps}
                >
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
        <Link to={path('references')} className={styles.allLink}>
          {copy.allReferences}
          <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </motion.div>
    </div>
  )
}
