import type { CSSProperties } from 'react'
import type { NavImage, NavItem, NavMenuLink } from '../../data/siteNav.ts'

export const DESKTOP_QUERY = '(min-width: 1024px)'

export type MenuKind = 'hardware' | 'software'

export type PanelCustom = {

  swap: boolean
  reduce: boolean
}

export function isItemActive(item: NavItem, current: string) {
  return item.route === current || Boolean(item.menu?.some((link) => link.route === current))
}

export function menuKind(item: NavItem): MenuKind {
  return item.key === 'hardware' ? 'hardware' : 'software'
}

export function splitHardware(links: NavMenuLink[]) {
  return {
    cards: links.filter((link) => link.placement !== 'accessory' && link.image),
    accessories: links.filter((link) => link.placement === 'accessory'),
  }
}

let menuImagesWarmed = false

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

export function imageAspectStyle(image: NavImage): CSSProperties {
  return { '--ar': (image.width / image.height).toFixed(4), '--fit': image.fit.toFixed(3) } as CSSProperties
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function focusableIn(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.closest('[inert]') === null && element.getClientRects().length > 0,
  )
}
