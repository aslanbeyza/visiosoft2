import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { alprCopy } from './alprCopy.ts'
import styles from './ExitPreview.module.css'

const base = '/img/pages/otopark-cikis'

/** Gerçek otopark çıkışı fotoğrafı: görseldeki ekipmanlar numaralı işaretlerle ve eşleşen açıklama listesiyle gösterilir. */
export default function ExitPreview() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const run = !reduce && inView
  const { demo } = alprCopy

  return (
    <div ref={ref} className={styles.root}>
      <MediaFrame tone="dark" caption={demo.caption} chips={[{ label: demo.chip, tone: 'neutral' }]} parallax={3}>
        <div className={styles.stage}>
          <Picture
            src={`${base}-1600.webp`}
            avif={`${base}-960.avif 960w, ${base}-1600.avif 1600w`}
            webp={`${base}-960.webp 960w, ${base}-1600.webp 1600w`}
            sizes="(min-width: 1280px) 44rem, (min-width: 1024px) 55vw, 100vw"
            width={1600}
            height={1200}
            alt={demo.alt}
          />
          <div className={styles.pins} aria-hidden="true">
            {demo.markers.map((marker, index) => (
              <span key={marker.key} className={styles.pinSlot} style={{ left: `${marker.x}%`, top: `${marker.y}%` }}>
                {reduce ? null : (
                  <motion.span
                    className={styles.pulse}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={run ? { opacity: [0, 0.8, 0], scale: [0.4, 2.2] } : undefined}
                    transition={{ duration: 1.1, delay: 1.3 + index * 0.25, ease: 'easeOut' }}
                  />
                )}
                <motion.span
                  className={styles.pin}
                  initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                  animate={run ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.25, ease: revealEase }}
                >
                  {index + 1}
                </motion.span>
              </span>
            ))}
          </div>
        </div>
      </MediaFrame>

      <ol className={styles.legend} aria-label={demo.markersLabel}>
        {demo.markers.map((marker, index) => (
          <motion.li
            key={marker.key}
            className={styles.item}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={run ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 1.1 + index * 0.25, ease: revealEase }}
          >
            <span className={styles.num} aria-hidden="true">
              {index + 1}
            </span>
            <span className={styles.itemText}>
              <strong>{marker.label}</strong>
              <span>{marker.text}</span>
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
