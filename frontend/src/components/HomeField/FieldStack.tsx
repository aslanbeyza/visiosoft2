import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { flagshipInfo } from '../HomeFlagships/flagships.ts'
import type { Flagship } from '../HomeFlagships/flagships.ts'
import { homeFieldCopy as text } from './homeFieldCopy.ts'
import styles from './FieldStack.module.css'

type FieldStackProps = {
  items: Flagship[]
  catalogHref: string
}

const STACK_X = 18
const STACK_SCALE = 0.045
const STACK_Y = 10
const FLING = 120

/** Mobil vitrin: framer-motion ile yığılmış ürün kartları. */
export default function FieldStack({ items, catalogHref }: FieldStackProps) {
  const count = items.length
  const reduce = Boolean(useReducedMotion())
  const [gone, setGone] = useState(() => new Set<number>())

  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => !gone.has(index))

  const resetDeck = useCallback(() => {
    setGone(new Set())
  }, [])

  const dismiss = useCallback(
    (index: number) => {
      setGone((prev) => {
        const next = new Set(prev)
        next.add(index)
        if (next.size >= count) {
          window.setTimeout(resetDeck, 380)
        }
        return next
      })
    },
    [count, resetDeck],
  )

  return (
    <div className={styles.root}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>{text.eyebrow}</p>
        <h2 id={text.titleId} className={styles.title}>{text.title}</h2>
        <p className={styles.hint}>{text.stackHint}</p>
        <Link to={catalogHref} className={styles.all}>{text.all}</Link>
      </header>

      <div className={styles.deck} aria-label={text.galleryLabel}>
        <AnimatePresence>
          {visible.map(({ item, index }, rank) => (
            <StackCard
              key={item.slug}
              item={item}
              index={index}
              rank={rank}
              count={count}
              reduce={reduce}
              onDismiss={() => dismiss(index)}
            />
          )).reverse()}
        </AnimatePresence>
      </div>
    </div>
  )
}

type StackCardProps = {
  item: Flagship
  index: number
  rank: number
  count: number
  reduce: boolean
  onDismiss: () => void
}

function StackCard({ item, index, rank, count, reduce, onDismiss }: StackCardProps) {
  const info = flagshipInfo(item.slug)
  const isTop = rank === 0
  const canDrag = isTop && !reduce
  const [exitX, setExitX] = useState(0)

  return (
    <motion.button
      type="button"
      className={styles.card}
      style={{
        zIndex: count - rank,
        touchAction: canDrag ? 'none' : undefined,
      }}
      initial={reduce ? false : { opacity: 0, y: rank * STACK_Y + 28 }}
      animate={{
        opacity: 1,
        x: rank * STACK_X,
        y: rank * STACK_Y,
        scale: 1 - rank * STACK_SCALE,
        rotate: rank * -2.5,
      }}
      exit={{
        opacity: 0,
        x: exitX || 420,
        transition: { duration: 0.28 },
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      drag={canDrag ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={(_event, drag) => {
        if (!canDrag) return
        const offset = drag.offset.x
        const velocity = drag.velocity.x
        if (Math.abs(offset) > FLING || Math.abs(velocity) > 650) {
          const dir = (offset === 0 ? Math.sign(velocity) : Math.sign(offset)) || 1
          setExitX(dir * (window.innerWidth + 160))
          onDismiss()
        }
      }}
      aria-label={info.name}
    >
      <span className={styles.media} data-fit={'height' in item.fit ? 'tall' : 'wide'}>
        <picture>
          <source type="image/avif" srcSet={item.image.avif} />
          <img
            src={item.image.src}
            alt=""
            width={item.image.width}
            height={item.image.height}
            draggable={false}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </picture>
      </span>
      <span className={styles.meta}>
        <span className={styles.counter}>
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <span className={styles.name}>{info.name}</span>
        <span className={styles.cat}>{info.category}</span>
      </span>
    </motion.button>
  )
}
