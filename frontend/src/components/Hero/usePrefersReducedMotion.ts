import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (onChange: () => void) => {
  const list = window.matchMedia(QUERY)
  list.addEventListener('change', onChange)
  return () => list.removeEventListener('change', onChange)
}
const read = () => window.matchMedia(QUERY).matches
const serverValue = () => false

/**
 * Hareket azaltma tercihini canlı izler. framer-motion'ın useReducedMotion'ı ilk değerde kalır;
 * video kaynakları ve oynatma, tercih oturum sırasında değişirse de doğru durumu izlemelidir.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, read, serverValue)
}
