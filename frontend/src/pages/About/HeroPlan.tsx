import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import styles from './HeroPlan.module.css'

/**
 * Hakkımızda kahraman sahnesi: kuşbakışı otopark planı çizilir, dolu yerler belirir,
 * lacivert araç koridordan gelip vurgulu boş yere park eder ve "P" tabelası yükselir.
 * Tetik kırpılmamış kaptan gelir; hareket azaltmada son kare doğrudan çizilir.
 */
const TOP = [100, 188, 276, 364, 452, 540]
const PARKED_TOP = [100, 188, 452]
const PARKED_BOTTOM = [100, 276, 364, 540]
const CAR_BODY = 'M-15 -18 Q0 -26 15 -18 L13 -6 H-13 Z M-13 16 H13 L15 26 Q0 32 -15 26 Z'

export default function HeroPlan() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const run = reduce || inView
  const init = <T,>(value: T) => (reduce ? false : value)

  const draw = (delay: number, duration = 0.9) => ({
    initial: init({ pathLength: 0 }),
    animate: run ? { pathLength: 1 } : undefined,
    transition: { duration, delay, ease: revealEase },
  })

  const dividers = [56, ...TOP.map((x) => x + 44)]

  return (
    <div ref={ref} className={styles.stage} aria-hidden="true">
      <svg className={styles.svg} viewBox="24 0 592 440" focusable="false">
        <rect x="40" y="56" width="560" height="368" rx="10" className={styles.ground} />
        <g className={styles.ink} fill="none">
          <motion.path d="M56 72 H584" {...draw(0.1)} />
          <motion.path d="M56 408 H584" {...draw(0.2)} />
          {dividers.map((x, i) => (
            <motion.path key={`t${x}`} d={`M${x} 72 V176`} {...draw(0.3 + i * 0.05, 0.6)} />
          ))}
          {dividers.map((x, i) => (
            <motion.path key={`b${x}`} d={`M${x} 304 V408`} {...draw(0.35 + i * 0.05, 0.6)} />
          ))}
        </g>
        <motion.path
          d="M72 240 H568"
          className={styles.lane}
          initial={init({ opacity: 0 })}
          animate={run ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {[...PARKED_TOP.map((x) => ({ x, y: 124, r: 0 })), ...PARKED_BOTTOM.map((x) => ({ x, y: 356, r: 180 }))].map((car, i) => (
          <g key={`${car.x}-${car.y}`} transform={`translate(${car.x} ${car.y}) rotate(${car.r})`}>
            <motion.g
              className={styles.parked}
              initial={init({ opacity: 0, y: -10 })}
              animate={run ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.7 + i * 0.07, ease: revealEase }}
            >
              <rect x="-21" y="-40" width="42" height="80" rx="11" />
              <path d={CAR_BODY} />
            </motion.g>
          </g>
        ))}

        <motion.rect
          x="321" y="73" width="86" height="103"
          className={styles.bayFill}
          initial={init({ opacity: 0 })}
          animate={run ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 1.3 }}
        />
        <motion.path d="M320 176 V72 H408 V176" className={styles.bayLine} {...draw(1.3, 0.8)} />

        <motion.g
          initial={init({ x: 660, y: 240, rotate: -90, opacity: 0 })}
          animate={run ? { x: [660, 520, 400, 364, 364], y: [240, 240, 236, 180, 126], rotate: [-90, -90, -60, 0, 0], opacity: [0, 1, 1, 1, 1] } : undefined}
          transition={{ duration: 2.2, delay: 1.5, times: [0, 0.3, 0.55, 0.8, 1], ease: 'easeInOut' }}
        >
          <rect x="-22" y="-42" width="44" height="84" rx="12" className={styles.carBody} />
          <path d="M-16 -19 Q0 -27 16 -19 L14 -6 H-14 Z" className={styles.carGlass} />
          <path d="M-14 17 H14 L16 27 Q0 33 -16 27 Z" className={styles.carRear} />
          <rect x="-12" y="-4" width="24" height="19" rx="3" className={styles.carRoof} />
        </motion.g>

        <motion.path d="M364 44 V72" className={styles.poleLine} {...draw(3.4, 0.4)} />
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          initial={init({ scale: 0, opacity: 0 })}
          animate={run ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: 3.6, ease: revealEase }}
        >
          <rect x="348" y="12" width="32" height="32" rx="6" className={styles.sign} />
          <path d="M359 37 V19 H366 A5.5 5.5 0 0 1 366 30 H359" className={styles.signP} />
        </motion.g>
      </svg>
    </div>
  )
}
