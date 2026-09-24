import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (onChange: () => void) => {
  const list = window.matchMedia(QUERY)
  list.addEventListener('change', onChange)
  return () => list.removeEventListener('change', onChange)
}
const read = () => window.matchMedia(QUERY).matches
const serverValue = () => false

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, read, serverValue)
}
