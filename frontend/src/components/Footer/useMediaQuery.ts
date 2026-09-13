import { useCallback, useSyncExternalStore } from 'react'

/** Medya sorgusunun güncel sonucunu döndürür; eşleşme değiştiğinde bileşeni yeniden çizer. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
