import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import {
  coverScaleFloor,
  coverTransform,
  frameForBox,
  measureStage,
  mixFrames,
  progressForFrame,
  sharpScaleLimit,
  tileCrop,
  timelineAt,
  toTransform,
  TILE_RATIO,
} from './zoomMath.ts'
import type { StageGeometry, StageViewport, ZoomBox } from './zoomMath.ts'
import styles from './ProductZoom.module.css'

export type ProductZoomDetail = {
  id: string
  title: string
  description: string
  box: ZoomBox

  marker?: { x: number; y: number }
}

export type ProductZoomImage = {

  src: string
  avif?: string
  width: number
  height: number
  alt: string
}

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

  staticLead?: string

  maxScale?: number

  sharpCap?: boolean

  frameLength?: number

  caption?: string
}

const pad = (value: number) => String(value).padStart(2, '0')

const stepLabel = (step: number, total: number) => `Adım ${step} / ${total}`

function Counter({ step, total }: { step: number; total: number }) {
  return (
    <span className={styles.counter}>
      <span aria-hidden="true">
        {pad(step)} / {pad(total)}
      </span>
      <span className={styles.srOnly}>{stepLabel(step, total)}</span>
    </span>
  )
}

const markerPoint = (detail: ProductZoomDetail) =>
  detail.marker ?? { x: detail.box.x + detail.box.w / 2, y: detail.box.y + detail.box.h / 2 }

const boxStyle = (box: ZoomBox): CSSProperties => ({
  left: `${box.x}%`,
  top: `${box.y}%`,
  width: `${box.w}%`,
  height: `${box.h}%`,
})

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

function Figure({ caption, className, children }: { caption?: string; className: string; children: ReactNode }) {
  if (!caption) return <div className={className}>{children}</div>
  return (
    <figure className={className}>
      {children}
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  )
}

function ScrollZoom({
  eyebrow,
  title,
  overview,
  image,
  details,
  overlays,
  tone = 'light',
  maxScale = 3,
  sharpCap = false,
  frameLength = 85,
  caption,
}: ProductZoomProps) {
  const titleId = useId()
  const sectionRef = useRef<HTMLElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const geometry = useRef<StageGeometry | null>(null)
  const viewport = useRef<StageViewport | null>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  const holdingRef = useRef(false)
  const [hold, setHold] = useState({ on: false, count: 0 })

  const items = [{ id: 'overview', ...overview }, ...details]
  const frameCount = items.length

  const fit = image.width >= image.height ? 'image' : 'fill'

  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const focusOpacity = useMotionValue(0)

  const focusX = useMotionValue(0)
  const focusY = useMotionValue(0)
  const focusWidth = useMotionValue(0)
  const focusHeight = useMotionValue(0)

  const cornerRight = useTransform(focusWidth, (value) => value / 2)
  const cornerLeft = useTransform(focusWidth, (value) => -value / 2)
  const cornerBottom = useTransform(focusHeight, (value) => value / 2)
  const cornerTop = useTransform(focusHeight, (value) => -value / 2)

  const markerScale = useTransform(scale, (value) => 1 / value)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  const apply = useCallback(
    (progress: number) => {
      const g = geometry.current
      if (!g) return

      const point = timelineAt(progress, frameCount)
      const boxes = [null, ...details.map((detail) => detail.box)]

      const limit = sharpCap ? sharpScaleLimit(g, image.width, window.devicePixelRatio || 1, maxScale) : maxScale
      const view = viewport.current

      const floor = (box: ZoomBox | null) => (fit === 'image' ? coverScaleFloor(box, g, view) : 1)
      const from = frameForBox(boxes[point.from], g, 0.72, limit, floor(boxes[point.from]))
      const to = frameForBox(boxes[point.to], g, 0.72, limit, floor(boxes[point.to]))
      const frame = mixFrames(from, to, point.t)
      const transform = toTransform(frame, g)
      const placed = fit === 'image' && view ? coverTransform(transform, g, view) : transform

      scale.set(placed.scale)
      x.set(placed.x)
      y.set(placed.y)
      focusX.set(placed.x - transform.x)
      focusY.set(placed.y - transform.y)

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

      const holding = point.t === 0 && point.from > 0
      if (holding !== holdingRef.current) {
        holdingRef.current = holding
        setHold((previous) => ({ on: holding, count: holding ? previous.count + 1 : previous.count }))
      }
    },
    [details, fit, frameCount, focusHeight, focusOpacity, focusWidth, focusX, focusY, image.width, maxScale, scale, sharpCap, x, y],
  )

  useMotionValueEvent(scrollYProgress, 'change', apply)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const measure = () => {
      const g = measureStage(canvas.offsetWidth, canvas.offsetHeight, image.width, image.height)
      geometry.current = g
      const view = viewRef.current
      viewport.current = view
        ? { width: view.clientWidth, height: view.clientHeight, canvasLeft: canvas.offsetLeft, canvasTop: canvas.offsetTop }
        : null

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
  const marker = active > 0 ? markerPoint(details[active - 1]) : null

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-tone={tone}
      style={{ '--frames': frameCount, '--frame-length': `${frameLength}svh` } as CSSProperties}
      aria-labelledby={titleId}
    >
      <div className={styles.sticky}>
        {}
        <div
          className={styles.layout}
          data-fit={fit}
          data-caption={caption ? 'true' : undefined}
          style={{ '--image-ratio': image.width / image.height } as CSSProperties}
        >
          <div className={styles.head}>
            <p className={styles.eyebrow}>
              <span className={styles.rule} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          </div>

          <div className={styles.stage}>
            <Figure caption={caption} className={styles.figure}>
              <div ref={viewRef} className={styles.viewport}>
                <motion.div ref={canvasRef} className={styles.canvas} style={{ x, y, scale }}>
                  <ZoomPicture image={image} className={styles.image} alt={image.alt} />
                  <div ref={frameRef} className={styles.imageFrame} aria-hidden="true">
                    <Overlays overlays={overlays} />
                    {marker ? (
                      <motion.span
                        className={styles.marker}
                        data-holding={hold.on}
                        style={{ left: `${marker.x}%`, top: `${marker.y}%`, scale: markerScale, opacity: focusOpacity }}
                      >
                        {}
                        <span key={hold.count} className={styles.markerRing} />
                        <span className={styles.markerDot} />
                      </motion.span>
                    ) : null}
                  </div>
                </motion.div>
                <motion.div
                  className={styles.focus}
                  style={{ opacity: focusOpacity, x: focusX, y: focusY }}
                  aria-hidden="true"
                >
                  <motion.span className={styles.corner} data-corner="top-left" style={{ x: cornerLeft, y: cornerTop }} />
                  <motion.span className={styles.corner} data-corner="top-right" style={{ x: cornerRight, y: cornerTop }} />
                  <motion.span
                    className={styles.corner}
                    data-corner="bottom-left"
                    style={{ x: cornerLeft, y: cornerBottom }}
                  />
                  <motion.span
                    className={styles.corner}
                    data-corner="bottom-right"
                    style={{ x: cornerRight, y: cornerBottom }}
                  />
                </motion.div>
              </div>
            </Figure>
          </div>

          <div className={styles.copy}>
            <div className={styles.callout}>
              {}
              {items.map((item, index) => (
                <div key={item.id} className={styles.calloutSizer} aria-hidden="true">
                  <span className={styles.counter}>
                    {pad(index + 1)} / {pad(frameCount)}
                  </span>
                  <p className={styles.calloutTitle}>{item.title}</p>
                  <p className={styles.calloutText}>{item.description}</p>
                </div>
              ))}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: revealEase }}
                >
                  <Counter step={active + 1} total={frameCount} />
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
                    {}
                    <span className={styles.stepBar} aria-hidden="true">
                      <span className={styles.stepFill} />
                    </span>
                    <span className={styles.stepIndex} aria-hidden="true">
                      {pad(index + 1)}
                    </span>
                    <span className={styles.srOnly}>{`${stepLabel(index + 1, frameCount)}: `}</span>
                    <span className={styles.stepLabel}>{item.title}</span>
                    {}
                    <span className={styles.stepText}>{item.description}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

const overlaps = (a: ZoomBox, b: ZoomBox) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

function StaticZoom({
  eyebrow,
  title,
  overview,
  staticLead,
  image,
  details,
  overlays,
  tone = 'light',
  sharpCap = false,
  caption,
}: ProductZoomProps) {
  const titleId = useId()
  const orientation = image.width > image.height ? 'wide' : 'tall'

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
        <p className={styles.calloutText}>{staticLead ?? overview.description}</p>

        <div className={styles.staticGrid} data-orientation={orientation}>
          <div>
            <Figure caption={caption} className={styles.staticFigure}>
              <div
                className={styles.staticOverview}
                data-orientation={orientation}
                style={{ '--image-ratio': image.width / image.height } as CSSProperties}
              >
                <div className={styles.staticFrame} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
                  <ZoomPicture image={image} className={styles.image} alt={image.alt} />
                  <div className={styles.staticOverlays} aria-hidden="true">
                    <Overlays overlays={overlays} />
                  </div>
                </div>
              </div>
            </Figure>
            <div className={styles.staticCaption}>
              <Counter step={1} total={details.length + 1} />
              <h3 className={styles.calloutTitle}>{overview.title}</h3>
            </div>
          </div>
          <ol className={styles.tiles} data-sharp={sharpCap}>
            {details.map((detail, index) => {
              const crop = tileCrop(detail.box, image.width, image.height)

              const tileOverlays = overlays?.filter((overlay) => overlaps(overlay.box, crop.maxWindow))
              return (
                <li
                  key={detail.id}
                  className={styles.tile}
                  style={
                    {
                      '--tile-ratio': TILE_RATIO,
                      '--cover-window': crop.coverWindow,
                      '--natural-width': image.width,
                    } as CSSProperties
                  }
                >
                  {}
                  <div className={styles.crop}>
                    <div
                      className={styles.cropFrame}
                      style={
                        {
                          '--zoom': crop.zoom,
                          '--cover': crop.cover,
                          '--cx': crop.cx,
                          '--cy': crop.cy,
                          '--image-ratio': image.height / image.width,
                        } as CSSProperties
                      }
                    >
                      <ZoomPicture image={image} className={styles.image} alt="" />
                      {tileOverlays?.length ? (
                        <div className={styles.staticOverlays} aria-hidden="true">
                          <Overlays overlays={tileOverlays} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <Counter step={index + 2} total={details.length + 1} />
                  <h3 className={styles.calloutTitle}>{detail.title}</h3>
                  <p className={styles.calloutText}>{detail.description}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
