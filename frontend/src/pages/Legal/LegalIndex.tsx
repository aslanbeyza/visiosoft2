import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { legalPageCopy as copy } from './legalPageCopy.ts'
import styles from './LegalIndex.module.css'

type LegalIndexProps = {
  /** Etkin belgenin rota adı. */
  active: string
  /** Etkin belgedeki h2 sayısı; madde cetvelinin çentik sayısı. */
  headingCount: number
}

const pad = (value: number) => String(value).padStart(2, '0')
const RULER_WIDTH = 240

/**
 * Hero altındaki belge dizini: altı yasal metin numaralı cetvel üzerinde dizilir, çizgiler soldan sağa çizilir,
 * etkin belge lacivert kalın çizgiyle işaretlenir. Altında belgenin başlık sayısı kadar çentikli cetvel çizilir (M3).
 */
export default function LegalIndex({ active, headingCount }: LegalIndexProps) {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const play = reduce || inView
  const step = headingCount > 1 ? RULER_WIDTH / (headingCount - 1) : 0

  return (
    <nav ref={ref} className={styles.index} aria-label={copy.indexLabel}>
      <ol className={styles.list}>
        {copy.documents.map((doc, index) => {
          const current = doc.route === active
          return (
            <li key={doc.route} className={styles.item}>
              <motion.span
                className={styles.rule}
                data-current={current}
                aria-hidden="true"
                initial={reduce ? false : { scaleX: 0 }}
                animate={play ? { scaleX: 1 } : undefined}
                transition={{ duration: 0.9, delay: 0.4 + index * 0.07, ease: revealEase }}
              />
              <Link to={path(doc.route)} className={styles.link} aria-current={current ? 'page' : undefined}>
                <span className={styles.number} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <span className={styles.label}>{doc.label}</span>
              </Link>
            </li>
          )
        })}
      </ol>

      {headingCount > 0 ? (
        <p className={styles.meta}>
          <svg
            className={styles.ruler}
            viewBox={`0 0 ${RULER_WIDTH + 8} 14`}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <motion.path
              d={`M4 7H${RULER_WIDTH + 4}`}
              strokeWidth="1.5"
              initial={reduce ? false : { pathLength: 0 }}
              animate={play ? { pathLength: 1 } : undefined}
              transition={{ duration: 1.1, delay: 0.7, ease: revealEase }}
            />
            {Array.from({ length: headingCount }, (_, index) => (
              <motion.path
                key={index}
                d={`M${4 + index * step} 1.5V12.5`}
                strokeWidth="1.5"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={play ? { pathLength: 1, opacity: 1 } : undefined}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.08, ease: revealEase }}
              />
            ))}
          </svg>
          <span>{copy.headingCount(headingCount)}</span>
        </p>
      ) : null}
    </nav>
  )
}
