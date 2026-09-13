import type { NavItem } from '../../data/siteNav.ts'

/** Masaüstü menünün devreye girdiği genişlik (Navbar.module.css ile aynı). */
export const DESKTOP_QUERY = '(min-width: 1024px)'

export type MenuKind = 'hardware' | 'software'

/** Mega menü paneline AnimatePresence üzerinden aktarılan animasyon bağlamı. */
export type PanelCustom = {
  /** Başka bir panel açıkken doğrudan geçiş yapılıyor. */
  swap: boolean
  reduce: boolean
}

type ImageSize = { width: number; height: number }

// Arka planı ayrılmış ürün kartı görsellerinin gerçek piksel ölçüleri.
const cardImageSizes: Record<string, ImageSize> = {
  '/img/products/cards/kiosk.webp': { width: 238, height: 900 },
  '/img/products/cards/tir-kiosk.webp': { width: 433, height: 577 },
  '/img/products/cards/visiobox.webp': { width: 736, height: 541 },
  '/img/products/cards/rack-kabin.webp': { width: 682, height: 900 },
  '/img/products/cards/kamera-muhafaza.webp': { width: 794, height: 397 },
  '/img/products/cards/kamera-montaj-kulesi.webp': { width: 433, height: 577 },
}

export function cardImageSize(src: string): ImageSize {
  return cardImageSizes[src] ?? { width: 800, height: 600 }
}

/** Menü öğesi, kendi rotası ya da alt menüsündeki bir rota açıkken etkindir. */
export function isItemActive(item: NavItem, current: string) {
  return item.route === current || Boolean(item.menu?.some((link) => link.route === current))
}

export function menuKind(item: NavItem): MenuKind {
  return item.menu?.some((link) => link.image) ? 'hardware' : 'software'
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Görünür ve etkileşime açık odaklanabilir öğeler (inert ve gizli öğeler hariç). */
export function focusableIn(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.closest('[inert]') === null && element.getClientRects().length > 0,
  )
}

/** Odak klavyeyle mi geldi? Fare tıklamasıyla gelen odak menüyü açmamalı. */
export function isKeyboardFocus(element: Element) {
  try {
    return element.matches(':focus-visible')
  } catch {
    return true
  }
}
