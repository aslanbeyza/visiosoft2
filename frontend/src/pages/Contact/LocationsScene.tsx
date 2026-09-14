import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { padIndex } from './locationDetails.ts'
import styles from './LocationsScene.module.css'

/**
 * Dört lokasyonun cephe çizimi (harita karosu yok): Perpa kulesinde showroom (Kat 8) ve depo (Kat 4) katları,
 * Başakşehir'de Living LAB ve Teknopark binaları. Çizgiler çizilir, katlar soldan dolar, işaretler belirir.
 * `active` verilen lokasyon öne çıkar, diğerleri soluklaşır. Dekoratiftir; bilgi kart listesinde yer alır.
 */
type Marker = { x: number; y: number; lead?: string; label: string }

export type LocationsSceneProps = {
  labels: string[]
  active: number | null
  className?: string
}

const FLOORS = [85, 110, 135, 160, 185, 210, 235, 260, 285, 310, 335]

export default function LocationsScene({ labels, active, className = '' }: LocationsSceneProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const run = reduce || inView
  const init = <T,>(value: T) => (reduce ? false : value)

  const draw = (delay: number, duration = 1) => ({
    initial: init({ pathLength: 0 }),
    animate: run ? { pathLength: 1 } : undefined,
    transition: { duration, delay, ease: revealEase },
  })

  const markers: Marker[] = [
    { x: 545, y: 147.5, lead: 'M470 147.5 H528', label: labels[0] ?? '' },
    { x: 545, y: 247.5, lead: 'M470 247.5 H528', label: labels[1] ?? '' },
    { x: 850, y: 172, lead: 'M850 212 V188', label: labels[2] ?? '' },
    { x: 1060, y: 80, lead: 'M1060 120 V96', label: labels[3] ?? '' },
  ]

  return (
    <div ref={ref} className={`${styles.scene} ${className}`.trim()} data-active={active ?? 'none'} aria-hidden="true">
      <svg className={styles.svg} viewBox="30 40 1150 380" focusable="false">
        <g className={styles.ink} fill="none">
          <motion.path d="M40 360 H1160" {...draw(0, 1.2)} />
          <rect x="250" y="60" width="220" height="300" className={styles.fill} />
          {FLOORS.map((y, i) => (
            <motion.path
              key={y}
              d={`M250 ${y} H470`}
              className={styles.floor}
              initial={init({ opacity: 0 })}
              animate={run ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.5 + (FLOORS.length - i) * 0.04 }}
            />
          ))}
          {[135, 235].map((y, i) => (
            <motion.rect
              key={y}
              x="251" y={y + 0.5} width="218" height="24"
              className={styles.band}
              data-index={i}
              style={{ transformBox: 'fill-box', transformOrigin: '0% 50%' }}
              initial={init({ scaleX: 0 })}
              animate={run ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.8, delay: 1.1 + i * 0.12, ease: revealEase }}
            />
          ))}
          <motion.path d="M250 360 V60 H470 V360" {...draw(0.2, 1.2)} />
          <motion.path d="M262 60 V50 H458 V60" {...draw(0.9, 0.6)} />
          <motion.path d="M340 360 V332 H380 V360" {...draw(1, 0.5)} />
          <motion.path d="M92 360 L250 262 M124 360 L250 282" {...draw(0.8, 0.8)} />
          <motion.path
            d="M760 360 V240 L805 212 V240 L850 212 V240 L895 212 V240 L940 212 V360 Z"
            className={styles.fill}
            {...draw(0.4, 1.2)}
          />
          <motion.path d="M760 300 H940" className={styles.floor} {...draw(1.2, 0.5)} />
          <motion.path d="M835 360 V332 H865 V360" {...draw(1.2, 0.5)} />
          <motion.path d="M980 360 V170 H1020 V120 H1100 V170 H1140 V360 Z" className={styles.fill} {...draw(0.55, 1.2)} />
          <motion.path d="M980 220 H1140 M980 270 H1140 M980 320 H1140 M1020 170 H1100" className={styles.floor} {...draw(1.3, 0.6)} />
          <motion.path d="M520 392 C 640 420, 740 420, 860 392" className={styles.link} {...draw(1.6, 1)} />
        </g>

        {markers.map((marker, i) => (
          <motion.g
            key={marker.label || i}
            className={styles.marker}
            data-index={i}
            initial={init({ opacity: 0 })}
            animate={run ? { opacity: 1 } : undefined}
            transition={{ duration: 0.5, delay: 1.5 + i * 0.12 }}
          >
            {marker.lead ? <motion.path d={marker.lead} className={styles.lead} {...draw(1.5 + i * 0.12, 0.5)} /> : null}
            <g className={styles.pin} style={{ transformOrigin: `${marker.x}px ${marker.y}px` }}>
              <circle cx={marker.x} cy={marker.y} r="15" className={styles.dot} />
              <text x={marker.x} y={marker.y + 4.5} className={styles.num} textAnchor="middle">
                {padIndex(i + 1)}
              </text>
            </g>
            <text x={marker.x + 26} y={marker.y + 5} className={styles.label}>
              {marker.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  )
}
