import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'

const SEPARATOR = ' '

/**
 * Yatay kaydırılan bağlantı şeridinin davranışları:
 * - `updateEdges`: kenar geçişleri React state'i yerine data öznitelikleriyle güncellenir (liste, öğeler ve yazı tipi
 *   yüklenince yeniden ölçülür; yalnızca liste boyutuna bakmak yazı tipi gecikince son sekmeyi ipuçsuz bırakırdı).
 * - `reveal(active)`: etkin bağlantıyı ortalar, ama yalnızca kullanıcı sayfayı kaydırdıktan (ya da bir #hedefle
 *   geldikten) sonra; ilk yüklemede şerit kendiliğinden kaymaz. Etkin bölüm yoksa şerit başa döner.
 *   Şerit ilk kullanıcı girdisiyle etkinleşince o anki etkin bağlantı bir kez ortalanır (kaydırma geri yüklemesi ya da
 *   betikle atlama sonrası etkin bağlantı ekran dışında kalmasın).
 * - `reveal(null, link)`: odaklanan bağlantıyı scroll-padding-inline payıyla en yakın kenara getirir.
 * - `page(yön)`: şeridi görünür genişliğin %80'i kadar ileri/geri kaydırır (kenardaki ok düğmeleri).
 */
export function useStripScroll(
  listRef: RefObject<HTMLUListElement | null>,
  wrapRef: RefObject<HTMLDivElement | null>,
  ids: string[],
  reduce: boolean,
) {
  const key = ids.join(SEPARATOR)
  const armed = useRef(false)
  const latest = useRef<string | null>(null)

  const updateEdges = useCallback(() => {
    const list = listRef.current
    const wrap = wrapRef.current
    if (!list || !wrap) return
    const max = list.scrollWidth - list.clientWidth
    wrap.dataset.fadeStart = String(list.scrollLeft > 4)
    wrap.dataset.fadeEnd = String(max - list.scrollLeft > 4)
  }, [listRef, wrapRef])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const observer = new ResizeObserver(() => updateEdges())
    observer.observe(list)
    for (const item of Array.from(list.children)) observer.observe(item)
    let alive = true
    document.fonts?.ready.then(() => {
      if (alive) updateEdges()
    })
    return () => {
      alive = false
      observer.disconnect()
    }
  }, [key, listRef, updateEdges])

  const reveal = useCallback(
    (active: string | null, focused?: HTMLElement) => {
      if (!focused) latest.current = active
      const list = listRef.current
      if (!list) return
      const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth'
      const overflow = list.scrollWidth - list.clientWidth > 1

      if (!focused && active === null) {
        if (list.scrollLeft > 0) list.scrollTo({ left: 0, behavior })
        return
      }
      if (!overflow) return

      const link = focused ?? list.querySelector<HTMLElement>('[aria-current]')
      if (!link) return
      const listRect = list.getBoundingClientRect()
      const rect = link.getBoundingClientRect()
      const start = rect.left - listRect.left - list.clientLeft
      const end = start + rect.width

      if (focused) {
        const style = getComputedStyle(list)
        const padStart = Number.parseFloat(style.scrollPaddingInlineStart) || 0
        const padEnd = Number.parseFloat(style.scrollPaddingInlineEnd) || 0
        let delta = 0
        if (start < padStart) delta = start - padStart
        else if (end > list.clientWidth - padEnd) delta = end - (list.clientWidth - padEnd)
        if (delta !== 0) list.scrollTo({ left: list.scrollLeft + delta, behavior })
        return
      }

      // Klavye odağı şeritteyken odaklı bağlantı yerinden oynatılmaz.
      if (!armed.current || list.querySelector(':focus-visible')) return
      const left = list.scrollLeft + start - (list.clientWidth - rect.width) / 2
      list.scrollTo({ left: Math.max(0, left), behavior })
    },
    [listRef, reduce],
  )

  // Kullanıcı girdisi (tekerlek, dokunma, tuş, işaretçi) ya da bir bölüme bağlantıyla gelmek şeridi etkinleştirir.
  useEffect(() => {
    if (armed.current) return
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (hash && key.split(SEPARATOR).includes(hash)) {
      armed.current = true
      return
    }
    const events = ['wheel', 'touchmove', 'keydown', 'pointerdown'] as const
    const arm = (event: Event) => {
      armed.current = true
      for (const name of events) window.removeEventListener(name, arm)
      // Girdi şeridin kendisindeyse (parmakla kaydırma, bağlantıya ya da oka basma) şerit kullanıcının altından kaymaz.
      const wrap = wrapRef.current
      if (event.target instanceof Node && wrap?.contains(event.target)) return
      if (latest.current !== null) reveal(latest.current)
    }
    for (const name of events) window.addEventListener(name, arm, { passive: true })
    return () => {
      for (const name of events) window.removeEventListener(name, arm)
    }
  }, [key, reveal, wrapRef])

  const page = useCallback(
    (direction: 1 | -1) => {
      const list = listRef.current
      if (!list) return
      list.scrollBy({ left: direction * list.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' })
    },
    [listRef, reduce],
  )

  return { updateEdges, reveal, page }
}
