import type { Variants } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'

export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay, ease: revealEase } }),

  instant: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

export const ruleVariants: Variants = {
  hidden: { scaleX: 0 },
  show: (delay: number = 0) => ({ scaleX: 1, transition: { duration: 1.05, delay, ease: revealEase } }),
  instant: { scaleX: 1, transition: { duration: 0.2 } },
}

export const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (delay: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.9, delay, ease: revealEase }, opacity: { duration: 0.2, delay } },
  }),
  instant: { pathLength: 1, opacity: 1, transition: { duration: 0.2 } },
}
