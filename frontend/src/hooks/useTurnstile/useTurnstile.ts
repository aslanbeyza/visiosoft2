
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { RefObject } from 'react'
import { ensureTurnstileScript, getLoaderStatus, getServerLoaderStatus, subscribeLoader } from './turnstileLoader.ts'

export const LOCAL_TURNSTILE_TOKEN = 'local-dev'

export type UseTurnstileResult = {

  ref: RefObject<HTMLDivElement | null>

  token: string

  ready: boolean

  error: boolean

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
