/**
 * Kullanım:
 * <Gallery columns={3} images={[{ src: '/img/a.webp', avif: '/img/a.avif', width: 1600, height: 1067, alt: 'Saha görseli', caption: 'temsilî görsel' }]} />
 * Her kare kırpılmamış li'den tetiklenen clip-path açılışıyla gelir (görsel 1.08 → 1), tıklanınca Lightbox açılır;
 * Lightbox içinde ok tuşları/yan düğmelerle görseller arasında geçilir.
 */
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
  /** Ek: listenin erişilebilir adı. */
  label?: string
  /** Ek: karede görselin sığdırılması. */
  fit?: 'cover' | 'contain'
  /** Ek: kare oranı (CSS aspect-ratio). */
  ratio?: string
  /** Ek: büyüt düğmesinin adı ("Büyüt: alt"). */
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
  // Kırpılan çerçeve kendi görünürlüğünü bildiremez; açılış kırpılmamış li'den tetiklenir.
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
  // Kapanış animasyonu sırasında son görsel yerinde kalsın diye indeks ve açık/kapalı ayrı tutulur.
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
