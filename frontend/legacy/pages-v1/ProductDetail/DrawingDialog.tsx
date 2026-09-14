import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import type { DetailImage } from './productDetailCopy.ts'
import styles from './DrawingDialog.module.css'

type DrawingDialogProps = {
  image: DetailImage
  title: string
  hint: string
  keyboardHint: string
  zoomInLabel: string
  zoomOutLabel: string
  closeLabel: string
  dimensions: { label: string; value: string }[]
  /** Kararlı (useCallback) bir fonksiyon olmalı. */
  onClose: () => void
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
const clamp = (value: number) => Math.min(100, Math.max(0, value))

/**
 * Teknik çizim penceresi: odak pencere içinde döner, Esc ve arka plan tıklaması kapatır,
 * kapanınca odak açan düğmeye döner ve sayfa kaydırması kilitlenir. Tıklanan noktaya 2 kat yakınlaşır.
 */
export default function DrawingDialog({
  image,
  title,
  hint,
  keyboardHint,
  zoomInLabel,
  zoomOutLabel,
  closeLabel,
  dimensions,
  onClose,
}: DrawingDialogProps) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const hintId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const origin = useRef({ x: 50, y: 50 })
  const pressedOnBackdrop = useRef(false)
  const [zoomed, setZoomed] = useState(false)

  // Kaydırma kilidi, ilk odak ve kapanışta odağın geri dönmesi.
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const { body, documentElement } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const scrollbar = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    closeRef.current?.focus({ preventScroll: true })

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
      previous?.focus({ preventScroll: true })
    }
  }, [])

  // Esc ile kapanış, Tab ile odak tuzağı; odak bir şekilde dışarı çıkarsa pencereye geri alınır.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const activeInside = panel.contains(document.activeElement)
      if (event.shiftKey && (document.activeElement === first || !activeInside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !activeInside)) {
        event.preventDefault()
        first.focus()
      }
    }

    const onFocusIn = (event: FocusEvent) => {
      const panel = panelRef.current
      if (panel && event.target instanceof Node && !panel.contains(event.target)) {
        closeRef.current?.focus({ preventScroll: true })
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [onClose])

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

  const onViewportClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    // detail 0: klavye ile tetiklendi; mevcut odak noktası korunur.
    if (!zoomed && event.detail > 0) {
      pointToOrigin(event.currentTarget, event.clientX, event.clientY)
    }
    setZoomed((value) => !value)
  }

  // Yakınken fareyle gezinme; React state yerine doğrudan stil güncellenir.
  const onViewportPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!zoomed || event.pointerType !== 'mouse') return
    pointToOrigin(event.currentTarget, event.clientX, event.clientY)
  }

  const onViewportKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!zoomed) return
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

  return createPortal(
    <motion.div
      className={styles.overlay}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onPointerDown={(event) => {
        pressedOnBackdrop.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        if (pressedOnBackdrop.current && event.target === event.currentTarget) onClose()
        pressedOnBackdrop.current = false
      }}
    >
      <motion.div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={hintId}
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: 0.45, ease: revealEase }}
      >
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <p id={hintId} className={styles.hint}>
              {hint}
              <span className={styles.srOnly}> {keyboardHint}</span>
            </p>
          </div>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <button
          type="button"
          className={styles.viewport}
          data-zoomed={zoomed}
          aria-label={zoomed ? zoomOutLabel : zoomInLabel}
          onClick={onViewportClick}
          onPointerMove={onViewportPointerMove}
          onKeyDown={onViewportKeyDown}
        >
          <div ref={layerRef} className={styles.layer}>
            <img
              className={styles.image}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              decoding="async"
              draggable={false}
            />
          </div>
          <span className={styles.badge} aria-hidden="true">
            {zoomed ? '2×' : '1×'}
          </span>
        </button>

        <dl className={styles.dims}>
          {dimensions.map((item) => (
            <div key={item.label} className={styles.dim}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
