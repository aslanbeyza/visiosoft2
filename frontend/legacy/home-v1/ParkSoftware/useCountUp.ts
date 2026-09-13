import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Görünür olunca hedefe ease-out ile sayar; hareket azaltmada direkt son değer. */
export function useCountUp(target: number, active: boolean, duration = 1800) {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    if (reduce) {
      setValue(target)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      setValue(target * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, duration, reduce, target])

  return value
}
