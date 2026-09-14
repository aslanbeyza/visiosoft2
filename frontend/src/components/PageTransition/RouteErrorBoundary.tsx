import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Button from '../Button/index.ts'
import { pageTransitionCopy as text } from './pageTransitionCopy.ts'
import styles from './PageTransition.module.css'

type Props = { children: ReactNode }
type State = { failed: boolean }

/**
 * Tembel parça indirilemezse (ağ hatası, eski dağıtım) sayfa hiçbir zaman perdenin altında kalmaz:
 * düz bir hata görünümü çizilir, perde normal şekilde açılır.
 */
export default class RouteErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Sayfa yüklenemedi', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <section className={styles.error} aria-labelledby="route-error-title">
        <div className={styles.errorInner}>
          <h1 id="route-error-title" className={styles.errorTitle}>
            {text.errorTitle}
          </h1>
          <p className={styles.errorBody}>{text.errorBody}</p>
          <div className={styles.errorActions}>
            <Button type="button" onClick={() => window.location.reload()}>
              {text.retry}
            </Button>
            <Link to="/" className={styles.errorLink} reloadDocument>
              {text.home}
            </Link>
          </div>
        </div>
      </section>
    )
  }
}
