/**
 * Kullanım:
 * const { ref, token, ready, error, reset } = useTurnstile(config?.turnstile_site_key)
 * <Form hiddenValues={{ 'cf-turnstile-response': token }} busy={!ready} …>
 *   {config?.turnstile_site_key ? <div ref={ref} /> : null}
 * </Form>
 * Anahtar yokken jeton 'local-dev' ve ready=true döner (LeadForm/backend sözleşmesi). Widget form içindeyse
 * Cloudflare `cf-turnstile-response` gizli alanını da kendisi ekler; hiddenValues yalnızca boşsa devreye girer.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { RefObject } from 'react'
import { ensureTurnstileScript, getLoaderStatus, getServerLoaderStatus, subscribeLoader } from './turnstileLoader.ts'

export const LOCAL_TURNSTILE_TOKEN = 'local-dev'

export type UseTurnstileResult = {
  /** Widget'ın çizileceği kap; anahtar varken DOM'a bağlanmalı. */
  ref: RefObject<HTMLDivElement | null>
  /** Doğrulama jetonu; anahtar yoksa 'local-dev'. */
  token: string
  /** Gönderime hazır: anahtar yok ya da widget bir jeton üretti. */
  ready: boolean
  /** Ek: betik yüklenemedi veya widget hata verdi. */
  error: boolean
  /** Ek: jetonu sıfırlar ve widget'ı yeniden başlatır (başarılı gönderimden sonra). */
  reset: () => void
}

export function useTurnstile(siteKey?: string): UseTurnstileResult {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const [token, setToken] = useState('')
  const [failed, setFailed] = useState(false)
  const enabled = Boolean(siteKey)
  const scriptStatus = useSyncExternalStore(subscribeLoader, getLoaderStatus, getServerLoaderStatus)

  useEffect(() => {
    if (!enabled) return
    ensureTurnstileScript()
  }, [enabled])

  // Betik hazır olunca widget çizilir; kaldırılınca temizlenir (StrictMode'da çift çalışma güvenlidir).
  useEffect(() => {
    if (!enabled || !siteKey || scriptStatus !== 'ready') return
    const container = ref.current
    const api = window.turnstile
    if (!container || !api) return

    const id = api.render(container, {
      sitekey: siteKey,
      language: 'tr',
      theme: 'light',
      size: 'flexible',
      'response-field': true,
      'response-field-name': 'cf-turnstile-response',
      callback: (value) => {
        setToken(value)
        setFailed(false)
      },
      'expired-callback': () => setToken(''),
      'timeout-callback': () => setToken(''),
      'error-callback': () => {
        setToken('')
        setFailed(true)
      },
    })
    widgetId.current = id

    return () => {
      if (id) api.remove(id)
      widgetId.current = undefined
    }
  }, [enabled, siteKey, scriptStatus])

  const reset = useCallback(() => {
    setToken('')
    if (widgetId.current) window.turnstile?.reset(widgetId.current)
  }, [])

  if (!enabled) {
    return { ref, token: LOCAL_TURNSTILE_TOKEN, ready: true, error: false, reset }
  }

  return {
    ref,
    token,
    ready: token.length > 0,
    error: failed || scriptStatus === 'error',
    reset,
  }
}
