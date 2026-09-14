import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Kullanım: `<Seo title="Kiosk | Visiosoft" description="…" canonicalPath="/donanim-urunleri/kiosk" />`
 * Sayfa başlığını, açıklamayı, canonical bağlantıyı, robots ve Open Graph / Twitter etiketlerini günceller.
 * `canonicalPath` verilmezse geçerli yol kullanılır; `noindex` arama motorlarını dışarıda bırakır.
 */
export type SeoProps = {
  title: string
  description?: string
  /** Site köküne göre yol (ör. "/iletisim"); varsayılan geçerli yol. */
  canonicalPath?: string
  noindex?: boolean
  /** Mutlak URL ya da site köküne göre yol. */
  ogImage?: string
}

export const SITE_URL = 'https://visiosoft.com.tr'
const DEFAULT_OG_IMAGE = '/img/Visiosoft-otopark-sistemleri.webp'
const SITE_NAME = 'Visiosoft'

function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const clean = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_URL}${clean}`
}

/** Sondaki eğik çizgiyi kaldırır; ana sayfa "/" kalır. */
function normalizePath(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed || '/'
}

function upsertMeta(selector: string, attributes: Record<string, string>, content: string | null) {
  const { head } = document
  let element = head.querySelector<HTMLMetaElement>(selector)
  if (content === null) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value)
    head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  const { head } = document
  let element = head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    head.appendChild(element)
  }
  element.setAttribute('href', href)
}

export default function Seo({ title, description, canonicalPath, noindex = false, ogImage }: SeoProps) {
  const { pathname } = useLocation()
  const canonical = absoluteUrl(normalizePath(canonicalPath ?? pathname))
  const image = absoluteUrl(ogImage ?? DEFAULT_OG_IMAGE)

  useEffect(() => {
    document.title = title

    upsertMeta('meta[name="description"]', { name: 'description' }, description ?? null)
    upsertLink('canonical', canonical)
    upsertMeta('meta[name="robots"]', { name: 'robots' }, noindex ? 'noindex, nofollow' : null)

    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website')
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, SITE_NAME)
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale' }, 'tr_TR')
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title)
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description ?? null)
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonical)
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, image)

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title)
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description ?? null)
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, image)
  }, [title, description, canonical, noindex, image])

  return null
}
