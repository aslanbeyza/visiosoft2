import { useEffect, useState, useSyncExternalStore } from 'react'
import type { RefObject } from 'react'
import { useInView } from 'framer-motion'

const subscribeVisibility = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}
const pageVisible = () => document.visibilityState !== 'hidden'
const serverVisible = () => true

/**
 * Video yalnızca bölüm görünürken, sekme açıkken ve kullanıcı duraklatmamışken oynar.
 * Hareket azaltma tercihinde hiç oynatılmaz (afiş kalır).
 */
export function useHeroPlayback(
  videoRef: RefObject<HTMLVideoElement | null>,
  sectionRef: RefObject<HTMLElement | null>,
  reduce: boolean,
) {
  const inView = useInView(sectionRef, { amount: 0.15 })
  const visible = useSyncExternalStore(subscribeVisibility, pageVisible, serverVisible)
  const [userPaused, setUserPaused] = useState(false)
  const shouldPlay = !reduce && inView && visible && !userPaused

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!shouldPlay) {
      video.pause()
      return
    }
    video.muted = true
    video.play().catch(() => undefined)
  }, [shouldPlay, videoRef])

  const toggle = () => setUserPaused((paused) => !paused)

  return { userPaused, toggle }
}
