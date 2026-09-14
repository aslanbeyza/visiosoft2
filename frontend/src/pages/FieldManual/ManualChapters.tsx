import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { Skeleton } from '../../components/States/index.ts'
import { fieldManualCopy as copy } from './fieldManualCopy.ts'
import styles from './ManualChapters.module.css'

export type ManualChapter = { id: string; title: string }

type ManualChaptersProps = {
  /** null: veri bekleniyor; boş dizi: gösterilecek bölüm yok. */
  chapters: ManualChapter[] | null
  title?: string
  /** PDF modunda hareket kapatılır. */
  static?: boolean
}

const pad = (value: number) => String(value).padStart(2, '0')

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

/**
 * Hero sahnesi: kılavuzun cilt sırtı. Sol kenardaki lacivert sırt çizgisi yukarıdan aşağı çizilir, her bölüm satırı
 * altındaki çizgiyle birlikte soldan süpürülerek belirir (M3 + M12). Satırlar ilgili başlığa atlayan bağlantılardır.
 */
export default function ManualChapters({ chapters, title = copy.chaptersTitle, static: isStatic = false }: ManualChaptersProps) {
  const reduce = Boolean(useReducedMotion()) || isStatic
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const play = reduce || inView
  const count = chapters?.length ?? 0

  return (
    <nav ref={ref} className={styles.card} aria-label={copy.chaptersLabel}>
      <motion.span
        className={styles.spine}
        aria-hidden="true"
        initial={reduce ? false : { scaleY: 0 }}
        animate={play ? { scaleY: 1 } : undefined}
        transition={{ duration: 1.2, delay: 0.35, ease: revealEase }}
      />
      <div className={styles.head}>
        <p className={styles.title}>{title}</p>
        {count > 0 ? <p className={styles.count}>{copy.chapterCount(count)}</p> : null}
      </div>

      {chapters === null ? <Skeleton variant="text" count={6} label={copy.loading} /> : null}

      {chapters && chapters.length > 0 ? (
        <ol className={styles.list}>
          {chapters.map((chapter, index) => (
            <li key={chapter.id} className={styles.item}>
              <motion.span
                className={styles.line}
                aria-hidden="true"
                initial={reduce ? false : { scaleX: 0 }}
                animate={play ? { scaleX: 1 } : undefined}
                transition={{ duration: 0.9, delay: 0.5 + index * 0.08, ease: revealEase }}
              />
              <motion.a
                href={`#${chapter.id}`}
                className={styles.link}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                animate={play ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.7, delay: 0.55 + index * 0.08, ease: revealEase }}
              >
                <span className={styles.number} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <span className={styles.label}>{chapter.title}</span>
                <Arrow />
              </motion.a>
            </li>
          ))}
        </ol>
      ) : null}
    </nav>
  )
}
