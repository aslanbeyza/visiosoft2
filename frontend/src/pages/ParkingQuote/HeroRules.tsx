import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { BarrierIcon, ChartIcon, KioskIcon, PlateIcon, SettingsIcon } from '../../components/FeatureGrid/icons.tsx'
import { revealEase } from '../../components/Reveal/index.ts'
import { quoteCopy } from './quoteCopy.ts'
import styles from './HeroRules.module.css'

const { catalog, panel, setup } = quoteCopy

const base = [
  { name: catalog.plate_recognition.name, Icon: PlateIcon },
  { name: catalog.parking_software.name, Icon: ChartIcon },
]

const rules = [
  { choice: setup.payment.options.card.label, product: catalog.kiosk.name, Icon: KioskIcon },
  { choice: panel.rows.barrier, product: catalog.barrier_system.name, Icon: BarrierIcon },
  { choice: panel.rows.installation, product: catalog.turnkey_installation.name, Icon: SettingsIcon },
]

const at = (i: number, offset: number) => 0.55 + i * 0.55 + offset
const ease = revealEase

const fadeUp: Variants = {
  off: { opacity: 0, y: 10 },
  on: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d, ease } }),
}
const draw: Variants = {
  off: { pathLength: 0 },
  on: (d: number) => ({ pathLength: 1, transition: { duration: 0.5, delay: d, ease } }),
}
const pop: Variants = {
  off: { scale: 0, opacity: 0 },
  on: (d: number) => ({ scale: 1, opacity: 1, transition: { duration: 0.35, delay: d, ease } }),
}
const slideIn: Variants = {
  off: { opacity: 0, x: 18 },
  on: (d: number) => ({ opacity: 1, x: 0, transition: { duration: 0.6, delay: d, ease } }),
}
const fill: Variants = {
  off: { scaleX: 0 },
  on: { scaleX: 1, transition: { duration: 2, delay: 0.6, ease } },
}

export default function HeroRules() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  return (
    <div ref={ref} className={styles.root} aria-hidden="true">
      <motion.div className={styles.card} initial={reduce ? false : 'off'} animate={reduce || inView ? 'on' : 'off'}>
        <div className={styles.head}>
          <span className={styles.live}>
            <span className={styles.liveDot} />
            {panel.badge}
          </span>
          <span className={styles.headTitle}>{panel.title}</span>
          <span className={styles.progress}>
            <motion.span className={styles.progressFill} variants={fill} />
          </span>
        </div>

        <ul className={styles.base}>
          {base.map(({ name, Icon }, i) => (
            <motion.li key={name} className={styles.baseItem} variants={fadeUp} custom={0.2 + i * 0.1}>
              <Icon className={styles.baseIcon} />
              {name}
            </motion.li>
          ))}
        </ul>

        <ul className={styles.rules}>
          {rules.map(({ choice, product, Icon }, i) => (
            <li key={product} className={styles.rule}>
              <motion.span className={styles.choice} variants={fadeUp} custom={at(i, 0)}>
                <svg viewBox="0 0 16 16" className={styles.box} fill="none">
                  <rect x="1" y="1" width="14" height="14" rx="3.5" className={styles.boxRect} />
                  <motion.path d="m4.2 8.3 2.5 2.5 5.1-5.3" className={styles.boxCheck} variants={draw} custom={at(i, 0.2)} />
                </svg>
                {choice}
              </motion.span>
              <span className={styles.link}>
                <svg viewBox="0 0 100 12" preserveAspectRatio="none" className={styles.linkSvg}>
                  <motion.path d="M0 6H100" className={styles.linkPath} variants={draw} custom={at(i, 0.35)} />
                </svg>
                <motion.span className={styles.linkDot} variants={pop} custom={at(i, 0.8)} />
              </span>
              <motion.span className={styles.product} variants={slideIn} custom={at(i, 0.85)}>
                <span className={styles.productIcon}>
                  <Icon className={styles.productSvg} />
                </span>
                {product}
              </motion.span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
