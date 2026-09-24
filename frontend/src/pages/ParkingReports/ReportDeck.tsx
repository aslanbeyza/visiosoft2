import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import styles from './ReportDeck.module.css'

export type DeckCard = { key: string; icon: FeatureIconName; label: string; short: string; badge: string; lines: string[] }

type ReportDeckProps = { cards: DeckCard[] }

type Fan = { x: number; y: number; r: number }

const FAN: Fan[] = [
  { x: -21, y: -30, r: -5 },
  { x: -7, y: -10, r: -1.5 },
  { x: 7, y: 10, r: 1.5 },
  { x: 21, y: 30, r: 5 },
]

const FAN_NARROW: Fan[] = [
  { x: -3, y: -36, r: -1.6 },
  { x: -1, y: -12, r: -0.5 },
  { x: 1, y: 12, r: 0.5 },
  { x: 3, y: 36, r: 1.6 },
]

type CardProps = { card: DeckCard; index: number; count: number; show: boolean; narrow: boolean; progress: MotionValue<number> }

function Card({ card, index, count, show, narrow, progress }: CardProps) {
  const reduce = Boolean(useReducedMotion())
  const fans = narrow ? FAN_NARROW : FAN
  const fan = fans[index] ?? fans[fans.length - 1]
  const spread = index - (count - 1) / 2

  const scrollX = useTransform(progress, [0, 1], ['0%', `${spread * (narrow ? 0 : 5)}%`])
  const scrollY = useTransform(progress, [0, 1], ['0%', `${spread * (narrow ? 4 : 9)}%`])
  const scrollR = useTransform(progress, [0, 1], [0, spread * (narrow ? 0.4 : 1.2)])
  const target = { x: `${fan.x}%`, y: `${fan.y}%`, rotate: fan.r }

  return (
    <motion.li
      className={styles.slot}
      style={{ zIndex: index + 1, ...(reduce ? {} : { x: scrollX, y: scrollY, rotate: scrollR }) }}
    >
      <motion.div
        className={styles.card}
        data-front={index === count - 1}

        initial={reduce ? false : { opacity: 0, x: '0%', y: '12%', rotate: 0 }}
        animate={
          reduce
            ? { opacity: 1, ...target }
            : show
              ? { opacity: [0, 1, 1], x: ['0%', '0%', target.x], y: ['12%', '0%', target.y], rotate: [0, 0, fan.r] }
              : undefined
        }
        transition={reduce ? { duration: 0 } : { duration: 1.7, times: [0, 0.38, 1], delay: 0.35 + index * 0.07, ease: revealEase }}
      >
        <span className={styles.head}>
          <span className={styles.icon}>
            <FeatureIcon name={card.icon} />
          </span>
          <span className={styles.label}>
            <span className={styles.labelLong}>{card.label}</span>
            <span className={styles.labelShort}>{card.short}</span>
          </span>
          <span className={styles.badge}>{card.badge}</span>
        </span>
        <span className={styles.lines}>
          {card.lines.map((line, lineIndex) => (
            <span key={line} className={styles.line} style={{ '--w': `${92 - lineIndex * 14}%` } as CSSProperties}>
              {line}
            </span>
          ))}
        </span>
        {}
        <span className={styles.foot}>
          <span className={styles.format}>Excel</span>
          <span className={styles.format}>PDF</span>
          <svg className={styles.download} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
          </svg>
        </span>
      </motion.div>
    </motion.li>
  )
}

export default function ReportDeck({ cards }: ReportDeckProps) {
  const reduce = Boolean(useReducedMotion())
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, amount: 0.3 })
  const narrow = useMediaQuery('(max-width: 639px)')
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['center center', 'end start'] })

  return (
    <div ref={stageRef} className={styles.stage} aria-hidden="true">
      <span className={styles.floor} />
      <ol className={styles.deck}>
        {cards.map((card, index) => (
          <Card
            key={card.key}
            card={card}
            index={index}
            count={cards.length}
            show={!reduce && inView}
            narrow={narrow}
            progress={scrollYProgress}
          />
        ))}
      </ol>
    </div>
  )
}
