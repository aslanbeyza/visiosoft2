import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { STAGE, flagshipGeometry } from './flagships.ts'
import type { Flagship } from './flagships.ts'
import styles from './FlagshipStage.module.css'

type FlagshipCanvasProps = {
  items: Flagship[]
  active: number
}

const DURATION = 0.38

export default function FlagshipCanvas({ items, active }: FlagshipCanvasProps) {
  const reduce = Boolean(useReducedMotion())
  const shapes = items.map(flagshipGeometry)
  const duration = reduce ? 0 : DURATION

  return (
    <div className={styles.stage}>
      <div
        className={styles.canvas}
        style={
          {
            '--floor': `${STAGE.floor}cqh`,
            '--shadow-max': `${STAGE.shadow.max}cqh`,
          } as CSSProperties
        }
      >
        <span className={styles.ground} aria-hidden="true">
          <motion.span
            className={styles.shadow}
            initial={false}
            animate={{ scaleX: shapes[active].shadow }}
            transition={{ duration, ease: revealEase }}
          />
        </span>
        {items.map((item, index) => {
          const on = index === active
          return (
            <motion.div
              key={item.slug}
              className={styles.product}
              style={shapes[index].style}
              aria-hidden={!on}
              initial={false}
              animate={{ opacity: on ? 1 : 0, y: on ? 0 : 14 }}
              transition={{ duration, ease: revealEase }}
            >
              <picture>
                <source type="image/avif" srcSet={item.image.avif} />
                <img
                  className={styles.image}
                  src={item.image.src}
                  alt={on ? item.image.alt : ''}
                  width={item.image.width}
                  height={item.image.height}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              </picture>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
