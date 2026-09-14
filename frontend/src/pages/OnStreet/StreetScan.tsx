import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { onStreetCopy } from './onStreetCopy.ts'
import styles from './StreetScan.module.css'

// Çizimdeki plakaların konumları (%; 1024 × 765 görsel üzerinde ölçüldü, küçük pay bırakıldı)
const plates = [
  { left: 25.6, top: 82.1, width: 8.8, height: 4.4, at: 0.3 },
  { left: 49.4, top: 74.8, width: 6.4, height: 3.2, at: 0.52 },
]

const corners = ['M0 30V0h24', 'M76 0h24v30', 'M100 70v30H76', 'M24 100H0V70']

// Tarama çizgisinin başlangıcı ve süresi (sn); plakalar çizgi üzerlerinden geçerken kilitlenir
const SCAN_DELAY = 1.05
const SCAN_TIME = 1.7

/** Hero anı: çizim açıldıktan sonra ince bir tarama çizgisi caddeyi soldan sağa geçer, plakalara çerçeve kilitlenir. */
export default function StreetScan() {
  const { scene } = onStreetCopy
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const run = !reduce && inView
  const labels = [scene.detect, scene.charge]

  return (
    <div ref={ref} className={styles.root}>
      {/* Çizimin sağ üstündeki kamera kutusu kenara yakın; screenshot kipi onu kırpmaz, plaka katmanları görselle birlikte kayar. */}
      <MediaFrame caption={scene.caption} mode="screenshot" amount={0.2}>
        <div className={styles.stage}>
          <Picture
            src="/img/pages/yol_ustu.jpg"
            webp="/img/pages/yol_ustu.webp"
            sizes="(min-width: 1280px) 38rem, (min-width: 1024px) 48vw, 100vw"
            width={1024}
            height={765}
            alt={scene.alt}
            loading="eager"
            fetchPriority="high"
          />

          <div className={styles.overlay} aria-hidden="true">
            {reduce ? null : (
              <motion.span
                className={styles.scan}
                initial={{ x: '0%', opacity: 0 }}
                animate={run ? { x: ['0%', '100%'], opacity: [0, 1, 1, 0] } : undefined}
                transition={{ duration: SCAN_TIME, delay: SCAN_DELAY, ease: 'easeInOut', times: [0, 0.12, 0.85, 1] }}
              >
                <span className={styles.scanLine} />
              </motion.span>
            )}

            {reduce ? null : (
              <span className={styles.lens}>
                <motion.span
                  className={styles.lensRing}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={run ? { opacity: [0, 0.8, 0], scale: [0.4, 1.8] } : undefined}
                  transition={{ duration: 1.3, delay: SCAN_DELAY - 0.2, repeat: 2, ease: 'easeOut' }}
                />
              </span>
            )}

            {plates.map((plate, index) => {
              const delay = SCAN_DELAY + SCAN_TIME * plate.at
              const box = {
                left: `${plate.left}%`,
                top: `${plate.top}%`,
                width: `${plate.width}%`,
                height: `${plate.height}%`,
              } as CSSProperties
              return (
                <span key={plate.left} className={styles.plate} style={box}>
                  <motion.span
                    className={styles.plateTint}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={run ? { opacity: 1 } : undefined}
                    transition={{ duration: 0.5, delay: delay + 0.2 }}
                  />
                  <svg className={styles.bracket} viewBox="0 0 100 100" preserveAspectRatio="none">
                    {corners.map((d) => (
                      <motion.path
                        key={d}
                        d={d}
                        vectorEffect="non-scaling-stroke"
                        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                        animate={run ? { pathLength: 1, opacity: 1 } : undefined}
                        transition={{ duration: 0.55, delay, ease: revealEase }}
                      />
                    ))}
                  </svg>
                  <motion.span
                    className={styles.pill}
                    data-index={index}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={run ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.6, delay: delay + 0.45, ease: revealEase }}
                  >
                    <svg viewBox="0 0 16 16" className={styles.check}>
                      <path d="M3.5 8.5l3 3 6-7" />
                    </svg>
                    {labels[index]}
                  </motion.span>
                </span>
              )
            })}
          </div>
        </div>
      </MediaFrame>
    </div>
  )
}
