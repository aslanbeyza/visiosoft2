import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { sitemapCopy as copy } from './sitemapCopy.ts'
import type { SitemapGroup } from './sitemapCopy.ts'
import styles from './SitemapGroups.module.css'

const pad = (value: number) => String(value).padStart(2, '0')

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

function GroupCard({ group, index }: { group: SitemapGroup; index: number }) {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const play = reduce || inView
  const headingId = `${group.id}-baslik`

  return (
    <section ref={ref} id={group.id} className={styles.group} aria-labelledby={headingId}>
      <motion.span
        className={styles.topRule}
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        animate={play ? { scaleX: 1 } : undefined}
        transition={{ duration: 1, ease: revealEase }}
      />
      <h2 id={headingId} className={styles.title}>
        <span className={styles.index} aria-hidden="true">
          {pad(index + 1)}
        </span>
        {group.title}
      </h2>
      <ul className={styles.list}>
        {group.links.map((link, row) => {
          const delay = 0.2 + row * 0.05
          return (
            <motion.li
              key={link.route}
              className={styles.row}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={play ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay, ease: revealEase }}
            >
              <motion.span
                className={styles.sweep}
                aria-hidden="true"
                initial={reduce ? false : { scaleX: 0, opacity: 1 }}
                animate={play ? { scaleX: 1, opacity: 0 } : undefined}
                transition={{
                  scaleX: { duration: 0.8, delay, ease: revealEase },
                  opacity: { duration: 0.5, delay: delay + 0.7, ease: 'linear' },
                }}
              />
              <Link to={path(link.route)} className={styles.link}>
                <span>{link.label}</span>
                <Arrow />
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}

export default function SitemapGroups({ groups }: { groups: SitemapGroup[] }) {
  return (
    <Section tone="surface" spacing="lg" width="wide" label={copy.groupsLabel}>
      <div className={styles.grid}>
        {groups.map((group, index) => (
          <GroupCard key={group.id} group={group} index={index} />
        ))}
      </div>
    </Section>
  )
}
