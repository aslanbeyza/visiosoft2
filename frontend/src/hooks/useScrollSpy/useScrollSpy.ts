import { useEffect, useState } from 'react'

const SEPARATOR = ' '

const TOLERANCE = 8

const BOTTOM_SLACK = 2

export function useScrollSpy(ids: string[], offset = 128): string | null {
  const key = ids.join(SEPARATOR)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const list = key ? key.split(SEPARATOR) : []
    if (list.length === 0 || typeof window === 'undefined') return

    let current: string | null | undefined
    let frame = 0
    let observer: IntersectionObserver | null = null

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

        if (top <= offset + TOLERANCE + marginOf(element)) next = id
      }

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
