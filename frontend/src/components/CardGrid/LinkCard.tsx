/**
 * Kullanım (CardGrid içinde):
 * <LinkCard
 *   to={path('hardware-products.kiosk')}
 *   eyebrow="Otopark Kiosk Sistemleri"
 *   title="İnsansız Çıkış Ödeme Kiosk"
 *   description="Plaka girişi olmadan çıkışta ödeme."
 *   image={{ src: '/img/products/cards/kiosk.webp', avif: '/img/products/cards/kiosk.avif', width: 238, height: 900, alt: '', fit: 'contain' }}
 *   index={1}
 *   meta="300 × 1800 mm"
 *   action="İncele"
 * />
 * Görsel sahnesi kırpılmamış kapsayıcıdan (li) tetiklenen clip-path ile açılır; kartın tamamı bağlantıdır.
 */
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Picture from '../Picture/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { spotlightLeave, spotlightMove } from '../FeatureGrid/spotlight.ts'
import { useCardGrid } from './context.ts'
import { linkCardCopy } from './linkCardCopy.ts'
import styles from './LinkCard.module.css'

export type LinkCardImage = {
  src: string
  avif?: string
  webp?: string
  width: number
  height: number
  alt: string
  /** contain: ürün görseli sahnede boşlukla · cover: fotoğraf tüm sahneyi doldurur. */
  fit?: 'contain' | 'cover'
}

export type LinkCardProps = {
  to: string
  eyebrow?: string
  title: string
  description?: string
  image?: LinkCardImage
  /** Görünen sıra numarası (01, 02…). */
  index?: number
  /** Küçük gri ek bilgi (tarih, ölçü, okuma süresi). */
  meta?: string
  external?: boolean
  /** Ok yanındaki eylem etiketi (ör. "İncele"). */
  action?: string
  tone?: 'light' | 'dark'
  /** Başlık düzeyi; bölüm başlığı h2 ise h3 (varsayılan). */
  headingAs?: 'h3' | 'h4'
  className?: string
}

const pad = (value: number) => String(value).padStart(2, '0')
const isExternalHref = (href: string) => /^(https?:|mailto:|tel:)/i.test(href)

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: revealEase, delay, delayChildren: delay },
  }),
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.25, ease: revealEase } },
}

const stageVariants: Variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, ease: revealEase } },
  exit: {},
}

const imageVariants: Variants = {
  hidden: { scale: 1.08 },
  show: { scale: 1, transition: { duration: 1.2, ease: revealEase } },
  exit: {},
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export default function LinkCard({
  to,
  eyebrow,
  title,
  description,
  image,
  index,
  meta,
  external,
  action,
  tone = 'light',
  headingAs: Heading = 'h3',
  className = '',
}: LinkCardProps) {
  const reduce = useReducedMotion()
  const { columns, position, animateLayout } = useCardGrid()
  const ref = useRef<HTMLLIElement>(null)
  // Kırpılmış sahne kendi görünürlüğünü bildiremez; açılış kırpılmamış li üzerinden tetiklenir.
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const delay = (position % columns) * 0.08
  const isExternal = external ?? isExternalHref(to)

  const linkContent = (
    <>
      {title}
      {isExternal ? <span className={styles.srOnly}> ({linkCardCopy.external})</span> : null}
    </>
  )

  return (
    <motion.li
      ref={ref}
      className={`${styles.item} ${className}`.trim()}
      layout={animateLayout && !reduce ? true : undefined}
      variants={cardVariants}
      custom={delay}
      initial={reduce ? false : 'hidden'}
      animate={reduce || inView ? 'show' : 'hidden'}
      exit={reduce ? undefined : 'exit'}
    >
      <article className={styles.card} data-tone={tone} onPointerMove={spotlightMove} onPointerLeave={spotlightLeave}>
        {image ? (
          <motion.div className={styles.stage} data-fit={image.fit ?? 'contain'} variants={stageVariants}>
            <motion.div className={styles.stageInner} variants={imageVariants}>
              <Picture
                src={image.src}
                avif={image.avif}
                webp={image.webp}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className={styles.image}
                pictureClassName={styles.picture}
              />
            </motion.div>
          </motion.div>
        ) : null}

        <div className={styles.body}>
          {index !== undefined || eyebrow ? (
            <div className={styles.top}>
              {index !== undefined ? (
                <span className={styles.index} aria-hidden="true">
                  {pad(index)}
                </span>
              ) : null}
              {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            </div>
          ) : null}

          <Heading className={styles.title}>
            {isExternal ? (
              <a href={to} className={styles.link} target="_blank" rel="noopener noreferrer">
                {linkContent}
              </a>
            ) : (
              <Link to={to} className={styles.link}>
                {linkContent}
              </Link>
            )}
          </Heading>

          {description ? <p className={styles.text}>{description}</p> : null}

          <div className={styles.foot}>
            <span className={styles.action} aria-hidden="true">
              {action}
              <Arrow />
            </span>
            {meta ? <span className={styles.meta}>{meta}</span> : null}
          </div>
        </div>
      </article>
    </motion.li>
  )
}
