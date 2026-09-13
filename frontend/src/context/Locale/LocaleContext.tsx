import { createContext } from 'react'
import type { Locale } from '../../lib/index.ts'

export type WebsiteConfig = {
  locales: string[]
  meet_url: string
  calendly_url: string
  whatsapp_wa_id: string
  whatsapp_display: string
  turnstile_site_key: string
  payment_iframe: string
}

export type LocaleContextValue = {
  locale: Locale
  messages: Record<string, string>
  config: WebsiteConfig | null
  ready: boolean
  t: (key: string) => string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
