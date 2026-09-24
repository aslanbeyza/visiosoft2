import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

type AutoAdvanceOptions = {
  count: number

  duration: number
  lastDuration: number
  running: boolean

  fill: MotionValue<number>
}

export function useAutoAdvance({ count, duration, lastDuration, running, fill }: AutoAdvanceOptions) {
  const [active, setActive] = useState(0)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!running || count === 0) return
    const length = active === count - 1 ? lastDuration : duration
    let from = fill.get() - active

    if (from < 0 || from >= 0.999) {
      fill.set(active)
      from = 0
    }
    const controls = animate(fill, active + 1, {
      duration: length * (1 - from),
      ease: 'linear',
      onComplete: () => {
        if (active === count - 1) {
          fill.set(0)
          setCycle((value) => value + 1)
          setActive(0)
        } else {
          setActive(active + 1)
        }
      },
    })
    return () => controls.stop()
  }, [running, active, count, duration, lastDuration, fill])

  const select = (index: number) => {

    fill.jump(index + 1)
    setActive(index)
  }

  return { active, cycle, select }
}
