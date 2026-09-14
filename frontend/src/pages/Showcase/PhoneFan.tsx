import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import styles from './PhoneFan.module.css'

export type PhoneScreen = { id: string; step: string; label: string; src: string; avif: string; alt: string }

type PhoneFanProps = {
  screens: PhoneScreen[]
  label: string
  caption: string
}

const FRAME = { src: '/img/pages/phone-frame-crop.webp', avif: '/img/pages/phone-frame-crop.avif', width: 726, height: 1444 }

// Yelpaze pozları: soldaki, ortadaki (önde) ve sağdaki telefon
// (yan telefonların alt köşesi, dönüş + y ile etiket satırına taşmayacak kadar yukarıda kalır)
const poses = [
  { x: '-72%', rotate: -6, y: 16, scale: 0.9, z: 1 },
  { x: '0%', rotate: 0, y: 0, scale: 1, z: 2 },
  { x: '72%', rotate: 6, y: 16, scale: 0.9, z: 1 },
]

/**
 * Mobil abonelik hero anı: üç gerçek uygulama ekranı telefon çerçevesinde üst üste gelir,
 * görünüme girince ortadaki yükselir, yandakiler arkasından yelpaze gibi açılır; kaydırmada hafif paralaks.
 */
export default function PhoneFan({ screens, label, caption }: PhoneFanProps) {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.35 })
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start end', 'end start'] })
  const sideY = useTransform(scrollYProgress, [0, 1], [14, -22])
  const centerY = useTransform(scrollYProgress, [0, 1], [6, -10])
  const play = !reduce && inView

  return (
    <div ref={rootRef} className={styles.root}>
      <svg className={styles.arc} viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <motion.path
          d="M 30 400 C 220 40, 780 40, 970 400"
          className={styles.arcPath}
          initial={reduce ? false : { pathLength: 0 }}
          animate={play ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.6, delay: 0.2, ease: revealEase }}
        />
      </svg>

      <ol className={styles.fan} aria-label={label}>
        {screens.slice(0, 3).map((screen, index) => {
          const pose = poses[index]
          const center = index === 1
          return (
            <motion.li
              key={screen.id}
              className={styles.item}
              style={{ zIndex: pose.z } as CSSProperties}
              initial={reduce ? false : { x: '0%' }}
              animate={play || reduce ? { x: pose.x } : undefined}
              transition={{ duration: 1.1, delay: center ? 0 : 0.45, ease: revealEase }}
            >
              <motion.div className={styles.lift} style={reduce ? undefined : { y: center ? centerY : sideY }}>
                <motion.div
                  className={styles.device}
                  initial={reduce ? false : { rotate: 0, scale: 0.9, y: 64, opacity: 0 }}
                  animate={play || reduce ? { rotate: pose.rotate, scale: pose.scale, y: pose.y, opacity: 1 } : undefined}
                  transition={{ duration: 1.1, delay: center ? 0 : 0.45, ease: revealEase }}
                >
                  <picture className={styles.screen}>
                    <source type="image/avif" srcSet={screen.avif} />
                    <img src={screen.src} alt={screen.alt} width={516} height={1124} loading="lazy" decoding="async" />
                  </picture>
                  <picture className={styles.frame} aria-hidden="true">
                    <source type="image/avif" srcSet={FRAME.avif} />
                    <img src={FRAME.src} alt="" width={FRAME.width} height={FRAME.height} loading="lazy" decoding="async" />
                  </picture>
                </motion.div>
              </motion.div>

              <motion.p
                className={styles.label}
                data-center={center}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={play ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.7, delay: 1 + index * 0.08, ease: revealEase }}
              >
                <span className={styles.step}>{screen.step}</span>
                {screen.label}
              </motion.p>
            </motion.li>
          )
        })}
      </ol>

      <p className={styles.caption}>{caption}</p>
    </div>
  )
}
