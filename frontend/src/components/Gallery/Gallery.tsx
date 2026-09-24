
import { useCallback, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Lightbox from '../Lightbox/index.ts'
import Picture from '../Picture/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { galleryCopy } from './galleryCopy.ts'
import styles from './Gallery.module.css'

export type GalleryImage = {
  src: string
  avif?: string
  webp?: string
  width: number
  height: number
  alt: string
  caption?: string
}

export type GalleryProps = {
  images: GalleryImage[]
  columns?: 2 | 3

  label?: string

  fit?: 'cover' | 'contain'

  ratio?: string

  openLabel?: string
  className?: string
}

type TileProps = {
  image: GalleryImage
  index: number
  columns: number
  fit: 'cover' | 'contain'
  ratio: string
  openLabel: string
  onOpen: (index: number) => void
}

function GalleryTile({ image, index, columns, fit, ratio, openLabel, onOpen }: TileProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLLIElement>(null)

  const inView = useInView(ref, { once: true, amount: 0.2 })
  const delay = (index % columns) * 0.08

  return (
    <li ref={ref} className={styles.item}>
      <figure className={styles.figure}>
        <motion.div
          className={styles.frame}
          style={{ '--ratio': ratio } as CSSProperties}
          initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
          transition={{ duration: 1.1, delay, ease: revealEase }}
        >
          <button type="button" className={styles.trigger} onClick={() => onOpen(index)} aria-haspopup="dialog" aria-label={`${openLabel}: ${image.alt}`}>
            <motion.span
              className={styles.imageWrap}
              initial={reduce ? false : { scale: 1.08 }}
              animate={inView ? { scale: 1 } : undefined}
              transition={{ duration: 1.2, delay, ease: revealEase }}
            >
              <Picture
                src={image.src}
                avif={image.avif}
                webp={image.webp}
                alt=""
                width={image.width}
                height={image.height}
                className={`${styles.image} ${fit === 'contain' ? styles.contain : ''}`.trim()}
                pictureClassName={styles.picture}
              />
            </motion.span>
            <span className={styles.chip} aria-hidden="true">
              <svg viewBox="0 0 24 24" className={styles.chipIcon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m20 20-4.4-4.4M11 8.5v5M8.5 11h5" />
              </svg>
            </span>
          </button>
        </motion.div>
        {image.caption ? <figcaption className={styles.caption}>{image.caption}</figcaption> : null}
      </figure>
    </li>
  )
}

export default function Gallery({
  images,
  columns = 3,
  label = galleryCopy.label,
  fit = 'cover',
  ratio = '4 / 3',
  openLabel = galleryCopy.open,
  className = '',
}: GalleryProps) {

  const [view, setView] = useState<{ index: number; open: boolean }>({ index: 0, open: false })
  const total = images.length

  const open = useCallback((index: number) => setView({ index, open: true }), [])
  const close = useCallback(() => setView((current) => ({ ...current, open: false })), [])
  const step = useCallback(
    (delta: number) => {
      setView((current) => (total === 0 ? current : { ...current, index: (current.index + delta + total) % total }))
    },
    [total],
  )
  const prev = useCallback(() => step(-1), [step])
  const next = useCallback(() => step(1), [step])

  const shownIndex = Math.min(view.index, Math.max(0, total - 1))
  const shown = images[shownIndex]

  return (
    <div className={`${styles.gallery} ${className}`.trim()}>
      <ul className={styles.list} data-columns={columns} aria-label={label}>
        {images.map((image, index) => (
          <GalleryTile
            key={`${image.src}-${index.toString()}`}
            image={image}
            index={index}
            columns={columns}
            fit={fit}
            ratio={ratio}
            openLabel={openLabel}
            onOpen={open}
          />
        ))}
      </ul>

      {shown ? (
        <Lightbox
          open={view.open}
          onClose={close}
          image={{ src: shown.src, avif: shown.avif, webp: shown.webp, width: shown.width, height: shown.height, alt: shown.alt }}
          caption={shown.caption}
          onPrev={total > 1 ? prev : undefined}
          onNext={total > 1 ? next : undefined}
          counter={total > 1 ? galleryCopy.counter(shownIndex + 1, total) : undefined}
        />
      ) : null}
    </div>
  )
}
