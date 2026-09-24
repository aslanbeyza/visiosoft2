import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import CountUp from '../../components/CountUp/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { sitemapCopy as copy } from './sitemapCopy.ts'
import type { SitemapGroup } from './sitemapCopy.ts'
import styles from './SitemapTree.module.css'

type SitemapTreeProps = { groups: SitemapGroup[]; homeTo: string }

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.homeIcon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
    </svg>
  )
}

export default function SitemapTree({ groups, homeTo }: SitemapTreeProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const play = reduce || inView
  const draw = (delay: number, axis: 'x' | 'y') => ({
    initial: reduce ? false : axis === 'x' ? { scaleX: 0 } : { scaleY: 0 },
    animate: play ? (axis === 'x' ? { scaleX: 1 } : { scaleY: 1 }) : undefined,
    transition: { duration: 0.7, delay, ease: revealEase },
  })

  return (
    <nav ref={ref} className={styles.tree} aria-label={copy.treeLabel} style={{ '--n': groups.length } as CSSProperties}>
      <motion.div
        className={styles.rootWrap}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, delay: 0.45, ease: revealEase }}
      >
        <Link to={homeTo} className={styles.root}>
          <HomeIcon />
          {copy.homeLabel}
        </Link>
      </motion.div>
      <motion.span className={styles.stem} aria-hidden="true" {...draw(0.75, 'y')} />

      <ol className={styles.nodes}>
        <motion.span className={styles.bus} aria-hidden="true" {...draw(1, 'x')} />
        {groups.map((group, index) => (
          <li key={group.id} className={styles.item}>
            <motion.span className={styles.drop} aria-hidden="true" {...draw(1.3 + index * 0.05, 'y')} />
            <motion.a
              href={`#${group.id}`}
              className={styles.node}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={play ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 1.45 + index * 0.07, ease: revealEase }}
            >
              <span className={styles.nodeTitle}>{group.title}</span>
              <span className={styles.nodeCount}>
                <CountUp value={group.links.length} suffix={copy.pagesSuffix} />
              </span>
            </motion.a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
