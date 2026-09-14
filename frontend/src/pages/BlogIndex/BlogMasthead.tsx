import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { blogCopy as copy } from './blogCopy.ts'
import type { BlogIndexState } from './useBlogIndex.ts'
import styles from './BlogMasthead.module.css'

/**
 * Hero altındaki gazete künyesi: üst ve alt çizgi ortadan dışa doğru çizilir; aralarında yayın adı,
 * gerçek yazı sayısı ve son yazının tarihi belirir (veri gelince). Satır yüksekliği baştan ayrılır, kayma olmaz.
 */
export default function BlogMasthead({ state }: { state: BlogIndexState }) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const play = reduce || inView
  const posts = state.status === 'ready' ? state.posts : []
  const latest = posts[0]?.formatted_date

  const fade = {
    initial: reduce ? false : { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: revealEase },
  }

  return (
    <div ref={ref} className={styles.masthead}>
      <motion.span
        className={styles.ruleStrong}
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        animate={play ? { scaleX: 1 } : undefined}
        transition={{ duration: 1.2, delay: 0.55, ease: revealEase }}
      />
      <p className={styles.row}>
        <span className={styles.brand}>Visiosoft Blog</span>
        {posts.length > 0 ? (
          <>
            <motion.span className={styles.dot} aria-hidden="true" {...fade} />
            <motion.span {...fade}>{copy.postCount(posts.length)}</motion.span>
            {latest ? (
              <>
                <motion.span className={styles.dot} aria-hidden="true" {...fade} />
                <motion.span {...fade}>
                  {copy.featuredEyebrow}: {latest}
                </motion.span>
              </>
            ) : null}
          </>
        ) : null}
      </p>
      <motion.span
        className={styles.ruleThin}
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        animate={play ? { scaleX: 1 } : undefined}
        transition={{ duration: 1.2, delay: 0.7, ease: revealEase }}
      />
    </div>
  )
}
