/** Cloudflare Turnstile betiğini bir kez yükleyen, useSyncExternalStore ile izlenen küçük depo. */

export type TurnstileRenderOptions = {
  sitekey: string
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
  'timeout-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  language?: string
  size?: 'normal' | 'compact' | 'flexible'
  'response-field'?: boolean
  'response-field-name'?: string
}

export type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string | undefined
  reset: (widgetId?: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    __visiosoftTurnstileReady?: () => void
  }
}

export type LoaderStatus = 'idle' | 'loading' | 'ready' | 'error'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__visiosoftTurnstileReady'

let status: LoaderStatus = 'idle'
const listeners = new Set<() => void>()

function setStatus(next: LoaderStatus) {
  if (status === next) return
  status = next
  for (const listener of listeners) listener()
}

export function getLoaderStatus(): LoaderStatus {
  return status
}

export function getServerLoaderStatus(): LoaderStatus {
  return 'idle'
}

export function subscribeLoader(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Betiği yalnızca ilk çağrıda ekler; tekrar çağrılar mevcut durumu korur. */
export function ensureTurnstileScript() {
  if (typeof document === 'undefined' || status === 'loading' || status === 'ready') return
  if (window.turnstile) {
    setStatus('ready')
    return
  }

  setStatus('loading')
  window.__visiosoftTurnstileReady = () => setStatus('ready')

  const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]')
  if (existing) return

  const script = document.createElement('script')
  script.src = SCRIPT_SRC
  script.async = true
  script.defer = true
  script.dataset.turnstile = 'true'
  script.addEventListener('error', () => setStatus('error'))
  script.addEventListener('load', () => {
    // onload geri çağrısı gelmezse bile API varsa hazır kabul edilir.
    if (window.turnstile) setStatus('ready')
  })
  document.head.appendChild(script)
}
