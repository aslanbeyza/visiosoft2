/**
 * Kullanım:
 * const [open, setOpen] = useState(false)
 * const close = useCallback(() => setOpen(false), [])
 * <Dialog open={open} onClose={close} title="Teknik çizim" description="Yakınlaştırmak için tıklayın." size="lg">…</Dialog>
 *
 * body'ye portallanır; role="dialog" aria-modal, odak tuzağı (Tab/Shift+Tab), Esc, arka plan tıklaması,
 * kapanınca odağın geri dönmesi ve sayfa kilidi (#root inert + body overflow) hazırdır. Hareket azaltılmışsa anında açılır.
 */
import { useEffect, useId, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { dialogCopy } from './dialogCopy.ts'
import { lockPage } from './pageLock.ts'
import styles from './Dialog.module.css'

export type DialogSize = 'md' | 'lg' | 'full'

export type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  /** md: 36rem · lg: 56rem · full: 80rem ve tam yükseklik. */
  size?: DialogSize
  children: ReactNode
  /** Ek: kapat düğmesinin erişilebilir adı. */
  closeLabel?: string
  /** Ek: başlık ve açıklama yalnızca ekran okuyucuya kalır; kapat düğmesi köşede durur. */
  hideHeader?: boolean
  /** Ek: alt şerit (ölçüler, düğmeler). */
  footer?: ReactNode
  /** Ek: açılışta odaklanacak öğe; yoksa gövdedeki ilk odaklanabilir, o da yoksa kapat düğmesi. */
  initialFocusRef?: RefObject<HTMLElement | null>
  /** Ek: 'close' açılışta kapat düğmesine odaklanır. */
  initialFocus?: 'body' | 'close'
  /** Ek: gövde iç boşluğunu kaldırır (görsel, harita, iframe). */
  flush?: boolean
  className?: string
  bodyClassName?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

type PanelProps = Omit<DialogProps, 'open'>

function DialogPanel({
  onClose,
  title,
  description,
  size = 'md',
  children,
  closeLabel = dialogCopy.close,
  hideHeader = false,
  footer,
  initialFocusRef,
  initialFocus = 'body',
  flush = false,
  className = '',
  bodyClassName = '',
}: PanelProps) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const pressedOnBackdrop = useRef(false)

  // Sayfa kilidi, ilk odak ve kapanışta odağın açan öğeye dönmesi.
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const unlock = lockPage()

    const target =
      initialFocusRef?.current ??
      (initialFocus === 'body' ? bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE) : null) ??
      closeRef.current ??
      panelRef.current
    target?.focus({ preventScroll: true })

    return () => {
      unlock()
      previous?.focus({ preventScroll: true })
    }
  }, [initialFocusRef, initialFocus])

  // Esc kapatır; Tab pencere içinde döner; odak dışarı kaçarsa geri alınır.
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
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((item) => item.offsetParent !== null || item === document.activeElement)
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }
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
        ;(closeRef.current ?? panel).focus({ preventScroll: true })
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [onClose])

  return (
    <motion.div
      className={styles.overlay}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
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
        className={`${styles.panel} ${className}`.trim()}
        data-size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        initial={reduce ? false : { opacity: 0, y: 12, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.99, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, ease: revealEase }}
      >
        <header className={styles.header} data-hidden={hideHeader ? 'true' : undefined}>
          <div className={hideHeader ? styles.srOnly : styles.headerText}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            ) : null}
          </div>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div ref={bodyRef} className={`${styles.body} ${bodyClassName}`.trim()} data-flush={flush ? 'true' : undefined}>
          {children}
        </div>

        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </motion.div>
    </motion.div>
  )
}

export default function Dialog({ open, ...rest }: DialogProps) {
  if (typeof document === 'undefined') return null

  return createPortal(<AnimatePresence>{open ? <DialogPanel key="dialog-panel" {...rest} /> : null}</AnimatePresence>, document.body)
}
