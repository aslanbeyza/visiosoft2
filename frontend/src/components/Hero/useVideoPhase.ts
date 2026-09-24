import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { useMotionValue } from 'framer-motion'
import { phaseAt, readProgressAt } from './heroTimeline.ts'
import type { Phase } from './heroTimeline.ts'

export function useVideoPhase(videoRef: RefObject<HTMLVideoElement | null>, enabled: boolean) {
  const [phase, setPhase] = useState<Phase>('detect')
  const progress = useMotionValue(0)

  useEffect(() => {
    const video = videoRef.current
    if (!enabled || !video) return
    let frame = 0

    const sync = () => {
      const time = video.currentTime
      progress.set(readProgressAt(time))
      const next = phaseAt(time)
      setPhase((current) => (current === next ? current : next))
    }

    const loop = () => {
      sync()
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(loop)
    }

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(sync)
    }

    const passive = ['seeked', 'timeupdate', 'loadeddata'] as const
    video.addEventListener('playing', start)
    video.addEventListener('pause', stop)
    video.addEventListener('ended', stop)
    passive.forEach((name) => video.addEventListener(name, sync))
    if (video.paused) frame = requestAnimationFrame(sync)
    else start()

    return () => {
      cancelAnimationFrame(frame)
      video.removeEventListener('playing', start)
      video.removeEventListener('pause', stop)
      video.removeEventListener('ended', stop)
      passive.forEach((name) => video.removeEventListener(name, sync))
    }
  }, [enabled, progress, videoRef])

  return { phase, progress }
}
