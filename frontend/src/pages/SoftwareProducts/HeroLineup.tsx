import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { Transition } from 'framer-motion'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import PhoneFrame from './PhoneFrame.tsx'
import { heroCopy, hubImages, mobileCopy } from './softwareHubCopy.ts'
import styles from './HeroLineup.module.css'

const ease = (delay: number, duration = 1.1): Transition => ({ duration, delay, ease: revealEase })

/**
 * Hero kompozisyonu: canlı harita, oturumlar tablosu ve telefon katmanları sırayla açılır;
 * haritadaki kamera ikonunun etrafına tespit köşeleri çizilir (M3). Kaydırdıkça katmanlar farklı hızlarda ayrışır.
 * Tetik kırpılmamış sahneden gelir; hareket azaltmada kompozisyon statik ve eksiksizdir.
 */
export default function HeroLineup() {
  const reduce = Boolean(useReducedMotion())
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, amount: 0.2 })
  const play = !reduce && inView

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] })
  const mapY = useTransform(scrollYProgress, [0, 1], ['2%', '-2%'])
  const tableY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const phoneY = useTransform(scrollYProgress, [0, 1], ['8%', '-14%'])

  const clipDown = reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }
  const clipSide = reduce ? false : { clipPath: 'inset(0% 100% 0% 0%)' }
  const open = { clipPath: 'inset(0% 0% 0% 0%)' }

  return (
    <div ref={stageRef} className={styles.stage} role="img" aria-label={heroCopy.lineupLabel}>
      <motion.div className={styles.mapLayer} style={reduce ? undefined : { y: mapY }}>
        <motion.div className={styles.window} initial={clipDown} animate={play ? open : undefined} transition={ease(0.25)}>
          <motion.div className={styles.zoom} initial={reduce ? false : { scale: 1.08 }} animate={play ? { scale: 1 } : undefined} transition={ease(0.25, 1.3)}>
            <Picture {...hubImages.liveMap} alt="" className={styles.img} loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 40vw, 90vw" />
          </motion.div>
          <span className={styles.chip}>{heroCopy.chips.map}</span>
        </motion.div>

        <svg className={styles.bracket} viewBox="0 0 40 40" aria-hidden="true">
          {['M2 12V2h10', 'M28 2h10v10', 'M38 28v10H28', 'M12 38H2V28'].map((d, i) => (
            <motion.path
              key={d}
              d={d}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={play ? { pathLength: 1, opacity: 1 } : undefined}
              transition={ease(1.45 + i * 0.08, 0.6)}
            />
          ))}
        </svg>
        <motion.span
          className={styles.bracketLabel}
          initial={reduce ? false : { opacity: 0, x: -8 }}
          animate={play ? { opacity: 1, x: 0 } : undefined}
          transition={ease(1.85, 0.7)}
        >
          {heroCopy.bracket}
        </motion.span>
      </motion.div>

      <motion.div className={styles.tableLayer} style={reduce ? undefined : { y: tableY }}>
        <motion.div className={styles.window} initial={clipSide} animate={play ? open : undefined} transition={ease(0.6)}>
          <Picture {...hubImages.sessionsTable} alt="" className={styles.img} loading="eager" sizes="(min-width: 1024px) 30vw, 60vw" />
          <span className={styles.chip}>{heroCopy.chips.sessions}</span>
        </motion.div>
      </motion.div>

      <motion.div className={styles.phoneLayer} style={reduce ? undefined : { y: phoneY }}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 48 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={ease(0.85, 1.1)}
        >
          <PhoneFrame image={mobileCopy.steps[0].image} decorative eager revealDelay={play ? 1.15 : null} />
        </motion.div>
      </motion.div>
    </div>
  )
}
