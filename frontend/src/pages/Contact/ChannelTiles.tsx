import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { spotlightLeave, spotlightMove } from '../../components/FeatureGrid/spotlight.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import styles from './ChannelTiles.module.css'

/**
 * İletişim kanalları: üç büyük kutucuk (WhatsApp, bayi kanal yöneticisi, e-posta).
 * Liste görünüme girince kutucuklar sırayla yükselir, ikon çizgileri çizilir; fare ışığı kartı izler (M10).
 */
export type ChannelTile = {
  key: string
  eyebrow: string
  value: string
  detail?: string
  description: string
  action: string
  href: string
  external?: boolean
  icon: 'whatsapp' | 'phone' | 'mail'
}

const ICONS: Record<ChannelTile['icon'], string[]> = {
  whatsapp: ['M4.5 19.5 5.7 16A7.8 7.8 0 1 1 8.3 18.4Z', 'M9.2 8.6c.3 2.9 2.3 5 5.3 5.6l1-1.2-1.6-1-1 .7a4 4 0 0 1-2-2l.7-1-1-1.6Z'],
  phone: ['M6.6 3.8 9.3 4.4l1 4-2 1.3a10.6 10.6 0 0 0 6 6l1.3-2 4 1 .6 2.7a2 2 0 0 1-2 2.3A16.6 16.6 0 0 1 4.3 5.8a2 2 0 0 1 2.3-2Z'],
  mail: ['M3.5 6.5h17v11h-17Z', 'm3.8 7 8.2 6.3L20.2 7'],
}

function TileIcon({ name, draw, delay }: { name: ChannelTile['icon']; draw: boolean; delay: number }) {
  const reduce = Boolean(useReducedMotion())
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true" focusable="false">
      {ICONS[name].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          initial={reduce ? false : { pathLength: 0 }}
          animate={draw ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.9, delay: delay + i * 0.25, ease: revealEase }}
        />
      ))}
    </svg>
  )
}

export default function ChannelTiles({ tiles, label, newTab, id }: { tiles: ChannelTile[]; label: string; newTab: string; id?: string }) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const run = reduce || inView

  const tileBody = (tile: ChannelTile, index: number): ReactNode => (
    <>
      <span className={styles.top}>
        <span className={styles.iconTile}>
          <TileIcon name={tile.icon} draw={run} delay={0.25 + index * 0.1} />
        </span>
        <span className={styles.eyebrow}>{tile.eyebrow}</span>
      </span>
      <strong className={styles.value}>{tile.value}</strong>
      {tile.detail ? <span className={styles.detail}>{tile.detail}</span> : null}
      <span className={styles.description}>{tile.description}</span>
      <span className={styles.action}>
        {tile.action}
        {tile.external ? <span className={styles.srOnly}> {newTab}</span> : null}
        <svg viewBox="0 0 24 24" className={styles.arrow} aria-hidden="true" focusable="false">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </>
  )

  return (
    <ul ref={ref} id={id} className={styles.list} aria-label={label}>
      {tiles.map((tile, index) => (
        <motion.li
          key={tile.key}
          className={styles.item}
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={run ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.75, delay: 0.1 + index * 0.09, ease: revealEase }}
        >
          <a
            className={styles.tile}
            data-channel={tile.icon}
            href={tile.href}
            target={tile.external ? '_blank' : undefined}
            rel={tile.external ? 'noopener noreferrer' : undefined}
            onPointerMove={spotlightMove}
            onPointerLeave={spotlightLeave}
          >
            {tileBody(tile, index)}
          </a>
        </motion.li>
      ))}
    </ul>
  )
}
