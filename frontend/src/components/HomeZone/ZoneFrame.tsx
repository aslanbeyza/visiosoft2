import { useEffect, useRef, useState } from 'react'
import type { PointerEventHandler } from 'react'
import { motion, useInView } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { homeZoneCopy as copy } from './homeZoneCopy.ts'
import ZoneShotLayer from './ZoneShotLayer.tsx'
import type { ZoneTourItem } from './zoneTour.ts'
import styles from './ZoneFrame.module.css'

type ZoneFrameProps = {
  items: ZoneTourItem[]
  active: number
  previous: number | null
  aspect: number
  mode: 'pan' | 'fade' | 'still'
  progress: MotionValue<number>
  panelId: string
  tabId: string
  /** null: kontrol gösterilmez (azaltılmış hareket). */
  paused: boolean | null
  onTogglePause: () => void
  onPointerEnter: PointerEventHandler
  onPointerLeave: PointerEventHandler
}

/** Zone ekran görüntülerini taşıyan tarayıcı çerçevesi: adres çubuğu, ilerleme çizgisi, görüntü ve açıklama. */
export default function ZoneFrame({
  items,
  active,
  previous,
  aspect,
  mode,
  progress,
  panelId,
  tabId,
  paused,
  onTogglePause,
  onPointerEnter,
  onPointerLeave,
}: ZoneFrameProps) {
  const ref = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [frameWidth, setFrameWidth] = useState(0)
  // Kırpılan görüntü alanı değil, kırpılmayan dış çerçeve izlenir (Chrome clip-path sorunu).
  const shown = useInView(ref, { once: true, amount: 0.25 })

  // Çerçeve genişliği: telefon kırpımı ve görsel boyutu (srcset `sizes`) buna göre hesaplanır.
  useEffect(() => {
    const node = viewportRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => setFrameWidth(Math.round(entry.contentRect.width)))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  const item = items[active]
  const still = mode === 'still'

  return (
    <div ref={ref} className={styles.frame} role="tabpanel" id={panelId} aria-labelledby={tabId}>
      <div className={styles.chrome}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <p className={styles.address}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <span className={styles.addressText}>
            {copy.framePrefix} · <span key={item.id} className={styles.addressLabel}>{item.title}</span>
          </span>
        </p>
        {paused === null ? (
          <span className={styles.toggleSpacer} aria-hidden="true" />
        ) : (
          <button type="button" className={styles.toggle} onClick={onTogglePause} aria-label={paused ? copy.play : copy.pause}>
            <span className={styles.toggleIcon} aria-hidden="true">
              {paused ? (
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M8 5.5v13l10.5-6.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M7.5 5h3v14h-3zM13.5 5h3v14h-3z" />
                </svg>
              )}
            </span>
          </button>
        )}
        {paused === null ? null : (
          <span className={styles.track} aria-hidden="true">
            <motion.span className={styles.bar} style={{ scaleX: progress }} />
          </span>
        )}
      </div>

      <motion.div
        ref={viewportRef}
        className={styles.viewport}
        style={{ aspectRatio: aspect }}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        initial={still ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={shown || still ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.1, ease: revealEase }}
      >
        {items.map((entry, index) => (
          <ZoneShotLayer
            key={entry.id}
            item={entry}
            aspect={aspect}
            frameWidth={frameWidth}
            mode={mode}
            state={index === active ? 'active' : index === previous ? 'previous' : 'idle'}
          />
        ))}
        <span className={styles.vignette} aria-hidden="true" />
      </motion.div>

      <div className={styles.footer}>
        <motion.p
          key={item.id}
          className={styles.shotCaption}
          initial={still ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: still ? 0 : 0.25, ease: revealEase }}
        >
          {item.caption}
        </motion.p>
      </div>
    </div>
  )
}
