import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { RefObject } from 'react'
import { assignHeadingIds } from './sanitize.ts'
import type { ProseHeading } from './sanitize.ts'

const EMPTY: ProseHeading[] = []

export function useDomHeadings(ref: RefObject<HTMLElement | null>, enabled: boolean): ProseHeading[] {
  const cache = useRef<{ key: string; list: ProseHeading[] }>({ key: '', list: EMPTY })

  const subscribe = useCallback(
    (notify: () => void) => {
      const root = ref.current
      if (!enabled || !root) return () => {}
      assignHeadingIds(root)
      const observer = new MutationObserver(() => {
        assignHeadingIds(root)
        notify()
      })
      observer.observe(root, { childList: true, subtree: true, characterData: true })
      return () => observer.disconnect()
    },
    [ref, enabled],
  )

  const getSnapshot = () => {
    const root = ref.current
    if (!enabled || !root) return EMPTY
    const nodes = Array.from(root.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]'))
    const key = nodes.map((node) => `${node.tagName}|${node.id}|${node.textContent}`).join('\n')
    if (key !== cache.current.key) {
      cache.current = {
        key,
        list: nodes.map((node) => ({ id: node.id, text: (node.textContent ?? '').trim(), level: node.tagName === 'H2' ? 2 : 3 })),
      }
    }
    return cache.current.list
  }

  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
}

export function useActiveHeading(ids: string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('\n')

  useEffect(() => {
    if (!enabled || !key || typeof IntersectionObserver === 'undefined') return
    const list = key.split('\n')
    const elements = list.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => element !== null)
    if (elements.length === 0) return

    const visible = new Set<string>()
    let current: string | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        let next: string | null = null
        if (visible.size > 0) {
          next = list.find((id) => visible.has(id)) ?? null
        } else {
          const limit = window.innerHeight * 0.3
          for (const element of elements) if (element.getBoundingClientRect().top < limit) next = element.id
        }
        if (next !== current) {
          current = next
          setActive(next)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [key, enabled])

  return active
}
