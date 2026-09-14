/**
 * Kullanım:
 * <IframeEmbed src={config.calendly_url} title="Online görüşme planlayın" height="44rem" fallbackHref={config.calendly_url} />
 * <IframeEmbed src={osmUrl} title="Lokasyon haritası" ratio="16 / 9" loadOn="click" description="Harita OpenStreetMap'ten yüklenir." fallbackHref={osmUrl} />
 * `loadOn='view'` (varsayılan) görünüme yaklaşınca, `'click'` "Yükle" düğmesiyle yükler; yüklenene kadar statik kart görünür.
 */
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Button from '../Button/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { iframeEmbedCopy } from './iframeEmbedCopy.ts'
import styles from './IframeEmbed.module.css'

export type IframeEmbedProps = {
  src: string
  title: string
  /** CSS aspect-ratio (varsayılan 16 / 9). `height` verilirse yok sayılır. */
  ratio?: string
  fallbackHref?: string
  fallbackLabel?: string
  loadOn?: 'view' | 'click'
  /** Ek: yer tutucu karttaki açıklama. */
  description?: string
  /** Ek: "Yükle" düğmesinin metni. */
  loadLabel?: string
  /** Ek: sabit yükseklik (ör. "44rem"); takvim gibi uzun içerikler için. */
  height?: string
  /** Ek: iframe izinleri / sandbox. */
  allow?: string
  sandbox?: string
  className?: string
}

function EmbedIcon({ className, draw }: { className: string; draw: boolean }) {
  const reduce = Boolean(useReducedMotion())
  const shared = {
    initial: reduce ? false : { pathLength: 0 },
    animate: draw ? { pathLength: 1 } : undefined,
  }
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <motion.rect x="5" y="8" width="38" height="30" rx="3" {...shared} transition={{ duration: 0.9, ease: revealEase }} />
      <motion.path d="M5 16h38" {...shared} transition={{ duration: 0.5, delay: 0.5, ease: revealEase }} />
      <motion.path d="M10 12h.01M14 12h.01M18 12h.01" strokeWidth="2.2" {...shared} transition={{ duration: 0.3, delay: 0.7 }} />
      <motion.path d="M24 22a6 6 0 0 1 6 6c0 4-6 8-6 8s-6-4-6-8a6 6 0 0 1 6-6Z" {...shared} transition={{ duration: 0.7, delay: 0.7, ease: revealEase }} />
      <motion.circle cx="24" cy="28" r="2" {...shared} transition={{ duration: 0.4, delay: 1.1 }} />
    </svg>
  )
}

export default function IframeEmbed({
  src,
  title,
  ratio = '16 / 9',
  fallbackHref,
  fallbackLabel = iframeEmbedCopy.openExternal,
  loadOn = 'view',
  description,
  loadLabel = iframeEmbedCopy.load,
  height,
  allow,
  sandbox,
  className = '',
}: IframeEmbedProps) {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const nearby = useInView(rootRef, { once: true, margin: '240px 0px' })
  const visible = useInView(rootRef, { once: true, amount: 0.3 })
  const [requested, setRequested] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const mounted = loadOn === 'view' ? nearby : requested

  // "Yükle" düğmesi kaybolunca odak boşa düşmesin; çerçeve kabına taşınır.
  useEffect(() => {
    if (requested) boxRef.current?.focus({ preventScroll: true })
  }, [requested])

  const style = { '--ratio': ratio, '--height': height } as CSSProperties

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`.trim()}>
      <div ref={boxRef} className={styles.box} style={style} data-fixed={height ? 'true' : undefined} tabIndex={-1}>
        {mounted ? (
          <iframe
            className={styles.frame}
            src={src}
            title={title}
            loading="lazy"
            allow={allow}
            sandbox={sandbox}
            referrerPolicy="strict-origin-when-cross-origin"
            data-loaded={loaded ? 'true' : 'false'}
            onLoad={() => setLoaded(true)}
          />
        ) : null}

        {!loaded ? (
          <div className={styles.cover} aria-hidden={mounted ? 'true' : undefined}>
            <motion.div
              className={styles.coverInner}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={visible ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, ease: revealEase }}
            >
              <EmbedIcon className={styles.icon} draw={visible} />
              <p className={styles.coverTitle}>{title}</p>
              {description ? <p className={styles.coverText}>{description}</p> : null}
              <div className={styles.coverActions}>
                {loadOn === 'click' && !mounted ? (
                  <Button onClick={() => setRequested(true)}>
                    {loadLabel}
                    <span className={styles.srOnly}>: {title}</span>
                  </Button>
                ) : (
                  <span className={styles.loading} role="status">
                    <span className={styles.loadingDot} aria-hidden="true" />
                    {iframeEmbedCopy.loading}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        ) : null}
      </div>

      {fallbackHref ? (
        <p className={styles.note}>
          <a href={fallbackHref} target="_blank" rel="noopener noreferrer" className={styles.noteLink}>
            {fallbackLabel}
            <svg viewBox="0 0 24 24" className={styles.noteIcon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </p>
      ) : null}
    </div>
  )
}
