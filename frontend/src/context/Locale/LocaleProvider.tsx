import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { messages, translate } from '../../i18n/index.ts'
import { getWebsiteConfig } from '../../services/index.ts'
import { LocaleContext } from './LocaleContext.tsx'
import type { WebsiteConfig } from './LocaleContext.tsx'

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = 'tr' as const
  const [config, setConfig] = useState<WebsiteConfig | null>(null)

  useEffect(() => {
    document.documentElement.lang = 'tr'
    getWebsiteConfig()
      .then((website) => setConfig(website.data))
      .catch(() => undefined)
  }, [])

  const value = useMemo(
    () => ({
      locale,
      messages,
      config,
      ready: true,
      t: translate,
    }),
    [config],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
