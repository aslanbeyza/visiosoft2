import { createRef, useMemo, useRef } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import { motion, motionValue, useReducedMotion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { RevealGroup, RevealItem } from '../Reveal/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { useNavbarShift } from './useNavbarShift.ts'
import styles from './ScrollStack.module.css'

/**
 * Kullanım:
 * `<ScrollStack tone="dark" items={[{ id: 'map', eyebrow: 'Canlı harita', title: '…', description: '…', bullets: […], media: <MediaFrame …/> }]} />`
 * Kartlar kaydırdıkça navbar altına yapışıp üst üste biner (M6); sıradaki kart gelirken bir önceki 0,96'ya küçülür
 * ve gölgelenir (kaydırmaya bağlı, state yok). Dar ekran ve hareket azaltmada düz kart listesi.
 */
export type ScrollStackItem = {
  id: string
  eyebrow?: string
  title: string
  description: string
  media?: ReactNode
  bullets?: string[]
}

export type ScrollStackProps = {
  items: ScrollStackItem[]
  tone?: 'light' | 'dark'
  className?: string
  /** Liste için erişilebilir ad. */
  label?: string
  /**
   * Navbar altındaki ek yapışma boşluğu (rem). Yapışkan SubNav olan sayfada `stickOffset={3.25}` verilirse
   * kartlar alt menü çubuğunun altında yığılır. Varsayılan 0.
   */
  stickOffset?: number
}

const pad = (value: number) => String(value).padStart(2, '0')

export default function ScrollStack({ items, tone = 'light', className = '', label, stickOffset = 0 }: ScrollStackProps) {
  const reduce = Boolean(useReducedMotion())
  const wide = useMediaQuery('(min-width: 1024px)')
  const stacked = wide && !reduce

  // Kart sayısı değişmedikçe ref ve ilerleme dizileri sabit kalır; ebeveyn her render'da yeni dizi verse de abonelik yenilenmez.
  const count = items.length
  const refs = useMemo(() => Array.from({ length: count }, () => createRef<HTMLLIElement>()), [count])
  const progress = useMemo(() => Array.from({ length: count }, () => motionValue(0)), [count])
  const listRef = useRef<HTMLOListElement>(null)
  // Kaydırma, CSS yapışma noktası ve navbar kayması tek ölçümden okunur; küçülme gerçek yapışmayla biter.
  useNavbarShift(listRef, refs, stacked, progress)

  return (
    <ol
      ref={listRef}
      className={`${styles.list} ${className}`.trim()}
      data-tone={tone}
      data-stacked={stacked}
      aria-label={label}
      style={stickOffset ? ({ '--ss-offset': `${stickOffset}rem` } as CSSProperties) : undefined}
    >
      {items.map((item, index) => (
        <StackCard
          key={item.id}
          item={item}
          index={index}
          count={count}
          stacked={stacked}
          reduce={reduce}
          selfRef={refs[index]}
          progress={progress[index]}
        />
      ))}
    </ol>
  )
}

type StackCardProps = {
  item: ScrollStackItem
  index: number
  count: number
  stacked: boolean
  reduce: boolean
  selfRef: RefObject<HTMLLIElement | null>
  /** Sıradaki kartın gerçek yapışma noktasına ilerleyişi (0 → 1); useNavbarShift yazar. */
  progress: MotionValue<number>
}

function StackCard({ item, index, count, stacked, reduce, selfRef, progress }: StackCardProps) {
  const isLast = index === count - 1
  // Sıradaki kart görünüm alanının altından yapışma noktasına (navbar gizliyse kaymış konumuna) gelirken bu kart geri çekilir.
  const scale = useTransform(progress, [0, 1], [1, 0.96])
  const shade = useTransform(progress, [0, 1], [0, 0.45])
  const animated = stacked && !isLast

  return (
    <li ref={selfRef} className={styles.item} style={{ '--index': index } as CSSProperties}>
      <motion.article className={styles.card} style={animated ? { scale } : undefined} aria-labelledby={`stack-${item.id}-title`}>
        <RevealGroup className={styles.copy} stagger={0.08} amount={0.3}>
          <RevealItem as="p" className={styles.index}>
            {pad(index + 1)}
            <span aria-hidden="true"> / </span>
            {pad(count)}
          </RevealItem>
          {item.eyebrow ? (
            <RevealItem as="p" className={styles.eyebrow}>
              <span className={styles.rule} aria-hidden="true" />
              {item.eyebrow}
            </RevealItem>
          ) : null}
          <RevealItem y={26}>
            <h3 id={`stack-${item.id}-title`} className={styles.title}>
              {item.title}
            </h3>
          </RevealItem>
          <RevealItem as="p" className={styles.text}>
            {item.description}
          </RevealItem>
          {item.bullets?.length ? (
            <RevealItem as="ul" className={styles.bullets}>
              {item.bullets.map((bullet) => (
                <li key={bullet} className={styles.bullet}>
                  <svg viewBox="0 0 16 16" className={styles.check} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m3.5 8.4 2.9 2.9 6.1-6.3" />
                  </svg>
                  {bullet}
                </li>
              ))}
            </RevealItem>
          ) : null}
        </RevealGroup>

        {item.media ? <div className={styles.media}>{item.media}</div> : null}

        {animated && !reduce ? <motion.span className={styles.shade} style={{ opacity: shade }} aria-hidden="true" /> : null}
      </motion.article>
    </li>
  )
}
