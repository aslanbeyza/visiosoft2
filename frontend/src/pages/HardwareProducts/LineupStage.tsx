import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import CountUp from '../../components/CountUp/index.ts'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { lineupItems, lineupRatio } from './lineup.ts'
import { heroCopy } from './listingCopy.ts'
import styles from './LineupStage.module.css'

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Hero anı: altı ürün tek zemin çizgisinin üzerinde, gerçek yükseklik oranlarıyla zeminden yükselir.
 * Işık huzmesi kaydırmayla soldan sağa geçer; ölçüsü bilinen ürünlerde yükseklik çizgisi çizilir.
 */
export default function LineupStage() {
  const reduce = useReducedMotion()
  const path = usePath()
  const stageRef = useRef<HTMLDivElement>(null)
  // Kırpılmış pencereler kendi görünürlüğünü bildiremez; tetik kırpılmamış sahneden gelir.
  const inView = useInView(stageRef, { once: true, amount: 0.3 })
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] })
  const spotX = useTransform(scrollYProgress, [0, 1], ['-32%', '32%'])
  const shown = Boolean(reduce) || inView
  const center = (lineupItems.length - 1) / 2

  return (
    <div ref={stageRef} className={styles.stage}>
      <motion.div
        className={styles.spot}
        aria-hidden="true"
        style={reduce ? undefined : { x: spotX }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: 1.6, ease: revealEase, delay: 0.5 }}
      />

      <ol className={styles.row} aria-label={heroCopy.lineupLabel}>
        {lineupItems.map((item, index) => {
          // Ortadaki uzun ürünler önce, kenardakiler sonra yükselir.
          const delay = 0.5 + Math.abs(index - center) * 0.14
          const style = { '--r': lineupRatio(item) } as CSSProperties
          return (
            <li key={item.slug} className={styles.item} style={style}>
              <Link to={path(item.route)} className={styles.link}>
                <span className={styles.window}>
                  <motion.span
                    className={styles.rise}
                    initial={reduce ? false : { y: '101%' }}
                    animate={shown ? { y: '0%' } : { y: '101%' }}
                    transition={{ duration: 1.15, ease: revealEase, delay }}
                  >
                    <Picture
                      src={item.src}
                      avif={item.avif}
                      width={item.width}
                      height={item.height}
                      alt=""
                      loading="eager"
                      className={styles.image}
                      pictureClassName={styles.picture}
                    />
                  </motion.span>
                </span>
                <span className={styles.shadow} aria-hidden="true" />
                <span className={styles.label}>
                  <span className={styles.index} aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <span className={styles.name}>{item.label}</span>
                </span>
              </Link>

              {item.measured ? (
                <span className={styles.dim}>
                  <motion.span
                    className={styles.dimLine}
                    aria-hidden="true"
                    initial={reduce ? false : { scaleY: 0 }}
                    animate={{ scaleY: shown ? 1 : 0 }}
                    transition={{ duration: 1, ease: revealEase, delay: delay + 0.7 }}
                  />
                  <motion.span
                    className={styles.dimValue}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                    transition={{ duration: 0.7, ease: revealEase, delay: delay + 1.1 }}
                  >
                    <span className={styles.srOnly}>{heroCopy.heightLabel}: </span>
                    <CountUp value={item.heightMm} suffix={` ${heroCopy.heightUnit}`} duration={1.4} delay={delay + 0.9} />
                  </motion.span>
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>

      <motion.span
        className={styles.floor}
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: shown ? 1 : 0 }}
        transition={{ duration: 1.3, ease: revealEase, delay: 0.1 }}
      />
    </div>
  )
}
