/**
 * Kullanım:
 * <Lightbox open={open} onClose={close} image={{ src: '/parking-product-3d/kiosk/kiosk.png', width: 1233, height: 860, alt: 'Kiosk teknik çizimi' }}
 *   caption="Ölçüler mm cinsindendir." dimensions={[{ label: 'Genişlik', value: '300 mm' }]} />
 * Dialog üzerine kuruludur: tıklama/Enter işaretçi konumunda 2× yakınlaştırır, yakınken ok tuşları ve dokunarak sürükleme kaydırır.
 * `onPrev`/`onNext` verilirse yan düğmeler ve (yakın değilken) sol/sağ ok tuşları görseller arasında geçer.
 */
import { useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, CSSProperties } from 'react'
import Dialog from '../Dialog/index.ts'
import Picture from '../Picture/index.ts'
import { lightboxCopy } from './lightboxCopy.ts'
import type { LightboxLabels } from './lightboxCopy.ts'
import styles from './Lightbox.module.css'

export type LightboxImage = {
  src: string
  width: number
  height: number
  alt: string
  avif?: string
  webp?: string
}

export type LightboxDimension = { label: string; value: string }

export type LightboxProps = {
  open: boolean
  onClose: () => void
  image: LightboxImage
  caption?: string
  dimensions?: LightboxDimension[]
  /** Ek: pencere başlığı; verilmezse caption, o da yoksa alt metni. */
  title?: string
  /** Ek: yakınlaştırma çarpanı. */
  zoom?: number
  /** Ek: galeri gezinmesi. */
  onPrev?: () => void
  onNext?: () => void
  /** Ek: "2 / 5" gibi konum metni. */
  counter?: string
  labels?: Partial<LightboxLabels>
}

const clamp = (value: number) => Math.min(100, Math.max(0, value))
const DRAG_THRESHOLD = 6

type StageProps = {
  image: LightboxImage
  zoom: number
  labels: LightboxLabels
  onPrev?: () => void
  onNext?: () => void
  counter?: string
}

function LightboxStage({ image, zoom, labels, onPrev, onNext, counter }: StageProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const origin = useRef({ x: 50, y: 50 })
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const [zoomed, setZoomed] = useState(false)

  const applyOrigin = () => {
    const layer = layerRef.current
    if (layer) layer.style.transformOrigin = `${origin.current.x}% ${origin.current.y}%`
  }

  const pointToOrigin = (element: HTMLElement, clientX: number, clientY: number) => {
    const rect = element.getBoundingClientRect()
    origin.current = {
      x: clamp(((clientX - rect.left) / rect.width) * 100),
      y: clamp(((clientY - rect.top) / rect.height) * 100),
    }
    applyOrigin()
  }

  const onClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    // detail 0: klavye ile tetiklendi; mevcut odak noktası korunur.
    if (!zoomed && event.detail > 0) pointToOrigin(event.currentTarget, event.clientX, event.clientY)
    setZoomed((value) => !value)
  }

  // Fare: yakınken imleci izler. Dokunmatik/kalem: yakınken sürükleyerek kaydırır (React state yok, doğrudan stil).
  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!zoomed || event.pointerType === 'mouse') return
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!zoomed) return
    if (event.pointerType === 'mouse') {
      pointToOrigin(event.currentTarget, event.clientX, event.clientY)
      return
    }
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    const dx = event.clientX - state.x
    const dy = event.clientY - state.y
    if (!state.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    state.moved = true
    state.x = event.clientX
    state.y = event.clientY
    const rect = event.currentTarget.getBoundingClientRect()
    const factor = Math.max(zoom - 1, 0.01)
    origin.current = {
      x: clamp(origin.current.x - (dx / (rect.width * factor)) * 100),
      y: clamp(origin.current.y - (dy / (rect.height * factor)) * 100),
    }
    applyOrigin()
  }

  const endDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    if (state.moved) suppressClick.current = true
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!zoomed) {
      if (event.key === 'ArrowLeft' && onPrev) {
        event.preventDefault()
        onPrev()
      } else if (event.key === 'ArrowRight' && onNext) {
        event.preventDefault()
        onNext()
      }
      return
    }
    const step = 8
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    origin.current = { x: clamp(origin.current.x + move[0]), y: clamp(origin.current.y + move[1]) }
    applyOrigin()
  }

  return (
    <div className={styles.stage} onKeyDown={onKeyDown}>
      <button
        type="button"
        className={styles.viewport}
        data-zoomed={zoomed ? 'true' : 'false'}
        style={{ '--zoom': zoom } as CSSProperties}
        aria-label={zoomed ? labels.zoomOut : labels.zoomIn}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={layerRef} className={styles.layer}>
          <Picture
            src={image.src}
            avif={image.avif}
            webp={image.webp}
            alt=""
            width={image.width}
            height={image.height}
            className={styles.image}
            pictureClassName={styles.picture}
            loading="eager"
          />
        </div>
        <span className={styles.badge} aria-hidden="true">
          {zoomed ? `${zoom.toLocaleString('tr-TR')}×` : '1×'}
        </span>
      </button>
      <span className={styles.srOnly}>{image.alt}</span>

      {onPrev ? (
        <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={onPrev} aria-label={labels.previous}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
      ) : null}
      {onNext ? (
        <button type="button" className={`${styles.nav} ${styles.next}`} onClick={onNext} aria-label={labels.next}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      ) : null}
      {counter ? (
        <span className={styles.counter} aria-live="polite">
          {counter}
        </span>
      ) : null}
    </div>
  )
}

export default function Lightbox({
  open,
  onClose,
  image,
  caption,
  dimensions,
  title,
  zoom = 2,
  onPrev,
  onNext,
  counter,
  labels: labelOverrides,
}: LightboxProps) {
  const labels: LightboxLabels = { ...lightboxCopy, ...labelOverrides }
  const hasFooter = Boolean(caption) || Boolean(dimensions && dimensions.length > 0)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title ?? caption ?? image.alt}
      description={`${labels.hint} ${labels.keyboardHint}`}
      size="full"
      flush
      closeLabel={labels.close}
      bodyClassName={styles.body}
      footer={
        hasFooter ? (
          <div className={styles.footer}>
            {caption ? <p className={styles.caption}>{caption}</p> : null}
            {dimensions && dimensions.length > 0 ? (
              <dl className={styles.dims}>
                {dimensions.map((item) => (
                  <div key={item.label} className={styles.dim}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : undefined
      }
    >
      {/* Görsel değişince yakınlaştırma durumu sıfırlanır. */}
      <LightboxStage key={image.src} image={image} zoom={zoom} labels={labels} onPrev={onPrev} onNext={onNext} counter={counter} />
    </Dialog>
  )
}
