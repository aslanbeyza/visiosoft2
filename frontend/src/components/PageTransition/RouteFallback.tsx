import { createPortal } from 'react-dom'
import { pageTransitionCopy as text } from './pageTransitionCopy.ts'
import styles from './PageTransition.module.css'

export default function RouteFallback() {
  if (typeof document === 'undefined') return null
  return (
    <>
      {createPortal(
        <div className={styles.progress} role="status" aria-live="polite">
          <span className={styles.progressBar} aria-hidden="true" />
          <span className={styles.srOnly}>{text.loading}</span>
        </div>,
        document.body,
      )}
      <div className={styles.hold} aria-hidden="true" />
    </>
  )
}
