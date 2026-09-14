import { motion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { HUB_CENTER, HUB_VIEWBOX, spokes } from './hubGeometry.ts'
import styles from './HubSpoke.module.css'

type HubSpokeArtProps = {
  /** Kırpılmamış kök görünüme girdi mi (bir kez). */
  drawn: boolean
  reduce: boolean
  active: number
}

/** Bağlantı çizgileri (M3 çizim), merkeze akan veri noktaları ve dönen dış halka. Tamamen dekoratif. */
export default function HubSpokeArt({ drawn, reduce, active }: HubSpokeArtProps) {
  const { x, y, ring } = HUB_CENTER

  return (
    <svg
      className={styles.art}
      viewBox={`0 0 ${HUB_VIEWBOX.width} ${HUB_VIEWBOX.height}`}
      aria-hidden="true"
      focusable="false"
    >
      <motion.g
        initial={reduce ? false : { opacity: 0 }}
        animate={drawn ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 0.2, ease: revealEase }}
      >
        <g className={styles.ring}>
          <circle cx={x} cy={y} r={ring} />
        </g>
      </motion.g>

      {spokes.map((spoke, index) => {
        const selected = index === active
        const nodeX = spoke.side === 'left' ? 270 : 730
        return (
          <g key={spoke.d} className={styles.spoke} data-active={selected}>
            <motion.path
              className={styles.wire}
              d={spoke.d}
              initial={reduce ? false : { pathLength: 0 }}
              animate={drawn ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.45 + index * 0.08, ease: revealEase }}
            />
            {reduce ? null : (
              <motion.g
                initial={{ opacity: 0 }}
                animate={drawn ? { opacity: 1 } : undefined}
                transition={{ duration: 0.6, delay: 1.35 + index * 0.06 }}
              >
                <path
                  className={styles.flow}
                  d={spoke.d}
                  pathLength={1}
                  style={{ animationDelay: `${index * -0.47}s` }}
                />
              </motion.g>
            )}
            <motion.circle
              className={styles.node}
              cx={nodeX}
              cy={spoke.y}
              r={4.5}
              initial={reduce ? false : { opacity: 0 }}
              animate={drawn ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
            />
          </g>
        )
      })}

      {reduce || !drawn ? null : (
        <motion.circle
          key={active}
          className={styles.echo}
          cx={x}
          cy={y}
          r={112}
          initial={{ opacity: 0.55, scale: 1 }}
          animate={{ opacity: 0, scale: 1.3 }}
          transition={{ duration: 1.1, ease: revealEase }}
        />
      )}
    </svg>
  )
}
