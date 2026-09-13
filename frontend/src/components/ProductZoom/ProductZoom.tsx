import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { frameForBox, measureStage, mixFrames, progressForFrame, timelineAt, toTransform } from './zoomMath.ts'
import type { StageGeometry, ZoomBox } from './zoomMath.ts'
import styles from './ProductZoom.module.css'

export type ProductZoomDetail = {
  id: string
  title: string
  description: string
  box: ZoomBox
}

export type ProductZoomImage = {
  /** Yakınlaşmada netlik için yüksek çözünürlüklü kaynak. */
  src: string
  avif?: string
  width: number
  height: number
  alt: string
}

/** Görselin üzerine yerleşen DOM katmanı (ör. kiosk ekran arayüzü); yakınlaşmada vektörel olarak net kalır. */
export type ProductZoomOverlay = {
  id: string
  box: ZoomBox
  node: ReactNode
}

type ProductZoomProps = {
  eyebrow: string
  title: string
  overview: { title: string; description: string }
  image: ProductZoomImage
  details: ProductZoomDetail[]
  overlays?: ProductZoomOverlay[]
  tone?: 'light' | 'dark'
}

const pad = (value: number) => String(value).padStart(2, '0')

const boxStyle = (box: ZoomBox): CSSProperties => ({
  left: `${box.x}%`,
  top: `${box.y}%`,
  width: `${box.w}%`,
  height: `${box.h}%`,
})

/**
 * Kaydırdıkça ürün görselinin detay alanlarına yakınlaşan sabitlenmiş bölüm.
 * Hareket azaltma tercihinde detaylar kırpılmış görseller hâlinde statik listelenir.
 */
export default function ProductZoom(props: ProductZoomProps) {
  const reduce = useReducedMotion()
  return reduce ? <StaticZoom {...props} /> : <ScrollZoom {...props} />
}

function ZoomPicture({ image, className, alt, style }: { image: ProductZoomImage; className: string; alt: string; style?: CSSProperties }) {
  return (
    <picture>
      {image.avif ? <source type="image/avif" srcSet={image.avif} /> : null}
      <img
        className={className}
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={style}
      />
    </picture>
  )
}

function Overlays({ overlays }: { overlays?: ProductZoomOverlay[] }) {
  if (!overlays?.length) return null
  return (
    <>
      {overlays.map((overlay) => (
        <div key={overlay.id} className={styles.overlay} style={boxStyle(overlay.box)}>
          {overlay.node}
        </div>
      ))}
    </>
  )
}

function ScrollZoom({ eyebrow, title, overview, image, details, overlays, tone = 'light' }: ProductZoomProps) {
  const titleId = useId()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const geometry = useRef<StageGeometry | null>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  const items = [{ id: 'overview', ...overview }, ...details]
  const frameCount = items.length

  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const focusOpacity = useMotionValue(0)
  const focusWidth = useMotionValue(0)
  const focusHeight = useMotionValue(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  const apply = useCallback(
    (progress: number) => {
      const g = geometry.current
      if (!g) return

      const point = timelineAt(progress, frameCount)
      const boxes = [null, ...details.map((detail) => detail.box)]
      const from = frameForBox(boxes[point.from], g)
      const to = frameForBox(boxes[point.to], g)
      const frame = mixFrames(from, to, point.t)
      const transform = toTransform(frame, g)

      scale.set(transform.scale)
      x.set(transform.x)
      y.set(transform.y)

      // Detay çerçevesi: bekleme sırasında görünür, kareler arası geçişte söner.
      const fromDetail = point.from > 0
      const toDetail = point.to > 0
      const opacity = point.t < 0.5 ? (fromDetail ? 1 - point.t * 2 : 0) : toDetail ? point.t * 2 - 1 : 0
      focusOpacity.set(opacity)
      focusWidth.set(frame.boxWidth * frame.scale)
      focusHeight.set(frame.boxHeight * frame.scale)

      if (point.active !== activeRef.current) {
        activeRef.current = point.active
        setActive(point.active)
      }
    },
    [details, frameCount, focusHeight, focusOpacity, focusWidth, scale, x, y],
  )

  useMotionValueEvent(scrollYProgress, 'change', apply)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const measure = () => {
      const g = measureStage(canvas.offsetWidth, canvas.offsetHeight, image.width, image.height)
      geometry.current = g
      // Katmanlar, "contain" ile yerleşen görselin tam dikdörtgenine oturur.
      const frame = frameRef.current
      if (frame) {
        frame.style.left = `${g.offsetX}px`
        frame.style.top = `${g.offsetY}px`
        frame.style.width = `${g.imageWidth}px`
        frame.style.height = `${g.imageHeight}px`
      }
      apply(scrollYProgress.get())
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [apply, image.height, image.width, scrollYProgress])

  const goTo = (index: number) => {
    const section = sectionRef.current
    if (!section) return
    const top = section.getBoundingClientRect().top + window.scrollY
    const distance = section.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + distance * progressForFrame(index, frameCount), behavior: 'smooth' })
  }

  const current = items[active]

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-tone={tone}
      style={{ '--frames': frameCount } as CSSProperties}
      aria-labelledby={titleId}
    >
      <div className={styles.sticky}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              <span className={styles.rule} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>

            <div className={styles.callout} aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: revealEase }}
                >
                  <span className={styles.counter}>
                    {pad(active)} <span aria-hidden="true">/</span> {pad(frameCount - 1)}
                  </span>
                  <h3 className={styles.calloutTitle}>{current.title}</h3>
                  <p className={styles.calloutText}>{current.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <ol className={styles.steps}>
              {items.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={styles.step}
                    aria-current={active === index ? 'step' : undefined}
                    onClick={() => goTo(index)}
                  >
                    <span className={styles.stepIndex}>{pad(index)}</span>
                    <span className={styles.stepLabel}>{item.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.stage}>
            <motion.div ref={canvasRef} className={styles.canvas} style={{ x, y, scale }}>
              <ZoomPicture image={image} className={styles.image} alt={image.alt} />
              <div ref={frameRef} className={styles.imageFrame} aria-hidden="true">
                <Overlays overlays={overlays} />
              </div>
            </motion.div>
            <motion.div
              className={styles.focus}
              style={{ opacity: focusOpacity, width: focusWidth, height: focusHeight }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StaticZoom({ eyebrow, title, overview, image, details, overlays, tone = 'light' }: ProductZoomProps) {
  const titleId = useId()

  return (
    <section className={styles.staticSection} data-tone={tone} aria-labelledby={titleId}>
      <div className={styles.staticInner}>
        <p className={styles.eyebrow}>
          <span className={styles.rule} aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p className={styles.calloutText}>{overview.description}</p>

        <div className={styles.staticGrid}>
          <div className={styles.staticOverview}>
            <div className={styles.staticFrame} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
              <ZoomPicture image={image} className={styles.image} alt={image.alt} />
              <div className={styles.staticOverlays} aria-hidden="true">
                <Overlays overlays={overlays} />
              </div>
            </div>
          </div>
          <ol className={styles.tiles}>
            {details.map((detail, index) => (
              <li key={detail.id} className={styles.tile}>
                <div
                  className={styles.crop}
                  style={{ aspectRatio: `${detail.box.w * image.width} / ${detail.box.h * image.height}` }}
                >
                  <ZoomPicture
                    image={image}
                    className={styles.cropImage}
                    alt=""
                    style={{
                      width: `${10000 / detail.box.w}%`,
                      left: `${(-detail.box.x / detail.box.w) * 100}%`,
                      top: `${(-detail.box.y / detail.box.h) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.counter}>{pad(index + 1)}</span>
                <h3 className={styles.calloutTitle}>{detail.title}</h3>
                <p className={styles.calloutText}>{detail.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
