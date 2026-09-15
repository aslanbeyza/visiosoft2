import { useId } from 'react'
import { motion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { CHIP, FIELD, HUB_CENTER, HUB_VIEWBOX, spokeEnds, spokes } from './hubGeometry.ts'
import styles from './HubSpoke.module.css'

type HubSpokeArtProps = {
  /** Kırpılmamış kök görünüme girdi mi (bir kez). */
  drawn: boolean
  reduce: boolean
  active: number
}

/**
 * Ağ katmanı: CPU çerçevesi, sinaps noktaları ve kartlardan merkeze giden ışınlar
 * (21st.dev Animated Beam / CPU Architecture). Tamamen dekoratif.
 */
export default function HubSpokeArt({ drawn, reduce, active }: HubSpokeArtProps) {
  const uid = `hub${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const { x, y, ring } = HUB_CENTER
  const chip = CHIP

  return (
    <svg
      className={styles.art}
      viewBox={`0 0 ${HUB_VIEWBOX.width} ${HUB_VIEWBOX.height}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#171b99" stopOpacity="0.22" />
          <stop offset="1" stopColor="#171b99" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.g
        initial={reduce ? false : { opacity: 0 }}
        animate={drawn ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 0.15, ease: revealEase }}
      >
        <circle cx={x} cy={y} r={ring + 72} fill={`url(#${uid}-glow)`} />
        <g className={styles.field}>
          {FIELD.map(([fx, fy]) => (
            <circle key={`${fx}-${fy}`} cx={fx} cy={fy} r="2.2" />
          ))}
        </g>
        <g className={styles.chip}>
          <path d={`M${x - chip} ${y - chip + 28}V${y - chip}h28`} />
          <path d={`M${x + chip} ${y - chip + 28}V${y - chip}h-28`} />
          <path d={`M${x - chip} ${y + chip - 28}V${y + chip}h28`} />
          <path d={`M${x + chip} ${y + chip - 28}V${y + chip}h-28`} />
        </g>
      </motion.g>

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
        const { nodeX, nodeY, d } = spokeEnds(spoke)
        return (
          <g key={`${spoke.side}-${spoke.y}`} className={styles.spoke} data-active={selected}>
            <motion.path
              className={styles.wire}
              d={d}
              initial={reduce ? false : { pathLength: 0 }}
              animate={drawn ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.95, delay: 0.4 + index * 0.08, ease: revealEase }}
            />
            {reduce ? null : (
              <motion.g
                initial={{ opacity: 0 }}
                animate={drawn ? { opacity: 1 } : undefined}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.05 }}
              >
                <path className={styles.beam} d={d} pathLength={1} style={{ animationDelay: `${index * -0.55}s` }} />
                <path className={styles.flow} d={d} pathLength={1} style={{ animationDelay: `${index * -0.55}s` }} />
              </motion.g>
            )}
            <motion.circle
              className={styles.node}
              cx={nodeX}
              cy={nodeY}
              r={selected ? 5.5 : 4.5}
              initial={reduce ? false : { opacity: 0 }}
              animate={drawn ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.35 + index * 0.08 }}
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
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.28 }}
          transition={{ duration: 1.15, ease: revealEase }}
        />
      )}
    </svg>
  )
}
