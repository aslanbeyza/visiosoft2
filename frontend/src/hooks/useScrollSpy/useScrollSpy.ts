import { useEffect, useState } from 'react'

const SEPARATOR = ' '
/** Okuma çizgisine tolerans (px): bağlantıyla atlanan bölümün üstü çizginin birkaç piksel altında kalabilir. */
const TOLERANCE = 8
/** Sayfa sonu sayılan mesafe (px). */
const BOTTOM_SLACK = 2

/**
 * Sayfadaki bölümlerden hangisinin okuma çizgisini (üstten `offset` px) geçtiğini döndürür.
 * Etkin bölüm her seferinde geometriden hesaplanır: üstü `offset + 8` px çizgisine ulaşmış son bölüm.
 * İlk bölümün üstünde null; sayfanın sonunda (son bölüm görünürken) son bölüm etkindir.
 * Anlık sıçramalar (Home tuşu, window.scrollTo, "Başa dön", kaydırma geri yükleme) da aynı hesapla yakalanır:
 * IntersectionObserver geri çağrıları ve rAF ile kısılmış scroll/resize dinleyicisi aynı ölçümü tetikler.
 * State yalnızca etkin bölüm değişince güncellenir.
 */
export function useScrollSpy(ids: string[], offset = 128): string | null {
  const key = ids.join(SEPARATOR)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const list = key ? key.split(SEPARATOR) : []
    if (list.length === 0 || typeof window === 'undefined') return

    // undefined: henüz ölçülmedi; ids değişince önceki sayfanın etkin bölümü de ilk ölçümde temizlenir.
    let current: string | null | undefined
    let frame = 0
    let observer: IntersectionObserver | null = null

    // Bölümün kendi scroll-margin-top değeri (px); boyut değişince (medya sorguları) yeniden okunur.
    let margins = new WeakMap<Element, number>()
    const marginOf = (element: Element) => {
      let margin = margins.get(element)
      if (margin === undefined) {
        margin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0
        margins.set(element, margin)
      }
      return margin
    }

    const compute = () => {
      frame = 0
      const root = document.documentElement
      let next: string | null = null
      let last: { id: string; top: number } | null = null

      for (const id of list) {
        const element = document.getElementById(id)
        if (!element) continue
        const top = element.getBoundingClientRect().top
        last = { id, top }
        // Kendi bağlantısıyla gidilen bölüm, scroll-margin-top kadar aşağıda durur; çizgi de o kadar aşağı alınır.
        if (top <= offset + TOLERANCE + marginOf(element)) next = id
      }

      // Sayfa sonunda kısa son bölüm çizgiye hiç ulaşamayabilir; görünür durumdaysa etkin sayılır.
      const scrollable = root.scrollHeight - window.innerHeight > BOTTOM_SLACK
      const atBottom = scrollable && window.scrollY > 0 && window.innerHeight + window.scrollY >= root.scrollHeight - BOTTOM_SLACK
      if (atBottom && last && last.top < window.innerHeight) next = last.id

      if (next === current) return
      current = next
      setActive(next)
    }

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(compute)
    }

    // Gözlemci yalnızca tetikleyicidir; hangi girdilerin değiştiğine bakılmaz, her seferinde tüm bölümler ölçülür.
    const connect = () => {
      observer?.disconnect()
      if (typeof IntersectionObserver === 'undefined') return
      const bottom = Math.max(0, window.innerHeight - offset - 1)
      observer = new IntersectionObserver(schedule, { rootMargin: `-${offset}px 0px -${bottom}px 0px`, threshold: 0 })
      for (const id of list) {
        const element = document.getElementById(id)
        if (element) observer.observe(element)
      }
    }

    const onResize = () => {
      margins = new WeakMap()
      connect()
      schedule()
    }

    connect()
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('hashchange', schedule)
    window.addEventListener('load', schedule)

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', schedule)
      window.removeEventListener('load', schedule)
    }
  }, [key, offset])

  return active
}
