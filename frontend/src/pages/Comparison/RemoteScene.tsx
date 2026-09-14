import { useId } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import styles from './RemoteView.module.css'

export type RemoteMode = 'traditional' | 'visio'

const LINK = 'M184 196 C 244 196 268 150 330 150'
const TOP_BAYS = [350, 390, 430, 470, 510, 550, 590]
const LOW_BAYS = [350, 390, 430, 510, 550, 590]
const CARS = [
  { x: 358, y: 72 },
  { x: 438, y: 72 },
  { x: 518, y: 72 },
  { x: 558, y: 72 },
  { x: 398, y: 254 },
  { x: 518, y: 254 },
]

const ease = { duration: 0.9, ease: revealEase }
const fadeOn: Variants = { traditional: { opacity: 0, transition: ease }, visio: { opacity: 1, transition: ease } }
const fadeOff: Variants = { traditional: { opacity: 1, transition: ease }, visio: { opacity: 0, transition: ease } }
const linkDraw: Variants = {
  traditional: { pathLength: 0, opacity: 0, transition: { duration: 0.5, ease: revealEase } },
  visio: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: revealEase } },
}
const carVariants: Variants = {
  traditional: { opacity: 0, y: 6, transition: { duration: 0.4 } },
  visio: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.5 + i * 0.08, ease: revealEase } }),
}

type Props = { mode: RemoteMode; reduce: boolean; running: boolean }

/** Üstten görünüş: solda uzaktaki kullanıcı, sağda otopark; bağlantı ve kamera konisi moda göre değişir. */
export default function RemoteScene({ mode, reduce, running }: Props) {
  const hatchId = `hatch-${useId().replace(/:/g, '')}`
  const initial = reduce ? false : 'traditional'

  return (
    <svg className={styles.svg} viewBox="0 0 640 420" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={hatchId} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" className={styles.hatchLine} />
        </pattern>
      </defs>

      {/* Dizüstü bilgisayar */}
      <rect x="52" y="150" width="120" height="78" rx="6" className={styles.device} />
      <path d="M40 234h144l-10 12H50z" className={styles.device} />
      <motion.g initial={initial} animate={mode} variants={fadeOn}>
        <rect x="62" y="160" width="100" height="58" rx="3" className={styles.screenOn} />
        <path d="M72 176h80M72 190h80M72 204h80M92 168v44M112 168v44M132 168v44" className={styles.screenGrid} />
        <circle cx="102" cy="183" r="4" className={styles.screenDot} />
      </motion.g>
      <motion.path d="M84 189h40" className={styles.screenOff} initial={initial} animate={mode} variants={fadeOff} />

      {/* Bağlantı: geleneksel = kopuk, Visiosoft = çizilen hat + akan paket */}
      <motion.g initial={initial} animate={mode} variants={fadeOff}>
        <path d={LINK} className={styles.linkBroken} />
        <path d="M250 164l14 14M264 164l-14 14" className={styles.linkCross} />
      </motion.g>
      <motion.path d={LINK} className={styles.link} initial={initial} animate={mode} variants={linkDraw} />
      {mode === 'visio' && !reduce ? (
        <path d={LINK} pathLength={1} className={styles.packet} data-running={running} />
      ) : null}

      {/* Otopark planı */}
      <rect x="330" y="48" width="270" height="324" rx="14" className={styles.lot} />
      <path d={`${TOP_BAYS.map((x) => `M${x} 60V132`).join('')}M350 132H590`} className={styles.bay} />
      <path d={`${LOW_BAYS.map((x) => `M${x} 236V308`).join('')}M350 236H430M510 236H590`} className={styles.bay} />
      <path d="M350 184H590" className={styles.aisle} />
      <path d="M430 308V372M510 308V372" className={styles.bay} />
      <circle cx="438" cy="330" r="4.5" className={styles.post} />
      <path d="M438 330H502" className={styles.arm} />
      <rect x="520" y="322" width="12" height="24" rx="2" className={styles.kiosk} />
      <rect x="516" y="296" width="8" height="8" rx="2" className={styles.post} />

      <motion.path d="M520 302L452 356L506 366Z" className={styles.cone} initial={initial} animate={mode} variants={fadeOn} />
      {CARS.map((car, i) => (
        <motion.rect
          key={`${car.x}-${car.y}`}
          x={car.x}
          y={car.y}
          width="24"
          height="40"
          rx="6"
          className={styles.car}
          custom={i}
          initial={initial}
          animate={mode}
          variants={carVariants}
        />
      ))}

      {/* Kör nokta taraması */}
      <motion.rect
        x="330"
        y="48"
        width="270"
        height="324"
        rx="14"
        fill={`url(#${hatchId})`}
        className={styles.blind}
        initial={initial}
        animate={mode}
        variants={fadeOff}
      />
    </svg>
  )
}
