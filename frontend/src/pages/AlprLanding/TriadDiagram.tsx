import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { revealEase } from '../../components/Reveal/index.ts'
import styles from './TriadDiagram.module.css'

const HUB = { x: 280, y: 206 }

// Üç bileşen: konum, hub'a giden bağlantı eğrisi, eğri boyunca yol alan noktanın göreli kareleri ve simge çizgileri
const nodes = [
  {
    x: 110,
    y: 96,
    link: 'M110 96C190 96 230 150 280 206',
    dot: { x: [0, 96, 170], y: [0, 34, 110] },
    glyph: 'M-26 -20h52v36h-52z M-8 24h16 M0 16v8 M-16 -8v-5h5 M11 -13h5v5 M16 4v5h-5 M-11 9h-5v-5 M-7 -2h14',
  },
  {
    x: 450,
    y: 96,
    link: 'M450 96C370 96 330 150 280 206',
    dot: { x: [0, -96, -170], y: [0, 34, 110] },
    glyph: 'M-28 -16h24l6 6v9h-30z M-20 -1v29 M-28 28h16 M8 -22h16v50h-16z M11 -17h10v10h-10z M16 20v2',
  },
  {
    x: 280,
    y: 352,
    link: 'M280 352V206',
    dot: { x: [0, 0, 0], y: [0, -73, -146] },
    glyph: 'M-20 8v-8a20 20 0 0 1 40 0v8 M-26 4h8v16h-8z M18 4h8v16h-8z M22 20c0 8-8 12-18 12',
  },
]

type TriadDiagramProps = {
  labels: string[]
  hub: string
  label: string
  active: number | null
}

/** Hero anı: yazılım, donanım ve destek düğümleri çizilir; bağlantılar hub'a akar. Kart üzerine gelindiğinde ilgili düğüm öne çıkar. */
export default function TriadDiagram({ labels, hub, label, active }: TriadDiagramProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const run = !reduce && inView
  const t = (delay: number, duration = 0.8) => ({ duration, delay, ease: revealEase })

  return (
    <div ref={ref} className={styles.root} role="img" aria-label={label}>
      <svg className={styles.svg} viewBox="0 0 560 452" data-active={active ?? 'none'} aria-hidden="true" focusable="false">
        <circle cx={HUB.x} cy={HUB.y} r="150" className={styles.orbit} />
        {nodes.map((node, index) => (
          <motion.path
            key={node.link}
            d={node.link}
            className={styles.link}
            data-node={index}
            initial={reduce ? false : { pathLength: 0 }}
            animate={run ? { pathLength: 1 } : undefined}
            transition={t(0.9 + index * 0.15, 0.9)}
          />
        ))}
        {reduce
          ? null
          : nodes.map((node, index) => (
              <motion.circle
                key={`dot-${node.link}`}
                cx={node.x}
                cy={node.y}
                r="5"
                className={styles.dot}
                initial={{ opacity: 0 }}
                animate={run ? { opacity: [0, 1, 1, 0], x: node.dot.x, y: node.dot.y } : undefined}
                transition={{ duration: 1, delay: 1.5 + index * 0.15, ease: 'easeInOut' }}
              />
            ))}
        {nodes.map((node, index) => (
          <g key={`node-${node.link}`} className={styles.node} data-node={index} transform={`translate(${node.x} ${node.y})`}>
            <motion.g
              initial={reduce ? false : { opacity: 0, scale: 0.7 }}
              animate={run ? { opacity: 1, scale: 1 } : undefined}
              transition={t(0.3 + index * 0.15)}
            >
              <circle r="56" className={styles.disc} />
              <motion.path
                d={node.glyph}
                className={styles.glyph}
                initial={reduce ? false : { pathLength: 0 }}
                animate={run ? { pathLength: 1 } : undefined}
                transition={t(0.55 + index * 0.15, 1)}
              />
              <circle cx="40" cy="-40" r="14" className={styles.badge} />
              <text x="40" y="-40" className={styles.badgeText}>
                {String(index + 1).padStart(2, '0')}
              </text>
              <text y="84" className={styles.nodeLabel}>
                {labels[index]}
              </text>
            </motion.g>
          </g>
        ))}
        <g transform={`translate(${HUB.x} ${HUB.y})`}>
          <motion.g initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={run ? { opacity: 1, scale: 1 } : undefined} transition={t(2.2)}>
            <circle r="50" className={styles.hub} />
            <text y="0" className={styles.hubText}>
              {hub}
            </text>
          </motion.g>
        </g>
      </svg>
    </div>
  )
}
