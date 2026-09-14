import { useCallback, useSyncExternalStore } from 'react'

/**
 * Kullanım: `const wide = useMediaQuery('(min-width: 1024px)')`
 * Medya sorgusunun eşleşme durumunu döndürür; değişimleri useSyncExternalStore ile izler (effect içinde setState yok).
 * Sunucu/ilk anlık görüntüde false döner.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => undefined
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia(query).matches
  }, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
