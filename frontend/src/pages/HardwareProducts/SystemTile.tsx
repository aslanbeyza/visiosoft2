import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { products } from '../HardwareProduct/products.ts'
import { lineupItems } from './lineup.ts'
import { systemTileCopy } from './listingCopy.ts'
import styles from './SystemTile.module.css'

type SystemTileProps = {

  span3: 1 | 2 | 3

  span2: 1 | 2
}

const HEADING_ID = 'donanim-sistem-baslik'

const steps = systemTileCopy.steps.map((step) => {
  const item = lineupItems.find((entry) => entry.slug === step.slug)
  return { ...step, item, name: products[step.slug].navLabel }
})

export default function SystemTile({ span3, span2 }: SystemTileProps) {
  const reduce = useReducedMotion()
  const path = usePath()
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const shown = Boolean(reduce) || inView

  const rise = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 20 },
          animate: shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
          transition: { duration: 0.8, ease: revealEase, delay },
        }

  return (
    <motion.li
      ref={ref}
      layout={reduce ? undefined : 'position'}
      className={styles.tile}
      data-span3={span3}
      data-span2={span2}
      aria-labelledby={HEADING_ID}
    >
      <div className={styles.copy}>
        <motion.p className={styles.eyebrow} {...rise(0)}>
          {systemTileCopy.eyebrow}
        </motion.p>
        <motion.h3 id={HEADING_ID} className={styles.title} {...rise(0.08)}>
          {systemTileCopy.title}
        </motion.h3>
        <motion.p className={styles.description} {...rise(0.16)}>
          {systemTileCopy.description}
        </motion.p>
      </div>

      <div className={styles.scene}>
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step.slug} className={styles.step} style={{ '--h': step.height } as CSSProperties}>
              <span className={styles.window} aria-hidden="true">
                {step.item ? (
                  <motion.span
                    className={styles.rise}
                    initial={reduce ? false : { y: '101%' }}
                    animate={shown ? { y: '0%' } : { y: '101%' }}
                    transition={{ duration: 1.05, ease: revealEase, delay: 0.3 + index * 0.12 }}
                  >
                    <Picture
                      src={step.item.src}
                      avif={step.item.avif}
                      width={step.item.width}
                      height={step.item.height}
                      alt=""
                      className={styles.image}
                      pictureClassName={styles.picture}
                    />
                  </motion.span>
                ) : null}
              </span>
              <motion.span className={styles.label} {...rise(0.7 + index * 0.1)}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.name}>{step.name}</span>
                <span className={styles.role}>{step.role}</span>
              </motion.span>
            </li>
          ))}
        </ol>
        <motion.span
          className={styles.floor}
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: shown ? 1 : 0 }}
          transition={{ duration: 1.2, ease: revealEase, delay: 0.15 }}
        />
      </div>

      <motion.div className={styles.foot} {...rise(1.1)}>
        <Link to={path('end-to-end')} className={styles.link}>
          {systemTileCopy.link}
          <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </motion.div>
    </motion.li>
  )
}
