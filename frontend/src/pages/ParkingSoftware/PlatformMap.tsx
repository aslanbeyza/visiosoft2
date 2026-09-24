import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import styles from './PlatformMap.module.css'

type Node = { icon: FeatureIconName; title: string }

type PlatformMapProps = {
  nodes: Node[]
  alt: string
  caption: string
}

const VIEW_H = 380
const ROWS = [40, 190, 340]
const TARGETS = [90, 190, 290]

const leftPath = (y: number, t: number) =>
  y === t ? `M228 ${y} H300` : `M228 ${y} H256 Q264 ${y} 264 ${y + Math.sign(t - y) * 8} V${t - Math.sign(t - y) * 8} Q264 ${t} 272 ${t} H300`
const rightPath = (y: number, t: number) =>
  y === t ? `M972 ${y} H900` : `M972 ${y} H944 Q936 ${y} 936 ${y + Math.sign(t - y) * 8} V${t - Math.sign(t - y) * 8} Q936 ${t} 928 ${t} H900`

export default function PlatformMap({ nodes, alt, caption }: PlatformMapProps) {
  const reduce = Boolean(useReducedMotion())
  const wide = useMediaQuery('(min-width: 1024px)')
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, amount: 0.3 })
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] })
  const leftY = useTransform(scrollYProgress, [0, 1], ['2.5%', '-2.5%'])
  const rightY = useTransform(scrollYProgress, [0, 1], ['-2.5%', '2.5%'])
  const parallax = wide && !reduce
  const show = reduce || inView

  const columns = [
    { side: 'left' as const, items: nodes.slice(0, 3), y: leftY, path: leftPath, edge: 300, from: 228 },
    { side: 'right' as const, items: nodes.slice(3, 6), y: rightY, path: rightPath, edge: 900, from: 972 },
  ]

  return (
    <div className={styles.root}>
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.screen}>
          <MediaFrame ratio="1600 / 922" mode="screenshot" amount={0.2}>
            <Picture
              src="/img/software/live-map.webp"
              avif="/img/software/live-map.avif"
              alt={alt}
              width={1600}
              height={922}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 40rem, 100vw"
            />
          </MediaFrame>
        </div>

        {columns.map((column, columnIndex) => (
          <motion.div
            key={column.side}
            className={styles.column}
            data-side={column.side}
            style={parallax ? { y: column.y } : undefined}
            aria-hidden="true"
          >
            <svg className={styles.lines} viewBox={`0 0 1200 ${VIEW_H}`} focusable="false">
              {column.items.map((item, i) => {
                const delay = 0.85 + (columnIndex * 3 + i) * 0.08
                return (
                  <g key={item.title}>
                    <motion.path
                      d={column.path(ROWS[i], TARGETS[i])}
                      className={styles.path}
                      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                      animate={show ? { pathLength: 1, opacity: 1 } : undefined}
                      transition={{ duration: 0.9, delay, ease: revealEase }}
                    />
                    <motion.circle
                      cx={column.edge}
                      cy={TARGETS[i]}
                      r={5}
                      className={styles.dot}
                      initial={reduce ? false : { scale: 0 }}
                      animate={show ? { scale: 1 } : undefined}
                      transition={{ duration: 0.5, delay: delay + 0.7, ease: revealEase }}
                    />
                  </g>
                )
              })}
            </svg>
            <ul className={styles.nodes}>
              {column.items.map((item, i) => (
                <motion.li
                  key={item.title}
                  className={styles.node}
                  style={{ '--row': ROWS[i] } as CSSProperties}
                  initial={reduce ? false : { opacity: 0, x: column.side === 'left' ? -24 : 24 }}
                  animate={show ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.8, delay: 0.5 + (columnIndex * 3 + i) * 0.08, ease: revealEase }}
                >
                  <span className={styles.icon}>
                    <FeatureIcon name={item.icon} />
                  </span>
                  <span className={styles.title}>{item.title}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <p className={styles.caption}>{caption}</p>
    </div>
  )
}
