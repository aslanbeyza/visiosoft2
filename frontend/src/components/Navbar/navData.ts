import type { CSSProperties } from 'react'
import type { NavImage, NavItem, NavMenuLink } from '../../data/siteNav.ts'

/** Masaüstü menünün devreye girdiği genişlik (Navbar.module.css ile aynı). */
export const DESKTOP_QUERY = '(min-width: 1024px)'

export type MenuKind = 'hardware' | 'software'

/** Mega menü paneline AnimatePresence üzerinden aktarılan animasyon bağlamı. */
export type PanelCustom = {
  /** Başka bir panel açıkken doğrudan geçiş yapılıyor. */
  swap: boolean
  reduce: boolean
}

/** Menü öğesi, kendi rotası ya da alt menüsündeki bir rota açıkken etkindir. */
export function isItemActive(item: NavItem, current: string) {
  return item.route === current || Boolean(item.menu?.some((link) => link.route === current))
}

export function menuKind(item: NavItem): MenuKind {
  return item.key === 'hardware' ? 'hardware' : 'software'
}

/** Donanım menüsünü kartlar ve sol sütundaki aksesuar bağlantıları olarak ayırır. */
export function splitHardware(links: NavMenuLink[]) {
  return {
    cards: links.filter((link) => link.placement !== 'accessory' && link.image),
    accessories: links.filter((link) => link.placement === 'accessory'),
  }
}

let menuImagesWarmed = false

/**
 * Mega menü görsellerini ilk etkileşim niyetinde (üzerine gelme / klavye odağı) önbelleğe alır;
 * böylece panel ilk açılışta boş kutularla görünmez. picture + source ile tarayıcı AVIF/WebP seçimini kendisi yapar.
 */
export function warmMenuImages(items: NavItem[]) {
  if (menuImagesWarmed || typeof document === 'undefined') return
  menuImagesWarmed = true
  for (const item of items) {
    for (const { image } of item.menu ?? []) {
      if (!image) continue
      const picture = document.createElement('picture')
      const source = document.createElement('source')
      source.type = 'image/avif'
      source.srcset = image.avif
      const img = document.createElement('img')
      img.decoding = 'async'
      picture.append(source, img)
      img.src = image.webp
    }
  }
}

/**
 * Görsel kutusuna aktarılan CSS değişkenleri: --ar zemin gölgesini ürün genişliğine göre ölçekler,
 * --fit yatay ürünleri küçülterek altı ürünün optik ölçeğini dengeler.
 */
export function imageAspectStyle(image: NavImage): CSSProperties {
  return { '--ar': (image.width / image.height).toFixed(4), '--fit': image.fit.toFixed(3) } as CSSProperties
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Görünür ve etkileşime açık odaklanabilir öğeler (inert ve gizli öğeler hariç). */
export function focusableIn(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.closest('[inert]') === null && element.getClientRects().length > 0,
  )
}
