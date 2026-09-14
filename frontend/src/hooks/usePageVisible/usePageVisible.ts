import { useSyncExternalStore } from 'react'

const subscribe = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

const getSnapshot = () => document.visibilityState === 'visible'

/**
 * Kullanım: `const visible = usePageVisible()`
 * Sekme görünürken true; arka plandaki sekmede döngü/zamanlayıcıları durdurmak için kullanılır.
 */
export function usePageVisible(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => true)
}
