import { createPortal } from 'react-dom'
import { pageTransitionCopy as text } from './pageTransitionCopy.ts'
import styles from './PageTransition.module.css'

/**
 * Tembel yüklenen sayfa parçası beklenirken üstte ince lacivert ilerleme çizgisi. Döner simge yok.
 * Sayfa sarmalayıcısı transform aldığı için çizgi body'ye portallanır (fixed konum sarmalayıcıya bağlanmasın).
 * Akış içindeki boş tutucu en az bir ekran yüksekliği yer ayırır: footer parça gelene kadar ekran dışında kalır,
 * sayfa bağlanınca yukarıdan aşağı sıçramaz (CLS). Navbar sabit konumlu olduğundan main 0'dan başlar.
 */
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
